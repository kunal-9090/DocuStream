import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Search Results",
      description: `Showing results for "${searchQuery}"`,
    });
    // In a real implementation, you would call an API to search the help articles
  };
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Your message has been sent to our support team. We'll get back to you soon!",
    });
    // In a real implementation, you would send this data to an API
  };
  
  return (
    <div className="container mx-auto px-4 pt-24 pb-12">
      <div className="max-w-5xl mx-auto main-content-container">
        <h1 className="text-3xl font-bold mb-8 text-primary avengers-glow">Help Center</h1>
        
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-center mb-6">How can we help you today?</h2>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search for help articles..." 
                className="pr-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
              >
                Search
              </Button>
            </div>
          </form>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-muted/30 hover:bg-muted/50 rounded-lg p-4 text-center cursor-pointer transition-colors">
              <i className="fas fa-laptop text-3xl text-primary mb-2"></i>
              <h3 className="font-medium">Account</h3>
            </div>
            <div className="bg-muted/30 hover:bg-muted/50 rounded-lg p-4 text-center cursor-pointer transition-colors">
              <i className="fas fa-credit-card text-3xl text-primary mb-2"></i>
              <h3 className="font-medium">Billing</h3>
            </div>
            <div className="bg-muted/30 hover:bg-muted/50 rounded-lg p-4 text-center cursor-pointer transition-colors">
              <i className="fas fa-film text-3xl text-primary mb-2"></i>
              <h3 className="font-medium">Content</h3>
            </div>
            <div className="bg-muted/30 hover:bg-muted/50 rounded-lg p-4 text-center cursor-pointer transition-colors">
              <i className="fas fa-trophy text-3xl text-primary mb-2"></i>
              <h3 className="font-medium">Rewards</h3>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="faq">
          <TabsList className="mb-6">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is DocuStream?</AccordionTrigger>
                  <AccordionContent>
                    DocuStream is a premium streaming platform that specializes in documentary content, including biographical documentaries on influential Indian personalities, educational series, and exclusive podcasts featuring renowned individuals from various fields.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I earn points on DocuStream?</AccordionTrigger>
                  <AccordionContent>
                    You can earn points by watching content (the longer the content, the more points you earn), completing challenges, participating in quizzes, and inviting friends to join DocuStream. Points can be redeemed for exclusive content, merchandise, and other rewards.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger>What are badges and how do I earn them?</AccordionTrigger>
                  <AccordionContent>
                    Badges are achievements you can earn by completing specific actions on DocuStream. Examples include watching a certain number of documentaries in a specific category, completing challenges, or reaching milestones in your viewing history. Badges can be displayed on your profile and some earn you bonus points.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I add content to My List?</AccordionTrigger>
                  <AccordionContent>
                    To add content to your list, simply hover over a title and click the "+" icon, or visit a movie/series page and click the "Add to My List" button. You can view and manage your list by navigating to the "My List" section from the main navigation menu.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger>How can I track my progress on series?</AccordionTrigger>
                  <AccordionContent>
                    DocuStream automatically tracks your viewing progress on all content. You can see what you've been watching in the "Continue Watching" section on the home page. For series, we track your progress both by episode and across the entire series.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger>What is the Avengers section?</AccordionTrigger>
                  <AccordionContent>
                    The Avengers section features movies from the Marvel Cinematic Universe, focusing on the Avengers team. This section includes all four Avengers movies and related content. We've also created special Avengers-themed challenges and badges for fans to earn!
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
          
          <TabsContent value="guides" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Helpful Guides</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/30 h-40 flex items-center justify-center">
                    <i className="fas fa-user-circle text-5xl text-primary"></i>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">Getting Started with DocuStream</h3>
                    <p className="text-sm text-muted-foreground mb-4">Learn how to set up your account, create profiles, and navigate the DocuStream interface.</p>
                    <Button variant="outline" size="sm">Read Guide</Button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/30 h-40 flex items-center justify-center">
                    <i className="fas fa-list text-5xl text-primary"></i>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">Managing Your Watchlist</h3>
                    <p className="text-sm text-muted-foreground mb-4">Everything you need to know about creating, organizing, and managing your personal watchlist.</p>
                    <Button variant="outline" size="sm">Read Guide</Button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/30 h-40 flex items-center justify-center">
                    <i className="fas fa-trophy text-5xl text-primary"></i>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">Points and Rewards System</h3>
                    <p className="text-sm text-muted-foreground mb-4">A complete guide to earning, tracking, and redeeming points in our gamified streaming experience.</p>
                    <Button variant="outline" size="sm">Read Guide</Button>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-muted/30 h-40 flex items-center justify-center">
                    <i className="fas fa-cog text-5xl text-primary"></i>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">Account Settings and Preferences</h3>
                    <p className="text-sm text-muted-foreground mb-4">Learn how to customize your account settings, update payment info, and manage notifications.</p>
                    <Button variant="outline" size="sm">Read Guide</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="contact">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Contact Our Support Team</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input placeholder="Your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <Input type="email" placeholder="Your email address" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject</label>
                      <Input placeholder="What's this about?" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Message</label>
                      <textarea 
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm min-h-[120px]"
                        placeholder="Tell us how we can help"
                      ></textarea>
                    </div>
                    
                    <Button type="submit">Send Message</Button>
                  </form>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Other Ways to Contact Us</h3>
                    <p className="text-muted-foreground mb-4">We're here to help! Choose the option that works best for you.</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="bg-primary/10 rounded-full p-2 mr-3 text-primary">
                          <i className="fas fa-envelope"></i>
                        </div>
                        <div>
                          <h4 className="font-medium">Email Support</h4>
                          <p className="text-sm text-muted-foreground">support@docustream.example</p>
                          <p className="text-xs">Response within 24 hours</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-primary/10 rounded-full p-2 mr-3 text-primary">
                          <i className="fas fa-comment"></i>
                        </div>
                        <div>
                          <h4 className="font-medium">Live Chat</h4>
                          <p className="text-sm text-muted-foreground">Available 9AM-6PM IST</p>
                          <Button variant="outline" size="sm" className="mt-1">Start Chat</Button>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="bg-primary/10 rounded-full p-2 mr-3 text-primary">
                          <i className="fas fa-phone"></i>
                        </div>
                        <div>
                          <h4 className="font-medium">Phone Support</h4>
                          <p className="text-sm text-muted-foreground">+91 123-456-7890</p>
                          <p className="text-xs">Available for Premium members</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Help Center Hours</h3>
                    <p className="text-sm">Monday - Friday: 9:00 AM - 9:00 PM IST</p>
                    <p className="text-sm">Saturday: 10:00 AM - 6:00 PM IST</p>
                    <p className="text-sm">Sunday: 12:00 PM - 5:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}