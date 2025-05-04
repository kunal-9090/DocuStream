import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { UserMenu } from "./user-menu";
import { MobileMenu } from "./mobile-menu";
import { NotificationsMenu } from "./notifications-menu";
import { useMobile } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMobile();
  const { user } = useAuth();
  
  // Get user points
  const { data: pointsData } = useQuery<{total: number; today: number; weekly: number; monthly: number}>({
    queryKey: ["/api/user-points"],
    enabled: !!user
  });

  // Handle scroll effect to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'nav-container' : 'bg-gradient-to-b from-background/80 to-transparent backdrop-blur-sm'}`}>
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-primary font-bold text-2xl md:text-3xl avengers-glow">
            DocuStream
          </Link>
          
          {/* Main Navigation - Desktop */}
          {!isMobile && (
            <div className="ml-8 space-x-6">
              <Link href="/" className={`${location === '/' ? 'text-white font-semibold' : 'text-gray-300'} hover:text-accent transition`}>
                Home
              </Link>
              <Link href="/movies" className={`${location === '/movies' ? 'text-white font-semibold' : 'text-gray-300'} hover:text-accent transition`}>
                Movies
              </Link>
              <Link href="/series" className={`${location === '/series' ? 'text-white font-semibold' : 'text-gray-300'} hover:text-accent transition`}>
                Series
              </Link>
              <Link href="/movies" className="text-gray-300 hover:text-accent transition">
                Documentaries
              </Link>
              <Link href="/my-list" className={`${location === '/my-list' ? 'text-white font-semibold' : 'text-gray-300'} hover:text-accent transition`}>
                My List
              </Link>
              <Link href="/challenges" className={`${location === '/challenges' ? 'text-white font-semibold' : 'text-gray-300'} hover:text-accent transition`}>
                Challenges
              </Link>
              <Link href="/achievements" className={`${location === '/achievements' ? 'text-white font-semibold' : 'text-gray-300'} hover:text-accent transition`}>
                Rewards
              </Link>
            </div>
          )}
        </div>
        
        {/* Right side items */}
        <div className="flex items-center space-x-4">
          {/* Points Display - Desktop */}
          {!isMobile && user && (
            <div className="flex items-center bg-secondary/20 border border-secondary/60 rounded-full px-3 py-1 shadow-md">
              <span className="text-accent mr-1">
                <i className="fas fa-star"></i>
              </span>
              <span className="text-accent font-semibold">{pointsData?.total || 0}</span>
            </div>
          )}
          
          {/* Search */}
          <Link href="/search" className="text-gray-300 hover:text-accent transition">
            <i className="fas fa-search text-xl"></i>
          </Link>
          
          {/* Notifications */}
          {user && <NotificationsMenu />}
          
          {/* User Menu */}
          {user && <UserMenu />}
          
          {/* Mobile menu button */}
          {isMobile && (
            <MobileMenu />
          )}
        </div>
      </nav>
    </header>
  );
}
