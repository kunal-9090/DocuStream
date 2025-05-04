import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Challenge as ChallengeType, UserChallenge } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface ChallengeWithProgress {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string | Date;
  endDate: string | Date;
  requirementType: string;
  requirementValue: number;
  requirementGenre: string | null;
  pointReward: number;
  difficulty: string;
  isRecurring: boolean;
  isActive: boolean;
  isCompleted: boolean;
  progress: number;
  completionDate?: string | Date;
}

export default function ChallengesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch all challenges
  const { data: challenges, isLoading: loadingChallenges } = useQuery<ChallengeType[]>({
    queryKey: ["/api/challenges"],
    enabled: !!user,
  });
  
  // Fetch user challenges
  const { data: userChallenges, isLoading: loadingUserChallenges } = useQuery<UserChallenge[]>({
    queryKey: ["/api/user-challenges"],
    enabled: !!user,
  });
  
  const isLoading = loadingChallenges || loadingUserChallenges;
  
  // Join challenges with user progress
  const challengesWithProgress: ChallengeWithProgress[] = challenges?.map(challenge => {
    const userChallenge = userChallenges?.find(uc => uc.challengeId === challenge.id);
    return {
      ...challenge,
      isActive: !!userChallenge && userChallenge.status === "active",
      isCompleted: !!userChallenge && userChallenge.status === "completed",
      progress: userChallenge ? Math.min(100, (userChallenge.progressValue / challenge.requirementValue) * 100) : 0,
      startDate: userChallenge?.startDate,
      completionDate: userChallenge?.completionDate
    };
  }) || [];
  
  const activeChallenges = challengesWithProgress.filter(c => c.isActive);
  const completedChallenges = challengesWithProgress.filter(c => c.isCompleted);
  const availableChallenges = challengesWithProgress.filter(c => !c.isActive && !c.isCompleted);
  
  const handleStartChallenge = (challengeId: number) => {
    // This would require an API endpoint
    toast({
      title: "Challenge Started",
      description: "You've started a new challenge. Good luck!",
    });
  };
  
  if (isLoading) {
    return <ChallengesPageSkeleton />;
  }
  
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-5xl mx-auto main-content-container">
        <h1 className="text-3xl font-bold text-primary avengers-glow mb-6">Challenges</h1>
        
        <Tabs defaultValue="active">
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active ({activeChallenges.length})</TabsTrigger>
            <TabsTrigger value="available">Available ({availableChallenges.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedChallenges.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeChallenges.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <div className="mb-4">
                  <i className="fas fa-trophy text-4xl text-muted-foreground"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Active Challenges</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  You don't have any active challenges yet. Start a challenge to earn points and badges!
                </p>
                <Button 
                  variant="default" 
                  onClick={() => {
                    const element = document.querySelector('[data-value="available"]');
                    if (element instanceof HTMLElement) {
                      element.click();
                    }
                  }}
                >
                  Browse Available Challenges
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {activeChallenges.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="available">
            {availableChallenges.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <div className="mb-4">
                  <i className="fas fa-check-circle text-4xl text-accent"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You've started all available challenges. Check back later for new challenges!
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {availableChallenges.map(challenge => (
                  <div 
                    key={challenge.id} 
                    className="bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <img 
                          src={challenge.imageUrl} 
                          alt={challenge.title}
                          className="w-full md:w-40 h-40 object-cover rounded"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{challenge.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              challenge.difficulty === 'Easy' ? 'bg-green-950/50 text-green-400' :
                              challenge.difficulty === 'Medium' ? 'bg-yellow-950/50 text-yellow-400' :
                              'bg-red-950/50 text-red-400'
                            }`}>
                              {challenge.difficulty}
                            </span>
                            <span className="text-accent font-semibold text-sm">
                              +{challenge.pointReward} points
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-xs">
                            <i className="fas fa-calendar-alt mr-2 text-muted-foreground"></i>
                            <span>Ends: {new Date(challenge.endDate).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center text-xs">
                            <i className="fas fa-film mr-2 text-muted-foreground"></i>
                            {challenge.requirementType === 'Count' && (
                              <span>Watch {challenge.requirementValue} {challenge.requirementGenre} content</span>
                            )}
                            {challenge.requirementType === 'Minutes' && (
                              <span>Watch {challenge.requirementValue} minutes of content</span>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          variant="default" 
                          onClick={() => handleStartChallenge(challenge.id)}
                        >
                          Start Challenge
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedChallenges.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <div className="mb-4">
                  <i className="fas fa-medal text-4xl text-muted-foreground"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">No Completed Challenges</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You haven't completed any challenges yet. Start working on challenges to earn rewards!
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {completedChallenges.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface ChallengeCardProps {
  challenge: ChallengeWithProgress;
}

function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <div className={`bg-card border rounded-lg p-6 ${
      challenge.isCompleted ? 'border-accent/70' : 'border-border'
    }`}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img 
            src={challenge.imageUrl} 
            alt={challenge.title}
            className="w-full md:w-40 h-40 object-cover rounded"
          />
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <h3 className="text-xl font-semibold">{challenge.title}</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                challenge.difficulty === 'Easy' ? 'bg-green-950/50 text-green-400' :
                challenge.difficulty === 'Medium' ? 'bg-yellow-950/50 text-yellow-400' :
                'bg-red-950/50 text-red-400'
              }`}>
                {challenge.difficulty}
              </span>
              <span className="text-accent font-semibold text-sm">
                +{challenge.pointReward} points
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
          
          <div className="space-y-1 mb-3">
            {challenge.isCompleted ? (
              <div className="flex items-center text-xs font-medium text-accent">
                <i className="fas fa-check-circle mr-2"></i>
                <span>Completed on {challenge.completionDate && new Date(challenge.completionDate).toLocaleDateString()}</span>
              </div>
            ) : (
              <>
                <div className="flex items-center text-xs">
                  <i className="fas fa-calendar-alt mr-2 text-muted-foreground"></i>
                  <span>Ends: {new Date(challenge.endDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center text-xs">
                  <i className="fas fa-film mr-2 text-muted-foreground"></i>
                  {challenge.requirementType === 'Count' && (
                    <span>Watch {challenge.requirementValue} {challenge.requirementGenre} content</span>
                  )}
                  {challenge.requirementType === 'Minutes' && (
                    <span>Watch {challenge.requirementValue} minutes of content</span>
                  )}
                </div>
              </>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span className={challenge.isCompleted ? 'text-accent font-medium' : ''}>
                {Math.round(challenge.progress)}%
              </span>
            </div>
            <Progress value={challenge.progress} className={`h-2 ${challenge.isCompleted ? 'bg-accent/30' : ''}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ChallengesPageSkeleton() {
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-5xl mx-auto main-content-container">
        <div className="h-10 w-40 bg-muted animate-pulse rounded mb-6"></div>
        
        <div className="h-10 w-full bg-muted animate-pulse rounded mb-6"></div>
        
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0 w-full md:w-40 h-40 bg-muted animate-pulse rounded"></div>
                
                <div className="flex-grow">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                    <div className="h-6 w-40 bg-muted animate-pulse rounded"></div>
                    <div className="h-6 w-24 bg-muted animate-pulse rounded"></div>
                  </div>
                  
                  <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-muted animate-pulse rounded mb-4"></div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-40 bg-muted animate-pulse rounded"></div>
                  </div>
                  
                  <div className="h-2 w-full bg-muted animate-pulse rounded mt-4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}