import { Link } from "wouter";
import { Content } from "@shared/schema";
import { useState } from "react";
import { VideoPlayer } from "@/components/ui/video-player";

interface HeroBannerProps {
  content: Content;
}

export function HeroBanner({ content }: HeroBannerProps) {
  const [showVideo, setShowVideo] = useState(false);

  const handlePlay = () => {
    setShowVideo(true);
  };

  const handleCloseVideo = () => {
    setShowVideo(false);
  };

  return (
    <section className="relative h-screen max-h-[70vh] md:max-h-[80vh] overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${content.bannerImageUrl || content.thumbnailUrl})` }}
      >
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 hero-gradient"></div>
      </div>
      
      {/* Content overlay */}
      <div className="relative h-full flex items-end">
        <div className="container mx-auto px-4 pb-24 md:pb-32 max-w-5xl">
          {/* Points badge */}
          <div className="inline-flex items-center bg-black bg-opacity-70 rounded-full px-3 py-1 mb-4">
            <span className="text-accent mr-1"><i className="fas fa-star"></i></span>
            <span className="text-white text-sm">Earn <span className="text-accent font-bold">{content.points}</span> points</span>
          </div>
          
          {/* Title and description */}
          <h1 className="text-4xl md:text-6xl font-bold mb-3 text-shadow-lg">{content.title}</h1>
          <p className="text-lg md:text-xl mb-6 max-w-3xl">{content.shortDescription || content.description}</p>
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center text-sm mb-6 gap-x-4 gap-y-2">
            <span className="font-medium">{content.releaseYear}</span>
            {content.ageRating && (
              <span className="px-1 py-0.5 border border-gray-400 text-xs rounded">{content.ageRating}</span>
            )}
            <span>{content.duration} min</span>
            {content.contentRating && (
              <span className="flex items-center">
                <i className="fas fa-star text-accent mr-1"></i>
                <span>{content.contentRating.toFixed(1)}</span>
              </span>
            )}
            <span className="bg-secondary bg-opacity-20 text-secondary px-2 py-0.5 rounded">HD</span>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button 
              className="bg-primary hover:bg-red-700 text-white px-6 py-2 rounded flex items-center font-medium transition"
              onClick={handlePlay}
            >
              <i className="fas fa-play mr-2"></i> Play
            </button>
            <Link href={`/movie/${content.id}`}>
              <button className="bg-gray-600 bg-opacity-70 hover:bg-opacity-100 text-white px-6 py-2 rounded flex items-center font-medium transition">
                <i className="fas fa-info-circle mr-2"></i> More Info
              </button>
            </Link>
            {content.hasChallenge && (
              <button className="bg-accent bg-opacity-20 hover:bg-opacity-30 text-accent px-4 py-2 rounded flex items-center transition">
                <i className="fas fa-trophy mr-2"></i> Challenge Available
              </button>
            )}
          </div>
        </div>
      </div>

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
    </section>
  );
}
