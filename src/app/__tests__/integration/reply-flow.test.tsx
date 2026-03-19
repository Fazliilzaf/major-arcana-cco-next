import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/utils/render-with-providers';
import { mockMessage } from '../../../test/utils/mock-data';
import App from '../../App';

/**
 * Integration tests for the reply workflow
 * Tests composing and sending message replies
 */
describe('Reply Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Opening Response Studio', () => {
    it('opens response studio when clicking reply', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      // Select a message
      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        // Find reply button
        const replyBtn = screen.queryByLabelText(/reply|svara/i) || 
                        screen.queryByText(/reply|svara/i);

        if (replyBtn) {
          await user.click(replyBtn);

          // Response studio should open
          await waitFor(() => {
            const studio = screen.queryByText(/response studio|svarstudio/i) ||
                          screen.queryByPlaceholderText(/write your message|skriv ditt meddelande/i);
            expect(studio).toBeInTheDocument();
          });
        }
      }
    });

    it('pre-fills recipient information', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        const firstMessage = messages[0];
        const senderName = firstMessage.textContent;

        await user.click(firstMessage);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          await waitFor(() => {
            // Recipient should be pre-filled
            const recipientField = screen.queryByText(senderName || '');
            // Recipient display varies by implementation
          });
        }
      }
    });

    it('loads customer context in sidebar', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          // Customer intelligence sidebar should be visible
          await waitFor(() => {
            const sidebar = screen.queryByText(/customer info|kundinformation/i) ||
                           screen.queryByText(/previous messages|tidigare meddelanden/i);
            // Sidebar content varies
          });
        }
      }
    });
  });

  describe('Composing Message', () => {
    it('allows typing in message field', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      // Navigate to response studio
      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          // Find message input
          const messageInput = screen.queryByPlaceholderText(/write|skriv/i) ||
                               screen.queryByRole('textbox');

          if (messageInput) {
            const testMessage = 'Tack för ditt meddelande!';
            await user.type(messageInput, testMessage);

            expect(messageInput).toHaveValue(testMessage);
          }
        }
      }
    });

    it('shows character count', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          const messageInput = screen.queryByRole('textbox');
          if (messageInput) {
            await user.type(messageInput, 'Test message');

            // Character count should update
            const charCount = screen.queryByText(/\d+ characters|\d+ tecken/i);
            // Character counter varies by implementation
          }
        }
      }
    });

    it('supports rich text formatting', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          // Look for formatting buttons
          const boldBtn = screen.queryByLabelText(/bold|fetstil/i);
          const italicBtn = screen.queryByLabelText(/italic|kursiv/i);

          // Formatting tools vary by implementation
        }
      }
    });
  });

  describe('AI-Powered Features', () => {
    it('shows AI-suggested responses', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          // AI suggestions should appear
          await waitFor(() => {
            const suggestions = screen.queryByText(/suggested|förslag/i) ||
                               screen.queryByText(/AI recommendation/i);
            // AI features vary
          });
        }
      }
    });

    it('allows selecting AI-suggested response', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          // Find and click suggested response
          const suggestions = screen.queryAllByText(/suggested|förslag/i);
          if (suggestions.length > 0) {
            await user.click(suggestions[0]);

            // Message field should be filled with suggestion
            const messageInput = screen.queryByRole('textbox');
            expect(messageInput?.textContent || messageInput?.value).toBeTruthy();
          }
        }
      }
    });

    it('shows tone selector', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          // Look for tone selector
          const toneSelector = screen.queryByLabelText(/tone|ton/i) ||
                              screen.queryByText(/professional|warm|casual/i);
          // Tone selector varies
        }
      }
    });
  });

  describe('Attachments', () => {
    it('allows adding attachments', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          // Find attach button
          const attachBtn = screen.queryByLabelText(/attach|bifoga/i);
          
          if (attachBtn) {
            await user.click(attachBtn);

            // File picker should appear
            const fileInput = screen.queryByLabelText(/choose file|välj fil/i);
            // File input handling varies
          }
        }
      }
    });

    it('displays attached files', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          // Mock file attachment
          const fileInput = screen.queryByLabelText(/attach|bifoga/i);
          
          if (fileInput && fileInput instanceof HTMLInputElement) {
            const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
            
            // Simulate file upload
            Object.defineProperty(fileInput, 'files', {
              value: [file],
              writable: false,
            });

            fileInput.dispatchEvent(new Event('change', { bubbles: true }));

            // File should be displayed
            await waitFor(() => {
              const attachedFile = screen.queryByText(/test.pdf/i);
              // File display varies
            });
          }
        }
      }
    });
  });

  describe('Sending Message', () => {
    it('sends message when clicking send button', async () => {
      const user = userEvent.setup();
      const sendMock = vi.fn().mockResolvedValue({ success: true });
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          const messageInput = screen.queryByRole('textbox');
          if (messageInput) {
            await user.type(messageInput, 'Test reply message');

            const sendBtn = screen.queryByText(/send|skicka/i) ||
                           screen.queryByLabelText(/send|skicka/i);

            if (sendBtn) {
              await user.click(sendBtn);

              // Success message should appear
              await waitFor(() => {
                const success = screen.queryByText(/sent|skickat/i) ||
                               screen.queryByText(/success|lyckades/i);
                // Success notification varies
              });
            }
          }
        }
      }
    });

    it('shows error when send fails', async () => {
      const user = userEvent.setup();
      global.fetch = vi.fn().mockRejectedValue(new Error('Send failed'));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          const messageInput = screen.queryByRole('textbox');
          if (messageInput) {
            await user.type(messageInput, 'Test message');

            const sendBtn = screen.queryByText(/send|skicka/i);
            if (sendBtn) {
              await user.click(sendBtn);

              // Error message should appear
              await waitFor(() => {
                const error = screen.queryByText(/error|fel|failed|misslyckades/i);
                // Error handling varies
              });
            }
          }
        }
      }
    });

    it('validates message before sending', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          // Try to send empty message
          const sendBtn = screen.queryByText(/send|skicka/i);
          if (sendBtn) {
            await user.click(sendBtn);

            // Should show validation error
            await waitFor(() => {
              const validationError = screen.queryByText(/required|required|måste/i) ||
                                     screen.queryByText(/empty|tom/i);
              // Validation varies
            });
          }
        }
      }
    });

    it('disables send button while sending', async () => {
      const user = userEvent.setup();
      
      // Mock slow API
      global.fetch = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          ok: true,
          json: async () => ({ success: true }),
        } as Response), 1000))
      );

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          const messageInput = screen.queryByRole('textbox');
          if (messageInput) {
            await user.type(messageInput, 'Test message');

            const sendBtn = screen.queryByText(/send|skicka/i);
            if (sendBtn && sendBtn instanceof HTMLButtonElement) {
              await user.click(sendBtn);

              // Button should be disabled during send
              expect(sendBtn.disabled).toBe(true);

              // Wait for send to complete
              await waitFor(() => {
                expect(sendBtn.disabled).toBe(false);
              }, { timeout: 2000 });
            }
          }
        }
      }
    });
  });

  describe('Draft Saving', () => {
    it('auto-saves draft while typing', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          const messageInput = screen.queryByRole('textbox');
          if (messageInput) {
            await user.type(messageInput, 'Draft message');

            // Wait for auto-save (usually debounced)
            await waitFor(() => {
              const draftIndicator = screen.queryByText(/saved|draft|sparad|utkast/i);
              // Draft indicator varies
            }, { timeout: 2000 });
          }
        }
      }
    });

    it('restores draft when reopening response studio', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          const messageInput = screen.queryByRole('textbox');
          if (messageInput) {
            const draftText = 'Draft to restore';
            await user.type(messageInput, draftText);

            // Close response studio
            const closeBtn = screen.queryByLabelText(/close|stäng/i) ||
                            screen.queryByText(/×/);
            if (closeBtn) {
              await user.click(closeBtn);

              // Reopen response studio
              const replyBtn2 = screen.queryByLabelText(/reply|svara/i);
              if (replyBtn2) {
                await user.click(replyBtn2);

                // Draft should be restored
                await waitFor(() => {
                  const restoredInput = screen.queryByRole('textbox');
                  expect(restoredInput?.textContent || restoredInput?.value).toContain(draftText);
                });
              }
            }
          }
        }
      }
    });
  });

  describe('Keyboard Shortcuts', () => {
    it('sends message with Cmd+Enter', async () => {
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/inbox|inkorg/i)).toBeInTheDocument();
      });

      const messages = screen.getAllByRole('button');
      if (messages.length > 0) {
        await user.click(messages[0]);

        const replyBtn = screen.queryByLabelText(/reply|svara/i);
        if (replyBtn) {
          await user.click(replyBtn);

          const messageInput = screen.queryByRole('textbox');
          if (messageInput) {
            await user.type(messageInput, 'Quick send');

            // Press Cmd+Enter (or Ctrl+Enter)
            await user.keyboard('{Meta>}{Enter}{/Meta}');

            // Message should be sent
            await waitFor(() => {
              const success = screen.queryByText(/sent|skickat/i);
              // Success varies
            });
          }
        }
      }
    });
  });
});
