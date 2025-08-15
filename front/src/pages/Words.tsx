import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { wordsList } from "@/integrations/api/words";
import WordDetail from "./WordDetail";

const Words = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState<string>("");
  const [limit, setLimit] = useState(4);
  const [allWords, setAllWords] = useState<string[]>([]);
  const [visibleWords, setVisibleWords] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  const fetchWords = async (searchQuery: string, pageNum: number = 1, limitNum: number = 4) => {
    if (isLoading) return;
    setIsLoading(true);

    const cursor = pageNum > 1 && visibleWords.length > 0 
      ? btoa(JSON.stringify({ text: visibleWords[visibleWords.length - 1] })) 
      : '';
    const data = await wordsList(searchQuery, cursor, limitNum);
    
    setVisibleWords((prev) => (pageNum === 1 ? data.results : [...prev, ...data.results])); // Concatena apenas para páginas subsequentes
  };

  useEffect(() => {
    const container = document.getElementById("words-scroll-container");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !isLoading) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: container, // Importante: observar dentro do container de rolagem
        threshold: 1.0,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNext, isLoading]);

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(e.target.value) || 4;
    setLimit(newLimit);

    const next = new URLSearchParams(searchParams);
    next.set("limit", newLimit.toString());
    setSearchParams(next, { replace: true });

    // Limpa e refaz a busca com o novo limit
    setVisibleWords([]);
    setPage(1);
    fetchWords(search, 1, newLimit);
  };

  useEffect(() => {
    // Inicializa ou reinicia a busca apenas quando search ou limit mudam
    if (search || limit) {
      setVisibleWords([]); // Limpa a lista antes de uma nova busca
      setPage(1); // Reseta a página
      fetchWords(search, 1, limit);
    }
  }, [search, limit]);
  useEffect(() => {
  if (page > 1) {
    fetchWords(search, page, limit);
  }
}, [page]);

  const onSearch = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set("search", value);
      next.set("limit", limit.toString());
    } else {
      next.delete("search");
      next.delete("limit");
    }
    setSearchParams(next, { replace: true });
    setSearchValue(value); // Atualiza o valor de busca
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
            <WordDetail 
              term={selectedWord} 
              allWords={allWords}
            />
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

          <div className="flex gap-4">
            <Input
              className="flex"
              placeholder="Buscar palavra..."
              defaultValue={search}
              onChange={(e) => onSearch(e.target.value)}
              aria-label="Buscar palavra"
            />
            <Input
              type="number"
              value={limit}
              onChange={handleLimitChange}
              min="1"
              placeholder="Limit"
            />
          </div>

          <div
            id="words-scroll-container"
            className="h-[400px] overflow-y-auto border rounded-md p-2"
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
