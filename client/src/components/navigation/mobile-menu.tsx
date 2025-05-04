import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  // Get user points
  const { data: pointsData } = useQuery<{total: number; today: number; weekly: number; monthly: number}>({
    queryKey: ["/api/user-points"],
    enabled: !!user
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    closeMenu();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="text-gray-300 hover:text-white"
        onClick={toggleMenu}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
      </button>
      
      {/* Mobile Navigation Menu */}
      <div className={`fixed inset-0 z-50 bg-background transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`} style={{ top: '72px' }}>
        <div className="flex flex-col h-full">
          <div className="flex-grow">
            <Link href="/" className={`block py-3 px-4 ${location === '/' ? 'text-white' : 'text-gray-300'} border-b border-gray-700`} onClick={closeMenu}>
              Home
            </Link>
            <Link href="/movies" className={`block py-3 px-4 ${location === '/movies' ? 'text-white' : 'text-gray-300'} border-b border-gray-700`} onClick={closeMenu}>
              Movies
            </Link>
            <Link href="/series" className={`block py-3 px-4 ${location === '/series' ? 'text-white' : 'text-gray-300'} border-b border-gray-700`} onClick={closeMenu}>
              Series
            </Link>
            <Link href="/movies" className="block py-3 px-4 text-gray-300 border-b border-gray-700" onClick={closeMenu}>
              Documentaries
            </Link>
            <Link href="/my-list" className={`block py-3 px-4 ${location === '/my-list' ? 'text-white' : 'text-gray-300'} border-b border-gray-700`} onClick={closeMenu}>
              My List
            </Link>
            <Link href="/" className="block py-3 px-4 text-gray-300 border-b border-gray-700" onClick={closeMenu}>
              Challenges
            </Link>
            <Link href="/" className="block py-3 px-4 text-gray-300 border-b border-gray-700" onClick={closeMenu}>
              Rewards
            </Link>
            <Link href="/search" className="block py-3 px-4 text-gray-300 border-b border-gray-700" onClick={closeMenu}>
              Search
            </Link>
            <Link href="#" className="block py-3 px-4 text-gray-300 border-b border-gray-700" onClick={closeMenu}>
              Account
            </Link>
            
            {user && (
              <button 
                className="w-full text-left block py-3 px-4 text-primary border-b border-gray-700"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            )}
          </div>
          
          {user && (
            <div className="py-3 px-4 flex items-center border-t border-gray-700">
              <span className="text-accent mr-2"><i className="fas fa-star"></i></span>
              <span className="text-accent font-semibold">{pointsData?.total || 0} points</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
          style={{ top: '72px' }}
        ></div>
      )}
    </>
  );
}
