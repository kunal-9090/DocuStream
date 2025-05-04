import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Content, Series } from "@shared/schema";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/common/footer";
import { ContentCard } from "@/components/content/content-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);
  
  // Fetch all content
  const { 
    data: allContent, 
    isLoading: isContentLoading 
  } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });
  
  // Fetch all series
  const { 
    data: allSeries, 
    isLoading: isSeriesLoading 
  } = useQuery<Series[]>({
    queryKey: ["/api/series"],
  });
  
  // Filter content based on search query
  const getFilteredContent = () => {
    if (!allContent) return [];
    if (!debouncedQuery) return [];
    
    return allContent.filter(content => 
      content.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      content.genres.some(genre => 
        genre.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    );
  };
  
  // Filter series based on search query
  const getFilteredSeries = () => {
    if (!allSeries) return [];
    if (!debouncedQuery) return [];
    
    return allSeries.filter(series => 
      series.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      series.description.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      series.genres.some(genre => 
        genre.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    );
  };
  
  const filteredContent = getFilteredContent();
  const filteredSeries = getFilteredSeries();
  const isLoading = isContentLoading || isSeriesLoading;
  
  const hasResults = filteredContent.length > 0 || filteredSeries.length > 0;

  return (
    <>
      <Navbar />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Search</h1>
          
          {/* Search input */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Input
                placeholder="Search for movies, series, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <i className="fas fa-search"></i>
              </div>
            </div>
          </div>
          
          {/* Initial state - no search performed yet */}
          {!debouncedQuery && (
            <div className="text-center py-16">
              <i className="fas fa-search text-5xl text-gray-600 mb-4"></i>
              <h2 className="text-2xl font-medium">Search for your favorite documentaries</h2>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Type in the search box above to find documentaries by title, description, or genre
              </p>
            </div>
          )}
          
          {/* Display results or no results message */}
          {debouncedQuery && (
            <>
              {isLoading ? (
                <div className="text-center py-8">
                  <Skeleton className="h-8 w-48 mx-auto mb-8" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} className="flex flex-col">
                        <Skeleton className="aspect-video w-full rounded-md" />
                        <Skeleton className="h-5 w-3/4 mt-2" />
                        <Skeleton className="h-4 w-1/2 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : hasResults ? (
                <div>
                  <h2 className="text-xl font-medium mb-6">
                    {filteredContent.length + filteredSeries.length} results for "{debouncedQuery}"
                  </h2>
                  
                  <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-6">
                      <TabsTrigger value="all">All Results</TabsTrigger>
                      <TabsTrigger value="movies">Movies</TabsTrigger>
                      <TabsTrigger value="series">Series</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {filteredContent.map(content => (
                          <ContentCard key={`content-${content.id}`} item={content} type="movie" />
                        ))}
                        {filteredSeries.map(series => (
                          <ContentCard key={`series-${series.id}`} item={series} type="series" />
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="movies">
                      {filteredContent.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No movies found for "{debouncedQuery}"</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                          {filteredContent.map(content => (
                            <ContentCard key={`content-${content.id}`} item={content} type="movie" />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="series">
                      {filteredSeries.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">No series found for "{debouncedQuery}"</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                          {filteredSeries.map(series => (
                            <ContentCard key={`series-${series.id}`} item={series} type="series" />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-16">
                  <i className="fas fa-search-minus text-5xl text-gray-600 mb-4"></i>
                  <h2 className="text-2xl font-medium">No results found</h2>
                  <p className="text-gray-500 mt-2 max-w-md mx-auto">
                    We couldn't find any documentaries matching "{debouncedQuery}". Try a different search term.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
