import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { favoriteWord, userFavorites, userHistories, wordsList } from "@/integrations/api/words";
import WordDetail from "./WordDetail";

const Words = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState<string>("");
  const [limit, setLimit] = useState(4);
  const [allWords, setAllWords] = useState<string[]>([]);
  const [visibleWords, setVisibleWords] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(50);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeButton, setActiveButton] = useState('wordList')
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const pagingRef = useRef(false);
  const firstPageLoadedRef = useRef(false);

  const fetchWords = async (searchQuery: string, cursor?: string, limit?: number) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (!searchQuery) {
        const data = await wordsList("", undefined, undefined);
        setAllWords(data.results);
        setVisibleCount(50);
        setNextCursor(null);
        setVisibleWords([]);
        firstPageLoadedRef.current = true;
      } else {
        const effectiveLimit = Number.isFinite(limit) && limit > 0 ? limit : 4;
        const data = await wordsList(searchQuery, cursor ?? undefined, effectiveLimit);
        const pageResults = data.results.slice(0, effectiveLimit);
        const merged = cursor ? [...visibleWords, ...pageResults] : pageResults;

        setVisibleWords(merged);
        setNextCursor(data.next || null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const container = document.getElementById("words-scroll-container");

    const observer = new IntersectionObserver(async (entries) => {
      const e = entries[0];
      if (!e.isIntersecting) return;
      if (isLoading) return;

      if (!firstPageLoadedRef.current) return;

      const scrolled = container
        ? container.scrollTop + container.clientHeight >= container.scrollHeight - 60
        : false;
      if (!scrolled) return;

      if (pagingRef.current) return;

      if (!search) {
        pagingRef.current = true;
        setVisibleCount((prev) => prev + 50);
        pagingRef.current = false;
      } else if (nextCursor) {
        pagingRef.current = true;
        await fetchWords(search, nextCursor);
        pagingRef.current = false;
      }
    }, { root: container, threshold: 0.1 });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [search, nextCursor, isLoading, limit]);
  
  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = parseInt(e.target.value) || 4;
    setLimit(newLimit);

    const next = new URLSearchParams(searchParams);
    next.set("limit", newLimit.toString());
    setSearchParams(next, { replace: true });

    setVisibleWords([]);
    setNextCursor(null);
    firstPageLoadedRef.current = false;
    fetchWords(search, undefined, newLimit);
  };

  useEffect(() => {
    setVisibleWords([]);
    setAllWords([]);
    setNextCursor(null);
    firstPageLoadedRef.current = false;
    fetchWords(search, undefined);
  }, [search, limit]);

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
    setSearchValue(value);
  };

  const handleFavoritesTab = async () => {    
    setActiveButton('favorites');
    setNextCursor(null);
    firstPageLoadedRef.current = false; 
    setVisibleCount(50);                 

    try {
      const favorites = await userFavorites(1, 10);
      const wordsArray = favorites.results.map((item) => item.word);
      setVisibleWords(wordsArray);
    } catch (e) {
      console.error(e);
      setVisibleWords([]); 
    }
  }
  
  const handleHistoriesTab = async () => {
    setActiveButton('histories');
    setNextCursor(null);
    firstPageLoadedRef.current = false; 
    setVisibleCount(50);                 

    try {
      const histories = await userHistories(1, 10);
      const wordsArray = histories.results.map((item) => item.word.text);
      setVisibleWords(wordsArray);
    } catch (e) {
      console.error(e);
      setVisibleWords([]); // fallback
    }
  }
  
  const handleWordListTab = async () => {
    setVisibleWords([])
    setActiveButton('wordList')
    fetchWords(search, undefined)
  }

  const itemsToShow = activeButton === 'wordList'
    ? (search ? visibleWords : allWords.slice(0, visibleCount))
    : visibleWords; 

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
            <WordDetail 
              term="hello" 
              allWords={allWords}
            />
          )}
        </div>

        {/* Painel direito - lista */}
        <div className="flex-1 space-y-6">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <button 
              onClick={handleWordListTab}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeButton === 'wordList'
                  ? 'bg-background text-foreground'
                  : 'text-muted-foreground hover:bg-background/50'
              }`}>
              Word list
            </button>
            <button
              onClick={handleFavoritesTab}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeButton === 'favorites'
                  ? 'bg-background text-foreground'
                  : 'text-muted-foreground hover:bg-background/50'
              }`}>
              Favorites
            </button>
            <button 
              onClick={handleHistoriesTab}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                activeButton === 'histories'
                  ? 'bg-background text-foreground'
                  : 'text-muted-foreground hover:bg-background/50'
              }`}>
              Histories
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
              {/* {(search ? visibleWords : allWords.slice(0, visibleCount)).map((w) => (                 */}
              {itemsToShow.map((w) => (
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
            <div ref={observerRef} className="h-4" />
            {isLoading && (
              <div className="py-2 text-center text-sm">Carregando...</div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
};

export default Words;
