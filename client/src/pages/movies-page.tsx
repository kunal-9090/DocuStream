import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Content } from "@shared/schema";
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

export default function MoviesPage() {
  const [genreFilter, setGenreFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Fetch all content
  const { data: allContent, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });
  
  // Get unique genres from content
  const getUniqueGenres = () => {
    if (!allContent) return [];
    
    const genresSet = new Set<string>();
    allContent.forEach(content => {
      content.genres.forEach(genre => {
        genresSet.add(genre);
      });
    });
    
    return Array.from(genresSet).sort();
  };
  
  // Get unique years from content
  const getUniqueYears = () => {
    if (!allContent) return [];
    
    const yearsSet = new Set<number>();
    allContent.forEach(content => {
      yearsSet.add(content.releaseYear);
    });
    
    return Array.from(yearsSet).sort((a, b) => b - a); // Sort descending
  };
  
  // Filter content based on selected filters and search query
  const getFilteredContent = () => {
    if (!allContent) return [];
    
    return allContent.filter(content => {
      // Genre filter
      const passesGenreFilter = genreFilter === "all" || 
        content.genres.includes(genreFilter);
      
      // Year filter
      const passesYearFilter = yearFilter === "all" || 
        content.releaseYear.toString() === yearFilter;
      
      // Search query
      const passesSearchFilter = !searchQuery || 
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return passesGenreFilter && passesYearFilter && passesSearchFilter;
    });
  };
  
  const filteredContent = getFilteredContent();
  const uniqueGenres = getUniqueGenres();
  const uniqueYears = getUniqueYears();

  return (
    <>
      <Navbar />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Movies & Documentaries</h1>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            
            <Select
              value={yearFilter}
              onValueChange={setYearFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {uniqueYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
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
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-search text-4xl text-gray-500 mb-4"></i>
              <h2 className="text-xl font-medium">No results found</h2>
              <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 mb-4">{filteredContent.length} results found</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredContent.map(content => (
                  <ContentCard key={content.id} item={content} type="movie" />
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
