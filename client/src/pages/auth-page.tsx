import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, loginSchema } from "@shared/schema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Zod schemas for our forms
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string()
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    loginMutation.mutate(values);
  };
  
  const onRegisterSubmit = (values: RegisterFormValues) => {
    // Remove confirmPassword as it's not in the schema
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate(userData);
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Hero Section */}
      <div className="hidden md:flex md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://i.imgur.com/gB0LO2S.jpg')" }}>
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-black/80 to-black/60 p-12">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-primary avengers-glow mb-4">DocuStream</h1>
            <p className="text-xl text-accent mb-6">Watch. Earn. Discover.</p>
            <p className="text-gray-300 mb-8">
              Get access to premium documentaries, biographies of Indian personalities, and the complete Marvel Avengers collection.
              Earn points by watching, and unlock exclusive rewards and badges.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center text-white">
                <i className="fas fa-film text-primary mr-3"></i>
                <span>Premium documentary collection</span>
              </div>
              <div className="flex items-center text-white">
                <i className="fas fa-mask text-primary mr-3"></i>
                <span>Complete Avengers series</span>
              </div>
              <div className="flex items-center text-white">
                <i className="fas fa-medal text-primary mr-3"></i>
                <span>Earn badges and rewards</span>
              </div>
              <div className="flex items-center text-white">
                <i className="fas fa-users text-primary mr-3"></i>
                <span>Indian personalities biographies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="w-full md:w-1/2 bg-background dark-card-gradient flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary avengers-glow">Welcome to DocuStream</h2>
            <p className="text-accent mt-2">Your premium documentary streaming platform</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            {/* Login Form */}
            <TabsContent value="login">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setActiveTab("register")}
                    className="text-primary hover:underline"
                  >
                    Register here
                  </button>
                </p>
              </div>
            </TabsContent>
            
            {/* Register Form */}
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Choose a username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your display name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating account..." : "Register"}
                  </Button>
                </form>
              </Form>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <button 
                    onClick={() => setActiveTab("login")}
                    className="text-primary hover:underline"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8">
            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to DocuStream's{" "}
              <Link href="#" className="text-primary hover:underline">Terms of Use</Link>
              {" "}and{" "}
              <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
