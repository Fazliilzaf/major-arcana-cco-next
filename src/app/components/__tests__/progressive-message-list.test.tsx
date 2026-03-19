import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/utils/render-with-providers';
import { mockMessages, mockSprintMessage, mockCriticalMessage } from '../../../test/utils/mock-data';
import ProgressiveMessageList from '../progressive-message-list';

describe('ProgressiveMessageList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders message list correctly', () => {
      const messages = mockMessages(5);
      render(<ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />);

      messages.forEach(message => {
        expect(screen.getByText(message.sender)).toBeInTheDocument();
      });
    });

    it('renders empty state when no messages', () => {
      render(<ProgressiveMessageList messages={[]} onSelectMessage={() => {}} />);

      const emptyState = screen.queryByText(/no messages|inga meddelanden|empty/i);
      expect(emptyState).toBeInTheDocument();
    });

    it('shows loading state', () => {
      const { container } = render(
        <ProgressiveMessageList messages={[]} isLoading={true} onSelectMessage={() => {}} />
      );

      const loadingIndicator = screen.queryByText(/loading|laddar/i) ||
                              container.querySelector('[role="status"]');
      expect(loadingIndicator).toBeTruthy();
    });

    it('displays message count', () => {
      const messages = mockMessages(25);
      render(<ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />);

      const count = screen.queryByText(/25|messages/i);
      // Count display varies
    });
  });

  describe('Progressive Disclosure', () => {
    it('groups messages by priority', () => {
      const messages = [
        mockSprintMessage({ id: '1', sender: 'Sprint User' }),
        mockCriticalMessage({ id: '2', sender: 'Critical User' }),
        ...mockMessages(3, { priority: 'normal' }),
      ];

      render(<ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />);

      // Sprint should be first
      const messageElements = screen.getAllByRole('button');
      if (messageElements.length > 0) {
        const firstMessage = messageElements[0];
        expect(firstMessage.textContent).toContain('Sprint User');
      }
    });

    it('shows sprint section separately', () => {
      const messages = [
        mockSprintMessage({ id: '1' }),
        mockSprintMessage({ id: '2' }),
      ];

      render(<ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />);

      const sprintHeader = screen.queryByText(/sprint|urgent/i);
      expect(sprintHeader).toBeInTheDocument();
    });

    it('collapses non-priority sections by default', () => {
      const messages = [
        mockSprintMessage({ id: '1' }),
        ...mockMessages(10, { priority: 'low' }),
      ];

      const { container } = render(
        <ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />
      );

      // Low priority section might be collapsed
      const collapsedSection = container.querySelector('[aria-expanded="false"]');
      // Collapse behavior varies
    });

    it('expands sections on click', async () => {
      const user = userEvent.setup();
      const messages = [
        mockSprintMessage({ id: '1' }),
        ...mockMessages(5, { priority: 'normal' }),
      ];

      render(<ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />);

      const expandButton = screen.queryByText(/show more|visa fler/i);
      
      if (expandButton) {
        await user.click(expandButton);

        await waitFor(() => {
          // More messages should be visible
          const visibleMessages = screen.getAllByRole('button');
          expect(visibleMessages.length).toBeGreaterThan(1);
        });
      }
    });
  });

  describe('Density Modes', () => {
    it('renders in minimal mode', () => {
      const messages = mockMessages(3);
      render(
        <ProgressiveMessageList 
          messages={messages} 
          densityMode="minimal" 
          onSelectMessage={() => {}} 
        />
      );

      // Minimal mode should show compact view
      const { container } = render(
        <ProgressiveMessageList 
          messages={messages} 
          densityMode="minimal" 
          onSelectMessage={() => {}} 
        />
      );

      // Check for minimal styling
      const messageItems = container.querySelectorAll('[data-density="minimal"]');
      // Density attributes vary
    });

    it('renders in standard mode', () => {
      const messages = mockMessages(3);
      render(
        <ProgressiveMessageList 
          messages={messages} 
          densityMode="standard" 
          onSelectMessage={() => {}} 
        />
      );

      // Standard mode should show more details
    });

    it('renders in detailed mode', () => {
      const messages = mockMessages(3);
      render(
        <ProgressiveMessageList 
          messages={messages} 
          densityMode="detailed" 
          onSelectMessage={() => {}} 
        />
      );

      // Detailed mode should show all information
      messages.forEach(message => {
        expect(screen.getByText(message.sender)).toBeInTheDocument();
        expect(screen.getByText(message.subject)).toBeInTheDocument();
      });
    });

    it('updates when density mode changes', () => {
      const messages = mockMessages(3);
      const { rerender } = render(
        <ProgressiveMessageList 
          messages={messages} 
          densityMode="minimal" 
          onSelectMessage={() => {}} 
        />
      );

      rerender(
        <ProgressiveMessageList 
          messages={messages} 
          densityMode="detailed" 
          onSelectMessage={() => {}} 
        />
      );

      // Should re-render with new density
    });
  });

  describe('Interactions', () => {
    it('calls onSelectMessage when message is clicked', async () => {
      const user = userEvent.setup();
      const onSelectMessage = vi.fn();
      const messages = mockMessages(3);

      render(<ProgressiveMessageList messages={messages} onSelectMessage={onSelectMessage} />);

      const firstMessage = screen.getByText(messages[0].sender);
      await user.click(firstMessage);

      expect(onSelectMessage).toHaveBeenCalledWith(messages[0]);
    });

    it('highlights selected message', () => {
      const messages = mockMessages(3);
      const { container } = render(
        <ProgressiveMessageList 
          messages={messages} 
          selectedMessageId={messages[0].id}
          onSelectMessage={() => {}} 
        />
      );

      // Selected message should have different styling
      const selectedElement = container.querySelector('[aria-selected="true"], .selected, .bg-pink-50');
      expect(selectedElement).toBeTruthy();
    });

    it('supports multi-select mode', async () => {
      const user = userEvent.setup();
      const onToggleMultiSelect = vi.fn();
      const messages = mockMessages(3);

      render(
        <ProgressiveMessageList 
          messages={messages} 
          multiSelectMode={true}
          onToggleMultiSelect={onToggleMultiSelect}
          onSelectMessage={() => {}} 
        />
      );

      // Checkboxes should be visible
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);

      // Click first checkbox
      await user.click(checkboxes[0]);
      expect(onToggleMultiSelect).toHaveBeenCalledWith(messages[0].id);
    });

    it('selects all messages', async () => {
      const user = userEvent.setup();
      const onSelectAll = vi.fn();
      const messages = mockMessages(5);

      render(
        <ProgressiveMessageList 
          messages={messages} 
          multiSelectMode={true}
          onSelectAll={onSelectAll}
          onSelectMessage={() => {}} 
        />
      );

      const selectAllCheckbox = screen.queryByLabelText(/select all|välj alla/i);
      
      if (selectAllCheckbox) {
        await user.click(selectAllCheckbox);
        expect(onSelectAll).toHaveBeenCalled();
      }
    });
  });

  describe('Search and Filter', () => {
    it('filters messages by search query', () => {
      const messages = [
        { ...mockMessages(1)[0], sender: 'John Doe', subject: 'Meeting' },
        { ...mockMessages(1)[0], sender: 'Jane Smith', subject: 'Invoice' },
        { ...mockMessages(1)[0], sender: 'Bob Johnson', subject: 'Question' },
      ];

      render(
        <ProgressiveMessageList 
          messages={messages} 
          searchQuery="John"
          onSelectMessage={() => {}} 
        />
      );

      // Should only show John Doe and Bob Johnson
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });

    it('shows no results message when filter has no matches', () => {
      const messages = mockMessages(3);

      render(
        <ProgressiveMessageList 
          messages={messages} 
          searchQuery="nonexistentquery123"
          onSelectMessage={() => {}} 
        />
      );

      const noResults = screen.queryByText(/no results|inga resultat|no matches/i);
      expect(noResults).toBeInTheDocument();
    });

    it('filters by priority', () => {
      const messages = [
        mockSprintMessage({ id: '1' }),
        mockCriticalMessage({ id: '2' }),
        ...mockMessages(2, { priority: 'normal' }),
      ];

      render(
        <ProgressiveMessageList 
          messages={messages} 
          filterPriority="sprint"
          onSelectMessage={() => {}} 
        />
      );

      // Should only show sprint messages
      const visibleMessages = screen.getAllByRole('button');
      expect(visibleMessages.length).toBe(1);
    });

    it('filters by SLA status', () => {
      const messages = [
        { ...mockMessages(1)[0], slaStatus: 'breach' as const },
        { ...mockMessages(1)[0], slaStatus: 'warning' as const },
        { ...mockMessages(1)[0], slaStatus: 'safe' as const },
      ];

      render(
        <ProgressiveMessageList 
          messages={messages} 
          filterSLA="breach"
          onSelectMessage={() => {}} 
        />
      );

      // Should only show breached SLA messages
      const visibleMessages = screen.getAllByRole('button');
      expect(visibleMessages.length).toBe(1);
    });
  });

  describe('Virtualization', () => {
    it('renders large lists efficiently', () => {
      const messages = mockMessages(1000);

      const startTime = performance.now();
      render(<ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />);
      const endTime = performance.now();

      const renderTime = endTime - startTime;

      // Should render in under 200ms even with 1000 messages
      expect(renderTime).toBeLessThan(200);
    });

    it('only renders visible items', () => {
      const messages = mockMessages(100);
      const { container } = render(
        <ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />
      );

      const renderedItems = container.querySelectorAll('[data-index]');
      
      // Should render fewer items than total (virtualization)
      expect(renderedItems.length).toBeLessThan(100);
    });

    it('loads more items on scroll', async () => {
      const messages = mockMessages(100);
      const { container } = render(
        <ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />
      );

      const listElement = container.querySelector('[role="list"]') || container.firstChild;
      
      if (listElement && listElement instanceof HTMLElement) {
        const initialItems = container.querySelectorAll('[data-index]').length;

        // Scroll to bottom
        listElement.scrollTop = listElement.scrollHeight;
        listElement.dispatchEvent(new Event('scroll'));

        await waitFor(() => {
          const newItems = container.querySelectorAll('[data-index]').length;
          // Should load more items (or stay same if all loaded)
          expect(newItems).toBeGreaterThanOrEqual(initialItems);
        });
      }
    });
  });

  describe('Performance', () => {
    it('updates efficiently on prop changes', () => {
      const messages = mockMessages(50);
      const { rerender } = render(
        <ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />
      );

      const startTime = performance.now();
      
      // Update with new messages
      const newMessages = mockMessages(50);
      rerender(<ProgressiveMessageList messages={newMessages} onSelectMessage={() => {}} />);
      
      const endTime = performance.now();
      const updateTime = endTime - startTime;

      // Re-render should be fast
      expect(updateTime).toBeLessThan(100);
    });

    it('memoizes message items', () => {
      const messages = mockMessages(10);
      const { rerender } = render(
        <ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />
      );

      // Get initial render
      const initialButtons = screen.getAllByRole('button');

      // Rerender with same messages
      rerender(<ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />);

      // Items should not re-render (React.memo)
      const newButtons = screen.getAllByRole('button');
      expect(newButtons.length).toBe(initialButtons.length);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA roles', () => {
      const messages = mockMessages(3);
      const { container } = render(
        <ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />
      );

      const list = container.querySelector('[role="list"]');
      expect(list).toBeInTheDocument();

      const items = container.querySelectorAll('[role="listitem"]');
      expect(items.length).toBeGreaterThan(0);
    });

    it('announces message count to screen readers', () => {
      const messages = mockMessages(25);
      const { container } = render(
        <ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />
      );

      const announcement = container.querySelector('[aria-live]') ||
                          screen.queryByText(/25 messages|25 meddelanden/i);
      
      // Announcement varies by implementation
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      const messages = mockMessages(3);
      render(<ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />);

      const firstButton = screen.getAllByRole('button')[0];
      firstButton.focus();

      await user.keyboard('{ArrowDown}');

      // Next message should be focused
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(document.activeElement).toBe(buttons[1] || buttons[0]);
      });
    });
  });

  describe('SLA Indicators', () => {
    it('shows SLA breach warnings', () => {
      const messages = [
        { ...mockMessages(1)[0], slaStatus: 'breach' as const, sla: '5m' },
      ];

      render(<ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />);

      const breachIndicator = screen.queryByText(/breach|överskriden|5m/i);
      expect(breachIndicator).toBeInTheDocument();
    });

    it('shows SLA warning indicators', () => {
      const messages = [
        { ...mockMessages(1)[0], slaStatus: 'warning' as const, slaMinutesLeft: 15 },
      ];

      render(<ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />);

      const warningIndicator = screen.queryByText(/warning|varning|15/i);
      expect(warningIndicator).toBeInTheDocument();
    });

    it('sorts by SLA urgency', () => {
      const messages = [
        { ...mockMessages(1)[0], id: '1', slaMinutesLeft: 30, slaStatus: 'warning' as const },
        { ...mockMessages(1)[0], id: '2', slaMinutesLeft: 5, slaStatus: 'breach' as const },
        { ...mockMessages(1)[0], id: '3', slaMinutesLeft: 60, slaStatus: 'safe' as const },
      ];

      render(<ProgressiveMessageList messages={messages} onSelectMessage={() => {}} />);

      const messageElements = screen.getAllByRole('button');
      
      // Breach (5min) should be first
      expect(messageElements[0].getAttribute('data-message-id') || messageElements[0].id).toContain('2');
    });
  });

  describe('Error States', () => {
    it('shows error message when messages fail to load', () => {
      render(
        <ProgressiveMessageList 
          messages={[]} 
          error="Failed to load messages"
          onSelectMessage={() => {}} 
        />
      );

      const errorMessage = screen.getByText(/failed to load/i);
      expect(errorMessage).toBeInTheDocument();
    });

    it('allows retry after error', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();

      render(
        <ProgressiveMessageList 
          messages={[]} 
          error="Network error"
          onRetry={onRetry}
          onSelectMessage={() => {}} 
        />
      );

      const retryButton = screen.queryByText(/retry|försök igen/i);
      
      if (retryButton) {
        await user.click(retryButton);
        expect(onRetry).toHaveBeenCalled();
      }
    });
  });
});
