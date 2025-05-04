import { useQuery } from "@tanstack/react-query";
import { Content, Series } from "@shared/schema";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/common/footer";
import { ContentCard } from "@/components/content/content-card";
import { Skeleton } from "@/components/ui/skeleton";

interface UserContentItem {
  id: number;
  watchPercentage: number;
  lastWatchDate: string;
  isCompleted: boolean;
  userRating: number | null;
  isInList: boolean;
  listType: string | null;
  content?: Content;
  episode?: any; // Episode type could be added if needed
}

export default function MyListPage() {
  // Fetch user's content list
  const { data: userContent, isLoading } = useQuery<UserContentItem[]>({
    queryKey: ["/api/user-content"],
  });

  // Filter items that are explicitly added to the list (isInList = true)
  const myListItems = userContent?.filter(item => item.isInList) || [];
  
  // Get content items (not episodes) from the list
  const contentItems = myListItems
    .filter(item => item.content)
    .map(item => item.content!);

  // Get content by type
  const getMovieContent = () => {
    return contentItems.filter(content => content.type !== "Series");
  };

  const getDocumentaryContent = () => {
    return contentItems.filter(content => 
      content.type === "Documentary" || 
      content.genres.includes("Documentary") ||
      content.genres.includes("Biography")
    );
  };

  const getIndianContent = () => {
    return contentItems.filter(content => 
      content.genres.includes("Indian Personalities") ||
      content.type === "Biography"
    );
  };

  return (
    <>
      <Navbar />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">My List</h1>
          
          {isLoading ? (
            <div>
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="mb-12">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="h-48 rounded-md" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : myListItems.length === 0 ? (
            <div className="text-center py-16">
              <i className="fas fa-list text-5xl text-gray-500 mb-6"></i>
              <h2 className="text-2xl font-medium mb-2">Your list is empty</h2>
              <p className="text-gray-400 mb-6">
                Add documentaries and series to your list to watch them later
              </p>
              <a href="/" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md">
                Browse Content
              </a>
            </div>
          ) : (
            <div className="space-y-12">
              {/* All Items */}
              <div>
                <h2 className="text-xl font-semibold mb-4">All Items ({myListItems.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {contentItems.map(content => (
                    <ContentCard key={content.id} item={content} type="movie" isInList={true} />
                  ))}
                </div>
              </div>
              
              {/* Documentaries */}
              {getDocumentaryContent().length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Documentaries</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {getDocumentaryContent().map(content => (
                      <ContentCard key={content.id} item={content} type="movie" isInList={true} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Indian Personalities */}
              {getIndianContent().length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Indian Personalities</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {getIndianContent().map(content => (
                      <ContentCard key={content.id} item={content} type="movie" isInList={true} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}