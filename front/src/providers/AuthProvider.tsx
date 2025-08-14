import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getSupabase } from "@/lib/getSupabase";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      const supabase = await getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!ignore) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    })();

    (async () => {
      const supabase = await getSupabase();
      if (!supabase) return;
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => listener.subscription.unsubscribe();
    })();
  }, []);

  const signIn: AuthContextType["signIn"] = async (email, password) => {
    const supabase = await getSupabase();
    if (!supabase) return { error: "Autenticação indisponível" };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { error: error.message } : {};
  };

  const signUp: AuthContextType["signUp"] = async (email, password) => {
    const supabase = await getSupabase();
    if (!supabase) return { error: "Autenticação indisponível" };
    const { error } = await supabase.auth.signUp({ email, password });
    return error ? { error: error.message } : {};
  };

  const signOut = async () => {
    const supabase = await getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
