import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Content } from "@shared/schema";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/common/footer";
import { VideoPlayer } from "@/components/ui/video-player";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ContentRow } from "@/components/content/content-row";

export default function MoviePage() {
  const [, params] = useRoute("/movie/:id");
  const contentId = params?.id ? parseInt(params.id) : undefined;
  const [showVideo, setShowVideo] = useState(false);
  
  const { data: content, isLoading } = useQuery<Content>({
    queryKey: [`/api/content/${contentId}`],
    enabled: !!contentId,
  });
  
  // Get similar content by genre
  const { data: allContent } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });
  
  const getSimilarContent = () => {
    if (!content || !allContent) return [];
    
    // Filter content with at least one matching genre
    return allContent.filter(item => 
      item.id !== content.id && // Not the current content
      item.genres.some(genre => content.genres.includes(genre))
    ).slice(0, 8); // Limit to 8 items
  };

  const handlePlay = () => {
    setShowVideo(true);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!content) {
    return <div>Content not found</div>;
  }

  return (
    <>
      <Navbar />
      
      <main className="pt-16">
        {/* Movie Header */}
        <section className="relative">
          {/* Background banner */}
          <div 
            className="w-full h-[30vh] md:h-[50vh] bg-cover bg-center relative"
            style={{ backgroundImage: `url(${content.bannerImageUrl || content.thumbnailUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          </div>
          
          {/* Content details overlay */}
          <div className="container mx-auto px-4 relative -mt-32 z-10">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Thumbnail */}
              <div className="flex-shrink-0 md:w-1/3 lg:w-1/4">
                <img 
                  src={content.thumbnailUrl} 
                  alt={content.title} 
                  className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg"
                />
              </div>
              
              {/* Details */}
              <div className="flex-grow">
                <div className="flex items-center flex-wrap gap-2 mb-2">
                  {content.genres.map((genre, index) => (
                    <span key={index} className="text-xs bg-card px-2 py-1 rounded">
                      {genre}
                    </span>
                  ))}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{content.title}</h1>
                
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span>{content.releaseYear}</span>
                  <span>{content.duration} minutes</span>
                  {content.ageRating && (
                    <span className="px-1 py-0.5 border border-gray-700 rounded">{content.ageRating}</span>
                  )}
                  {content.contentRating && (
                    <span className="flex items-center">
                      <i className="fas fa-star text-accent mr-1"></i>
                      <span>{content.contentRating.toFixed(1)}</span>
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <Button 
                    className="bg-primary hover:bg-primary/90"
                    onClick={handlePlay}
                  >
                    <i className="fas fa-play mr-2"></i> Watch Now
                  </Button>
                  
                  <Button variant="secondary">
                    <i className="fas fa-plus mr-2"></i> Add to My List
                  </Button>
                  
                  {content.hasChallenge && (
                    <Button variant="outline" className="text-accent border-accent">
                      <i className="fas fa-trophy mr-2"></i> Challenge Available
                    </Button>
                  )}
                </div>
                
                {/* Points info */}
                <div className="mb-6 p-3 bg-card bg-opacity-50 rounded-lg inline-flex items-center">
                  <span className="text-accent mr-2"><i className="fas fa-star"></i></span>
                  <span>Earn <span className="font-bold text-accent">{content.points}</span> points by watching this documentary</span>
                </div>
                
                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold mb-2">About this documentary</h2>
                  <p className="text-gray-300">{content.description}</p>
                </div>
                
                {/* Director & Cast */}
                {(content.director || (content.cast && content.cast.length > 0)) && (
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {content.director && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400">Director</h3>
                        <p>{content.director}</p>
                      </div>
                    )}
                    {content.cast && content.cast.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400">Cast</h3>
                        <p>{content.cast.join(', ')}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        
        {/* Similar Content */}
        <section className="mt-16">
          <ContentRow 
            title="More Like This" 
            items={getSimilarContent()} 
            type="movie" 
          />
        </section>
      </main>
      
      {/* Video Player Modal */}
      {showVideo && (
        <VideoPlayer
          videoUrl={content.videoUrl}
          title={content.title}
          thumbnailUrl={content.thumbnailUrl}
          duration={content.duration}
          contentId={content.id}
          episodeId={null}
          points={content.points}
          onClose={handleCloseVideo}
        />
      )}
      
      <Footer />
    </>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <Navbar />
      
      <main className="pt-16">
        {/* Banner Skeleton */}
        <Skeleton className="w-full h-[30vh] md:h-[50vh]" />
        
        {/* Content details skeleton */}
        <div className="container mx-auto px-4 relative -mt-32 z-10">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Thumbnail */}
            <Skeleton className="flex-shrink-0 md:w-1/3 lg:w-1/4 aspect-[2/3] rounded-lg" />
            
            {/* Details */}
            <div className="flex-grow">
              <div className="flex gap-2 mb-2">
                <Skeleton className="w-16 h-6 rounded" />
                <Skeleton className="w-16 h-6 rounded" />
                <Skeleton className="w-16 h-6 rounded" />
              </div>
              
              <Skeleton className="h-10 w-3/4 mb-2" />
              
              <div className="flex gap-4 mb-4">
                <Skeleton className="w-12 h-5" />
                <Skeleton className="w-24 h-5" />
                <Skeleton className="w-10 h-5" />
              </div>
              
              <div className="flex gap-3 mb-6">
                <Skeleton className="w-32 h-10 rounded-md" />
                <Skeleton className="w-32 h-10 rounded-md" />
              </div>
              
              <Skeleton className="w-64 h-12 mb-6 rounded-lg" />
              
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
