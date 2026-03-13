import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { fetchBeans, searchBeans, getRecommendations, type Bean } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { SearchHeader } from "@/components/SearchHeader";
import { BeanCard } from "@/components/BeanCard";
import { BeanCardSkeleton } from "@/components/BeanCardSkeleton";
import { FilterPanel } from "@/components/FilterPanel";
import { RecommendationsPanel } from "@/components/RecommendationsPanel";

const Index = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [selectedRoasts, setSelectedRoasts] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [recSourceBean, setRecSourceBean] = useState<Bean | null>(null);

  // Fetch all beans
  const { data: allBeans, isLoading: loadingAll } = useQuery({
    queryKey: ["beans"],
    queryFn: fetchBeans,
  });

  // Search beans
  const { data: searchResults, isLoading: loadingSearch } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchBeans(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  // Recommendations
  const [recId, setRecId] = useState<number | null>(null);
  const { data: recommendations, isLoading: loadingRecs } = useQuery({
    queryKey: ["recommendations", recId],
    queryFn: () => getRecommendations(recId!),
    enabled: recId !== null,
  });

  const baseBeans = debouncedQuery.length > 0 ? searchResults : allBeans;
  const isLoading = debouncedQuery.length > 0 ? loadingSearch : loadingAll;

  // Derive filter options from all beans
  const roastTypes = useMemo(() => {
    if (!allBeans) return [];
    return [...new Set(allBeans.map((b) => b.roast_type))].sort();
  }, [allBeans]);

  const countries = useMemo(() => {
    if (!allBeans) return [];
    return [...new Set(allBeans.map((b) => b.country))].sort();
  }, [allBeans]);

  // Apply filters
  const filteredBeans = useMemo(() => {
    if (!baseBeans) return [];
    return baseBeans.filter((b) => {
      if (selectedRoasts.length > 0 && !selectedRoasts.includes(b.roast_type)) return false;
      if (selectedCountries.length > 0 && !selectedCountries.includes(b.country)) return false;
      return true;
    });
  }, [baseBeans, selectedRoasts, selectedCountries]);

  const handleFindSimilar = (id: number) => {
    const source = (allBeans || []).find((b) => b.id === id) || null;
    setRecSourceBean(source);
    setRecId(id);
  };

  const handleBackFromRecs = () => {
    setRecId(null);
    setRecSourceBean(null);
  };

  const toggleRoast = (r: string) =>
    setSelectedRoasts((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));

  const toggleCountry = (c: string) =>
    setSelectedCountries((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const clearFilters = () => {
    setSelectedRoasts([]);
    setSelectedCountries([]);
  };

  return (
    <div className="min-h-screen bg-background coffee-grain">
      {/* Header */}
      <header className="pt-12 pb-8 px-4">
        <SearchHeader value={query} onChange={setQuery} />
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {recId !== null ? (
          loadingRecs ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <BeanCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <RecommendationsPanel
              sourceName={recSourceBean?.name || ""}
              beans={recommendations || []}
              onBack={handleBackFromRecs}
              onFindSimilar={handleFindSimilar}
            />
          )
        ) : (
          <div className="flex gap-8">
            <FilterPanel
              roastTypes={roastTypes}
              countries={countries}
              selectedRoasts={selectedRoasts}
              selectedCountries={selectedCountries}
              onRoastToggle={toggleRoast}
              onCountryToggle={toggleCountry}
              onClear={clearFilters}
            />

            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <BeanCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredBeans.length > 0 ? (
                <AnimatePresence mode="wait">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBeans.map((bean, i) => (
                      <BeanCard key={bean.id} bean={bean} index={i} onFindSimilar={handleFindSimilar} />
                    ))}
                  </div>
                </AnimatePresence>
              ) : (
                <div className="text-center py-20">
                  <p className="text-lg font-display text-muted-foreground">No beans found</p>
                  <p className="text-sm font-body text-muted-foreground mt-1">
                    Try a different search or adjust your filters
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
