import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Series } from "@shared/schema";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/common/footer";
import { ContentCard } from "@/components/content/content-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function SeriesPage() {
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Fetch all series
  const { data: allSeries, isLoading } = useQuery<Series[]>({
    queryKey: ["/api/series"],
  });
  
  // Get unique genres from series
  const getUniqueGenres = () => {
    if (!allSeries) return [];
    
    const genresSet = new Set<string>();
    allSeries.forEach(series => {
      series.genres.forEach(genre => {
        genresSet.add(genre);
      });
    });
    
    return Array.from(genresSet).sort();
  };
  
  // Filter series based on selected filters and search query
  const getFilteredSeries = () => {
    if (!allSeries) return [];
    
    return allSeries.filter(series => {
      // Genre filter
      const passesGenreFilter = genreFilter === "all" || 
        series.genres.includes(genreFilter);
      
      // Search query
      const passesSearchFilter = !searchQuery || 
        series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        series.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return passesGenreFilter && passesSearchFilter;
    });
  };
  
  const filteredSeries = getFilteredSeries();
  const uniqueGenres = getUniqueGenres();

  return (
    <>
      <Navbar />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Series</h1>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <Input
                placeholder="Search by title or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select
              value={genreFilter}
              onValueChange={setGenreFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {uniqueGenres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex flex-col">
                  <Skeleton className="aspect-video w-full rounded-md" />
                  <Skeleton className="h-5 w-3/4 mt-2" />
                  <Skeleton className="h-4 w-1/2 mt-1" />
                </div>
              ))}
            </div>
          ) : filteredSeries.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-gray-500 mb-4"></i>
              <h2 className="text-xl font-medium">No results found</h2>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 mb-4">{filteredSeries.length} results found</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredSeries.map(series => (
                  <ContentCard key={series.id} item={series} type="series" />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
