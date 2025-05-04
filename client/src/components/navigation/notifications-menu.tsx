import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "challenge" | "achievement" | "system";
  isRead: boolean;
  timestamp: Date;
}

export function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Welcome to DocuStream!",
      message: "Explore our latest content and earn points by watching documentaries.",
      type: "info",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
    },
    {
      id: 2,
      title: "New Avengers Content Added",
      message: "Check out the complete Avengers movie collection now available!",
      type: "info",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
    },
    {
      id: 3,
      title: "Challenge Available",
      message: "Complete the Avengers Marathon Challenge to earn exclusive badges and points!",
      type: "challenge",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
    }
  ]);
  const menuRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
    toast({
      title: "All notifications marked as read",
      description: "Your notification inbox is now cleared."
    });
  };
  
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  // Format the relative time (e.g., "2 hours ago")
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  };
  
  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "info":
        return "fas fa-info-circle text-secondary";
      case "challenge":
        return "fas fa-trophy text-accent";
      case "achievement":
        return "fas fa-medal text-primary";
      case "system":
        return "fas fa-bell text-muted-foreground";
      default:
        return "fas fa-circle text-muted-foreground";
    }
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
    <div className="relative" ref={menuRef}>
      <button 
        className="text-gray-300 hover:text-accent transition bg-background/40 p-2 rounded-full"
        onClick={toggleMenu}
        aria-label="Notifications"
      >
        <i className="fas fa-bell text-xl"></i>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-white/50">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="text-xs text-primary hover:text-primary/80 transition"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <i className="fas fa-check-circle text-2xl mb-2"></i>
                <p className="text-sm">You're all caught up!</p>
                <p className="text-xs">No new notifications.</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b border-border ${notification.isRead ? 'opacity-70' : 'bg-muted/10'}`}
                >
                  <div className="flex">
                    <div className="mr-3 mt-1">
                      <i className={getNotificationIcon(notification.type)}></i>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <div className="flex space-x-2 ml-2">
                          {!notification.isRead && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-secondary hover:text-secondary/80"
                              aria-label="Mark as read"
                            >
                              <i className="fas fa-check"></i>
                            </button>
                          )}
                          <button 
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-muted-foreground hover:text-primary"
                            aria-label="Delete notification"
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs mb-1">{notification.message}</p>
                      <span className="text-xs text-muted-foreground">{getRelativeTime(notification.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-2 border-t border-border">
            <Link href="/notifications" className="block text-center text-xs text-secondary p-2 hover:underline">
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}