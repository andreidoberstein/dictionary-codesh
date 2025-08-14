export const getSupabase = async (): Promise<any | null> => {
  try {
    const mod: any = await import("@/integrations/supabase/client");
    return mod.supabase;
  } catch {
    return null;
  }
};
