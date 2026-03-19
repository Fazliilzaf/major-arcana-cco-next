/**
 * Mock API for Customer Identity Resolution
 * 
 * This file provides mock API endpoints that simulate backend operations.
 * In production, these would be real API calls to your Supabase backend.
 * 
 * Ready for Supabase integration - just replace mock functions with real API calls!
 */

import type { UnifiedCustomer, EmailAlias, PhoneAlias, MergeSuggestion } from "../components/customer-identity-manager";
import { mockUnifiedCustomers, mockMergeSuggestions } from "../data/mock-customer-identity-data";

// Simulate network delay
const simulateDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================================================
// CUSTOMER ENDPOINTS
// ============================================================================

/**
 * GET /api/customers
 * Fetch all unified customer profiles
 */
export async function fetchCustomers(): Promise<UnifiedCustomer[]> {
  await simulateDelay();
  
  // TODO: Replace with real Supabase call
  // const { data, error } = await supabase
  //   .from('unified_customers')
  //   .select('*, customer_emails(*), customer_phones(*)')
  //   .order('last_contact', { ascending: false });
  
  return mockUnifiedCustomers;
}

/**
 * GET /api/customers/:id
 * Fetch a single customer by ID
 */
export async function fetchCustomerById(customerId: string): Promise<UnifiedCustomer | null> {
  await simulateDelay();
  
  // TODO: Replace with real Supabase call
  // const { data, error } = await supabase
  //   .from('unified_customers')
  //   .select('*, customer_emails(*), customer_phones(*)')
  //   .eq('id', customerId)
  //   .single();
  
  const customer = mockUnifiedCustomers.find(c => c.id === customerId);
  return customer || null;
}

/**
 * GET /api/customers/by-email/:email
 * Find customer by email address
 */
export async function findCustomerByEmail(email: string): Promise<UnifiedCustomer | null> {
  await simulateDelay();
  
  // TODO: Replace with real Supabase call
  // const { data, error } = await supabase
  //   .from('customer_emails')
  //   .select('customer_id, unified_customers(*)')
  //   .eq('email', email)
  //   .single();
  
  const customer = mockUnifiedCustomers.find(c => 
    c.emails.some(e => e.email.toLowerCase() === email.toLowerCase())
  );
  return customer || null;
}

/**
 * GET /api/customers/by-phone/:phone
 * Find customer by phone number
 */
export async function findCustomerByPhone(phone: string): Promise<UnifiedCustomer | null> {
  await simulateDelay();
  
  // TODO: Replace with real Supabase call
  // const { data, error } = await supabase
  //   .from('customer_phones')
  //   .select('customer_id, unified_customers(*)')
  //   .eq('phone', phone)
  //   .single();
  
  const customer = mockUnifiedCustomers.find(c =>
    c.phones.some(p => p.phone === phone)
  );
  return customer || null;
}

// ============================================================================
// EMAIL MANAGEMENT ENDPOINTS
// ============================================================================

/**
 * POST /api/customers/:id/emails
 * Add a new email address to a customer
 */
export async function addEmailToCustomer(
  customerId: string,
  email: string
): Promise<{ success: boolean; customer: UnifiedCustomer | null }> {
  await simulateDelay();
  
  // TODO: Replace with real Supabase call
  // const { data, error } = await supabase
  //   .from('customer_emails')
  //   .insert({
  //     customer_id: customerId,
  //     email: email,
  //     is_primary: false,
  //     verified: false,
  //     first_seen: new Date().toISOString(),
  //     last_used: new Date().toISOString(),
  //     message_count: 0
  //   });
  
  console.log(`[MOCK API] Adding email ${email} to customer ${customerId}`);
  
  return {
    success: true,
    customer: await fetchCustomerById(customerId),
  };
}

/**
 * DELETE /api/customers/:id/emails/:email
 * Remove an email address from a customer
 */
export async function removeEmailFromCustomer(
  customerId: string,
  email: string
): Promise<{ success: boolean }> {
  await simulateDelay();
  
  // TODO: Replace with real Supabase call
  // const { error } = await supabase
  //   .from('customer_emails')
  //   .delete()
  //   .eq('customer_id', customerId)
  //   .eq('email', email)
  //   .eq('is_primary', false); // Prevent deleting primary email
  
  console.log(`[MOCK API] Removing email ${email} from customer ${customerId}`);
  
  return { success: true };
}

/**
 * PUT /api/customers/:id/primary-email
 * Set a new primary email for a customer
 */
export async function setPrimaryEmail(
  customerId: string,
  email: string
): Promise<{ success: boolean }> {
  await simulateDelay();
  
  // TODO: Replace with real Supabase call
  // const { error } = await supabase.rpc('set_primary_email', {
  //   p_customer_id: customerId,
  //   p_email: email
  // });
  
  console.log(`[MOCK API] Setting ${email} as primary for customer ${customerId}`);
  
  return { success: true };
}

/**
 * GET /api/customers/:id/aliases
 * Get all email and phone aliases for a customer
 */
