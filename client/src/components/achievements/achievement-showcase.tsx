import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

interface UserBadge {
  id: number;
  dateEarned: string;
  isDisplayed: boolean;
  badge: {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    tier: string;
    pointValue: number;
    rarity: string;
  };
}

// Map badge icons to FontAwesome icons
const badgeIconMap: Record<string, string> = {
  mountain: "fa-mountain",
  clock: "fa-clock",
  rocket: "fa-rocket",
  book: "fa-book",
  anchor: "fa-anchor",
  award: "fa-award",
  // Add more mappings as needed
};

export function AchievementShowcase() {
  const { user } = useAuth();
  
  const { data: userBadges, isLoading } = useQuery<UserBadge[]>({
    queryKey: ["/api/user-badges"],
    enabled: !!user
  });

  if (isLoading) {
    return <AchievementShowcaseSkeleton />;
  }

  // If no badges, don't show the section
  if (!userBadges || userBadges.length === 0) {
    return null;
  }

  // Get the user's earned badges
  const earnedBadges = userBadges.map(ub => ub.badge);
  
  // Define placeholder badges for the locked ones
  const placeholderBadges = [
    {
      id: 100,
      name: "History Buff",
      description: "5 history docs",
      imageUrl: "book",
      progress: 60,
    },
    {
      id: 101,
      name: "Ocean Master",
      description: "7 ocean docs",
      imageUrl: "anchor",
      progress: 30,
    },
    {
      id: 102,
      name: "Quiz Master",
      description: "5 quizzes 100%",
      imageUrl: "award",
      progress: 20,
    }
  ];

  // Get recently earned badges (within the last week)
  const recentBadges = userBadges.filter(ub => {
    const earnedDate = new Date(ub.dateEarned);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return earnedDate > weekAgo;
  });

  // Determine background gradient based on badge tier
  const getBadgeGradient = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return 'from-amber-600 to-amber-800';
      case 'silver':
        return 'from-gray-300 to-gray-500';
      case 'gold':
        return 'from-yellow-400 to-yellow-600';
      case 'platinum':
        return 'from-purple-400 to-pink-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <section className="container mx-auto px-4 mb-12">
      <div className="relative bg-card rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-30"></div>
        
        <div className="relative p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Achievement Showcase</h2>
              <p className="text-gray-400">Collect badges by watching content and completing challenges</p>
            </div>
            <Link href="/achievements" className="mt-3 md:mt-0 px-4 py-2 bg-card border border-gray-700 rounded-full hover:bg-gray-700 transition text-sm">
              View All Achievements
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Show the user's earned badges first */}
            {earnedBadges.slice(0, 3).map((badge) => (
              <div key={`earned-${badge.id}`} className="relative flex flex-col items-center">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${getBadgeGradient(badge.tier)} flex items-center justify-center overflow-hidden p-0.5 ${
                  recentBadges.some(rb => rb.badge.id === badge.id) ? 'badge-glow' : ''
                }`}>
                  <div className="bg-card rounded-full w-full h-full flex items-center justify-center">
                    <i className={`fas ${badgeIconMap[badge.imageUrl] || 'fa-award'} text-white text-2xl`}></i>
                  </div>
                </div>
                <h3 className="text-center mt-3 font-medium text-sm">{badge.name}</h3>
                <p className="text-xs text-gray-400 text-center">{badge.description}</p>
                {recentBadges.some(rb => rb.badge.id === badge.id) && (
                  <span className="absolute -top-1 -right-1 bg-primary text-xs px-1.5 py-0.5 rounded-full">NEW</span>
                )}
              </div>
            ))}
            
            {/* Then show placeholder locked badges */}
            {placeholderBadges.map((badge) => (
              <div key={`locked-${badge.id}`} className="relative flex flex-col items-center opacity-50">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden p-0.5">
                  <div className="bg-card rounded-full w-full h-full flex items-center justify-center">
                    <i className="fas fa-lock text-gray-500 text-2xl"></i>
                  </div>
                </div>
                <h3 className="text-center mt-3 font-medium text-sm">{badge.name}</h3>
                <p className="text-xs text-gray-500 text-center">{badge.description}</p>
                <div className="absolute bottom-0 left-0 right-0 bg-gray-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-gray-600 h-full" style={{ width: `${badge.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AchievementShowcaseSkeleton() {
  return (
    <section className="container mx-auto px-4 mb-12">
      <div className="bg-card rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-9 w-36 rounded-full mt-3 md:mt-0" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full" />
                <Skeleton className="h-4 w-20 mt-3 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
