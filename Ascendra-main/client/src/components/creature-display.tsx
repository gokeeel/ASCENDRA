import React from "react";
import { motion } from "framer-motion";
import { useGame } from "@/lib/game-store";
import { cn } from "@/lib/utils";

// Import assets - Updated to 3D Style
import emberlingBaby from "@assets/generated_images/realistic_3d_fire_creature.png";
import leafpuffBaby from "@assets/generated_images/realistic_3d_plant_creature.png";
import aquaminiBaby from "@assets/generated_images/realistic_3d_water_creature.png";

// Placeholder for evolutions (reusing baby for now but logic supports unique images)
const creatureImages = {
  emberling: { baby: emberlingBaby, mid: emberlingBaby, guardian: emberlingBaby }, 
  leafpuff: { baby: leafpuffBaby, mid: leafpuffBaby, guardian: leafpuffBaby },
  aquamini: { baby: aquaminiBaby, mid: aquaminiBaby, guardian: aquaminiBaby },
};

export function CreatureDisplay({ isFocusing = false }: { isFocusing?: boolean }) {
  const { creature } = useGame();

  if (!creature) return null;

  const imageSrc = creatureImages[creature.type][creature.stage];

  return (
    <div className="relative w-full aspect-square max-w-[340px] mx-auto flex items-center justify-center perspective-1000">
      
      {/* Focus Mode Aura */}
      {isFocusing && (
        <>
            <motion.div
            className="absolute inset-0 bg-primary/20 rounded-full blur-[60px]"
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
             <motion.div
            className="absolute inset-10 bg-white/30 rounded-full blur-[40px] mix-blend-overlay"
            animate={{ scale: [0.9, 1.2, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
        </>
      )}

      {/* Creature Animation - 3D Hover Effect */}
      <motion.div
        className="relative z-10 w-full h-full flex items-center justify-center"
        animate={
          isFocusing
            ? {
                y: [0, -20, 0],
                scale: [1, 1.05, 1],
              }
            : {
                y: [0, -15, 0],
              }
        }
        transition={{
          duration: isFocusing ? 2 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
          <img
            src={imageSrc}
            alt="Your Companion"
            className={cn(
                "w-[85%] h-[85%] object-contain drop-shadow-2xl filter transition-all duration-500",
                isFocusing ? "brightness-110 contrast-110" : "brightness-100"
            )}
            style={{
                filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.25))"
            }}
        />
      </motion.div>

      {/* Ground Shadow */}
      <motion.div
        className="absolute bottom-10 w-1/2 h-6 bg-black/20 rounded-[100%] blur-md"
        animate={{ scale: [1, 0.8, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: isFocusing ? 2 : 4, repeat: Infinity }}
      />
    </div>
  );
}
