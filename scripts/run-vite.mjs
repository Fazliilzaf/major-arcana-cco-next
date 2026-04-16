/**
 * Kör Vite med en Node-binär som faktiskt kan ladda lightningcss (Tailwind v4).
 * IDE-inbäddade Node-binärer (Cursor/Codex) kan få ERR_DLOPEN_FAILED / Team ID på macOS.
 * Sätt CCO_NODE eller NODE_BINARY för att tvinga en specifik node.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');
const viteBin = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');

function canLoadLightningcss(nodePath) {
  const r = spawnSync(nodePath, ['-e', 'require("lightningcss")'], {
    stdio: 'ignore',
    cwd: projectRoot,
  });
  return r.status === 0;
}

function findNodeForVite() {
  const isWin = process.platform === 'win32';
  const nodeName = isWin ? 'node.exe' : 'node';
  const pathDirs = (process.env.PATH ?? '').split(path.delimiter).filter(Boolean);

  /** @type {string[]} */
  const candidates = [];
  const push = (p) => {
    if (p) candidates.push(p);
  };

  push(process.env.CCO_NODE);
  push(process.env.NODE_BINARY);

  if (process.platform === 'darwin') {
    push('/opt/homebrew/bin/node');
    push('/usr/local/bin/node');
  }

  for (const dir of pathDirs) {
    push(path.join(dir, nodeName));
  }

  push(process.execPath);

  const seen = new Set();
  for (const p of candidates) {
    if (!p || seen.has(p)) continue;
    seen.add(p);
    if (!existsSync(p)) continue;
    if (canLoadLightningcss(p)) return p;
  }

  console.error(`[cco] Ingen Node-binär kunde ladda lightningcss (krävs av Tailwind v4).
Installera Node från https://nodejs.org eller använd nvm (se .nvmrc), verifiera med:
  node -e "require('lightningcss')"
Alternativt: export CCO_NODE=/sökväg/till/node`);
  process.exit(1);
}

const node = findNodeForVite();
const forwards = process.argv.slice(2);
const result = spawnSync(node, [viteBin, ...forwards], {
  stdio: 'inherit',
  cwd: projectRoot,
  env: process.env,
});
process.exit(result.status ?? 1);
