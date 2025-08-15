import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { wordsList } from "@/integrations/api/words";
import WordDetail from "./WordDetail";

const chunkSize = 50;

const Words = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [allWords, setAllWords] = useState<string[]>([]);
  const [visibleWords, setVisibleWords] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(chunkSize);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await wordsList();
        const words = await res.results;
        if (active) {
          setAllWords(words);
          setVisibleWords(words);
        }
      } catch {
        const fallback = ["hello", "world", "dictionary", "language", "programming"];
        setAllWords(fallback);
        setVisibleWords(fallback.slice(0, chunkSize));
      }
    };
    load();
    return () => { active = false };
  }, []);

  const filtered = useMemo(() => {
    return search
      ? allWords.filter((w) => w.toLowerCase().includes(search.toLowerCase()))
      : allWords;
  }, [allWords, search]);

  useEffect(() => {
    setVisibleCount(chunkSize);
    setVisibleWords(filtered.slice(0, chunkSize));
  }, [filtered]);

  const onSearch = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("search", value);
    else next.delete("search");
    setSearchParams(next, { replace: true });
  };

  return (
    <main className="container mx-auto px-4 py-4">
      <Helmet>
        <title>Explorar palavras</title>
        <meta
          name="description"
          content="Explore palavras com rolagem infinita e busca compartilhável."
        />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="flex gap-6">
        {/* Painel esquerdo - detalhes */}
        <div className="flex-1 border rounded-lg p-4">
          {selectedWord ? (
            <WordDetail term={selectedWord} allWords={allWords}/>
          ) : (
            <p className="text-muted-foreground">Selecione uma palavra para ver detalhes</p>
          )}
        </div>

        {/* Painel direito - lista */}
        <div className="flex-1 space-y-6">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <button className="flex-1 py-2 px-4 bg-background text-foreground rounded-md text-sm font-medium">
              Word list
            </button>
            <button className="flex-1 py-2 px-4 text-muted-foreground rounded-md text-sm font-medium hover:bg-background/50">
              Favorites
            </button>
          </div>

          <Input
            placeholder="Buscar palavra..."
            defaultValue={search}
            onChange={(e) => onSearch(e.target.value)}
            aria-label="Buscar palavra"
          />

          <div
            id="words-scroll-container"
            className="h-[400px] overflow-y-auto border rounded-md p-2"
            onScroll={(e) => {
              const target = e.currentTarget;
              if (target.scrollTop + target.clientHeight >= target.scrollHeight - 5) {
                setVisibleCount((prev) => {
                  const nextCount = Math.min(prev + chunkSize, filtered.length);
                  setVisibleWords(filtered.slice(0, nextCount));
                  return nextCount;
                });
              }
            }}
          >
            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
              {visibleWords.map((w) => (
                <button
                  key={w}
                  className="p-3 text-center border rounded-md hover:bg-accent transition-colors text-sm"
                  onClick={() => setSelectedWord(w)}
                  aria-label={`Ver detalhes de ${w}`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Words;
