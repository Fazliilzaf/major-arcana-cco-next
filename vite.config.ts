import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

/**
 * Vite-plugin som hanterar `figma:asset/...` imports från Figma Make.
 * Eftersom de ursprungliga binära asseten inte finns i repot resolvar vi
 * alla sådana imports till en 1x1 transparent PNG (data-URL).
 * Det gör att appen kan köra utan att krascha — riktiga logotyper kan
 * läggas i /public och importeras som vanligt när de finns tillgängliga.
 */
const TRANSPARENT_PNG_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

function figmaAssetShim() {
  const VIRTUAL_PREFIX = '\0figma-asset:'
  return {
    name: 'figma-asset-shim',
    resolveId(source: string) {
      if (source.startsWith('figma:asset/')) {
        return VIRTUAL_PREFIX + source
      }
      return null
    },
    load(id: string) {
      if (id.startsWith(VIRTUAL_PREFIX)) {
        return `export default ${JSON.stringify(TRANSPARENT_PNG_DATA_URL)};`
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    figmaAssetShim(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Production build optimization
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for production debugging
    sourcemap: true,
    
    // Target modern browsers for smaller bundle
    target: 'es2020',
    
    // Minify with esbuild (faster than terser)
    minify: 'esbuild',
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Rollup options for optimization
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
          ],
          'material-ui': [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/react',
            '@emotion/styled',
          ],
          'charts': ['recharts'],
          'animation': ['motion', 'canvas-confetti'],
          'utils': ['date-fns', 'clsx', 'tailwind-merge'],
        },
        
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          } else if (/woff|woff2|eot|ttf|otf/i.test(extType)) {
            extType = 'fonts';
          }
          
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        
        // Entry file naming
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Asset inline limit (smaller assets are inlined as base64)
    assetsInlineLimit: 4096,
    
    // Clear the output directory before building
    emptyOutDir: true,
  },

  // Server configuration for development
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: false,
  },

  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
    open: false,
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router',
      'lucide-react',
      'date-fns',
      'clsx',
      'tailwind-merge',
    ],
    exclude: ['@testing-library/react', '@testing-library/user-event', 'vitest'],
  },
})
