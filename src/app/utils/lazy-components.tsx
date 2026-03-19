import { lazy, Suspense, ComponentType } from "react";
import { LoadingSpinner } from "../components/loading-states";

/**
 * Lazy load wrapper with loading fallback
 * Usage: const MyComponent = lazyLoad(() => import('./MyComponent'))
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);

  return (props: React.ComponentProps<T>) => (
    <Suspense
      fallback={
        fallback || (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="medium" text="Laddar..." />
          </div>
        )
      }
    >
      <LazyComponent {...props} />
    </Suspense>
  );
}

// Lazy-loaded modals (rarely used, should be lazy loaded)
export const SignatureEditorModal = lazyLoad(
  () => import("../components/signature-editor-modal")
);

export const StatsDashboardModal = lazyLoad(
  () => import("../components/stats-dashboard-modal")
);

export const AdvancedSearchModal = lazyLoad(
  () => import("../components/advanced-search-modal")
);

export const OnboardingTutorial = lazyLoad(
  () => import("../components/onboarding-tutorial")
);

export const KeyboardShortcutsModal = lazyLoad(
  () => import("../components/keyboard-shortcuts-modal")
);

export const AddMailboxModal = lazyLoad(
  () => import("../components/add-mailbox-modal")
);

// Lazy-loaded pages (route-based code splitting)
export const UnansweredPage = lazyLoad(
  () => import("../pages/unanswered-page")
);

export const SnoozedPage = lazyLoad(
  () => import("../pages/snoozed-page")
);

export const DraftsPage = lazyLoad(
  () => import("../pages/drafts-page")
);

export const ArchivePage = lazyLoad(
  () => import("../pages/archive-page")
);
