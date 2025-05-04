import { useRef } from "react";
import { ContentCard } from "./content-card";
import { Content, Series } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

interface ContentRowProps {
  title: string;
  items: Content[] | Series[];
  type: "movie" | "series";
  isMyList?: boolean;
}

export function ContentRow({ title, items, type, isMyList = false }: ContentRowProps) {
  const { user } = useAuth();
  
  interface UserContentItem {
    id: number;
    isInList: boolean;
    content?: {
      id: number;
    };
    episode?: {
      id: number;
      seriesId?: number;
    };
  }
  
  // Fetch user's content list to determine what's in the list
  const { data: userContent = [] } = useQuery<UserContentItem[]>({
    queryKey: ["/api/user-content"],
    enabled: !!user
  });
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;
    
    const scrollAmount = rowRef.current.clientWidth * 0.75;
    const scrollDirection = direction === "left" ? -1 : 1;
    
    rowRef.current.scrollBy({
      left: scrollDirection * scrollAmount,
      behavior: "smooth"
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 mb-12">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      
      <div className="relative content-row group">
        {/* Left scroll button */}
        <button 
          className="scroll-button absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 z-10 opacity-0 transition-opacity duration-300"
          onClick={() => scroll("left")}
        >
          <i className="fas fa-chevron-left text-white"></i>
        </button>
        
        {/* Content row */}
        <div 
          ref={rowRef}
          className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4"
        >
          {items.map((item) => {
            // Determine if this item is in the user's list
            const isInList = isMyList || userContent.some(
              (uc) => 
                uc.isInList && 
                ((uc.content && uc.content.id === item.id) || 
                 ('episodes' in item && uc.episode && uc.episode.seriesId === item.id))
            );
            
            return (
              <ContentCard 
                key={item.id} 
                item={item} 
                type={type}
                isInList={isInList}
              />
            );
          })}
        </div>
        
        {/* Right scroll button */}
        <button 
          className="scroll-button absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 z-10 opacity-0 transition-opacity duration-300"
          onClick={() => scroll("right")}
        >
          <i className="fas fa-chevron-right text-white"></i>
        </button>
      </div>
    </section>
  );
}
