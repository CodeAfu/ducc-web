import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollText, Play, Square, ExternalLink, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import AnimatedButton from "~/components/AnimatedButton";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/hyl/")({
  component: HylScraperPage,
});

type ScraperStatus = "idle" | "initializing" | "fetching" | "done" | "error";

interface LinkResult {
  status: ScraperStatus;
  url?: string;
  error?: string;
}

function HylScraperPage() {
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<ScraperStatus>("idle");
  const [urls, setUrls] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of list
  // useEffect(() => {
  //   resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [urls]);

  const stopScrape = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);
  };

  const startScrape = () => {
    // Reset state
    setUrls([]);
    setErrorMsg(null);
    setStatus("initializing");
    setIsStreaming(true);

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = `${import.meta.env.VITE_API_URL}/api/v3/hylscraper/scrape?limit=${limit}`;
    const es = new EventSource(url, { withCredentials: true }); eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data: LinkResult = JSON.parse(event.data);
        setStatus(data.status);

        if (data.url) {
          setUrls((prev) => [...prev, data.url!]);
        }

        if (data.error) {
          setErrorMsg(data.error);
          setStatus("error");
          stopScrape();
        }
      } catch (err) {
        console.error("Failed to parse SSE message:", err);
      }
    };

    es.addEventListener("done", () => {
      setStatus("done");
      stopScrape();
    });

    es.onerror = (err) => {
      console.error("SSE Error:", err);
      setErrorMsg("Connection to scraper lost or failed.");
      setStatus("error");
      stopScrape();
    };
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col mx-auto max-w-5xl w-full p-4 md:p-8 space-y-8 font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
            <ScrollText className="size-5 md:size-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight truncate">HoyoLab Scraper</h1>
        </div>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
          Automated collection of HoyoLab article URLs via the v3 Go API.
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4 p-4 md:p-6 rounded-xl border border-border bg-card/40 backdrop-blur-sm">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-xs md:text-sm font-medium text-muted-foreground font-mono uppercase tracking-wider">
            Scrape Limit
          </label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value) || 1))}
            disabled={isStreaming}
            className="w-full h-10 md:h-11 bg-background border border-border rounded-lg px-4 focus:ring-2 focus:ring-primary/50 outline-none transition-all disabled:opacity-50"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {!isStreaming ? (
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
            className="overflow-hidden"
          >
            <div className={cn(
              "flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border gap-2",
              status === "initializing" && "bg-blue-500/10 border-blue-500/30 text-blue-400",
              status === "fetching" && "bg-primary/10 border-primary/30 text-primary",
              status === "done" && "bg-accent/10 border-accent/30 text-accent",
              status === "error" && "bg-destructive/10 border-destructive/30 text-destructive"
            )}>
              <div className="flex items-center gap-3">
                {status === "initializing" && <Loader2 className="size-5 animate-spin" />}
                {status === "fetching" && <Loader2 className="size-5 animate-spin" />}
                {status === "done" && <CheckCircle2 className="size-5" />}
                {status === "error" && <AlertCircle className="size-5" />}
                <span className="font-mono uppercase tracking-widest text-xs md:text-sm font-bold">
                  {status}
                </span>
              </div>
              <div className="text-xs md:text-sm font-mono">
                {urls.length} articles found
              </div>
            </div>
            {errorMsg && (
              <p className="mt-2 text-xs md:text-sm text-destructive font-medium px-1">
                {errorMsg}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Container */}
      <div className="flex-1 flex flex-col min-h-[300px] md:min-h-[400px] border border-border rounded-xl bg-card/60 backdrop-blur-sm overflow-hidden">
        <div className="p-3 md:p-4 border-b border-border bg-muted/20 flex items-center justify-between">
          <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground">Scrape Stream</span>
          <span className="text-[10px] md:text-xs text-muted-foreground font-mono">{urls.length} items</span>
        </div>

        <div className="flex-1 overflow-y-auto p-1 md:p-2 space-y-1 font-mono text-[11px] md:text-sm custom-scrollbar">
          {urls.length === 0 && status === "idle" && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-40 py-20">
              <ScrollText className="size-10 md:size-12 mb-4" />
              <p className="text-xs md:text-sm">Ready to scrape HoyoLab</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {urls.map((url, idx) => (
              <motion.div
                key={url + idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="group flex items-center justify-between p-2 md:p-3 rounded-md border border-transparent hover:border-border hover:bg-background/50 transition-all min-w-0"
              >
                <span className="truncate flex-1 pr-4 min-w-0">{url}</span>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-muted/30 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
                >
                  <ExternalLink className="size-3 md:size-4" />
                </a>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={resultsEndRef} />
        </div>
      </div>
    </div>
  );
}
