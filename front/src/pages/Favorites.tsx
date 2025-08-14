import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getSupabase } from "@/lib/getSupabase";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

interface FavoriteRow { term: string }

const Favorites = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<FavoriteRow[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!user) return;
      const supabase = await getSupabase();
      if (!supabase) return;
      const { data } = await supabase
        .from("favorites")
        .select("term")
        .eq("user_id", user.id)
        .order("term", { ascending: true });
      setItems(data ?? []);
    })();
  }, [user]);

  const remove = async (term: string) => {
    if (!user) return;
    const supabase = await getSupabase();
    if (!supabase) return;
    await supabase.from("favorites").delete().eq("user_id", user.id).eq("term", term);
    setItems((s) => s.filter((i) => i.term !== term));
  };

  return (
    <main className="container mx-auto px-4 py-4">
      <Helmet>
        <title>Favoritos — Dicionário</title>
        <meta name="description" content="Veja e gerencie suas palavras favoritas." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <section>
        <h1 className="mb-3 text-xl font-semibold">Favoritos</h1>
        {items.length === 0 ? (
          <p className="text-muted-foreground">Você ainda não tem favoritos.</p>
        ) : (
          <ul className="divide-y rounded-md border">
            {items.map((i) => (
              <li key={i.term} className="flex items-center justify-between px-4 py-3">
                <button
                  className="text-left"
                  onClick={() => navigate(`/word/${encodeURIComponent(i.term)}`)}
                >
                  {i.term}
                </button>
                <button className="text-sm text-destructive" onClick={() => remove(i.term)}>
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default Favorites;
