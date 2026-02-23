import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, ArrowRight } from "lucide-react";
import type { Question } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface QuizSectionProps {
  questions: Question[];
  onComplete: () => void;
  isAlreadyCompleted: boolean;
}

export function QuizSection({ questions, onComplete, isAlreadyCompleted }: QuizSectionProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  // Initialize with correct answers if already completed globally
  useEffect(() => {
    if (isAlreadyCompleted) {
      const allCorrect: Record<number, number> = {};
      const allSubmitted: Record<number, boolean> = {};
      questions.forEach((q) => {
        allCorrect[q.id] = q.correctOptionIndex;
        allSubmitted[q.id] = true;
      });
      setAnswers(allCorrect);
      setSubmitted(allSubmitted);
    }
  }, [isAlreadyCompleted, questions]);

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (submitted[questionId]) return; // Don't allow changing after submit
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = (questionId: number) => {
    if (answers[questionId] === undefined) return;
    
    setSubmitted(prev => ({ ...prev, [questionId]: true }));
    
    // Check if ALL questions are now correctly answered
    const question = questions.find(q => q.id === questionId);
    const isCorrect = answers[questionId] === question?.correctOptionIndex;
    
    if (isCorrect) {
      const allCorrectNow = questions.every(q => {
        if (q.id === questionId) return true; // Just answered this one correctly
        return submitted[q.id] && answers[q.id] === q.correctOptionIndex;
      });
      
      if (allCorrectNow && !isAlreadyCompleted) {
        onComplete();
      }
    }
  };

  const handleRetry = (questionId: number) => {
    setSubmitted(prev => ({ ...prev, [questionId]: false }));
    const newAnswers = { ...answers };
    delete newAnswers[questionId];
    setAnswers(newAnswers);
  };

  if (!questions || questions.length === 0) return null;

  return (
    <div className="mt-16 pt-12 border-t border-border">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <AlertCircle className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Perguntas de Assimilacao</h2>
      </div>

      <div className="space-y-8">
        {questions.map((question, qIndex) => {
          const isSubmitted = submitted[question.id];
          const selectedOption = answers[question.id];
          const isCorrect = selectedOption === question.correctOptionIndex;

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.1 }}
            >
              <Card className={`p-6 md:p-8 overflow-hidden relative border-2 transition-colors duration-300 ${
                isSubmitted && isCorrect ? 'border-green-500/30 bg-green-500/5' : 
                isSubmitted && !isCorrect ? 'border-destructive/30 bg-destructive/5' : 
                'border-border hover:border-primary/20'
              }`}>
                
                {/* Background glow effect for success */}
                {isSubmitted && isCorrect && (
                  <div className="absolute top-0 right-0 -mt-16 -mr-16 h-32 w-32 rounded-full bg-green-500/10 blur-3xl" />
                )}

                <h3 className="text-lg font-medium leading-relaxed mb-6">
                  <span className="text-muted-foreground mr-2">{qIndex + 1}.</span>
                  {question.questionText}
                </h3>

                <div className="space-y-3">
                  {question.options.map((option, oIndex) => {
                    const isSelected = selectedOption === oIndex;
                    let optionStyle = "border-border hover:border-primary/30 hover:bg-muted/50";
                    
                    if (isSubmitted) {
                      if (oIndex === question.correctOptionIndex) {
                        optionStyle = "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400 font-medium";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "border-destructive/50 bg-destructive/10 text-destructive font-medium";
                      } else {
                        optionStyle = "border-border/50 opacity-50";
                      }
                    } else if (isSelected) {
                      optionStyle = "border-primary bg-primary/5 ring-1 ring-primary/20";
                    }

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleSelect(question.id, oIndex)}
                        disabled={isSubmitted}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${optionStyle} ${!isSubmitted && 'hover:-translate-y-0.5 active:translate-y-0'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                            isSubmitted && oIndex === question.correctOptionIndex ? "bg-green-500 border-green-500 text-white" :
                            isSubmitted && isSelected && !isCorrect ? "bg-destructive border-destructive text-white" :
                            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                          }`}>
                            {isSubmitted && oIndex === question.correctOptionIndex ? <CheckCircle2 className="h-4 w-4" /> :
                             isSubmitted && isSelected && !isCorrect ? <XCircle className="h-4 w-4" /> :
                             <span className="text-xs">{String.fromCharCode(65 + oIndex)}</span>}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                      className="overflow-hidden"
                    >
                      <div className={`p-5 rounded-xl border ${
                        isCorrect ? "bg-green-500/10 border-green-500/20 text-green-800 dark:text-green-300" : 
                        "bg-destructive/10 border-destructive/20 text-destructive"
                      }`}>
                        <div className="flex gap-3">
                          <div className="mt-0.5">
                            {isCorrect ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-semibold mb-1">
                              {isCorrect ? "Correto!" : "Nao esta correto."}
                            </p>
                            <p className="text-sm opacity-90 leading-relaxed">
                              {question.explanation}
                            </p>
                            
                            {!isCorrect && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleRetry(question.id)}
                                className="mt-4 hover-elevate bg-background"
                              >
                                Tentar Novamente
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isSubmitted && (
                  <div className="mt-6 flex justify-end">
                    <Button 
                      onClick={() => handleSubmit(question.id)}
                      disabled={selectedOption === undefined}
                      className="hover-elevate px-8"
                    >
                      Verificar Resposta
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
