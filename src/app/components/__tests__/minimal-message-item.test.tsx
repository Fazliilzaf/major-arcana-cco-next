import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/utils/render-with-providers';
import { mockMessage, mockSprintMessage, mockCriticalMessage } from '../../../test/utils/mock-data';
import MinimalMessageItem from '../minimal-message-item';

describe('MinimalMessageItem', () => {
  describe('Rendering', () => {
    it('renders sender and subject', () => {
      const message = mockMessage({
        sender: 'John Doe',
        subject: 'Test Subject',
      });

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Test Subject')).toBeInTheDocument();
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

    it('shows unread indicator for unread messages', () => {
      const message = mockMessage({ unread: true });

      const { container } = render(
        <MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />
      );

      expect(container.querySelector('.bg-emerald-500')).toBeInTheDocument();
    });

    it('does not show unread dot for read messages', () => {
      const message = mockMessage({ unread: false });

      const { container } = render(
        <MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />
      );

      expect(container.querySelector('.bg-emerald-500')).not.toBeInTheDocument();
    });
  });

  describe('Priority & SLA', () => {
    it('shows sprint badge for sprint priority', () => {
      const message = mockSprintMessage();

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      expect(screen.getByText('Sprint')).toBeInTheDocument();
    });

    it('shows critical badge for critical priority', () => {
      const message = mockCriticalMessage();

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      expect(screen.getByText('Critical')).toBeInTheDocument();
    });

    it('shows SLA tag for breach status', () => {
      const message = mockMessage({ slaStatus: 'breach', sla: '5m', priority: 'high' });

      const { container } = render(
        <MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />
      );

      expect(screen.getByText('5m')).toBeInTheDocument();
      expect(container.querySelector('.text-red-800')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when row is activated', async () => {
      const onClick = vi.fn();
      const message = mockMessage();

      render(<MinimalMessageItem message={message} isSelected={false} onClick={onClick} />);

      const user = userEvent.setup();
      await user.click(
        screen.getByRole('button', { name: /öppna konversation med test user/i })
      );

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('shows selected state when isSelected is true', () => {
      const message = mockMessage();

      const { container } = render(
        <MinimalMessageItem message={message} isSelected={true} onClick={() => {}} />
      );

      expect(container.querySelector('.border-l-pink-500')).toBeInTheDocument();
    });

    it('shows checkbox in multiselect mode', () => {
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

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
  });

  describe('Smart features', () => {
    it('shows VIP star badge', () => {
      const message = mockMessage({ isVIP: true });

      const { container } = render(
        <MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />
      );

      expect(container.querySelector('.from-amber-400')).toBeInTheDocument();
    });

    it('shows sentiment emoji', () => {
      const message = mockMessage({ sentiment: 'frustrated' });

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      expect(screen.getByTitle(/sentiment: frustrated/i)).toBeInTheDocument();
    });

    it('shows typing indicator', () => {
      const message = mockMessage({ isTyping: true });

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      expect(screen.getByText(/skriver/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('exposes row as button with beskrivande etikett', () => {
      const message = mockMessage();

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      expect(
        screen.getByRole('button', { name: /öppna konversation med test user/i })
      ).toBeInTheDocument();
    });

    it('has alt text for avatar image', () => {
      const message = mockMessage({ sender: 'Alice Johnson' });

      render(<MinimalMessageItem message={message} isSelected={false} onClick={() => {}} />);

      expect(screen.getByAltText('Alice Johnson')).toBeInTheDocument();
    });
  });
});
