import React from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { CreatureDisplay } from "@/components/creature-display";
import { FocusTimer } from "@/components/focus-timer";
import { BottomNav } from "@/components/bottom-nav";
import { useLocation } from "wouter";

export default function FocusPage() {
  const [, setLocation] = useLocation();

  return (
    <MobileLayout>
      <div className="flex flex-col h-full min-h-[80vh]">
        <div className="flex-1 flex flex-col justify-center items-center py-6">
          <div className="mb-8 scale-110">
            <CreatureDisplay isFocusing={true} />
          </div>
          
          <div className="w-full bg-white/80 backdrop-blur-xl rounded-t-[3rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] flex-1 pt-8 pb-20 px-6 border-t border-white/50">
             <h2 className="text-center text-2xl font-bold font-display text-primary mb-2">Focus Mode</h2>
             <p className="text-center text-muted-foreground text-sm mb-6">Your creature grows while you focus.</p>
             <FocusTimer onComplete={() => {}} />
          </div>
        </div>
      </div>
      <BottomNav />
    </MobileLayout>
  );
}
