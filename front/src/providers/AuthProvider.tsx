import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { jwtDecode } from 'jwt-decode';

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
    const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          setUser(null);
          window.location.href = "/login";
        } else {
          setUser({ token, ...decoded });
        }
      } catch (e) {
        localStorage.removeItem("token");
        setUser(null);
        window.location.href = "/login";
      }
    }

    setLoading(false);
  }, []);

  const signIn: AuthContextType["signIn"] = async (email, password) => {
    const data = {
      email,
      password
    }
    const res = await fetch(`https://dictionary-codesh-production.up.railway.app/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    if (!res.ok) throw new Error("Erro na API");
    
    const user = await res.json()
    localStorage.setItem("token", user.token);

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
    const res = await fetch(`https://dictionary-codesh-production.up.railway.app/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error("Erro na API");
    return res.json();
  }


  const signOut: AuthContextType["signOut"] = async () => {
    try {
      console.log("Logout...")
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      window.location.href = "/login";
    }
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
