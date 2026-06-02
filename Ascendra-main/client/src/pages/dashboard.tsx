import React, { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Eye, Armchair, CheckCircle2, Trophy, Flame, Wind, Move, ChevronRight } from "lucide-react";
import { MobileLayout } from "@/components/mobile-layout";
import { CreatureDisplay } from "@/components/creature-display";
import { BottomNav } from "@/components/bottom-nav";
import { useGame } from "@/lib/game-store";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EyeRestModal, PostureCheckModal, BreathingModal, StretchModal } from "@/components/wellness-modals";

export default function Dashboard() {
  const { creature, user, streak, habits, incrementWater, quests, completeQuest } = useGame();
  
  // Modals state
  const [showEyeModal, setShowEyeModal] = useState(false);
  const [showPostureModal, setShowPostureModal] = useState(false);
  const [showBreathModal, setShowBreathModal] = useState(false);
  const [showStretchModal, setShowStretchModal] = useState(false);

  if (!creature) return null; 

  const nextLevelXP = 100 * Math.pow(1.2, creature.level - 1); // Helper to visualize
  
  return (
    <MobileLayout>
      <div className="p-6 space-y-8 pb-32">
        {/* Header */}
        <div className="flex justify-between items-center z-20 relative">
          <div className="bg-white/80 backdrop-blur-md p-2 pl-3 pr-4 rounded-2xl shadow-sm border border-white/50 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                 {user.name[0]}
             </div>
             <div>
                <h2 className="text-sm font-bold text-slate-800 leading-tight">
                {user.name}
                </h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Lvl {creature.level} Explorer
                </p>
             </div>
          </div>
          
          <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 backdrop-blur px-4 py-2 rounded-2xl shadow-sm border border-orange-200">
            <Flame className="text-orange-500 fill-orange-500 animate-pulse" size={20} />
            <span className="font-bold text-orange-800 text-sm">{streak} Day Streak</span>
          </div>
        </div>

        {/* Creature Stage */}
        <div className="relative py-4 min-h-[340px] flex flex-col items-center justify-center">
          <CreatureDisplay />
          
          {/* Level Progress Bar - Fixed Logic */}
          <div className="absolute -bottom-2 w-full max-w-[280px] bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/60 z-20">
            <div className="flex justify-between items-end mb-2">
              <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Level</span>
                  <span className="text-2xl font-display font-bold text-slate-800 leading-none">{creature.level}</span>
              </div>
              <div className="text-right">
                  <span className="text-xs font-bold text-indigo-600">{Math.round(creature.levelProgress)}%</span>
              </div>
            </div>
            
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                 <motion.div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${creature.levelProgress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                 />
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div className="pt-4">
          <Link href="/focus">
            <Button className="w-full text-lg h-16 rounded-3xl shadow-lg shadow-indigo-500/30 bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.02] transition-all duration-300 border-t border-white/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-3xl" />
              <span className="relative z-10 flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <ChevronRight size={20} />
                  </div>
                  Start Focus Session
              </span>
            </Button>
          </Link>
        </div>

        {/* Wellness Habits - Expanded Grid */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-xl px-1 flex items-center gap-2 text-slate-800">
            Wellness Hub
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Water - Special Large Card */}
            <div className="col-span-2">
                 <HabitCardLarge
                    icon={Droplets}
                    title="Hydration"
                    current={habits.water.current}
                    target={habits.water.target}
                    color="bg-blue-500"
                    lightColor="bg-blue-50"
                    textColor="text-blue-600"
                    onClick={incrementWater}
                 />
            </div>

            {/* Other Habits */}
            <HabitCardSmall
              icon={Eye}
              label="Eye Rest"
              color="text-emerald-600"
              bg="bg-emerald-100"
              onClick={() => setShowEyeModal(true)}
            />
            <HabitCardSmall
              icon={Armchair}
              label="Posture"
              color="text-violet-600"
              bg="bg-violet-100"
              onClick={() => setShowPostureModal(true)}
            />
            <HabitCardSmall
              icon={Wind}
              label="Breathe"
              color="text-sky-600"
              bg="bg-sky-100"
              onClick={() => setShowBreathModal(true)}
            />
             <HabitCardSmall
              icon={Move}
              label="Stretch"
              color="text-orange-600"
              bg="bg-orange-100"
              onClick={() => setShowStretchModal(true)}
            />
          </div>
        </div>

        {/* Daily Quests */}
        <div className="space-y-4">
          <h3 className="font-display font-bold text-xl px-1 text-slate-800">Daily Quests</h3>
          <div className="space-y-3">
            {quests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Modals */}
      <EyeRestModal open={showEyeModal} onOpenChange={setShowEyeModal} />
      <PostureCheckModal open={showPostureModal} onOpenChange={setShowPostureModal} />
      <BreathingModal open={showBreathModal} onOpenChange={setShowBreathModal} />
      <StretchModal open={showStretchModal} onOpenChange={setShowStretchModal} />
      
      <BottomNav />
    </MobileLayout>
  );
}

function HabitCardLarge({ icon: Icon, title, current, target, color, lightColor, textColor, onClick }: any) {
    const progress = (current / target) * 100;
    
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "w-full p-4 rounded-3xl border-2 border-transparent shadow-sm hover:shadow-md transition-all relative overflow-hidden flex items-center justify-between",
                lightColor
            )}
        >
            <div className="absolute inset-0 bg-white/50" />
            <div 
                className={cn("absolute left-0 top-0 bottom-0 opacity-20 transition-all duration-500", color)}
                style={{ width: `${progress}%` }}
            />
            
            <div className="relative z-10 flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl shadow-sm text-white", color)}>
                    <Icon size={24} className="fill-white/20" />
                </div>
                <div className="text-left">
                    <h4 className={cn("font-bold text-lg leading-none", textColor)}>{title}</h4>
                    <p className="text-xs font-bold opacity-60 mt-1">{current} / {target} glasses</p>
                </div>
            </div>

            <div className="relative z-10">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white", textColor, progress >= 100 ? "border-green-500 text-green-500" : "border-transparent")}>
                    {progress >= 100 ? <CheckCircle2 size={20} /> : "+"}
                </div>
            </div>
        </motion.button>
    )
}

