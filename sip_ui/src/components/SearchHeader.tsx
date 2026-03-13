import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchHeaderProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchHeader({ value, onChange }: SearchHeaderProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-display font-semibold tracking-tight text-foreground mb-2">
          Sip<span className="text-accent">n</span>Scrape
        </h1>
        <p className="text-muted-foreground font-body text-lg">
          Discover specialty coffee, one bean at a time
        </p>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by flavor, roaster, or origin..."
          className="pl-12 pr-4 py-6 text-base rounded-full bg-card border-border shadow-sm focus-visible:ring-accent font-body"
        />
      </div>
    </div>
  );
}
