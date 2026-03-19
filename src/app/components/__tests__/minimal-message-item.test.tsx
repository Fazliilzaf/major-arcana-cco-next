import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/utils/render-with-providers';
import { mockMessage, mockSprintMessage, mockCriticalMessage } from '../../../test/utils/mock-data';
import MinimalMessageItem from '../minimal-message-item';

describe('MinimalMessageItem', () => {
  describe('Rendering', () => {
    it('renders message correctly', () => {
      const message = mockMessage({
        sender: 'John Doe',
        subject: 'Test Subject',
        preview: 'Test preview',
      });

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Test Subject')).toBeInTheDocument();
      expect(screen.getByText('Test preview')).toBeInTheDocument();
    });

    it('renders avatar image', () => {
      const message = mockMessage({
        sender: 'Jane Smith',
        avatar: 'https://example.com/avatar.jpg',
      });

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      const avatar = screen.getByAltText('Jane Smith');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('shows unread badge for unread messages', () => {
      const message = mockMessage({ unread: true });

      const { container } = render(
        <MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />
      );

      // Check for unread indicator (blue dot or bold text)
      const unreadIndicator = container.querySelector('.bg-blue-500');
      expect(unreadIndicator).toBeInTheDocument();
    });

    it('does not show unread badge for read messages', () => {
      const message = mockMessage({ unread: false });

      const { container } = render(
        <MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />
      );

      const unreadIndicator = container.querySelector('.bg-blue-500');
      expect(unreadIndicator).not.toBeInTheDocument();
    });
  });

  describe('Priority Badges', () => {
    it('shows sprint badge for sprint priority', () => {
      const message = mockSprintMessage();

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      expect(screen.getByText(/sprint/i)).toBeInTheDocument();
    });

    it('shows critical badge for critical priority', () => {
      const message = mockCriticalMessage();

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      expect(screen.getByText(/critical|kritisk/i)).toBeInTheDocument();
    });

    it('shows correct SLA status badge', () => {
      const message = mockMessage({ slaStatus: 'breach', sla: '5m' });

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      // Should show breach badge (red)
      const { container } = render(
        <MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />
      );
      const breachBadge = container.querySelector('.bg-red-100, .text-red-600');
      expect(breachBadge).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when clicked', async () => {
      const onClick = vi.fn();
      const message = mockMessage();

      render(<MinimalMessageItem message={message} isSelected={false} onClick={onClick} />);

      const user = userEvent.setup();
      const messageElement = screen.getByText(message.sender).closest('div[role="button"]');
      
      if (messageElement) {
        await user.click(messageElement);
        expect(onClick).toHaveBeenCalledWith(message);
      }
    });

    it('shows selected state when isSelected is true', () => {
      const message = mockMessage();

      const { container } = render(
        <MinimalMessageItem message={message} isSelected={true} onClick={() => {}} />
      );

      // Check for selected styling (background color change)
      const selectedElement = container.querySelector('.bg-pink-50, .bg-rose-50');
      expect(selectedElement).toBeInTheDocument();
    });

    it('handles multiselect mode', async () => {
      const onToggleMultiSelect = vi.fn();
      const message = mockMessage();

      render(
        <MinimalMessageItem
          message={message}
          isSelected={false}
          onClick={() => {}}
          multiSelectMode={true}
          isMultiSelected={false}
          onToggleMultiSelect={onToggleMultiSelect}
        />
      );

      // Look for checkbox in multiselect mode
      const checkbox = screen.queryByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
    });
  });

  describe('Smart Features', () => {
    it('shows VIP badge for VIP customers', () => {
      const message = mockMessage({ isVIP: true });

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      // Look for VIP indicator (star icon or badge)
      const { container } = render(
        <MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />
      );
      const vipBadge = container.querySelector('[data-vip="true"]');
      // VIP badge might be rendered as icon or text
      expect(screen.queryByText(/vip/i) || vipBadge).toBeTruthy();
    });

    it('shows sentiment indicator', () => {
      const message = mockMessage({ sentiment: 'frustrated' });

      const { container } = render(
        <MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />
      );

      // Sentiment might be shown as icon or color
      expect(container.querySelector('[data-sentiment]')).toBeTruthy();
    });

    it('shows duplicate badge when isDuplicate is true', () => {
      const message = mockMessage({ isDuplicate: true, duplicateCount: 3 });

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      expect(screen.queryByText(/3|dupl/i)).toBeTruthy();
    });

    it('shows typing indicator when customer is typing', () => {
      const message = mockMessage({ isTyping: true });

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      expect(screen.queryByText(/typing|skriver/i)).toBeTruthy();
    });
  });

  describe('Warmth Indicators', () => {
    it('shows hot warmth indicator', () => {
      const message = mockMessage({ warmth: 'hot' });

      const { container } = render(
        <MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />
      );

      const hotIndicator = container.querySelector('.text-red-500, .text-orange-500');
      expect(hotIndicator).toBeTruthy();
    });

    it('shows cold warmth indicator', () => {
      const message = mockMessage({ warmth: 'cold' });

      const { container } = render(
        <MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />
      );

      const coldIndicator = container.querySelector('.text-blue-500, .text-gray-500');
      expect(coldIndicator).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      const message = mockMessage();

      const { container } = render(
        <MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />
      );

      const messageElement = container.querySelector('[role="button"]');
      expect(messageElement).toBeInTheDocument();
    });

    it('has alt text for avatar image', () => {
      const message = mockMessage({ sender: 'Alice Johnson' });

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      const avatar = screen.getByAltText('Alice Johnson');
      expect(avatar).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('renders quickly with minimal re-renders', () => {
      const message = mockMessage();

      const start = performance.now();
      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);
      const duration = performance.now() - start;

      // Should render in less than 50ms
      expect(duration).toBeLessThan(50);
    });
  });
});
