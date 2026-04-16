import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../../../test/utils/render-with-providers';
import { mockMessage } from '../../../test/utils/mock-data';
import App from '../../App';
import MinimalMessageItem from '../../components/minimal-message-item';

/**
 * Smala a11y-röktester mot nuvarande komponenter.
 * Utöka med WCAG-krav när ni har tydlig design-/DOM-kontrakt.
 */
describe('Accessibility (smoke)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('meddelanderad har namngiven knapp (aria-label)', () => {
    const message = mockMessage();
    render(
      <MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />
    );

    expect(
      screen.getByRole('button', { name: /öppna konversation med test user/i })
    ).toBeInTheDocument();
  });

  it('app-layout exponerar banner (header)', async () => {
    render(<App />);

    await waitFor(
      () => {
        expect(screen.getByRole('banner')).toBeInTheDocument();
      },
      { timeout: 8000 }
    );
  });
});
