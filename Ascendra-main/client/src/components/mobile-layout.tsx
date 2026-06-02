import React from "react";
import worldBg from "@assets/generated_images/realistic_3d_landscape_background.png";

export function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center overflow-hidden font-sans">
      <div className="w-full max-w-md bg-background min-h-screen shadow-2xl relative flex flex-col">
        {/* Background Layer with Parallax-like effect */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-50">
             <div 
                className="absolute inset-0 opacity-100 transition-all duration-1000"
                style={{
                    backgroundImage: `url(${worldBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(0px)' // Keep it sharp for realism
                }}
            />
            {/* Overlay Gradient for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white/95" />
        </div>
        
        {/* Content Layer */}
        <div className="relative z-10 flex-1 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar">
             {children}
        </div>
      </div>
    </div>
  );
}
