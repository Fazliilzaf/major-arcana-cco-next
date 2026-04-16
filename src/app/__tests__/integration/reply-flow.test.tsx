import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../../../test/utils/render-with-providers';
import App from '../../App';

/**
 * Röktester för svar/konversationsytan – det som faktiskt finns i conversation-focus-panel.
 */
describe('Reply Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('laddar appen utan krasch', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('CCO')).toBeInTheDocument();
    });
  });

  it('visar konversationspanel med rubrik och snabbåtgärder', async () => {
    render(<App />);

    await waitFor(
      () => {
        const headings = screen.getAllByRole('heading', {
          name: /akut ombokning idag/i,
        });
        expect(headings.length).toBeGreaterThanOrEqual(1);
      },
      { timeout: 15000 }
    );

    expect(screen.getAllByText('Svarstudio').length).toBeGreaterThanOrEqual(1);
  }, 16000);
});
