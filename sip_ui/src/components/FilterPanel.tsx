import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FilterPanelProps {
  roastTypes: string[];
  countries: string[];
  selectedRoasts: string[];
  selectedCountries: string[];
  onRoastToggle: (roast: string) => void;
  onCountryToggle: (country: string) => void;
  onClear: () => void;
}

export function FilterPanel({
  roastTypes,
  countries,
  selectedRoasts,
  selectedCountries,
  onRoastToggle,
  onCountryToggle,
  onClear,
}: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const hasFilters = selectedRoasts.length > 0 || selectedCountries.length > 0;

  return (
    <>
      {/* Mobile trigger */}
      <div className="md:hidden flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="font-body gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasFilters && (
            <span className="ml-1 bg-accent text-accent-foreground rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
              {selectedRoasts.length + selectedCountries.length}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 z-40 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-card border-l border-border z-50 p-6 overflow-y-auto md:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-semibold">Filters</h3>
                <button onClick={() => setOpen(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <FilterContent
                roastTypes={roastTypes}
                countries={countries}
                selectedRoasts={selectedRoasts}
                selectedCountries={selectedCountries}
                onRoastToggle={onRoastToggle}
                onCountryToggle={onCountryToggle}
                onClear={onClear}
                hasFilters={hasFilters}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden md:block w-56 flex-shrink-0">
        <div className="sticky top-8">
          <h3 className="font-display text-lg font-semibold mb-4">Filters</h3>
          <FilterContent
            roastTypes={roastTypes}
            countries={countries}
            selectedRoasts={selectedRoasts}
            selectedCountries={selectedCountries}
            onRoastToggle={onRoastToggle}
            onCountryToggle={onCountryToggle}
            onClear={onClear}
            hasFilters={hasFilters}
          />
        </div>
      </div>
    </>
  );
}

function FilterContent({
  roastTypes,
  countries,
  selectedRoasts,
  selectedCountries,
  onRoastToggle,
  onCountryToggle,
  onClear,
  hasFilters,
}: FilterPanelProps & { hasFilters: boolean }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-body font-medium uppercase tracking-widest text-muted-foreground mb-3">
          Roast Type
        </p>
        <div className="space-y-1.5">
          {roastTypes.map((r) => (
            <button
              key={r}
              onClick={() => onRoastToggle(r)}
              className={`block w-full text-left px-3 py-1.5 text-sm font-body rounded-md transition-colors ${
                selectedRoasts.includes(r)
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-body font-medium uppercase tracking-widest text-muted-foreground mb-3">
          Country
        </p>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => onCountryToggle(c)}
              className={`block w-full text-left px-3 py-1.5 text-sm font-body rounded-md transition-colors ${
                selectedCountries.includes(c)
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={onClear}
          className="text-xs font-body text-muted-foreground hover:text-foreground underline transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
