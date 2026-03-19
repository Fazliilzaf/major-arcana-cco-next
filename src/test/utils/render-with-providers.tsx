import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { LanguageProvider } from '../../app/context/language-context';
import { MailboxProvider } from '../../app/context/mailbox-context';

/**
 * Custom render function that wraps components with all required providers
 * 
 * @example
 * renderWithProviders(<MyComponent />);
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <LanguageProvider>
        <MailboxProvider>
          {children}
        </MailboxProvider>
      </LanguageProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { renderWithProviders as render };
