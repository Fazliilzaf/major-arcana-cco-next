import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

interface AppSplashScreenProps {
  /**
   * Hur länge splash-skärmen visas (ms) innan den fasas ut.
   * Default: 1800ms — tillräckligt för att se varumärket utan att bromsa användaren.
   */
  duration?: number;
  /**
   * Callback när splash-skärmen är färdigdold. Används för att
   * undvika att den renderas i DOM:en efter fade-out.
   */
  onFinish?: () => void;
}

/**
 * Första laddningssidan för CCO Next.
 *
 * Designspråk:
 *  - Pink → rose gradient (brand, matchar header & theme_color #ec4899)
 *  - Neutral bas (vit / dark:gray-950) med subtila grå toner
 *  - motion/react för mjuka entré-/exit-animationer
 *  - Svensk copy ("Laddar din arbetsyta...") för HairTP Clinic
 */
export function AppSplashScreen({ duration = 1800, onFinish }: AppSplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  // Animera progress från 0 → 100 över splash-durationen.
  useEffect(() => {
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  // Dölj splash när durationen är slut.
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), duration);
    return () => window.clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          key="cco-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white dark:bg-gray-950"
          role="status"
          aria-live="polite"
          aria-label="Laddar CCO Next"
        >
          {/* Subtil linje-textur i bakgrunden — ren, ingen "blob" */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              color: "#030213",
            }}
          />

          {/* Varumärke */}
          <div className="relative flex flex-col items-center gap-6">
            {/* CCO-wordmark */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-baseline gap-1"
            >
              <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl">
                CCO
              </span>
              <span className="text-2xl font-light text-gray-400 dark:text-gray-500 sm:text-3xl">
                Next
              </span>
            </motion.div>

            {/* Divider — animerad bredd */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="h-px w-24 origin-center bg-gradient-to-r from-transparent via-pink-400 to-transparent"
            />

            {/* Undertext */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
              className="flex flex-col items-center gap-1 text-center"
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                Customer Care OS
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                HairTP Clinic
              </p>
            </motion.div>
          </div>

          {/* Progress + status längst ner */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            className="absolute bottom-16 flex w-full max-w-xs flex-col items-center gap-3 px-6"
          >
            <div
              className="h-[3px] w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress)}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 transition-[width] duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] font-medium tracking-wide text-gray-500 dark:text-gray-400">
              Laddar din arbetsyta...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
