import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/layout/AppSidebar";
import Home from "@/pages/Home";
import ModulePage from "@/pages/ModulePage";
import Completion from "@/pages/Completion";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/module/:slug" component={ModulePage} />
      <Route path="/complete" component={Completion} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <div className="flex h-screen w-full overflow-hidden bg-background">
            <AppSidebar />
            
            <div className="flex flex-1 flex-col overflow-hidden relative">
              {/* Header with Sidebar Toggle for mobile/collapsed state */}
              <header className="absolute top-0 z-50 flex h-14 items-center gap-4 bg-background/80 px-4 backdrop-blur-md border-b border-border/50 w-full lg:sticky">
                <SidebarTrigger className="hover-elevate" />
                <div className="flex-1" />
                {/* Optional Theme Toggle could go here */}
              </header>

              {/* Main Scrollable Content Area */}
              <main className="flex-1 overflow-y-auto scroll-smooth">
                <Router />
              </main>
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
