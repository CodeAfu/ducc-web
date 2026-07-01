import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollText, Play, Square, ExternalLink, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import AnimatedButton from "~/components/AnimatedButton";
import { cn } from "~/lib/utils";
import { useStartHylScrape } from "~/hooks/useStartHylScrape";
import { useAuth } from "@clerk/tanstack-react-start";

export const Route = createFileRoute("/hyl/")({
  component: HylScraperPage,
});

type ScraperStatus = "idle" | "initializing" | "fetching" | "done" | "error";

interface ScrapedPost {
  url: string;
  title: string;
  author: string;
}


function HylScraperPage() {
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<ScraperStatus>("idle");
  const [results, setResults] = useState<ScrapedPost[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { getToken, isLoaded: isAuthLoaded } = useAuth()

  // Reserved for the upcoming SSE subscribe endpoint (Postgres LISTEN/NOTIFY)
  const eventSourceRef = useRef<EventSource | null>(null);

  const startHylScrape = useStartHylScrape(getToken);

  const isActive = startHylScrape.isPending || status === "fetching";

  const stopScrape = () => {
    startHylScrape.reset();
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setStatus("idle");
  };

  const startScrape = () => {
    setResults([]);
    setErrorMsg(null);
    setStatus("initializing");

    startHylScrape.mutate(
      { limit },
      {
        onSuccess: (jobId) => {
          // jobId available for the SSE subscribe endpoint
          console.log("Scrape job initialised:", jobId);
          // TODO: open EventSource to /api/v3/hylscraper/subscribe?jobId=<jobId>
          setStatus("fetching");
        },
        onError: (err) => {
          setErrorMsg(err.message);
          setStatus("error");
        },
      }
    );
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  if (!isAuthLoaded) {
    return null
  }

  return (
    <div className="flex flex-col mx-auto max-w-5xl w-full min-w-0 p-4 md:p-8 space-y-8 font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 min-w-0"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
            <ScrollText className="size-5 md:size-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">HoyoLab Scraper</h1>
        </div>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl truncate">
          Automated collection of HoyoLab article metadata via the v3 Go API.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4 p-4 md:p-6 rounded-xl border border-border bg-card/40 backdrop-blur-sm min-w-0">
        <div className="flex-1 space-y-2 min-w-0 w-full">
          <label className="text-xs md:text-sm font-medium text-muted-foreground font-mono uppercase tracking-wider">
            Scrape Limit
          </label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value) || 1))}
            // disabled={isStreaming}
            className="w-full h-10 md:h-11 bg-background border border-border rounded-lg px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all disabled:opacity-50"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          {!isActive ? (
            <AnimatedButton
              variant="primary"
              className="flex-1 md:w-32 h-10 md:h-11"
              onClick={startScrape}
            >
              <Play className="size-4 mr-2" />
              Scrape
            </AnimatedButton>
          ) : (
            <AnimatedButton
              variant="destructive"
              className="flex-1 md:w-32 h-10 md:h-11"
              onClick={stopScrape}
            >
              <Square className="size-4 mr-2" />
              Stop
            </AnimatedButton>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <AnimatePresence mode="wait">
        {status !== "idle" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden min-w-0"
          >
            <div className={cn(
              "flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border gap-2 min-w-0",
              status === "initializing" && "bg-blue-500/10 border-blue-500/30 text-blue-400",
              status === "fetching" && "bg-primary/10 border-primary/30 text-primary",
              status === "done" && "bg-accent/10 border-accent/30 text-accent",
              status === "error" && "bg-destructive/10 border-destructive/30 text-destructive"
            )}>
              <div className="flex items-center gap-3 min-w-0">
                {status === "initializing" && <Loader2 className="size-5 animate-spin" />}
                {status === "fetching" && <Loader2 className="size-5 animate-spin" />}
                {status === "done" && <CheckCircle2 className="size-5" />}
                {status === "error" && <AlertCircle className="size-5" />}
                <span className="font-mono uppercase tracking-widest text-xs md:text-sm font-bold">
                  {status}
                </span>
              </div>
              <div className="text-xs md:text-sm font-mono shrink-0">
                {results.length} articles found
              </div>
            </div>
            {errorMsg && (
              <p className="mt-2 text-xs md:text-sm text-destructive font-medium px-1 truncate">
                {errorMsg}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Container */}
      <div className="flex flex-col min-w-0 w-full border border-border rounded-xl bg-card/60 backdrop-blur-sm overflow-hidden mb-24">
        <div className="p-3 md:p-4 border-b border-border bg-muted/20 flex items-center justify-between shrink-0 min-w-0">
          <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground truncate">Scrape Stream</span>
          <span className="text-[10px] md:text-xs text-muted-foreground font-mono shrink-0">{results.length} items</span>
        </div>

        <div className="min-w-0 w-full p-1 md:p-2 space-y-1 font-sans">
          {results.length === 0 && status === "idle" && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-40 py-20 min-w-0">
              <ScrollText className="size-10 md:size-12 mb-4" />
              <p className="text-xs md:text-sm uppercase tracking-widest font-mono text-center">Ready to scrape HoyoLab</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {results.map((post, idx) => (
              <motion.div
                key={post.url + idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group flex items-center justify-between p-3 md:p-4 rounded-md border border-transparent hover:border-border hover:bg-background/50 transition-all min-w-0 w-full"
              >
                <div className="flex flex-col min-w-0 flex-1 pr-4 overflow-hidden">
                  <span className="block text-sm md:text-base font-semibold truncate leading-tight mb-0.5 max-w-full">
                    {post.title}
                  </span>
                  <span className="block text-[10px] md:text-xs text-muted-foreground font-mono truncate max-w-full">
                    by {post.author}
                  </span>
                </div>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="View original post"
                  className="p-2 md:p-2.5 rounded-lg bg-muted/30 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shrink-0 border border-transparent hover:border-primary/20"
                >
                  <ExternalLink className="size-4 md:size-5" />
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
