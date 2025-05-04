import { useQuery } from "@tanstack/react-query";
import { Content, Series } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/common/footer";
import { HeroBanner } from "@/components/content/hero-banner";
import { ContentRow } from "@/components/content/content-row";
import { ContinueWatching } from "@/components/content/continue-watching";
import { PointsDashboard } from "@/components/points/points-dashboard";
import { AchievementShowcase } from "@/components/achievements/achievement-showcase";
import { WeeklyChallenges } from "@/components/challenges/weekly-challenges";

export default function HomePage() {
  // Fetch featured content for hero banner
  const { data: featuredContent, isLoading: isFeaturedLoading } = useQuery<Content[]>({
    queryKey: ["/api/content/featured"],
  });

  // Fetch all content
  const { data: allContent, isLoading: isContentLoading } = useQuery<Content[]>({
    queryKey: ["/api/content"],
  });

  // Fetch all series
  const { data: allSeries, isLoading: isSeriesLoading } = useQuery<Series[]>({
    queryKey: ["/api/series"],
  });

  // Filter content by genre
  const getNatureContent = () => {
    return allContent?.filter(content => 
      content.genres.some(genre => 
        ["Nature", "Wildlife"].includes(genre)
      )
    ) || [];
  };

  const getSpaceContent = () => {
    return allContent?.filter(content => 
      content.genres.some(genre => 
        ["Space", "Science"].includes(genre)
      )
    ) || [];
  };

  // Filter content for Indian personalities
  const getIndianPersonalitiesContent = () => {
    return allContent?.filter(content => 
      content.genres.includes("Indian Personalities") ||
      content.type === "Biography"
    ) || [];
  };

  // Filter podcast series
  const getPodcastSeries = () => {
    return allSeries?.filter(series => 
      series.genres.includes("Podcast")
    ) || [];
  };

  // Get a random featured content for hero banner
  const getRandomFeatured = () => {
    if (!featuredContent || featuredContent.length === 0) {
      return null;
    }
    return featuredContent[Math.floor(Math.random() * featuredContent.length)];
  };

  const heroContent = getRandomFeatured();

  if (isFeaturedLoading) {
    return <LoadingState />;
  }

  if (!heroContent) {
    return <div>No content available</div>;
  }

  return (
    <>
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Banner */}
        <HeroBanner content={heroContent} />
        
        {/* Points Dashboard */}
        <PointsDashboard />
        
        {/* Continue Watching */}
        <ContinueWatching />
        
        {/* Popular on DocuStream */}
        <ContentRow 
          title="Popular on DocuStream" 
          items={allContent || []} 
          type="movie" 
        />
        
        {/* Trending Series */}
        <ContentRow 
          title="Trending Series" 
          items={allSeries || []} 
          type="series" 
        />
        
        {/* Nature Documentaries */}
        <ContentRow 
          title="Nature Documentaries" 
          items={getNatureContent()} 
          type="movie" 
        />
        
        {/* Space & Science */}
        <ContentRow 
          title="Space & Science" 
          items={getSpaceContent()} 
          type="movie" 
        />
        
        {/* Indian Personalities Documentaries */}
        <ContentRow 
          title="Great Indian Personalities" 
          items={getIndianPersonalitiesContent()} 
          type="movie" 
        />
        
        {/* Podcasts */}
        <ContentRow 
          title="Featured Podcasts" 
          items={getPodcastSeries()} 
          type="series" 
        />
        
        {/* Achievement Showcase */}
        <AchievementShowcase />
        
        {/* Weekly Challenges */}
        <WeeklyChallenges />
      </main>
      
      <Footer />
    </>
  );
}

function LoadingState() {
  return (
    <>
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Banner Skeleton */}
        <div className="relative h-screen max-h-[70vh] md:max-h-[80vh] overflow-hidden">
          <Skeleton className="absolute inset-0" />
          
          <div className="relative h-full flex items-end">
            <div className="container mx-auto px-4 pb-24 md:pb-32 max-w-5xl">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-10 w-3/4 mb-3" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              <Skeleton className="h-4 w-64 mb-6" />
              <div className="flex space-x-3">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Points Dashboard Skeleton */}
        <div className="relative -mt-5 z-20 container mx-auto px-4 mb-8">
          <Skeleton className="h-40 w-full max-w-5xl mx-auto" />
        </div>
        
        {/* Content Rows Skeleton */}
        {[1, 2, 3].map(i => (
          <div key={i} className="container mx-auto px-4 mb-12">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {[1, 2, 3, 4, 5].map(j => (
                <Skeleton key={j} className="flex-none w-64 h-40" />
              ))}
            </div>
          </div>
        ))}
      </main>
      
      <Footer />
    </>
  );
}
