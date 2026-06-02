import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Square, Zap, Droplets, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useGame } from "@/lib/game-store";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export function FocusTimer({ onComplete }: { onComplete: () => void }) {
  const [duration, setDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(false);
  const [showReminder, setShowReminder] = useState(false); // Post-focus reminder state
  
  const { addXP, incrementStreak, recordDailyStats, incrementWater, completeStretch } = useGame();
  const { toast } = useToast();

  useEffect(() => {
    if (!isActive) {
        setTimeLeft(duration * 60);
    }
  }, [duration, isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    const xpEarned = Math.round(duration * 4); // Boosted XP
    addXP(xpEarned);
    incrementStreak();
    recordDailyStats(duration); // Save to history
    
    confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });
    
    // Show Reminder Dialog instead of just closing
    setShowReminder(true);
    
    onComplete();
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div className="flex flex-col items-center gap-8 py-4 w-full max-w-xs mx-auto">
      {/* Post-Focus Reminder Dialog */}
      <Dialog open={showReminder} onOpenChange={setShowReminder}>
          <DialogContent className="bg-white rounded-3xl border-0 shadow-2xl">
              <DialogHeader>
                  <DialogTitle className="text-center text-2xl font-bold font-display text-slate-800">
                      Great Focus! 🎉
                  </DialogTitle>
              </DialogHeader>
              <div className="py-6 text-center space-y-6">
                  <p className="text-slate-500">
                      Before you continue, take a moment to recharge.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex flex-col gap-2 border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 text-blue-600"
                        onClick={() => { incrementWater(); setShowReminder(false); toast({ title: "Hydrated! +15 XP" }); }}
                      >
                          <Droplets size={32} />
                          <span className="font-bold">Drink Water</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex flex-col gap-2 border-2 border-orange-100 hover:border-orange-500 hover:bg-orange-50 text-orange-600"
                        onClick={() => { completeStretch(); setShowReminder(false); toast({ title: "Stretched! +40 XP" }); }}
                      >
                          <Move size={32} />
                          <span className="font-bold">Quick Stretch</span>
                      </Button>
                  </div>
              </div>
              <DialogFooter>
                   <Button onClick={() => setShowReminder(false)} variant="ghost" className="w-full text-slate-400">
                       Skip for now
                   </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

      {/* Timer Circle */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Glow behind */}
        {isActive && (
             <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full animate-pulse" />
        )}
        
        <svg className="w-full h-full transform -rotate-90 relative z-10">
          <circle
            cx="144"
            cy="144"
            r="130"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100"
          />
          {/* Progress Circle */}
          <circle
            cx="144"
            cy="144"
            r="130"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 130}
            strokeDashoffset={2 * Math.PI * 130 * (1 - progress / 100)}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Time Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-7xl font-bold font-mono tracking-tighter text-slate-800 drop-shadow-sm">
            {formatTime(timeLeft)}
          </span>
          <span className="text-sm text-indigo-500 uppercase tracking-[0.2em] mt-2 font-bold flex items-center gap-2">
            {isActive ? <><Zap size={14} className="fill-current animate-bounce" /> Focusing</> : "Ready"}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full space-y-8 relative z-20">
        {!isActive && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between text-sm font-bold text-slate-500 px-2">
              <span>Duration</span>
              <span>{duration} min</span>
            </div>
            <Slider
              value={[duration]}
              onValueChange={(val) => setDuration(val[0])}
              min={5}
              max={120}
              step={5}
              className="w-full"
            />
            <div className="grid grid-cols-4 gap-2">
              {[15, 25, 45, 60].map((mins) => (
                <Button
                  key={mins}
                  variant="outline"
                  size="sm"
                  onClick={() => setDuration(mins)}
                  className={`rounded-xl h-10 font-bold border-2 ${duration === mins ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-500'}`}
                >
                  {mins}m
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-6">
          <Button
            size="lg"
            className={`h-20 w-20 rounded-[2rem] shadow-xl hover:scale-105 transition-all duration-300 ${isActive ? 'bg-amber-400 hover:bg-amber-500 shadow-amber-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
            onClick={toggleTimer}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </Button>
          {isActive && (
            <Button
              size="lg"
              variant="destructive"
              className="h-20 w-20 rounded-[2rem] shadow-xl hover:scale-105 transition-transform bg-rose-500 hover:bg-rose-600 shadow-rose-200"
              onClick={resetTimer}
            >
              <Square size={24} fill="currentColor" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
