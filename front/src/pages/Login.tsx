import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet-async";

const Login = () => {
  const { signIn, signUp } = useAuth();
  const [inputName, setInputName] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = isSignup ? await signUp(name, email, password) : await signIn(email, password);

    setEmail("")
    setPassword("")

    if (res.error) {
      setError(res.error)
    } else if(isSignup) {
      setIsSignup((s) => !s)
      setInputName((s) => !s)
    } else {
      navigate(location.state?.from?.pathname || "/");
    } 
  };

  const handleClickRegister = () => {
    setIsSignup((s) => !s)
    setInputName((s) => !s)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Entrar — Dicionário</title>
        <meta name="description" content="Entrar no Dicionário para salvar favoritos e ver histórico." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <section className="mx-auto max-w-sm">
        <h1 className="mb-4 text-2xl font-semibold">{isSignup ? "Criar conta" : "Entrar"}</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          { inputName &&
            <div >
              <label className="mb-1 block text-sm">Nome</label>
              <Input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          }
          <div>
            <label className="mb-1 block text-sm">E-mail</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-sm">Senha</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex items-center gap-2 pt-2">
            <Button type="submit" variant="default" className="flex-1">
              {isSignup ? "Cadastrar" : "Entrar"}
            </Button>
            <Button type="button" variant="secondary" onClick={handleClickRegister}> 
              {isSignup ? "Já tenho conta" : "Criar conta"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
