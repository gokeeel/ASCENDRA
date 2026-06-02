import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useGame, CreatureType } from "@/lib/game-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Import assets
import emberlingBaby from "@assets/generated_images/realistic_3d_fire_creature.png";
import leafpuffBaby from "@assets/generated_images/realistic_3d_plant_creature.png";
import aquaminiBaby from "@assets/generated_images/realistic_3d_water_creature.png";

const STARTERS = [
  {
    id: "emberling",
    name: "Emberling",
    type: "Fire",
    desc: "A spirited spark that fuels your passion.",
    color: "bg-orange-50 border-orange-200 text-orange-800",
    img: emberlingBaby,
  },
  {
    id: "leafpuff",
    name: "Leafpuff",
    type: "Nature",
    desc: "A calm sprout that grows with your patience.",
    color: "bg-green-50 border-green-200 text-green-800",
    img: leafpuffBaby,
  },
  {
    id: "aquamini",
    name: "Aquamini",
    type: "Water",
    desc: "A fluid friend that adapts to your flow.",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    img: aquaminiBaby,
  },
];

export default function Onboarding() {
  const { selectStarter, user } = useGame();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user.starter) {
      setLocation("/dashboard");
    }
  }, [user.starter, setLocation]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 mb-10"
      >
        <h1 className="text-5xl font-display font-bold text-primary tracking-tight">ASCENDRA</h1>
        <p className="text-muted-foreground text-lg font-medium max-w-[280px] mx-auto">
          Choose your 3D companion to begin your wellness journey.
        </p>
      </motion.div>

      <div className="grid gap-6 w-full">
        {STARTERS.map((starter, index) => (
          <motion.div
            key={starter.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <div
              className={`relative overflow-hidden group cursor-pointer rounded-3xl border-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${starter.color} bg-white`}
              onClick={() => selectStarter(starter.id as CreatureType)}
            >
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-current opacity-5 rounded-full blur-3xl" />
              
              <div className="p-5 flex items-center gap-5 relative z-10">
                <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden shadow-md bg-white">
                  <img
                    src={starter.img}
                    alt={starter.name}
                    className="w-full h-full object-cover scale-110"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold mb-1">{starter.name}</h3>
                    <div className="bg-white/50 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider opacity-70">
                        {starter.type}
                    </div>
                  </div>
                  <p className="text-sm leading-snug opacity-90 font-medium mt-1">
                    {starter.desc}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { useEffect } from "react";
