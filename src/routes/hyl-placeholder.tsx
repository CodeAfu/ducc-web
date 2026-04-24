import { createFileRoute, Link } from "@tanstack/react-router";
import { Construction, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export const Route = createFileRoute("/hyl-placeholder")({
  component: HoyoLabPlaceholder,
});

function HoyoLabPlaceholder() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md space-y-6"
      >
        <div className="inline-flex p-4 rounded-full bg-muted/20 border border-border text-muted-foreground">
          <Construction className="size-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">HoyoLab Scraper</h1>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-wider">
            Coming Soon™
          </p>
        </div>
        <p className="text-muted-foreground">
          I'm currently porting the scraper logic to the Go v3 backend.
          Check back later for community update tracking and automated data scraping!
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2 rounded-md bg-card border border-border hover:border-primary/50 hover:text-primary transition-all font-medium"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
