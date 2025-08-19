import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { favoriteWord, unfavoriteWord, userFavorites, wordDetail } from "@/integrations/api/words";
import { toast } from "sonner";

interface Meaning {
  partOfSpeech: string;
  definitions: { definition: string; example?: string }[];
}

interface WordDetailProps {
  term: string;
  allWords?: string[];
  onSelectWord?: (word: string) => void;
}

const fetchWord = async (term: string) => {
  try {
    const res = await wordDetail(term);
    const item = res[0];
    const phonetic =
      item?.phonetic ||
      item?.phonetics?.[0]?.text ||
      item?.phonetics?.[1]?.text;
    const meanings = item?.meanings || [];
    return { phonetic, meanings };
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Erro ao buscar a palavra");
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
    async function loadFav() {
      if (!user || !term) {
        setIsFavorite(false);
        return;
      }
      try {

        const fav = await userFavorites(1, 10);
        
        const hasWord =
          fav?.results?.some((item) => (item?.text ?? item?.word) === term) ?? false;

        if (active) setIsFavorite(hasWord);
      } catch {
        if (active) setIsFavorite(false);
      }
    }
    loadFav();
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
    return () => { active = false; };
  }, [term]);

  const toggleFavorite = async () => {
    if (!user) return;
    setFavLoading(true);
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
    } catch {
      setIsFavorite(previous);
    } finally {
      setFavLoading(false);
    }
  };

  const goNext = () => {
    const idx = allWords.indexOf(term);
    if (idx >= 0 && idx < allWords.length - 1) onSelectWord(allWords[idx + 1]);
  };

  const goPrev = () => {
    const idx = allWords.indexOf(term);
    if (idx > 0) onSelectWord(allWords[idx - 1]);
  };

  const playPhonetic = () => {
    if (!term) return;
    const utter = new SpeechSynthesisUtterance(term);
    utter.lang = "en-US";
    speechSynthesis.speak(utter);
  };

  const title = useMemo(() => `${term} — Significados e fonética`, [term]);
  const isFirst = allWords.indexOf(term) === 0;
  const isLast = allWords.indexOf(term) === allWords.length - 1;

  return (
    <section className="space-y-4 sm:space-y-6">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={`Veja significados e fonética de ${term}. Salve como favorito.`} />
      </Helmet>

      <div className="sticky top-0 z-20 -mx-3 sm:mx-0 px-3 py-2 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between gap-2">
        <Button size="sm" onClick={goPrev} disabled={isFirst} aria-label="Anterior">
          ← Anterior
        </Button>
        <Button size="sm" onClick={goNext} disabled={isLast} aria-label="Próxima">
          Próxima →
        </Button>
      </div>

      <div className="bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-lg p-4 sm:p-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 break-words">{term}</h1>
        {phonetic && (
          <div className="flex flex-col items-center">
            <p className="text-base sm:text-lg">{phonetic}</p>
            <Button className="mt-2" size="sm" onClick={playPhonetic}>▶ Ouvir</Button>
          </div>
        )}
      </div>

      {loading && (
        <p className="text-center text-muted-foreground" aria-live="polite">
          Carregando...
        </p>
      )}
      {error && (
        <p className="text-center text-destructive" aria-live="assertive">
          {error}
        </p>
      )}

      {!loading && !error && meanings.length > 0 && (
        <div className="space-y-4 sm:space-y-5 text-left">
          <h2 className="text-lg sm:text-xl font-semibold">Meanings</h2>
          {meanings.map((m, i) => (
            <div key={i} className="space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground">{m.partOfSpeech}</p>
              {m.definitions.map((d, j) => (
                <p key={j} className="text-sm leading-relaxed">- {d.definition}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {user && (
        <div className="text-center">
          <Button
            variant={isFavorite ? "secondary" : "default"}
            onClick={toggleFavorite}
            disabled={favLoading}
            className="w-full sm:w-auto"
          >
            {isFavorite ? "Remover dos favoritos" : "Salvar como favorito"}
          </Button>
        </div>
      )}
    </section>
  );
};

export default WordDetail;
