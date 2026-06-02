import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Armchair, Wind, Move } from "lucide-react";
import { useGame } from "@/lib/game-store";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

// EYE REST MODAL
export function EyeRestModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [timeLeft, setTimeLeft] = useState(20);
  const [isActive, setIsActive] = useState(false);
  const { completeEyeRest } = useGame();

  useEffect(() => {
    if (open) {
      setTimeLeft(20);
      setIsActive(false);
    }
  }, [open]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      completeEyeRest();
      setTimeout(() => onOpenChange(false), 1500); 
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#0F172A] text-white border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-400 font-display text-xl">
            <Eye className="fill-emerald-400/20" />
            Visual Reset
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-10 gap-8">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Ambient Glow */}
             <div className="absolute inset-0 bg-emerald-500/20 blur-[50px] rounded-full" />

            {/* Breathing Animation */}
            <AnimatePresence>
                <motion.div
                    className="absolute inset-0 border-4 border-emerald-500/50 rounded-full"
                    animate={isActive ? { scale: [1, 1.3, 1], opacity: [0.8, 0.2, 0.8] } : {}}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                 <motion.div
                    className="absolute inset-4 border-2 border-emerald-400/30 rounded-full"
                    animate={isActive ? { scale: [1, 1.1, 1], opacity: [0.5, 0.1, 0.5] } : {}}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                />
            </AnimatePresence>
            
            <div className="z-10 text-6xl font-mono font-bold text-emerald-400 tabular-nums shadow-emerald-500/50 drop-shadow-lg">
              {timeLeft}
            </div>
          </div>

          <p className="text-center text-slate-400 max-w-[80%] text-sm leading-relaxed">
             Focus on a point 20 feet away. Let your eyes soften. Breathe.
          </p>

          <Button 
            onClick={() => setIsActive(!isActive)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white w-full max-w-xs h-12 rounded-xl text-lg font-bold shadow-lg shadow-emerald-900/50 transition-all active:scale-95"
          >
            {isActive ? "Pause Session" : "Start Focus"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// POSTURE CHECK MODAL
export function PostureCheckModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { completePostureCheck } = useGame();
    const [step, setStep] = useState(0);

    const steps = [
        { text: "Sit up straight with your back against the chair.", icon: "🪑" },
        { text: "Keep your feet flat on the floor.", icon: "🦶" },
        { text: "Relax your shoulders down and away from ears.", icon: "😌" },
        { text: "Align your screen with your eye level.", icon: "👀" }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            completePostureCheck();
            onOpenChange(false);
            setTimeout(() => setStep(0), 500);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden p-0">
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white text-center">
                    <DialogTitle className="flex flex-col items-center gap-2 font-display text-2xl">
                        <Armchair size={32} className="opacity-80" />
                        Posture Align
                    </DialogTitle>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-violet-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                        />
                    </div>

                    <div className="h-48 relative flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                                className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
                            >
                                <div className="text-6xl mb-4 drop-shadow-sm">{steps[step].icon}</div>
                                <p className="text-xl font-medium text-slate-800 leading-snug">{steps[step].text}</p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <Button onClick={handleNext} className="w-full bg-violet-600 hover:bg-violet-700 text-white h-14 rounded-2xl text-lg font-bold shadow-lg shadow-violet-200">
                        {step < steps.length - 1 ? "Next Check" : "Complete Check"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// BREATHING EXERCISE MODAL
export function BreathingModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { completeBreathing } = useGame();
    const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
    const [isActive, setIsActive] = useState(false);
    const [cycles, setCycles] = useState(0);

    useEffect(() => {
        if (!isActive) return;

        const breathe = async () => {
            setPhase("inhale");
            await new Promise(r => setTimeout(r, 4000));
            setPhase("hold");
            await new Promise(r => setTimeout(r, 4000));
            setPhase("exhale");
            await new Promise(r => setTimeout(r, 4000));
            setCycles(c => c + 1);
        };

        const interval = setInterval(() => {
            breathe();
        }, 12000); // 4+4+4

        breathe(); // Start immediately

        return () => clearInterval(interval);
    }, [isActive]);

    useEffect(() => {
        if (cycles >= 3) { // Complete after 3 cycles
            setIsActive(false);
            completeBreathing();
            setTimeout(() => {
                onOpenChange(false);
                setCycles(0);
            }, 1000);
        }
    }, [cycles]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-sky-50 border-0 shadow-2xl rounded-3xl overflow-hidden p-0 max-w-sm">
                 <div className="bg-sky-400 p-4 text-white text-center">
                    <DialogTitle className="flex items-center justify-center gap-2 font-display text-xl">
                        <Wind className="opacity-80" />
                        Box Breathing
                    </DialogTitle>
                </div>
                
                <div className="p-8 flex flex-col items-center gap-8 min-h-[400px] justify-center relative overflow-hidden">
                    {/* Background Circles */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <motion.div 
                            className="w-64 h-64 bg-sky-200/30 rounded-full blur-3xl"
                            animate={{ scale: phase === "inhale" ? 1.5 : phase === "exhale" ? 1 : 1.2 }}
                            transition={{ duration: 4, ease: "easeInOut" }}
                         />
                    </div>

                    <div className="relative z-10">
                        <motion.div
                            className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-sky-100"
                            animate={{ 
                                scale: phase === "inhale" ? 1.3 : phase === "exhale" ? 1 : 1.3,
                                borderColor: phase === "hold" ? "rgb(56, 189, 248)" : "rgb(224, 242, 254)"
                            }}
                            transition={{ duration: 4, ease: "easeInOut" }}
                        >
                            <span className="text-sky-600 font-display text-2xl font-bold uppercase tracking-widest">
                                {isActive ? phase : "Ready"}
                            </span>
                        </motion.div>
                    </div>

                    <div className="z-10 w-full text-center">
                        <p className="text-sky-900/60 mb-6 font-medium">
                            {cycles}/3 Cycles Completed
                        </p>
                        {!isActive ? (
                            <Button onClick={() => setIsActive(true)} className="w-full bg-sky-500 hover:bg-sky-600 text-white h-12 rounded-xl font-bold">
                                Start Breathing
                            </Button>
                        ) : (
                             <Button onClick={() => setIsActive(false)} variant="ghost" className="text-sky-500 hover:bg-sky-100">
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// STRETCH MODAL
export function StretchModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { completeStretch } = useGame();
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-orange-50 border-0 shadow-2xl rounded-3xl p-6 max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-orange-600 font-display flex items-center gap-2">
                        <Move /> Quick Stretch
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-4">
                        <div className="text-3xl">🙆</div>
                        <div>
                            <h4 className="font-bold text-orange-900">Overhead Reach</h4>
                            <p className="text-xs text-orange-800/60">Reach high, hold for 10s</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-4">
                        <div className="text-3xl">🤷</div>
                        <div>
                            <h4 className="font-bold text-orange-900">Shoulder Shrugs</h4>
                            <p className="text-xs text-orange-800/60">Up and down 10 times</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-orange-100 flex items-center gap-4">
                        <div className="text-3xl">🦒</div>
                        <div>
                            <h4 className="font-bold text-orange-900">Neck Release</h4>
                            <p className="text-xs text-orange-800/60">Gently tilt head left/right</p>
                        </div>
                    </div>
                </div>

                <Button 
                    onClick={() => { completeStretch(); onOpenChange(false); }} 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 rounded-xl"
                >
                    I Stretched!
                </Button>
            </DialogContent>
        </Dialog>
    );
}
