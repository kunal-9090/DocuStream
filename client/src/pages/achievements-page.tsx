import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Badge as BadgeType, UserBadge } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

type BadgeCategory = "Movie" | "Series" | "Social" | "Explorer" | "Avengers" | "Movies";

interface BadgeWithDetails extends Omit<BadgeType, 'dateEarned'> {
  isEarned: boolean;
  dateEarned?: string;
  isDisplayed?: boolean;
}

export default function AchievementsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch user badges
  const { data: userBadges, isLoading: loadingBadges } = useQuery<UserBadge[]>({
    queryKey: ["/api/user-badges"],
    enabled: !!user,
  });
  
  // Fetch all available badges (this API endpoint needs to be created)
  const { data: allBadges, isLoading: loadingAllBadges } = useQuery<BadgeType[]>({
    queryKey: ["/api/badges"],
    enabled: !!user,
  });
  
  const isLoading = loadingBadges || loadingAllBadges;
  
  // Prepare badges with earning status
  const badges: BadgeWithDetails[] = 
    allBadges?.map(badge => {
      const userBadge = userBadges?.find(ub => ub.badgeId === badge.id);
      return {
        ...badge,
        isEarned: !!userBadge,
        dateEarned: userBadge?.dateEarned ? userBadge.dateEarned.toString() : undefined,
        isDisplayed: userBadge?.isDisplayed
      };
    }) || [];
  
  // Filter badges by category
  const getBadgesByCategory = (category: BadgeCategory) => {
    return badges.filter(badge => badge.category === category);
  };
  
  const getTotalProgress = () => {
    if (!badges.length) return 0;
    const earned = badges.filter(b => b.isEarned).length;
    return Math.round((earned / badges.length) * 100);
  };
  
  const handleDisplayToggle = (badgeId: number) => {
    // This would require an API endpoint to update the badge display status
    toast({
      title: "Display Updated",
      description: "Your showcase badges have been updated.",
    });
  };
  
  if (isLoading) {
    return <AchievementsPageSkeleton />;
  }
  
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-5xl mx-auto main-content-container">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary avengers-glow">My Achievements</h1>
          
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <span className="text-sm text-muted-foreground">Total Progress</span>
              <span className="text-lg font-semibold">{badges.filter(b => b.isEarned).length} / {badges.length}</span>
            </div>
            <div className="w-40">
              <Progress value={getTotalProgress()} className="h-2" />
            </div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg mb-8 border border-border">
          <h2 className="text-xl font-semibold mb-4">Showcase Badges</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {badges.filter(b => b.isEarned && b.isDisplayed).length > 0 ? (
              badges
                .filter(b => b.isEarned && b.isDisplayed)
                .slice(0, 6)
                .map(badge => (
                  <div key={badge.id} className="flex flex-col items-center">
                    <div className="relative h-20 w-20 mb-2 avengers-accent-border rounded-full">
                      <img 
                        src={badge.imageUrl} 
                        alt={badge.name} 
                        className="h-full w-full object-cover rounded-full"
                      />
                      <button 
                        className="absolute -top-2 -right-2 bg-background rounded-full p-1"
                        onClick={() => handleDisplayToggle(badge.id)}
                      >
                        <i className="fas fa-times text-xs"></i>
                      </button>
                    </div>
                    <span className="text-xs text-center font-medium">{badge.name}</span>
                  </div>
                ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">You haven't added any badges to your showcase yet.</p>
                <p className="text-sm">Select badges from your collection below to showcase them on your profile.</p>
              </div>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Badges</TabsTrigger>
            <TabsTrigger value="avengers">Avengers</TabsTrigger>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="series">Series</TabsTrigger>
            <TabsTrigger value="explorer">Explorer</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <BadgeGrid badges={badges} onDisplayToggle={handleDisplayToggle} />
          </TabsContent>
          
          <TabsContent value="avengers" className="space-y-6">
            <BadgeGrid badges={getBadgesByCategory("Avengers")} onDisplayToggle={handleDisplayToggle} />
          </TabsContent>
          
          <TabsContent value="movies" className="space-y-6">
            <BadgeGrid badges={getBadgesByCategory("Movie")} onDisplayToggle={handleDisplayToggle} />
          </TabsContent>
          
          <TabsContent value="series" className="space-y-6">
            <BadgeGrid badges={getBadgesByCategory("Series")} onDisplayToggle={handleDisplayToggle} />
          </TabsContent>
          
          <TabsContent value="explorer" className="space-y-6">
            <BadgeGrid badges={getBadgesByCategory("Explorer")} onDisplayToggle={handleDisplayToggle} />
          </TabsContent>
          
          <TabsContent value="social" className="space-y-6">
            <BadgeGrid badges={getBadgesByCategory("Social")} onDisplayToggle={handleDisplayToggle} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface BadgeGridProps {
  badges: BadgeWithDetails[];
  onDisplayToggle: (badgeId: number) => void;
}

function BadgeGrid({ badges, onDisplayToggle }: BadgeGridProps) {
  if (badges.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No badges in this category yet.</p>
        <p className="text-sm">Keep watching and completing challenges to earn badges!</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {badges.map(badge => (
        <div
          key={badge.id}
          className={`bg-card border ${badge.isEarned ? 'border-secondary/60' : 'border-border opacity-60'} rounded-lg p-4 flex flex-col items-center transition-transform hover:scale-105`}
        >
          <div className={`relative h-24 w-24 mb-3 ${badge.isEarned ? badge.tier === 'Gold' ? 'avengers-accent-border' : '' : 'grayscale'}`}>
            <img 
              src={badge.imageUrl} 
              alt={badge.name} 
              className={`h-full w-full object-contain ${badge.isEarned && badge.tier === 'Gold' ? 'badge-glow' : ''}`}
            />
            
            {badge.isEarned && (
              <div className="absolute -bottom-2 -right-2 bg-background rounded-full p-1 border border-border">
                <button 
                  className={`h-6 w-6 rounded-full flex items-center justify-center ${badge.isDisplayed ? 'bg-accent text-accent-foreground' : 'bg-muted hover:bg-muted/80'}`}
                  onClick={() => onDisplayToggle(badge.id)}
                >
                  <i className={`fas fa-${badge.isDisplayed ? 'check' : 'plus'} text-xs`}></i>
                </button>
              </div>
            )}
          </div>
          
          <h3 className="font-semibold text-center">{badge.name}</h3>
          <p className="text-xs text-center text-muted-foreground mb-2">{badge.description}</p>
          
          <div className="mt-auto pt-2 flex items-center space-x-2">
            <span className={`inline-block px-2 py-0.5 rounded text-xs ${getTierColor(badge.tier)}`}>
              {badge.tier}
            </span>
            
            <span className="text-xs text-muted-foreground">
              {badge.rarity}
            </span>
            
            <span className="ml-auto text-accent text-xs font-semibold">
              +{badge.pointValue}
            </span>
          </div>
          
          {badge.isEarned && badge.dateEarned && (
            <div className="w-full text-center text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
              Earned on {new Date(badge.dateEarned).toLocaleDateString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function getTierColor(tier: string) {
  switch (tier) {
    case 'Bronze':
      return 'bg-amber-950/50 text-amber-400';
    case 'Silver':
      return 'bg-slate-800/50 text-slate-300';
    case 'Gold':
      return 'bg-amber-900/50 text-amber-300';
    case 'Platinum':
      return 'bg-indigo-900/50 text-indigo-300';
    default:
      return 'bg-gray-800 text-gray-300';
  }
}

function AchievementsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-5xl mx-auto main-content-container">
        <div className="flex items-center justify-between mb-6">
          <div className="h-10 w-48 bg-muted animate-pulse rounded"></div>
          <div className="flex items-center space-x-4">
            <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
            <div className="w-40 h-2 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg mb-8">
          <div className="h-8 w-40 bg-muted animate-pulse rounded mb-4"></div>
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-20 w-20 mb-2 bg-muted rounded-full animate-pulse"></div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="h-10 w-full bg-muted animate-pulse rounded mb-6"></div>
        
        <div className="grid grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 flex flex-col items-center">
              <div className="h-24 w-24 mb-3 bg-muted animate-pulse rounded-full"></div>
              <div className="h-6 w-32 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-4 w-3/4 bg-muted animate-pulse rounded mb-4"></div>
              <div className="h-6 w-full bg-muted animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}