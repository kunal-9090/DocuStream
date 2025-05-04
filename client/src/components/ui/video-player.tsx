import { useState, useRef, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  subtitle?: string;
  thumbnailUrl: string;
  duration: number;
  contentId?: number | null;
  episodeId?: number | null;
  points: number;
  onClose: () => void;
}

export function VideoPlayer({
  videoUrl,
  title,
  subtitle,
  thumbnailUrl,
  duration,
  contentId,
  episodeId,
  points,
  onClose,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [watchPercentage, setWatchPercentage] = useState(0);
  const [showPointsNotification, setShowPointsNotification] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(false);
  const { toast } = useToast();

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Automatically hide controls after 3 seconds of inactivity
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const percentage = (video.currentTime / video.duration) * 100;
      setWatchPercentage(percentage);

      // Trigger points notification at 10% if not already shown
      if (percentage >= 10 && percentage < 15 && !showPointsNotification) {
        setShowPointsNotification(true);
        setTimeout(() => {
          setShowPointsNotification(false);
        }, 5000);
      }

      // Track progress with backend at various points
      if (
        (percentage >= 25 && percentage < 26) ||
        (percentage >= 50 && percentage < 51) ||
        (percentage >= 75 && percentage < 76) ||
        (percentage >= 85 && percentage < 86)
      ) {
        trackProgress(percentage);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [contentId, episodeId]);

  const trackProgress = async (percentage: number) => {
    try {
      // Only track if we have either contentId or episodeId
      if (!contentId && !episodeId) return;

      const response = await apiRequest("POST", "/api/user-content", {
        contentId,
        episodeId,
        watchPercentage: percentage,
      });

      // If we hit 85% and haven't awarded points yet, show toast
      if (percentage >= 85 && !pointsEarned) {
        setPointsEarned(true);
        toast({
          title: "Points earned!",
          description: `You earned ${points} points for watching this content`,
        });
      }
    } catch (error) {
      console.error("Error tracking video progress:", error);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let timeString = "";
    if (hrs > 0) {
      timeString += `${hrs}:${mins < 10 ? "0" : ""}`;
    }
    timeString += `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    return timeString;
  };

  const toggleFullScreen = () => {
    const container = document.querySelector(".video-container");
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div 
        className="relative w-full h-full max-w-6xl mx-auto video-container"
        onMouseMove={() => {
          setShowControls(true);
          if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
          }
          controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
              setShowControls(false);
            }
          }, 3000);
        }}
      >
        {/* Video element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={videoUrl}
          poster={thumbnailUrl}
          onClick={togglePlay}
        ></video>

        {/* Video controls overlay */}
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black to-transparent transition-opacity duration-300 flex flex-col justify-between p-4 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Top controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src={thumbnailUrl} 
                alt={title} 
                className="w-12 h-12 object-cover rounded mr-3"
              />
              <div>
                <h3 className="font-medium">{title}</h3>
                {subtitle && <p className="text-sm text-gray-300">{subtitle}</p>}
              </div>
            </div>
            
            <button 
              className="bg-black bg-opacity-70 hover:bg-opacity-100 text-white rounded-full p-2 transition"
              onClick={onClose}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {/* Center play button */}
          <div className="flex items-center justify-center flex-grow">
            {!isPlaying && (
              <button 
                className="bg-white text-black rounded-full w-16 h-16 flex items-center justify-center opacity-80 hover:opacity-100 transition"
                onClick={togglePlay}
              >
                <i className="fas fa-play text-2xl"></i>
              </button>
            )}
          </div>
          
          {/* Bottom controls */}
          <div>
            {/* Progress bar */}
            <input
              type="range"
              min={0}
              max={videoRef.current?.duration || duration * 60}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-700 rounded-full overflow-hidden mb-4 cursor-pointer appearance-none"
              style={{
                background: `linear-gradient(to right, #E50914 0%, #E50914 ${
                  (currentTime / (videoRef.current?.duration || duration * 60)) * 100
                }%, #4B5563 ${
                  (currentTime / (videoRef.current?.duration || duration * 60)) * 100
                }%, #4B5563 100%)`,
              }}
            />
            
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="text-white" onClick={togglePlay}>
                  <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
                </button>
                <button className="text-white">
                  <i className="fas fa-redo-alt"></i>
                </button>
                <div className="flex items-center">
                  <button className="text-white mr-2">
                    <i className={`fas ${volume === 0 ? "fa-volume-mute" : "fa-volume-up"}`}></i>
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer appearance-none"
                  />
                </div>
                <span className="text-sm text-gray-300">
                  {formatTime(currentTime)} / {formatTime(videoRef.current?.duration || duration * 60)}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-2">
                  <button className="text-white">
                    <i className="fas fa-closed-captioning"></i>
                  </button>
                  <button className="text-white">
                    <i className="fas fa-sliders-h"></i>
                  </button>
                </div>
                <button className="text-white" onClick={toggleFullScreen}>
                  <i className="fas fa-expand"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Points notification */}
        {showPointsNotification && (
          <div className="absolute top-4 right-20 bg-card bg-opacity-90 border border-accent rounded-lg px-4 py-2 flex items-center">
            <i className="fas fa-star text-accent mr-2"></i>
            <div>
              <p className="text-white font-medium">+{Math.floor(points * 0.2)} points earned!</p>
              <p className="text-xs text-gray-300">Keep watching to earn more</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
