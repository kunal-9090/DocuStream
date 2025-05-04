import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import MoviePage from "@/pages/movie-page";
import MoviesPage from "@/pages/movies-page";
import SeriesPage from "@/pages/series-page";
import SearchPage from "@/pages/search-page";
import MyListPage from "@/pages/my-list-page";
import AccountPage from "@/pages/account-page";
import AchievementsPage from "@/pages/achievements-page";
import HelpCenterPage from "@/pages/help-center-page";
import ChallengesPage from "@/pages/challenges-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/movies" component={MoviesPage} />
      <ProtectedRoute path="/series" component={SeriesPage} />
      <ProtectedRoute path="/movie/:id" component={MoviePage} />
      <ProtectedRoute path="/search" component={SearchPage} />
      <ProtectedRoute path="/my-list" component={MyListPage} />
      <ProtectedRoute path="/account" component={AccountPage} />
      <ProtectedRoute path="/achievements" component={AchievementsPage} />
      <ProtectedRoute path="/help-center" component={HelpCenterPage} />
      <ProtectedRoute path="/challenges" component={ChallengesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
