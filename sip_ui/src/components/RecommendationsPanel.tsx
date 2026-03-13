import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Bean } from "@/lib/api";
import { BeanCard } from "./BeanCard";

interface RecommendationsPanelProps {
  sourceName: string;
  beans: Bean[];
  onBack: () => void;
  onFindSimilar: (id: number) => void;
}

export function RecommendationsPanel({ sourceName, beans, onBack, onFindSimilar }: RecommendationsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="h-4 w-px bg-border" />
        <p className="text-sm font-body text-muted-foreground">
          Coffees similar to <span className="font-medium text-foreground">{sourceName}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {beans.map((bean, i) => (
          <BeanCard key={bean.id} bean={bean} index={i} onFindSimilar={onFindSimilar} />
        ))}
      </div>
      {beans.length === 0 && (
        <p className="text-center text-muted-foreground font-body py-12">No recommendations found.</p>
      )}
    </motion.div>
  );
}
