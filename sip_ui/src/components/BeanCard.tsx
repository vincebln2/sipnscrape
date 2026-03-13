import { motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import type { Bean } from "@/lib/api";
import { VibeRing } from "./VibeRing";

interface BeanCardProps {
  bean: Bean;
  index: number;
  onFindSimilar: (id: number) => void;
}

export function BeanCard({ bean, index, onFindSimilar }: BeanCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative rounded-lg border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow duration-300 coffee-grain flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-body font-medium uppercase tracking-widest text-muted-foreground mb-1">
            {bean.roaster}
          </p>
          <h3 className="text-lg font-display font-semibold text-foreground leading-tight truncate">
            {bean.name}
          </h3>
        </div>
        <VibeRing score={bean.vibe_score} />
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground font-body mb-3">
        <span className="bg-secondary px-2 py-0.5 rounded-sm">{bean.roast_type}</span>
        <span>·</span>
        <span>{bean.country}</span>
        {bean.elevation && (
          <>
            <span>·</span>
            <span>{bean.elevation}m</span>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {bean.taste_notes.map((note) => (
          <span
            key={note}
            className="text-xs font-body px-2 py-0.5 rounded-full bg-coffee-latte text-coffee-espresso border border-border"
          >
            {note}
          </span>
        ))}
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <button
          onClick={() => onFindSimilar(bean.id)}
          className="flex items-center gap-1.5 text-xs font-body font-medium text-accent hover:text-accent/80 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Find Similar
        </button>
        <div className="flex-1" />
        <a
          href={bean.hyperlink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
}
