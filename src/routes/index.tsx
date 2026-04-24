import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Sword, LayoutGrid, MessageCircle, ScrollText, ArrowRight } from "lucide-react";
import { ReactNode } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-12 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <FeatureCard
          to="/genshin"
          title="Genshin Stuff"
          icon={<Sword className="size-8" />}
          status="active"
          index={0}
        />
        <FeatureCard
          to="/bingo"
          title="Bingo Card"
          icon={<LayoutGrid className="size-8" />}
          status="active"
          index={1}
        />
        <FeatureCard
          to="/copium"
          title="Reddit Scraper"
          icon={<MessageCircle className="size-8" />}
          status="placeholder"
          index={2}
        />
        <FeatureCard
          to="/hyl-placeholder"
          title="HoyoLab Scraper"
          icon={<ScrollText className="size-8" />}
          status="placeholder"
          index={3}
        />
      </div>
    </div>
  );
}

interface FeatureCardProps {
  to: string;
  title: string;
  icon: ReactNode;
  status: "active" | "placeholder";
  index: number;
}

function FeatureCard({ to, title, icon, status, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link
        to={to}
        className="group relative flex flex-col gap-6 p-8 rounded-xl border border-border bg-card/60 backdrop-blur-sm 
                   hover:border-primary/50 transition-all duration-300 h-full overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-lg bg-background border border-border group-hover:border-primary/30 group-hover:text-primary transition-colors">
            {icon}
          </div>
          <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded border ${status === "active"
            ? "border-accent/50 text-accent bg-accent/10"
            : "border-muted-foreground/30 text-muted-foreground bg-muted/20"
            }`}>
            {status}
          </span>
        </div>

        <div className="flex items-center justify-between group-hover:translate-x-1 transition-transform">
          <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors font-sans">
            {title}
          </h2>
          <ArrowRight className="size-5 text-primary opacity-0 group-hover:opacity-100 transition-all" />
        </div>

        {/* Decorative background glow on hover */}
        <div className="absolute -right-8 -bottom-8 size-32 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    </motion.div>
  );
}
