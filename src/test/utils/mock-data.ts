/**
 * Mock data generators for testing
 */

export interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  avatar: string;
  unread?: boolean;
  sla?: string;
  slaStatus?: "safe" | "warning" | "breach";
  slaMinutesLeft?: number;
  priority: "sprint" | "critical" | "high" | "normal" | "low";
  warmth?: "cold" | "warm" | "hot";
  lifecycle?: "new" | "active" | "returning" | "dormant";
  receivedAt?: string;
  intent?: string;
  confidence?: number;
  recommendedAction?: string;
  tags?: string[];
  sentiment?: 'happy' | 'frustrated' | 'neutral' | 'excited' | 'worried';
  isVIP?: boolean;
  isDuplicate?: boolean;
  duplicateCount?: number;
  competitorMentioned?: string;
  isTyping?: boolean;
  medicalFlags?: string[];
}

/**
 * Create a mock message with default values
 * 
 * @example
 * const message = mockMessage({ sender: 'John Doe', priority: 'critical' });
 */
export function mockMessage(overrides?: Partial<Message>): Message {
  return {
    id: '1',
    sender: 'Test User',
    subject: 'Test Subject',
    preview: 'Test preview text...',
    time: '12:00',
    avatar: 'https://via.placeholder.com/100',
    unread: true,
    priority: 'normal',
    warmth: 'warm',
    lifecycle: 'active',
    ...overrides,
  };
}

/**
 * Create multiple mock messages
 * 
 * @example
 * const messages = mockMessages(10);
 */
export function mockMessages(count: number, overrides?: Partial<Message>): Message[] {
  return Array.from({ length: count }, (_, i) => 
    mockMessage({ 
      id: String(i + 1), 
      sender: `User ${i + 1}`,
      subject: `Subject ${i + 1}`,
      ...overrides 
    })
  );
}

/**
 * Create a sprint priority message
 */
export function mockSprintMessage(overrides?: Partial<Message>): Message {
  return mockMessage({
    priority: 'sprint',
    slaStatus: 'breach',
    slaMinutesLeft: 5,
    unread: true,
    ...overrides,
  });
}

/**
 * Create a critical priority message
 */
export function mockCriticalMessage(overrides?: Partial<Message>): Message {
  return mockMessage({
    priority: 'critical',
    slaStatus: 'warning',
    slaMinutesLeft: 15,
    isVIP: true,
    ...overrides,
  });
}

/**
 * Create messages with different priorities
 */
export function mockMixedPriorityMessages(): Message[] {
  return [
    mockSprintMessage({ id: '1', sender: 'Sprint User' }),
    mockCriticalMessage({ id: '2', sender: 'Critical User' }),
    mockMessage({ id: '3', sender: 'Normal User', priority: 'high' }),
    mockMessage({ id: '4', sender: 'Low User', priority: 'low' }),
  ];
}

/**
 * Mock conversation thread
 */
export interface ConversationMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isCustomer: boolean;
  avatar?: string;
}

export function mockConversation(count: number = 5): ConversationMessage[] {
  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    sender: i % 2 === 0 ? 'Customer' : 'Agent',
    text: `Message ${i + 1} content`,
    timestamp: `2024-03-15 12:${String(i).padStart(2, '0')}`,
    isCustomer: i % 2 === 0,
    avatar: 'https://via.placeholder.com/100',
  }));
}

/**
 * Mock mailbox
 */
export interface Mailbox {
  email: string;
  name: string;
  signatureId: string;
  tone: "professional" | "warm" | "casual";
  categories: string[];
  tones?: string[];
}

export function mockMailbox(overrides?: Partial<Mailbox>): Mailbox {
  return {
    email: 'test@example.com',
    name: 'Test Mailbox',
    signatureId: 'sig-1',
    tone: 'professional',
    categories: ['Bokning', 'Frågor'],
    ...overrides,
  };
}

/**
 * Mock signature
 */
export interface Signature {
  id: string;
  name: string;
  content: string;
  isDefault?: boolean;
}

export function mockSignature(overrides?: Partial<Signature>): Signature {
  return {
    id: 'sig-1',
    name: 'Default Signature',
    content: 'Best regards,\nTest User',
    isDefault: true,
    ...overrides,
  };
}

/**
 * Mock user event simulation helpers
 */
export const testIds = {
  messageItem: (id: string) => `message-${id}`,
  replyButton: 'reply-button',
  sendButton: 'send-button',
  messageInput: 'message-input',
  searchInput: 'search-input',
  densityModeSelector: 'density-mode-selector',
  multiSelectButton: 'multi-select-button',
  bulkArchiveButton: 'bulk-archive-button',
} as const;
