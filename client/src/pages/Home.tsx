import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useModules } from "@/hooks/use-modules";
import { useCourseProgress } from "@/lib/progress";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: modules, isLoading } = useModules();
  const { isCompleted } = useCourseProgress();

  useEffect(() => {
    if (!isLoading && modules && modules.length > 0) {
      // Sort to ensure order
      const sortedModules = [...modules].sort((a, b) => a.order - b.order);
      
      // Find the first incomplete module
      const firstIncomplete = sortedModules.find(m => !isCompleted(m.id));
      
      if (firstIncomplete) {
        setLocation(`/module/${firstIncomplete.slug}`);
      } else {
        // If all are complete, they can go to the first module or completion page
        setLocation('/complete');
      }
    }
  }, [isLoading, modules, isCompleted, setLocation]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Loader2 className="h-8 w-8 animate-spin" />
          <div className="absolute inset-0 rounded-2xl border-4 border-primary/20 blur-sm" />
        </div>
        <p className="text-lg font-medium text-muted-foreground animate-pulse">
          Carregando o curso...
        </p>
      </div>
    </div>
  );
}
