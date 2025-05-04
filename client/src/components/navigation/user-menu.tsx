import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@shared/schema";

// Default avatar URLs
const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80"
];

export function UserMenu() {
  const { user, logoutMutation } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const getAvatarUrl = (user: User | null) => {
    if (!user) return DEFAULT_AVATARS[0];
    return user.profileImageUrl || DEFAULT_AVATARS[user.id % DEFAULT_AVATARS.length];
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative group" ref={menuRef}>
      <button 
        className="flex items-center"
        onClick={toggleMenu}
      >
        <img 
          src={getAvatarUrl(user)} 
          alt="Profile" 
          className="h-8 w-8 rounded-full object-cover border-2 border-secondary"
        />
        <i className={`fas fa-caret-down ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-card rounded shadow-lg py-2 z-50">
          <div className="flex items-center px-4 py-2 border-b border-gray-700">
            <img 
              src={getAvatarUrl(user)} 
              alt="Profile" 
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="text-sm font-semibold">{user?.displayName || user?.username}</p>
              <p className="text-xs text-accent">Level 1</p>
            </div>
          </div>
          <Link href="/account" className="block px-4 py-2 hover:bg-accent/10 transition-colors">
            <i className="fas fa-user-circle mr-2 text-muted-foreground"></i>
            Account
          </Link>
          <Link href="/achievements" className="block px-4 py-2 hover:bg-accent/10 transition-colors">
            <i className="fas fa-trophy mr-2 text-muted-foreground"></i>
            My Achievements
          </Link>
          <Link href="/help-center" className="block px-4 py-2 hover:bg-accent/10 transition-colors">
            <i className="fas fa-question-circle mr-2 text-muted-foreground"></i>
            Help Center
          </Link>
          <button 
            className="block w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors text-primary"
            onClick={() => logoutMutation.mutate()}
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
