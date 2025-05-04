import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80"
];

export default function AccountPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  
  // Get current avatar
  const getAvatarUrl = () => {
    if (!user) return DEFAULT_AVATARS[0];
    return user.profileImageUrl || DEFAULT_AVATARS[user.id % DEFAULT_AVATARS.length];
  };
  
  const handleSaveChanges = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-3xl mx-auto main-content-container">
        <h1 className="text-3xl font-bold mb-8 text-primary avengers-glow">Account Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left sidebar */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-center">
              <img 
                src={getAvatarUrl()} 
                alt="Profile" 
                className="h-32 w-32 rounded-full object-cover border-4 border-accent avengers-accent-border mb-4"
              />
              <h2 className="text-xl font-semibold mb-1">{user?.displayName || user?.username}</h2>
              <p className="text-sm text-accent mb-4">Premium Member</p>
              
              <div className="flex items-center space-x-2 mb-6">
                <div className="bg-secondary/20 border border-secondary/60 rounded-full px-3 py-1">
                  <span className="text-accent mr-1">
                    <i className="fas fa-star"></i>
                  </span>
                  <span className="text-accent font-semibold">250</span>
                </div>
                
                <div className="bg-secondary/20 border border-secondary/60 rounded-full px-3 py-1">
                  <span className="text-secondary mr-1">
                    <i className="fas fa-trophy"></i>
                  </span>
                  <span className="text-secondary font-semibold">4</span>
                </div>
              </div>
              
              <div className="w-full space-y-2">
                <Link href="/account" className="block bg-muted hover:bg-muted/80 py-2 px-4 rounded-lg text-center font-medium">
                  Profile
                </Link>
                <Link href="/account/billing" className="block hover:bg-muted/50 py-2 px-4 rounded-lg text-center">
                  Billing
                </Link>
                <Link href="/account/preferences" className="block hover:bg-muted/50 py-2 px-4 rounded-lg text-center">
                  Preferences
                </Link>
                <Link href="/account/security" className="block hover:bg-muted/50 py-2 px-4 rounded-lg text-center">
                  Security
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <Input defaultValue={user.username} disabled className="bg-muted/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <Input defaultValue={user.displayName || ""} placeholder="Set a display name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input defaultValue={user.email || ""} placeholder="Add your email" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea 
                    className="w-full bg-muted/50 border border-input rounded-md px-3 py-2 h-24"
                    placeholder="Tell us about yourself"
                    defaultValue=""
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-xl font-semibold mb-4">Choose Avatar</h3>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {DEFAULT_AVATARS.map((avatar, index) => (
                  <div 
                    key={index}
                    className={`cursor-pointer relative rounded-full overflow-hidden ${selectedAvatar === index ? 'ring-4 ring-accent' : ''}`}
                    onClick={() => setSelectedAvatar(index)}
                  >
                    <img 
                      src={avatar} 
                      alt={`Avatar ${index + 1}`} 
                      className="h-16 w-16 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="default" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}