export async function getCustomerAliases(customerId: string): Promise<{
  emails: EmailAlias[];
  phones: PhoneAlias[];
}> {
  await simulateDelay();
  
  const customer = await fetchCustomerById(customerId);
  
  return {
    emails: customer?.emails || [],
    phones: customer?.phones || [],
  };
}

// ============================================================================
// MERGE ENDPOINTS
// ============================================================================

/**
 * POST /api/customers/merge
 * Merge two customer profiles
 */
export async function mergeCustomers(
  primaryCustomerId: string,
  secondaryCustomerId: string,
  options: {
    keepAllEmails: boolean;
    keepAllPhones: boolean;
    combineNotes: boolean;
  }
): Promise<{ success: boolean; mergedCustomer: UnifiedCustomer | null }> {
  await simulateDelay(500);
  
  // TODO: Replace with real Supabase call
  // const { data, error } = await supabase.rpc('merge_customers', {
  //   p_primary_customer_id: primaryCustomerId,
  //   p_secondary_customer_id: secondaryCustomerId,
  //   p_keep_all_emails: options.keepAllEmails,
  //   p_keep_all_phones: options.keepAllPhones,
  //   p_combine_notes: options.combineNotes
  // });
  
  console.log(`[MOCK API] Merging customer ${secondaryCustomerId} into ${primaryCustomerId}`, options);
  
  return {
    success: true,
    mergedCustomer: await fetchCustomerById(primaryCustomerId),
  };
}

/**
 * POST /api/customers/bulk-merge
 * Merge multiple customer profiles into one
 */
export async function bulkMergeCustomers(
  customerIds: string[],
  primaryCustomerId: string
): Promise<{ success: boolean; mergedCustomer: UnifiedCustomer | null }> {
  await simulateDelay(800);
  
  // TODO: Replace with real Supabase call
  // const { data, error } = await supabase.rpc('bulk_merge_customers', {
  //   p_customer_ids: customerIds,
  //   p_primary_customer_id: primaryCustomerId
  // });
  
  console.log(`[MOCK API] Bulk merging ${customerIds.length} customers into ${primaryCustomerId}`);
  
  return {
    success: true,
    mergedCustomer: await fetchCustomerById(primaryCustomerId),
  };
}

/**
 * POST /api/customers/split
 * Split a merged customer profile
 */
export async function splitCustomer(
  customerId: string,
  emailToSplit: string
): Promise<{ success: boolean; newCustomer: UnifiedCustomer | null }> {
  await simulateDelay(500);
  
  // TODO: Replace with real Supabase call
  // const { data, error } = await supabase.rpc('split_customer', {
  //   p_customer_id: customerId,
  //   p_email_to_split: emailToSplit
  // });
  
  console.log(`[MOCK API] Splitting ${emailToSplit} from customer ${customerId}`);
  
  return {
    success: true,
    newCustomer: null, // Would return the newly created customer
  };
}

// ============================================================================
// MERGE SUGGESTIONS ENDPOINTS
// ============================================================================

/**
 * GET /api/merge-suggestions
 * Get AI-generated merge suggestions
 */
export async function fetchMergeSuggestions(): Promise<MergeSuggestion[]> {
  await simulateDelay();
  
  // TODO: Replace with real Supabase call + AI analysis
  // const { data, error } = await supabase
  //   .from('merge_suggestions')
  //   .select('*')
  //   .eq('status', 'pending')
  //   .order('confidence', { ascending: false });
  
  return mockMergeSuggestions;
}

/**
 * POST /api/merge-suggestions/:id/accept
 * Accept a merge suggestion
 */
export async function acceptMergeSuggestion(suggestionId: string): Promise<{ success: boolean }> {
  await simulateDelay();
  
  // TODO: Replace with real Supabase call
  // const { error } = await supabase
  //   .from('merge_suggestions')
  //   .update({ status: 'accepted', accepted_at: new Date().toISOString() })
  //   .eq('id', suggestionId);
  
  console.log(`[MOCK API] Accepting merge suggestion ${suggestionId}`);
  
  return { success: true };
}

/**
 * POST /api/merge-suggestions/:id/reject
 * Reject a merge suggestion
 */
export async function rejectMergeSuggestion(suggestionId: string): Promise<{ success: boolean }> {
  await simulateDelay();
  
  // TODO: Replace with real Supabase call
  // const { error } = await supabase
  //   .from('merge_suggestions')
  //   .update({ status: 'rejected', rejected_at: new Date().toISOString() })
  //   .eq('id', suggestionId);
  
  console.log(`[MOCK API] Rejecting merge suggestion ${suggestionId}`);
  
  return { success: true };
}

/**
 * POST /api/merge-suggestions/generate
 * Generate new AI merge suggestions
 */
