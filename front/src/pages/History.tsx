import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getSupabase } from "@/lib/getSupabase";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

interface HistoryRow { term: string; viewed_at?: string }

const History = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryRow[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      if (!user) return;
      const supabase = await getSupabase();
      if (!supabase) return;
      const { data } = await supabase
        .from("history")
        .select("term, viewed_at")
        .eq("user_id", user.id)
        .order("viewed_at", { ascending: false });
      setItems(data ?? []);
    })();
  }, [user]);

  return (
    <main className="container mx-auto px-4 py-4">
      <Helmet>
        <title>Histórico — Dicionário</title>
        <meta name="description" content="Palavras que você já viu anteriormente." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <section>
        <h1 className="mb-3 text-xl font-semibold">Histórico</h1>
        {items.length === 0 ? (
          <p className="text-muted-foreground">Seu histórico está vazio.</p>
        ) : (
          <ul className="divide-y rounded-md border">
            {items.map((i, idx) => (
              <li key={`${i.term}-${idx}`} className="flex items-center justify-between px-4 py-3">
                <button className="text-left" onClick={() => navigate(`/word/${encodeURIComponent(i.term)}`)}>
                  {i.term}
                </button>
                {i.viewed_at && (
                  <span className="text-xs text-muted-foreground">{new Date(i.viewed_at).toLocaleString()}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default History;
