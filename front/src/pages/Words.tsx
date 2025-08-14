import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";

const WORDS_URL =
  "https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt";

const chunkSize = 50;

const Words = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [allWords, setAllWords] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(chunkSize);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(WORDS_URL);
        const txt = await res.text();
        const words = txt.split(/\n|\r/).filter(Boolean);
        if (active) setAllWords(words);
      } catch {
        if (active)
          setAllWords([
            "hello",
            "world",
            "dictionary",
            "language",
            "programming",
            "typescript",
            "react",
            "javascript",
            "mobile",
            "favorite",
            "history",
          ]);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return q
      ? allWords.filter((w) => w.toLowerCase().includes(q.toLowerCase()))
      : allWords;
  }, [allWords, q]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((v) => Math.min(v + chunkSize, filtered.length));
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [filtered.length]);

  useEffect(() => {
    setVisibleCount(chunkSize);
  }, [q]);

  const onSearch = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  return (
    <main className="container mx-auto px-4 py-4">
      <Helmet>
        <title>Explorar palavras</title>
        <meta name="description" content="Explore palavras com rolagem infinita e busca compartilhável." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      
      <section className="space-y-6">
        {/* Tabs */}
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
          defaultValue={q}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="Buscar palavra"
        />
        
        {/* Word Grid */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          {filtered.slice(0, visibleCount).map((w) => (
            <button
              key={w}
              className="p-3 text-center border rounded-md hover:bg-accent transition-colors text-sm"
              onClick={() => navigate(`/word/${encodeURIComponent(w)}`)}
              aria-label={`Ver detalhes de ${w}`}
            >
              {w}
            </button>
          ))}
          {/* Placeholder dots for remaining slots */}
          {Array.from({ length: Math.max(0, 6 - (filtered.slice(0, visibleCount).length % 6)) }).map((_, i) => (
            <div key={`placeholder-${i}`} className="p-3 text-center border rounded-md opacity-20">
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
