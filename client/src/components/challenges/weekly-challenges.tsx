import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

interface Challenge {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  requirementType: string;
  requirementValue: number;
  requirementGenre?: string;
  pointReward: number;
  difficulty: string;
  isRecurring: boolean;
}

export function WeeklyChallenges() {
  const { user } = useAuth();
  
  const { data: challenges, isLoading } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges"],
    enabled: !!user
  });

  const { data: userChallenges } = useQuery({
    queryKey: ["/api/user-challenges"],
    enabled: !!user
  });

  if (isLoading) {
    return <WeeklyChallengesSkeleton />;
  }

  if (!challenges || challenges.length === 0) {
    return null;
  }

  // Calculate days remaining for each challenge
  const challengesWithTimeLeft = challenges.map(challenge => {
    const endDate = new Date(challenge.endDate);
    const today = new Date();
    const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Find user progress for this challenge if it exists
    const userProgress = userChallenges?.find(uc => uc.challenge.id === challenge.id);
    const progressValue = userProgress ? userProgress.progressValue : 0;
    const progressPercentage = userProgress ? 
      Math.min(100, (userProgress.progressValue / challenge.requirementValue) * 100) : 0;
    
    return {
      ...challenge,
      daysRemaining,
      progressValue,
      progressPercentage
    };
  });

  // Take only the first 3 challenges to display
  const displayChallenges = challengesWithTimeLeft.slice(0, 3);

  // Check if a challenge is new (added within the last 2 days)
  const isNewChallenge = (startDate: string) => {
    const challengeStart = new Date(startDate);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return challengeStart > twoDaysAgo;
  };

  return (
    <section className="container mx-auto px-4 mb-12">
      <h2 className="text-xl font-semibold mb-4">Weekly Challenges</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayChallenges.map((challenge) => (
          <div 
            key={challenge.id} 
            className="bg-card rounded-lg overflow-hidden border border-gray-800 hover:border-accent transition-all duration-300"
          >
            <div 
              className="h-32 bg-cover bg-center relative" 
              style={{ backgroundImage: `url(${challenge.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent"></div>
              <div className="absolute top-3 right-3 bg-accent text-black text-xs font-bold px-2 py-1 rounded">
                {challenge.pointReward} POINTS
              </div>
              {isNewChallenge(challenge.startDate) && (
                <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded">
                  NEW
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{challenge.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{challenge.description}</p>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">Progress: {challenge.progressValue}/{challenge.requirementValue}</span>
                <span className="text-xs text-gray-400">{challenge.daysRemaining} days remaining</span>
              </div>
              
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-secondary" 
                  style={{ width: `${challenge.progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="bg-accent hover:bg-yellow-500 text-black text-sm font-medium py-2 px-4 rounded-full transition flex-1">
                  {challenge.progressValue > 0 ? "Continue Watching" : "Start Watching"}
                </button>
                <button className="border border-gray-600 hover:border-gray-400 text-white py-2 px-3 rounded-full transition">
                  <i className="fas fa-info-circle"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WeeklyChallengesSkeleton() {
  return (
    <section className="container mx-auto px-4 mb-12">
      <Skeleton className="h-7 w-48 mb-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-lg overflow-hidden border border-gray-800">
            <Skeleton className="h-32 w-full" />
            
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
              
              <Skeleton className="h-2 w-full rounded-full mb-4" />
              
              <div className="flex items-center space-x-2">
                <Skeleton className="h-10 flex-1 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
