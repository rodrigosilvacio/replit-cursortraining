import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, ArrowLeft, Star, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Completion() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Fire confetti on load
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8b5cf6', '#3b82f6', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8b5cf6', '#3b82f6', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 blur-xl duration-3000" />
            <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-purple-600 shadow-2xl shadow-primary/30 border border-white/10">
              <Trophy className="h-16 w-16 text-white" />
            </div>
            
            {/* Decorative floating icons */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-4 -left-4 bg-background p-2 rounded-full shadow-lg border border-border">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute -bottom-4 -right-4 bg-background p-2 rounded-xl shadow-lg border border-border">
              <Code2 className="h-6 w-6 text-blue-500" />
            </motion.div>
          </div>
        </div>

        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Course Completed!
        </h1>
        
        <p className="mx-auto mb-10 max-w-xl text-xl text-muted-foreground leading-relaxed">
          Incredible work! You've mastered all the modules and completed the interactive assimilation checks. You are now ready to build amazing things with Cursor.
        </p>

        <Button 
          size="lg" 
          onClick={() => setLocation("/")}
          className="hover-elevate h-14 px-8 text-lg font-semibold rounded-full"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Curriculum
        </Button>
      </motion.div>
    </div>
  );
}
