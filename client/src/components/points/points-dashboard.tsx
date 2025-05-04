import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function PointsDashboard() {
  const { user } = useAuth();
  
  const { data: pointsData, isLoading } = useQuery({
    queryKey: ["/api/user-points"],
    enabled: !!user
  });

  if (isLoading) {
    return <PointsDashboardSkeleton />;
  }

  if (!pointsData) {
    return null;
  }

  // Calculate progress to next level (just a simple example - could be more complex)
  const currentLevel = Math.floor(pointsData.total / 1000) + 1;
  const nextLevelPoints = currentLevel * 1000;
  const currentProgress = (pointsData.total % 1000) / 10; // Convert to percentage

  return (
    <section className="relative -mt-5 z-20 container mx-auto px-4 mb-8">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Points section */}
          <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Your Points</h3>
              <span className="text-xs bg-black bg-opacity-30 rounded-full px-2 py-1">Level {currentLevel}</span>
            </div>
            <div className="flex items-center mb-3">
              <span className="text-accent text-3xl font-bold">{pointsData.total}</span>
              {pointsData.today > 0 && (
                <span className="text-green-500 ml-2 text-sm points-earned">+{pointsData.today} today</span>
              )}
            </div>
            {/* Progress to next level */}
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary" 
                style={{ width: `${currentProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>Next level: {nextLevelPoints - pointsData.total} points</span>
              <span>Unlock: Premium Avatar</span>
            </div>
          </div>
          
          {/* Weekly challenge section */}
          <div className="flex-1 p-5">
            <h3 className="font-semibold mb-3">Weekly Challenge</h3>
            <div className="flex items-start mb-3">
              <div className="bg-secondary bg-opacity-20 p-2 rounded mr-3">
                <i className="fas fa-video text-secondary"></i>
              </div>
              <div>
                <p className="font-medium">Watch 3 Environmental Documentaries</p>
                <p className="text-gray-400 text-sm">Earn 150 bonus points</p>
              </div>
            </div>
            {/* Challenge progress */}
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-secondary" style={{ width: "33%" }}></div>
            </div>
            <div className="flex justify-between text-xs">
              <span>1/3 completed</span>
              <span>5 days remaining</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PointsDashboardSkeleton() {
  return (
    <section className="relative -mt-5 z-20 container mx-auto px-4 mb-8">
      <div className="bg-card rounded-lg shadow-lg overflow-hidden max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-5 border-b md:border-b-0 md:border-r border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="flex items-center mb-3">
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-2 w-full rounded-full mb-2" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          
          <div className="flex-1 p-5">
            <Skeleton className="h-5 w-32 mb-3" />
            <div className="flex items-start mb-3">
              <Skeleton className="h-10 w-10 rounded mr-3" />
              <div className="flex-1">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <Skeleton className="h-2 w-full rounded-full mb-2" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
