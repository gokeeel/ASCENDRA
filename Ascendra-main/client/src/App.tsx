import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { GameProvider, useGame } from "@/lib/game-store";
import { useEffect } from "react";

// Pages
import Onboarding from "@/pages/onboarding";
import Dashboard from "@/pages/dashboard";
import ProfilePage from "@/pages/profile";
import FocusPage from "@/pages/focus";
import TeamPage from "@/pages/team";
import SummaryPage from "@/pages/summary";

function Router() {
  const { user } = useGame();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Simple protection: if no starter selected, go to onboarding
    if (!user.starter && location !== "/onboarding") {
      setLocation("/onboarding");
    }
  }, [user.starter, location, setLocation]);

  return (
    <Switch>
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/focus" component={FocusPage} />
      <Route path="/team" component={TeamPage} />
      <Route path="/summary" component={SummaryPage} />
      <Route path="/profile" component={ProfilePage} />
      
      {/* Default route */}
      <Route path="/">
        {user.starter ? <Dashboard /> : <Onboarding />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
          <Toaster />
          <Router />
        </GameProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
