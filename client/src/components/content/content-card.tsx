import { useState } from "react";
import { Link } from "wouter";
import { Content, Series } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ContentCardProps {
  item: Content | Series;
  type: "movie" | "series";
  isInList?: boolean;
}

export function ContentCard({ item, type, isInList = false }: ContentCardProps) {
  const [addedToList, setAddedToList] = useState(isInList);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if item has both movie and series properties using type guards
  const isContent = (item: Content | Series): item is Content => {
    return 'videoUrl' in item;
  };
  
  const isSeries = (item: Content | Series): item is Series => {
    return 'seasons' in item;
  };

  const getLink = () => {
    if (isContent(item)) {
      return `/movie/${item.id}`;
    } else {
      return `/series/${item.id}`;
    }
  };

  // Mutation to add/remove from My List
  const toggleMyListMutation = useMutation({
    mutationFn: async () => {
      const contentId = isContent(item) ? item.id : null;
      const episodeId = null; // Only for episodes, not for entire content or series
      
      const payload = {
        contentId: isContent(item) ? item.id : null,
        episodeId: null,
        isInList: !addedToList,
        listType: 'favorites',
        watchPercentage: 0,
      };
      
      const response = await apiRequest("POST", "/api/user-content", payload);
      return response.json();
    },
    onSuccess: () => {
      setAddedToList(!addedToList);
      toast({
        title: addedToList ? "Removed from My List" : "Added to My List",
        description: addedToList 
          ? `${item.title} was removed from your list` 
          : `${item.title} was added to your list`,
        variant: addedToList ? "destructive" : "default",
      });
      
      // Invalidate user content query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/user-content"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update your list: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleToggleMyList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMyListMutation.mutate();
  };

  return (
    <div className="content-card flex-none w-64 rounded overflow-hidden">
      <div className="relative group">
        <img 
          src={item.thumbnailUrl} 
          alt={item.title} 
          className="w-full h-36 object-cover transition duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Link href={getLink()}>
            <button className="bg-white text-black rounded-full p-2 mx-1">
              <i className="fas fa-play"></i>
            </button>
          </Link>
          <button 
            className="bg-card bg-opacity-60 text-white rounded-full p-2 mx-1"
            onClick={handleToggleMyList}
            disabled={toggleMyListMutation.isPending}
          >
            <i className={`fas ${addedToList ? 'fa-check' : 'fa-plus'}`}></i>
          </button>
          <button className="bg-card bg-opacity-60 text-white rounded-full p-2 mx-1">
            <i className="fas fa-thumbs-up"></i>
          </button>
        </div>
        
        {/* Show different badges based on item type and properties */}
        {isContent(item) && item.hasChallenge && (
          <div className="absolute top-2 right-2 bg-accent bg-opacity-90 text-black text-xs px-2 py-1 rounded-full flex items-center">
            <i className="fas fa-trophy mr-1"></i>
            <span>Challenge</span>
          </div>
        )}
        
        {isContent(item) && item.hasQuiz && (
          <div className="absolute top-2 right-2 bg-secondary bg-opacity-90 text-black text-xs px-2 py-1 rounded-full flex items-center">
            <i className="fas fa-question-circle mr-1"></i>
            <span>Quiz</span>
          </div>
        )}
        
        {isContent(item) && item.points > 0 && !item.hasChallenge && !item.hasQuiz && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-accent text-xs px-2 py-1 rounded-full flex items-center">
            <i className="fas fa-star mr-1"></i>
            <span>{item.points} pts</span>
          </div>
        )}
        
        {/* New badge */}
        {((isContent(item) && new Date(item.addedDate).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) ||
          (isSeries(item) && item.releaseYearStart === new Date().getFullYear())) && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
            NEW
          </div>
        )}
      </div>
      <div className="p-3 bg-card">
        <div className="flex justify-between">
          <h3 className="font-medium truncate">{item.title}</h3>
          <div className="flex items-center text-xs">
            {isContent(item) && item.contentRating && (
              <>
                <i className="fas fa-star text-accent mr-1"></i>
                <span>{item.contentRating.toFixed(1)}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>
            {isContent(item) 
              ? `${item.releaseYear} • ${item.duration}m`
              : `${item.releaseYearStart}${item.releaseYearEnd ? ` - ${item.releaseYearEnd}` : ''} • ${item.seasons} Season${item.seasons !== 1 ? 's' : ''}`
            }
          </span>
          <span>
            {isContent(item) && item.genres?.length > 0 
              ? item.genres[0]
              : isSeries(item) && item.genres?.length > 0 
                ? item.genres[0]
                : ''
            }
          </span>
        </div>
      </div>
    </div>
  );
}
