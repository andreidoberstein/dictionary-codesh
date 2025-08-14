// Stub Supabase client for when the Lovable Supabase integration is not connected.
// This file satisfies the dynamic import in src/lib/getSupabase.ts to avoid build-time resolution errors.
// To enable real auth/database features, connect Supabase via Lovable's green Supabase button.

// Export a null client; app code already handles the `null` case gracefully.
export const supabase = null as any;