function HabitCardSmall({ icon: Icon, label, color, bg, onClick }: any) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all gap-3 h-32 relative overflow-hidden group"
    >
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity", bg)} />
      <div className={cn("p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300", bg, color)}>
         <Icon size={26} />
      </div>
      <span className="text-sm font-bold text-slate-700">{label}</span>
    </motion.button>
  );
}

function QuestCard({ quest }: { quest: any }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "relative overflow-hidden rounded-2xl border transition-all duration-300 group",
                quest.completed 
                    ? "bg-slate-50 border-slate-200" 
                    : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100"
            )}
        >
            {/* Left Color Bar */}
            <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1.5",
                quest.type === 'focus' ? "bg-indigo-500" : 
                quest.type === 'wellness' ? "bg-emerald-500" : 
                quest.type === 'team' ? "bg-purple-500" : "bg-orange-500"
            )} />

            <div className="p-4 pl-6 flex items-center justify-between">
                <div>
                    <h4 className={cn("font-bold text-sm", quest.completed && "text-slate-500 line-through")}>{quest.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{quest.desc}</p>
                </div>
                
                <div className="flex items-center gap-3">
                    {!quest.completed && (
                        <div className="text-[10px] font-bold px-2 py-1 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
                            +{quest.xpReward} XP
                        </div>
                    )}
                    <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors",
                        quest.completed ? "bg-green-500 border-green-500 text-white" : "border-slate-200 text-transparent"
                    )}>
                        <CheckCircle2 size={14} />
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
