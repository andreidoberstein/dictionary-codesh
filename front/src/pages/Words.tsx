import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { userFavorites, userHistories, wordsList } from "@/integrations/api/words";
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

  const [activeButton, setActiveButton] = useState<"wordList" | "favorites" | "histories">("wordList");
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
    const observer = new IntersectionObserver(
      async (entries) => {
        const e = entries[0];
        if (!e.isIntersecting || isLoading || !firstPageLoadedRef.current) return;

        const scrolled = container
          ? container.scrollTop + container.clientHeight >= container.scrollHeight - 60
          : false;
        if (!scrolled || pagingRef.current) return;

        if (!search) {
          pagingRef.current = true;
          setVisibleCount((prev) => prev + 50);
          pagingRef.current = false;
        } else if (nextCursor) {
          pagingRef.current = true;
          await fetchWords(search, nextCursor);
          pagingRef.current = false;
        }
      },
      { root: container, threshold: 0.1 }
    );

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
    setActiveButton("favorites");
    setNextCursor(null);
    firstPageLoadedRef.current = false;
    setVisibleCount(50);

    try {
      const favorites = await userFavorites(1, 50);
      const wordsArray = favorites.results.map((item) => item?.word ?? item?.text);
      setVisibleWords(wordsArray);
    } catch (e) {
      console.error(e);
      setVisibleWords([]);
    }
  };

  const handleHistoriesTab = async () => {
    setActiveButton("histories");
    setNextCursor(null);
    firstPageLoadedRef.current = false;
    setVisibleCount(50);

    try {
      const histories = await userHistories(1, 50);
      const wordsArray = histories.results.map((item) => item?.word?.text ?? item?.word);
      setVisibleWords(wordsArray);
    } catch (e) {
      console.error(e);
      setVisibleWords([]);
    }
  };

  const handleWordListTab = async () => {
    setVisibleWords([]);
    setActiveButton("wordList");
    fetchWords(search, undefined);
  };

  const itemsToShow =
    activeButton === "wordList"
      ? (search ? visibleWords : allWords.slice(0, visibleCount))
      : visibleWords;

  const currentWord = useMemo(() => selectedWord || "hello", [selectedWord]);

  return (
    <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 py-4">
      <Helmet>
        <title>Explorar palavras</title>
        <meta
          name="description"
          content="Explore palavras com rolagem infinita e busca compartilhável."
        />
        <link
          rel="canonical"
          href={typeof window !== "undefined" ? window.location.href : ""}
        />
      </Helmet>

      {/* [C1] Grid mobile-first; em lg vira 2 colunas (3/5 detalhe, 2/5 lista) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        {/* [C2] DETALHE primeiro no DOM (mobile: primeiro; lg: fica à esquerda, col-span-3) */}
        <section className="order-1 lg:order-none lg:col-span-3 border rounded-lg p-3 sm:p-4">
          <WordDetail term={currentWord} allWords={allWords} onSelectWord={setSelectedWord} />
        </section>

        {/* [C3] LISTA segundo no DOM (mobile: depois; lg: à direita, col-span-2) */}
        <section className="order-2 lg:order-none lg:col-span-2 space-y-4">
          {/* Tabs roláveis no mobile */}
          <div className="bg-muted rounded-lg p-1 overflow-x-auto">
            <div className="flex sm:grid sm:grid-cols-3 gap-1 min-w-0">
              <button
                onClick={handleWordListTab}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium whitespace-nowrap ${
                  activeButton === "wordList"
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:bg-background/50"
                }`}
              >
                Word list
              </button>
              <button
                onClick={handleFavoritesTab}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium whitespace-nowrap ${
                  activeButton === "favorites"
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:bg-background/50"
                }`}
              >
                Favorites
              </button>
              <button
                onClick={handleHistoriesTab}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium whitespace-nowrap ${
                  activeButton === "histories"
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:bg-background/50"
                }`}
              >
                Histories
              </button>
            </div>
          </div>

          {/* Busca + Limite */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              className="w-full min-w-0"
              placeholder="Buscar palavra..."
              defaultValue={search}
              onChange={(e) => onSearch(e.target.value)}
              aria-label="Buscar palavra"
            />
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={limit}
                onChange={handleLimitChange}
                min="1"
                placeholder="Limit"
                className="w-24"
                aria-label="Limite por página"
              />
            </div>
          </div>

          {/* [C4] Lista rolável com IntersectionObserver inalterado */}
          <div
            id="words-scroll-container"
            className="max-h-[60vh] sm:max-h-[70vh] lg:max-h-[calc(100vh-12rem)] overflow-y-auto border rounded-md p-2"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
              {itemsToShow.map((w) => (
                <button
                  key={w}
                  className="py-3 px-2 text-center border rounded-md hover:bg-accent transition-colors text-sm sm:text-base"
                  onClick={() => setSelectedWord(w)}
                  aria-label={`Ver detalhes de ${w}`}
                >
                  {w}
                </button>
              ))}
            </div>

            <div ref={observerRef} className="h-8" />
            {isLoading && (
              <div className="py-2 text-center text-sm" aria-live="polite">
                Carregando...
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Words;
