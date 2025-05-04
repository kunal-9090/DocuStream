import { useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { VideoPlayer } from "@/components/ui/video-player";

interface WatchHistoryItem {
  id: number;
  watchPercentage: number;
  lastWatchDate: string;
  isCompleted: boolean;
  content?: {
    id: number;
    title: string;
    thumbnailUrl: string;
    duration: number;
    type: string;
    points: number;
  };
  episode?: {
    id: number;
    title: string;
    seasonNumber: number;
    episodeNumber: number;
    duration: number;
    points: number;
  };
}

export function ContinueWatching() {
  const rowRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [selectedItem, setSelectedItem] = useState<WatchHistoryItem | null>(null);
  
  const { data, isLoading } = useQuery<WatchHistoryItem[]>({
    queryKey: ["/api/user-content"],
    enabled: !!user,
  });

  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;
    
    const scrollAmount = rowRef.current.clientWidth * 0.75;
    const scrollDirection = direction === "left" ? -1 : 1;
    
    rowRef.current.scrollBy({
      left: scrollDirection * scrollAmount,
      behavior: "smooth"
    });
  };

  const formatTimeLeft = (item: WatchHistoryItem) => {
    if (!item.content) return "";
    
    const totalSeconds = item.content.duration * 60;
    const watchedSeconds = totalSeconds * (item.watchPercentage / 100);
    const secondsLeft = totalSeconds - watchedSeconds;
    
    // Convert to minutes or hours + minutes
    if (secondsLeft < 3600) {
      return `${Math.ceil(secondsLeft / 60)}m left`;
    } else {
      const hours = Math.floor(secondsLeft / 3600);
      const minutes = Math.ceil((secondsLeft % 3600) / 60);
      return `${hours}h ${minutes}m left`;
    }
  };

  const startPlaying = (item: WatchHistoryItem) => {
    setSelectedItem(item);
  };

  const handleCloseVideo = () => {
    setSelectedItem(null);
  };

  // Only show if there are items to continue watching
  if (isLoading) {
    return <ContinueWatchingSkeleton />;
  }

  if (!data || data.length === 0) {
    return null;
  }

  // Filter out items that are completed
  const continuableItems = data.filter(item => !item.isCompleted && item.content);

  if (continuableItems.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 mb-12">
      <h2 className="text-xl font-semibold mb-4">Continue Watching</h2>
      
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
          {continuableItems.map((item) => (
            item.content && (
              <div key={item.id} className="content-card flex-none w-64 relative rounded overflow-hidden">
                <div className="relative">
                  <img 
                    src={item.content.thumbnailUrl} 
                    alt={item.content.title} 
                    className="w-full h-36 object-cover"
                  />
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${item.watchPercentage}%` }}
                    ></div>
                  </div>
                  
                  {/* Play overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                    <button 
                      className="bg-white text-black rounded-full p-3"
                      onClick={() => startPlaying(item)}
                    >
                      <i className="fas fa-play"></i>
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-card">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium truncate">{item.content.title}</h3>
                    <span className="bg-black bg-opacity-50 text-xs px-1 rounded">{formatTimeLeft(item)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>
                      {item.episode 
                        ? `S${item.episode.seasonNumber}:E${item.episode.episodeNumber} "${item.episode.title}"`
                        : item.content.type
                      }
                    </span>
                    <span className="text-accent">
                      <i className="fas fa-star mr-1"></i>
                      {item.content.points}pts
                    </span>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
        
        {/* Right scroll button */}
        <button 
          className="scroll-button absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 z-10 opacity-0 transition-opacity duration-300"
          onClick={() => scroll("right")}
        >
          <i className="fas fa-chevron-right text-white"></i>
        </button>
      </div>

      {/* Video Player */}
      {selectedItem && selectedItem.content && (
        <VideoPlayer
          videoUrl={selectedItem.content.thumbnailUrl.replace("https://images.unsplash.com", "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")}
          title={selectedItem.content.title}
          subtitle={selectedItem.episode ? `S${selectedItem.episode.seasonNumber}:E${selectedItem.episode.episodeNumber} "${selectedItem.episode.title}"` : undefined}
          thumbnailUrl={selectedItem.content.thumbnailUrl}
          duration={selectedItem.content.duration}
          contentId={selectedItem.content.id}
          episodeId={selectedItem.episode?.id}
          points={selectedItem.content.points}
          onClose={handleCloseVideo}
        />
      )}
    </section>
  );
}

function ContinueWatchingSkeleton() {
  return (
    <section className="container mx-auto px-4 mb-12">
      <h2 className="text-xl font-semibold mb-4">Continue Watching</h2>
      
      <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-none w-64 rounded overflow-hidden">
            <Skeleton className="w-full h-36" />
            <div className="p-3 bg-card">
              <Skeleton className="h-4 w-4/5 mb-2" />
              <Skeleton className="h-3 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
