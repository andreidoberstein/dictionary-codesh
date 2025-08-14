import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Helmet>
        <title>Página não encontrada</title>
        <meta name="description" content="A página que você tentou acessar não existe." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Oops! Página não encontrada</p>
        <Link to="/" className="underline">
          Voltar para Home
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
