import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/getSupabase";
import { useAuth } from "@/providers/AuthProvider";
import { favoriteWord, isWordFavorited, unfavoriteWord, userFavorites, wordDetail } from "@/integrations/api/words";
import { toast } from "sonner";

interface Meaning {
  partOfSpeech: string;
  definitions: { definition: string; example?: string }[];
}

interface WordDetailProps {
  term: string;
  allWords?: string[]; // Optional prop with default
  onSelectWord?: (word: string) => void; // Optional callback
}

const fetchWord = async (term: string) => {
  try {
    const res = await wordDetail(term);
    const item = res[0];
    const phonetic = item?.phonetic || item?.phonetics?.[0]?.text || item?.phonetics?.[1]?.text;
    const meanings = item?.meanings || [];
    return { phonetic, meanings };
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao buscar a palavra');
  }
};

const WordDetail = ({ term, allWords = [], onSelectWord = () => {} }: WordDetailProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phonetic, setPhonetic] = useState<string | undefined>();
  const [meanings, setMeanings] = useState<Meaning[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!user || !term) {
        setIsFavorite(false);
        return;
      }
      try {
        const fav = await userFavorites(1,10);
        console.log(fav)
        const hasWord = fav.results.some(item => item.text == term)
        if (active) setIsFavorite(hasWord);
      } catch (e) {
        if (active) setIsFavorite(false);
      }
    }
    load();
    return () => { active = false; };
  }, [term, user]);

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
      } catch (e) {
        if (!active) return;
        setError(e.message ?? "Erro inesperado");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false };
  }, [term]);

  const toggleFavorite = async () => {
    if (!user) return;
    
    setFavLoading(true);
    // otimismo: aplica local e reverte em erro
    const previous = isFavorite;
    setIsFavorite(!previous);
    try {
      if (previous) {
        await unfavoriteWord(term);
        toast.success(`Palavra "${term}" removida dos favoritos`, { id: `fav-${term}` });
      } else {
        await favoriteWord(term);
        toast.success(`Palavra "${term}" salva nos favoritos`, { id: `fav-${term}` });
      }
    } catch (e) {
      setIsFavorite(previous); // rollback
      // toast.error("Não foi possível atualizar favoritos");
    } finally {
      setFavLoading(false);
    }
  }

  const goNext = () => {
    const idx = allWords.indexOf(term);
    if (idx >= 0 && idx < allWords.length - 1) {
      onSelectWord(allWords[idx + 1]);
    }
  };

  const goPrev = () => {
    const idx = allWords.indexOf(term);
    if (idx > 0) {
      onSelectWord(allWords[idx - 1]);
    }
  };

  const playPhonetic = () => {
    if (!term) return;
    const utter = new SpeechSynthesisUtterance(term);
    utter.lang = "en-US";
    speechSynthesis.speak(utter);
  };

  const title = useMemo(() => `${term} — Significados e fonética`, [term]);

  return (
    <div className="space-y-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={`Veja significados e fonética de ${term}. Salve como favorito.`} />
      </Helmet>

      <div className="flex justify-between">
        <Button onClick={goPrev} disabled={allWords.indexOf(term) === 0}>← Anterior</Button>
        <Button onClick={goNext} disabled={allWords.indexOf(term) === allWords.length - 1}>Próxima →</Button>
      </div>

      <div className="bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold mb-2">{term}</h1>
        {phonetic && (
          <div className="flex flex-col items-center">
            <p className="text-lg">{phonetic}</p>
            <Button className="mt-2" onClick={playPhonetic}>▶ Ouvir</Button>
          </div>
        )}
      </div>

      {loading && <p className="text-center text-muted-foreground">Carregando...</p>}
      {error && <p className="text-center text-destructive">{error}</p>}
      {!loading && !error && meanings.length > 0 && (
        <div className="space-y-4 text-center">
          <h2 className="text-xl font-semibold">Meanings</h2>
          {meanings.map((m, i) => (
            <div key={i} className="space-y-2">
              <p className="text-sm text-muted-foreground">{m.partOfSpeech}</p>
              {m.definitions.map((d, j) => (
                <p key={j} className="text-sm">- {d.definition}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* {user && (
        <div className="text-center">
          <Button variant={isFavorite ? "secondary" : "default"} onClick={toggleFavorite}>
            {isFavorite ? "Remover dos favoritos" : "Salvar como favorito"}
          </Button>
        </div>  bceae5ad-6e4c-4c76-9a77-442a65b82b8e
      )} */}
      {user && (
        <div className="text-center">
          <Button
            variant={isFavorite ? "secondary" : "default"}
            onClick={toggleFavorite}
            disabled={favLoading}
          >
            {isFavorite ? "Remover dos favoritos" : "Salvar como favorito"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default WordDetail;
