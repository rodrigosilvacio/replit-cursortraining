import { useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronRight, CheckCircle2, ChevronLeft, GraduationCap } from "lucide-react";
import { useModule, useModules } from "@/hooks/use-modules";
import { useCourseProgress } from "@/lib/progress";
import { MarkdownRenderer } from "@/components/module/MarkdownRenderer";
import { QuizSection } from "@/components/module/QuizSection";
import { Button } from "@/components/ui/button";

export default function ModulePage() {
  const [, params] = useRoute("/module/:slug");
  const [, setLocation] = useLocation();
  const topRef = useRef<HTMLDivElement>(null);
  
  const slug = params?.slug || "";
  const { data: moduleData, isLoading, isError } = useModule(slug);
  const { data: allModules = [] } = useModules();
  const { isCompleted, markCompleted } = useCourseProgress();

  // Scroll to top on module change
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError || !moduleData) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <span className="text-4xl">🤔</span>
        </div>
        <h2 className="text-2xl font-bold">Modulo nao encontrado</h2>
        <p className="max-w-md text-muted-foreground">
          Nao foi possivel encontrar o modulo que voce esta procurando.
        </p>
        <Button onClick={() => setLocation("/")} className="mt-4 hover-elevate">
          Voltar ao Inicio
        </Button>
      </div>
    );
  }

  const sortedModules = [...allModules].sort((a, b) => a.order - b.order);
  const currentIndex = sortedModules.findIndex(m => m.id === moduleData.id);
  const nextModule = currentIndex < sortedModules.length - 1 ? sortedModules[currentIndex + 1] : null;
  const prevModule = currentIndex > 0 ? sortedModules[currentIndex - 1] : null;
  
  // Security check: is user allowed here?
  const isUnlocked = currentIndex === 0 || (prevModule && isCompleted(prevModule.id));
  
  if (!isUnlocked) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted shadow-inner">
          <span className="text-4xl text-muted-foreground">🔒</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-2">Modulo Bloqueado</h2>
          <p className="max-w-md text-muted-foreground text-lg">
            Complete os modulos anteriores para acessar este conteudo.
          </p>
        </div>
        <Button onClick={() => setLocation("/")} size="lg" className="mt-4 hover-elevate">
          Ir para o Modulo Atual
        </Button>
      </div>
    );
  }

  const alreadyCompleted = isCompleted(moduleData.id);

  const handleModuleComplete = () => {
    markCompleted(moduleData.id);
    // Optional: could auto-scroll to next button or show a toast here
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8 lg:py-16" ref={topRef}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header Breadcrumb / Tag */}
        <div className="mb-8 flex items-center gap-2 text-sm font-medium text-primary">
          <GraduationCap className="h-4 w-4" />
          <span>Modulo {moduleData.order}</span>
          {alreadyCompleted && (
            <span className="ml-3 inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-3 w-3" />
              Concluido
            </span>
          )}
        </div>

        {/* Markdown Content */}
        <MarkdownRenderer content={moduleData.content} />

        {/* Interactive Quiz */}
        {moduleData.questions && moduleData.questions.length > 0 && (
          <QuizSection 
            questions={moduleData.questions} 
            onComplete={handleModuleComplete}
            isAlreadyCompleted={alreadyCompleted}
          />
        )}

        {/* Next/Prev Navigation Footer */}
        <div className="mt-20 flex flex-col-reverse justify-between gap-6 border-t border-border pt-8 sm:flex-row sm:items-center">
          {prevModule ? (
            <Button 
              variant="outline" 
              onClick={() => setLocation(`/module/${prevModule.slug}`)}
              className="hover-elevate gap-2 px-6 py-6 text-base h-auto group"
            >
              <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              Modulo Anterior
            </Button>
          ) : (
            <div /> // empty div to maintain flex-between spacing
          )}

          {nextModule ? (
            <Button
              onClick={() => setLocation(`/module/${nextModule.slug}`)}
              disabled={!isCompleted(moduleData.id)}
              className="hover-elevate gap-2 px-8 py-6 text-base font-semibold h-auto group bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              Proximo Modulo
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          ) : (
             <Button
              onClick={() => setLocation("/complete")}
              disabled={!isCompleted(moduleData.id)}
              className="hover-elevate gap-2 px-8 py-6 text-base font-bold h-auto bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50"
            >
              Concluir Curso
              <GraduationCap className="h-5 w-5" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
