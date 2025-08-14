import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ignore = false;
    (async () => {
      
      
    })();

    (async () => {

    })();
  }, []);

  const signIn: AuthContextType["signIn"] = async (email, password) => {
    const data = {
      email,
      password
    }
    // const res = await fetch(`${BASE_URL}${path}`, {
    const res = await fetch(`http://localhost:3030/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Erro na API");
    
    const user = await res.json() 
    setUser(user)
    
    return {
      success: true,
      data: user
    }
  };

  const signUp: AuthContextType["signUp"] = async (name, email, password) => {
    const data = {
      name,
      email,
      password
    }
    // const res = await fetch(`${BASE_URL}${path}`, {
    const res = await fetch(`http://localhost:3030/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Erro na API");
    return res.json();
  }


  const signOut = async () => {
    
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
