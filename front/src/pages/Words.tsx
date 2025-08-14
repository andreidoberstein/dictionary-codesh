import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { wordsList } from "@/integrations/api/words";

const chunkSize = 50;

const Words = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [allWords, setAllWords] = useState<string[]>([]);
  const [visibleWords, setVisibleWords] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(chunkSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const query = search ? `?search=${encodeURIComponent(search)}` : "";
        const res = await wordsList();
        const words = await res.results;
        if (active) {
          setAllWords(words);
          setVisibleWords(words); 
        }
      } catch {
        const fallback = [
          "hello",
          "world",
          "dictionary",
          "language",
          "programming",
        ];
        setAllWords(fallback);
        setVisibleWords(fallback.slice(0, chunkSize));
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  // Filtrar palavras de acordo com a busca
  const filtered = useMemo(() => {
    return search
      ? allWords.filter((w) => w.toLowerCase().includes(search.toLowerCase()))
      : allWords;
  }, [allWords, search]);

  // Atualizar palavras visíveis quando o filter muda
  useEffect(() => {
    setVisibleCount(chunkSize);
    setVisibleWords(filtered.slice(0, chunkSize));
  }, [filtered]);

  // Observador de rolagem infinita
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => {
          const nextCount = Math.min(prev + chunkSize, filtered.length);
          setVisibleWords(filtered.slice(0, nextCount));
          return nextCount;
        });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [filtered]);

  // Atualiza URL ao digitar
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

      <section className="space-y-6">
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <button className="flex-1 py-2 px-4 bg-background text-foreground rounded-md text-sm font-medium">
            Word list
          </button>
          <button className="flex-1 py-2 px-4 text-muted-foreground rounded-md text-sm font-medium hover:bg-background/50">
            Favorites
          </button>
        </div>

        <h1 className="text-xl font-semibold">Word list</h1>

        <Input
          placeholder="Buscar palavra..."
          defaultValue={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Buscar palavra"
        />

        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {visibleWords.map((w) => (
            <button
              key={w}
              className="p-3 text-center border rounded-md hover:bg-accent transition-colors text-sm"
              onClick={() => navigate(`/word/${encodeURIComponent(w)}`)}
              aria-label={`Ver detalhes de ${w}`}
            >
              {w}
            </button>
          ))}

          {Array.from({
            length: Math.max(0, 6 - (visibleWords.length % 6)),
          }).map((_, i) => (
            <div
              key={`placeholder-${i}`}
              className="p-3 text-center border rounded-md opacity-20"
            >
              ...
            </div>
          ))}
        </div>

        <div ref={sentinelRef} className="h-6" />
      </section>
    </main>
  );
};

export default Words;