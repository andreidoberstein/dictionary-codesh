import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

export const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();                 // já limpa e navega,
    // navigate('/login', { replace: true }); // só use se não navegar no signOut
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="font-semibold">
          Dicionário
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/" className={location.pathname === "/" ? "opacity-100" : "opacity-80"}>
            <Button variant="ghost" size="sm">Explorar</Button>
          </Link>
          {user ? (
            <Button variant="outline" size="sm" onClick={handleSignOut} aria-label="Sair">
              Sair
            </Button>
          ) : (
            <Link to="/login">
              <Button variant="default" size="sm" aria-label="Entrar">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};
