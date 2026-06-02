import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, format } from "date-fns";

// Types
export type CreatureType = "emberling" | "leafpuff" | "aquamini";
export type EvolutionStage = "baby" | "mid" | "guardian";

export interface User {
  id: string;
  name: string;
  starter: CreatureType | null;
  joinedAt: Date;
}

export interface Creature {
  type: CreatureType;
  stage: EvolutionStage;
  xp: number;
  level: number;
  levelProgress: number; // 0-100 for current level
}

export interface Habits {
  water: { current: number; target: number }; 
  eyes: { lastCompleted: string | null; count: number };
  posture: { lastChecked: string | null; count: number };
  breathing: { lastCompleted: string | null; count: number }; // New habit
  stretch: { lastCompleted: string | null; count: number }; // New habit
}

export interface Teammate {
  id: string;
  name: string;
  avatar: string; // simple color/initial
  status: "offline" | "focusing" | "online";
  focusTimeToday: number; 
  lastActive: string;
}

export interface Team {
  code: string;
  name: string;
  streak: number;
  members: Teammate[];
  createdBy: string; // user id
}

export interface Quest {
  id: string;
  title: string;
  desc: string;
  completed: boolean;
  xpReward: number;
  type: "focus" | "wellness" | "team" | "challenge";
}

export interface DailyStats {
  date: string;
  focusMinutes: number;
  wellnessScore: number;
  xpEarned: number;
}

export interface GameState {
  user: User;
  creature: Creature | null;
  streak: number;
  lastLogin: Date;
  habits: Habits;
  quests: Quest[];
  wellnessScore: number;
  team: Team | null;
  history: DailyStats[];
}

// XP System Constants
const XP_PER_LEVEL_BASE = 100;
const XP_SCALING_FACTOR = 1.2; // Each level needs 20% more XP

// Initial State
const INITIAL_STATE: GameState = {
  user: { id: "user-" + Math.random().toString(36).substr(2, 9), name: "Explorer", starter: null, joinedAt: new Date() },
  creature: null,
  streak: 0,
  lastLogin: new Date(),
  habits: { 
    water: { current: 0, target: 8 }, 
    eyes: { lastCompleted: null, count: 0 },
    posture: { lastChecked: null, count: 0 },
    breathing: { lastCompleted: null, count: 0 },
    stretch: { lastCompleted: null, count: 0 }
  },
  quests: [], // Will be generated
  wellnessScore: 85,
  team: null,
  history: []
};

// Generate Daily Quests
const generateQuests = (): Quest[] => [
  { id: "q1", title: "Deep Focus", desc: "Complete a 25m focus session", completed: false, xpReward: 150, type: "focus" },
  { id: "q2", title: "Hydration Hero", desc: "Drink 4 glasses of water", completed: false, xpReward: 80, type: "wellness" },
  { id: "q3", title: "Eye Guardian", desc: "Perform eye rest 2 times", completed: false, xpReward: 60, type: "wellness" },
  { id: "q4", title: "Squad Goals", desc: "Check in with your team", completed: false, xpReward: 40, type: "team" },
  { id: "q5", title: "Zen Master", desc: "Complete a breathing exercise", completed: false, xpReward: 100, type: "challenge" },
];

