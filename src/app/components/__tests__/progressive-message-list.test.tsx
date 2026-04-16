import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../../test/utils/render-with-providers';
import { ProgressiveMessageList } from '../progressive-message-list';

describe('ProgressiveMessageList', () => {
  it('renderar inkorg med rubrik', () => {
    render(<ProgressiveMessageList filterType="inbox" />);
    expect(screen.getByRole('heading', { name: /inkorg/i })).toBeInTheDocument();
  });

  it('renderar senare-läge med rätt rubrik', () => {
    render(<ProgressiveMessageList filterType="later" />);
    expect(screen.getByRole('heading', { name: /senare/i })).toBeInTheDocument();
  });

  it('renderar skickat-läge med rätt rubrik', () => {
    render(<ProgressiveMessageList filterType="sent" />);
    expect(screen.getByRole('heading', { name: /skickade/i })).toBeInTheDocument();
  });
});