export async function generateMergeSuggestions(): Promise<{ 
  success: boolean; 
  count: number;
  suggestions: MergeSuggestion[];
}> {
  await simulateDelay(1000);
  
  // TODO: Replace with real AI analysis
  // This would analyze all customers and find potential duplicates
  // based on name similarity, phone numbers, email domains, etc.
  
  console.log(`[MOCK API] Generating new merge suggestions via AI...`);
  
  return {
    success: true,
    count: mockMergeSuggestions.length,
    suggestions: mockMergeSuggestions,
  };
}

// ============================================================================
// VERIFICATION ENDPOINTS
// ============================================================================

/**
 * POST /api/customers/:id/emails/:email/verify
 * Send verification email
 */
export async function sendEmailVerification(
  customerId: string,
  email: string
): Promise<{ success: boolean }> {
  await simulateDelay();
  
  // TODO: Replace with real email verification
  // Send verification email via SendGrid/Postmark/etc.
  
  console.log(`[MOCK API] Sending verification email to ${email}`);
  
  return { success: true };
}

/**
 * POST /api/verify-email/:token
 * Verify email with token
 */
export async function verifyEmailWithToken(token: string): Promise<{ success: boolean }> {
  await simulateDelay();
  
  // TODO: Replace with real verification logic
  // const { error } = await supabase
  //   .from('customer_emails')
  //   .update({ verified: true })
  //   .eq('verification_token', token);
  
  console.log(`[MOCK API] Verifying email with token ${token}`);
  
  return { success: true };
}

// ============================================================================
// STATISTICS ENDPOINTS
// ============================================================================

/**
 * GET /api/customers/stats
 * Get customer statistics
 */
export async function getCustomerStats(): Promise<{
  totalCustomers: number;
  vipCustomers: number;
  mergedProfiles: number;
  totalEmailAliases: number;
  totalPhoneAliases: number;
  totalConversations: number;
  totalLTV: number;
  averageLTV: number;
}> {
  await simulateDelay();
  
  const customers = await fetchCustomers();
  
  return {
    totalCustomers: customers.length,
    vipCustomers: customers.filter(c => c.isVIP).length,
    mergedProfiles: customers.filter(c => c.mergedProfiles.length > 0).length,
    totalEmailAliases: customers.reduce((sum, c) => sum + c.emails.length, 0),
    totalPhoneAliases: customers.reduce((sum, c) => sum + c.phones.length, 0),
    totalConversations: customers.reduce((sum, c) => sum + c.totalConversations, 0),
    totalLTV: customers.reduce((sum, c) => sum + (c.lifetimeValue || 0), 0),
    averageLTV: customers.reduce((sum, c) => sum + (c.lifetimeValue || 0), 0) / customers.length,
  };
}

// ============================================================================
// EXPORT/IMPORT ENDPOINTS
// ============================================================================

/**
 * GET /api/customers/export
 * Export all customer data
 */
export async function exportCustomers(format: 'json' | 'csv' = 'json'): Promise<Blob> {
  await simulateDelay(500);
  
  const customers = await fetchCustomers();
  
  if (format === 'json') {
    const json = JSON.stringify(customers, null, 2);
    return new Blob([json], { type: 'application/json' });
  } else {
    // CSV export
    const headers = ['ID', 'Name', 'Primary Email', 'Phone', 'LTV', 'Conversations'];
    const rows = customers.map(c => [
      c.id,
      c.primaryName,
      c.emails.find(e => e.isPrimary)?.email || '',
      c.phones.find(p => p.isPrimary)?.phone || '',
      c.lifetimeValue || 0,
      c.totalConversations,
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    return new Blob([csv], { type: 'text/csv' });
  }
}

/**
 * POST /api/customers/import
 * Import customer data
 */
export async function importCustomers(file: File): Promise<{
  success: boolean;
  imported: number;
  errors: string[];
}> {
  await simulateDelay(1000);
  
  // TODO: Replace with real import logic
  // Parse file, validate data, insert into Supabase
  
  console.log(`[MOCK API] Importing customers from file: ${file.name}`);
  
  return {
    success: true,
    imported: 10,
    errors: [],
  };
}

// ============================================================================
// SUPABASE INTEGRATION GUIDE
// ============================================================================

/**
 * TO INTEGRATE WITH SUPABASE:
 * 
 * 1. Install Supabase client:
 *    npm install @supabase/supabase-js
 * 
 * 2. Create Supabase client:
 *    import { createClient } from '@supabase/supabase-js'
 *    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
 * 
 * 3. Replace all mock functions with real Supabase queries (examples in comments above)
 * 
 * 4. Create database schema (see /CUSTOMER_IDENTITY_RESOLUTION.md for schema)
 * 
 * 5. Create PostgreSQL functions for complex operations:
 *    - merge_customers(p_primary_customer_id, p_secondary_customer_id, options)
 *    - bulk_merge_customers(p_customer_ids, p_primary_customer_id)
 *    - split_customer(p_customer_id, p_email_to_split)
 *    - set_primary_email(p_customer_id, p_email)
 * 
 * 6. Set up Row Level Security (RLS) policies for data protection
 * 
 * 7. Enable real-time subscriptions for live updates
 */
