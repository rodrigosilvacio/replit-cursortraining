import { Link, useLocation } from "wouter";
import { CheckCircle2, Lock, BookOpen, GraduationCap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useModules } from "@/hooks/use-modules";
import { useCourseProgress } from "@/lib/progress";

export function AppSidebar() {
  const [location] = useLocation();
  const { data: modules = [], isLoading } = useModules();
  const { isCompleted } = useCourseProgress();

  // Sort modules just in case the backend doesn't, to ensure order is respected
  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  return (
    <Sidebar className="border-r border-border/50 bg-sidebar">
      <SidebarHeader className="p-4 pt-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">Cursor Mastery</h2>
            <p className="text-xs font-medium text-muted-foreground">Interactive Course</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Curriculum
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu>
              {isLoading ? (
                // Skeleton loading state
                Array.from({ length: 5 }).map((_, i) => (
                  <SidebarMenuItem key={i} className="mb-1">
                    <div className="h-10 w-full animate-pulse rounded-lg bg-muted/50" />
                  </SidebarMenuItem>
                ))
              ) : (
                sortedModules.map((module, index) => {
                  const completed = isCompleted(module.id);
                  // Unlocked if it's the first module OR the previous module is completed
                  const isUnlocked = index === 0 || isCompleted(sortedModules[index - 1].id);
                  const isActive = location === `/module/${module.slug}`;

                  return (
                    <SidebarMenuItem key={module.id} className="mb-1">
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        className={`h-auto py-3 px-3 transition-all duration-200 ${
                          !isUnlocked ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      >
                        {isUnlocked ? (
                          <Link href={`/module/${module.slug}`} className="flex items-start gap-3 w-full">
                            <div className="mt-0.5 flex-shrink-0">
                              {completed ? (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                              ) : (
                                <BookOpen className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex flex-col flex-1 overflow-hidden">
                              <span className={`text-sm font-medium leading-tight ${completed ? 'text-foreground' : ''}`}>
                                {module.title}
                              </span>
                              <span className="text-xs text-muted-foreground mt-1">
                                Module {module.order}
                              </span>
                            </div>
                          </Link>
                        ) : (
                          <div className="flex items-start gap-3 w-full">
                            <div className="mt-0.5 flex-shrink-0">
                              <Lock className="h-5 w-5 text-muted-foreground/60" />
                            </div>
                            <div className="flex flex-col flex-1 overflow-hidden">
                              <span className="text-sm font-medium leading-tight text-muted-foreground">
                                {module.title}
                              </span>
                              <span className="text-xs text-muted-foreground mt-1">
                                Locked
                              </span>
                            </div>
                          </div>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
