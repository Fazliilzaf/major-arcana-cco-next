import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../../../test/utils/render-with-providers';
import App from '../../App';

/**
 * Röktester för inkorgen – validerar att router + layout + inkorgssida mountar.
 */
describe('Inbox Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('laddar appen med CCO-header', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('CCO')).toBeInTheDocument();
    });
  });

  it('visar worklist med "Alla trådar" på desktop', async () => {
    render(<App />);

    await waitFor(
      () => {
        expect(screen.getByText('Alla trådar')).toBeInTheDocument();
      },
      { timeout: 8000 }
    );
  });
});
