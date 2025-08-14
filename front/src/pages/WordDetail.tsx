import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/getSupabase";
import { useAuth } from "@/providers/AuthProvider";

interface Meaning {
  partOfSpeech: string;
  definitions: { definition: string; example?: string }[];
}

const fetchWord = async (term: string) => {
  const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`);
  if (!res.ok) throw new Error("Falha ao buscar palavra");
  const data = await res.json();
  const item = data[0];
  const phonetic: string | undefined = item?.phonetic || item?.phonetics?.[0]?.text;
  const meanings: Meaning[] = item?.meanings || [];
  return { phonetic, meanings };
};

const WordDetail = () => {
  const { term = "" } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phonetic, setPhonetic] = useState<string | undefined>();
  const [meanings, setMeanings] = useState<Meaning[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { phonetic, meanings } = await fetchWord(term);
        if (!active) return;
        setPhonetic(phonetic);
        setMeanings(meanings);
      } catch (e: any) {
        if (!active) return;
        setError(e.message ?? "Erro inesperado");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [term]);

  useEffect(() => {
    (async () => {
      if (!user || !term) return;
      const supabase = await getSupabase();
      if (!supabase) return;
      await supabase.from("history").insert({ term, user_id: user.id }).catch(() => {});
      const { data } = await supabase
        .from("favorites")
        .select("term")
        .eq("user_id", user.id)
        .eq("term", term)
        .maybeSingle();
      setIsFavorite(!!data);
    })();
  }, [user, term]);

  const toggleFavorite = async () => {
    if (!user) return;
    const supabase = await getSupabase();
    if (!supabase) return;
    if (isFavorite) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("term", term);
      setIsFavorite(false);
    } else {
      await supabase.from("favorites").upsert({ term, user_id: user.id });
      setIsFavorite(true);
    }
  };

  const title = useMemo(() => `${term} — Significados e fonética`, [term]);

  return (
    <main className="container mx-auto px-4 py-4 max-w-2xl">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={`Veja significados e fonética de ${term}. Salve como favorito.`} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      
      <section className="space-y-6">
        {/* Word Card */}
        <div className="bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{term}</h1>
          {phonetic && <p className="text-lg text-gray-600 dark:text-gray-300">{phonetic}</p>}
        </div>

        {/* Audio Bar */}
        <div className="bg-blue-500 h-2 rounded-full relative overflow-hidden">
          <div className="bg-blue-300 h-full w-1/3 rounded-full"></div>
        </div>

        {/* Meanings Section */}
        {loading && <p className="text-center text-muted-foreground">Carregando...</p>}
        {error && <p className="text-center text-destructive">{error}</p>}
        {!loading && !error && meanings.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Meanings</h2>
            {meanings.map((m, i) => (
              <div key={i} className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {m.partOfSpeech}. "{m.definitions[0]?.definition || 'No definition available'}"
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            Voltar
          </Button>
          <Button variant="outline">
            Próximo
          </Button>
        </div>

        {/* Favorite Button */}
        {user && (
          <div className="text-center">
            <Button variant={isFavorite ? "secondary" : "default"} onClick={toggleFavorite} aria-label="Favoritar">
              {isFavorite ? "Remover dos favoritos" : "Salvar como favorito"}
            </Button>
          </div>
        )}
      </section>
    </main>
  );
};

export default WordDetail;