interface GameContextType extends GameState {
  selectStarter: (type: CreatureType) => void;
  addXP: (amount: number) => void;
  incrementWater: () => void;
  completeEyeRest: () => void;
  completePostureCheck: () => void;
  completeBreathing: () => void;
  completeStretch: () => void;
  completeQuest: (id: string) => void;
  incrementStreak: () => void;
  createTeam: (name: string) => void;
  joinTeam: (code: string) => void;
  simulateTeamActivity: () => void;
  recordDailyStats: (minutes: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  // Use a simulated "network" delay for team actions to feel real
  const [isSyncing, setIsSyncing] = useState(false);

  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem("ascendra-state-v3"); // Version 3
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        parsed.user.joinedAt = new Date(parsed.user.joinedAt);
        parsed.lastLogin = new Date(parsed.lastLogin);
        return parsed;
      } catch (e) {
        return { ...INITIAL_STATE, quests: generateQuests() };
      }
    }
    return { ...INITIAL_STATE, quests: generateQuests() };
  });

  useEffect(() => {
    localStorage.setItem("ascendra-state-v3", JSON.stringify(state));
  }, [state]);

  // Check for daily reset on load
  useEffect(() => {
    if (!isSameDay(new Date(), new Date(state.lastLogin))) {
       setState(prev => ({
           ...prev,
           lastLogin: new Date(),
           habits: {
               water: { current: 0, target: 8 },
               eyes: { lastCompleted: null, count: 0 },
               posture: { lastChecked: null, count: 0 },
               breathing: { lastCompleted: null, count: 0 },
               stretch: { lastCompleted: null, count: 0 }
           },
           quests: generateQuests() // New quests for new day
       }));
    }
  }, []);

  const selectStarter = (type: CreatureType) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, starter: type },
      creature: { type, stage: "baby", xp: 0, level: 1, levelProgress: 0 },
    }));
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#FFD700', '#FFA500', '#FF4500'] });
  };

  const getXPForNextLevel = (level: number) => {
      return Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_SCALING_FACTOR, level - 1));
  };

  const addXP = (amount: number) => {
    setState((prev) => {
      if (!prev.creature) return prev;
      
      let currentXP = prev.creature.xp + amount;
      let currentLevel = prev.creature.level;
      let xpNeeded = getXPForNextLevel(currentLevel);
      
      // Level Up Logic
      while (currentXP >= xpNeeded) {
          currentXP -= xpNeeded;
          currentLevel++;
          xpNeeded = getXPForNextLevel(currentLevel);
          confetti({ particleCount: 100, spread: 60, colors: ['#00FF00', '#0000FF'] });
          // Could add a toast here via a callback or effect
      }

      // Evolution Logic based on Level
      let newStage = prev.creature.stage;
      if (prev.creature.stage === "baby" && currentLevel >= 5) newStage = "mid";
      else if (prev.creature.stage === "mid" && currentLevel >= 15) newStage = "guardian";

      if (newStage !== prev.creature.stage) {
           // Evolution Celebration
           confetti({ particleCount: 300, spread: 120, startVelocity: 45 });
      }

      // Calculate progress percentage for current level
      const levelProgress = (currentXP / xpNeeded) * 100;

      // Update Daily Stats for XP
      const today = format(new Date(), 'yyyy-MM-dd');
      const historyIndex = prev.history.findIndex(h => h.date === today);
      let newHistory = [...prev.history];
      
      if (historyIndex >= 0) {
          newHistory[historyIndex].xpEarned += amount;
      } else {
          newHistory.push({ date: today, focusMinutes: 0, wellnessScore: prev.wellnessScore, xpEarned: amount });
      }

      return {
        ...prev,
        creature: { ...prev.creature, xp: currentXP, stage: newStage, level: currentLevel, levelProgress },
        history: newHistory
      };
    });
  };

  const incrementWater = () => {
    setState(prev => {
        const newCount = Math.min(prev.habits.water.current + 1, prev.habits.water.target);
        if (newCount === 4) completeQuest("q2");
        return {
            ...prev,
            habits: { ...prev.habits, water: { ...prev.habits.water, current: newCount } }
        };
    });
    addXP(15);
  };

  const completeEyeRest = () => {
      setState(prev => {
        const newCount = prev.habits.eyes.count + 1;
        if (newCount === 2) completeQuest("q3");
        return {
            ...prev,
            habits: { ...prev.habits, eyes: { lastCompleted: new Date().toISOString(), count: newCount } }
        };
      });
      addXP(30);
  };

  const completePostureCheck = () => {
       setState(prev => ({
          ...prev,
          habits: { ...prev.habits, posture: { lastChecked: new Date().toISOString(), count: prev.habits.posture.count + 1 } }
      }));
      addXP(20);
  };

  const completeBreathing = () => {
       setState(prev => {
           completeQuest("q5");
           return {
                ...prev,
                habits: { ...prev.habits, breathing: { lastCompleted: new Date().toISOString(), count: prev.habits.breathing.count + 1 } }
           };
       });
      addXP(50);
  };
  
  const completeStretch = () => {
       setState(prev => ({
          ...prev,
          habits: { ...prev.habits, stretch: { lastCompleted: new Date().toISOString(), count: prev.habits.stretch.count + 1 } }
      }));
      addXP(40);
  };

  const completeQuest = (id: string) => {
    setState((prev) => {
      const quest = prev.quests.find((q) => q.id === id);
      if (quest && !quest.completed) {
        addXP(quest.xpReward);
        return {
          ...prev,
          quests: prev.quests.map((q) =>
            q.id === id ? { ...q, completed: true } : q
          ),
        };
      }
      return prev;
    });
  };

  const incrementStreak = () => {
    setState((prev) => ({ ...prev, streak: prev.streak + 1 }));
    completeQuest("q1"); 
  };

  const createTeam = (name: string) => {
      const newTeam: Team = {
          code: Math.random().toString(36).substring(2, 8).toUpperCase(),
          name,
          streak: 1,
          members: [
              { id: state.user.id, name: state.user.name, avatar: "ME", status: "online", focusTimeToday: 0, lastActive: new Date().toISOString() }
          ],
          createdBy: state.user.id
      };
      setState(prev => ({ ...prev, team: newTeam }));
  };

  // Improved Join Team - actually works with any code for demo, but persists structure
  const joinTeam = (code: string) => {
      // In a real app, this would fetch from DB. Here we simulate finding a team or creating a mock one if it doesn't exist in local state
      const mockTeam: Team = {
          code,
          name: "Global Squad " + code,
          streak: 5,
          members: [
              { id: "u1", name: "Alex", avatar: "A", status: "focusing", focusTimeToday: 30, lastActive: new Date().toISOString() },
              { id: "u2", name: "Sam", avatar: "S", status: "offline", focusTimeToday: 15, lastActive: new Date().toISOString() },
              { id: state.user.id, name: state.user.name, avatar: "ME", status: "online", focusTimeToday: 0, lastActive: new Date().toISOString() }
          ],
          createdBy: "u1"
      };
      
      setState(prev => ({ ...prev, team: mockTeam }));
      completeQuest("q4");
  };

  // Simulate teammates doing things
  const simulateTeamActivity = () => {
      if (!state.team) return;
      
      setState(prev => {
          if (!prev.team) return prev;
          
          // Don't modify the current user, only "others"
          const updatedMembers = prev.team.members.map(m => {
              if (m.id === prev.user.id) return m;
              
              // Randomly update status/time
              const random = Math.random();
              let newStatus = m.status;
              let newTime = m.focusTimeToday;
              
              if (random > 0.8) {
                  newStatus = Math.random() > 0.4 ? "focusing" : "online";
                  if (newStatus === "focusing") newTime += 5;
              } else if (random < 0.1) {
                  newStatus = "offline";
              }

              return { 
                  ...m, 
                  focusTimeToday: newTime,
                  status: newStatus
              } as Teammate;
          });
          
          return { ...prev, team: { ...prev.team, members: updatedMembers } };
      });
  };

  const recordDailyStats = (minutes: number) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      setState(prev => {
          const historyIndex = prev.history.findIndex(h => h.date === today);
          let newHistory = [...prev.history];
          
          if (historyIndex >= 0) {
              newHistory[historyIndex].focusMinutes += minutes;
          } else {
              newHistory.push({ date: today, focusMinutes: minutes, wellnessScore: prev.wellnessScore, xpEarned: 0 });
          }
          
          return { ...prev, history: newHistory };
      });
  };

  return (
    <GameContext.Provider
      value={{
        ...state,
        selectStarter,
        addXP,
        incrementWater,
        completeEyeRest,
        completePostureCheck,
        completeBreathing,
        completeStretch,
        completeQuest,
        incrementStreak,
        createTeam,
        joinTeam,
        simulateTeamActivity,
        recordDailyStats
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
