import React, { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { BottomNav } from "@/components/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, UserPlus, Shield, Copy, LogIn, Crown, Sparkles, MessageCircle, Zap } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGame } from "@/lib/game-store";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function TeamPage() {
  const { team, createTeam, joinTeam, simulateTeamActivity, user } = useGame();
  const [teamCode, setTeamCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [view, setView] = useState<"menu" | "join" | "create">("menu");
  const { toast } = useToast();

  // Simulate activity when viewing the page
  React.useEffect(() => {
    const interval = setInterval(() => {
        simulateTeamActivity();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = () => {
      if (!teamName) return;
      createTeam(teamName);
      toast({ title: "Squad Created!", description: "Share your code with friends." });
  };

  const handleJoin = () => {
      if (teamCode.length < 3) return; // Allow short codes for demo
      joinTeam(teamCode);
      toast({ title: "Joined Squad!", description: "Welcome to the team." });
  };

  const copyCode = () => {
      if (team?.code) {
        navigator.clipboard.writeText(team.code);
        toast({ title: "Code Copied" });
      }
  };

  return (
    <MobileLayout>
      <div className="p-6 space-y-6 pb-32">
        <h2 className="text-3xl font-display font-bold text-slate-800">Your Squad</h2>

        {!team ? (
          <div className="space-y-6 py-4">
            <AnimatePresence mode="wait">
            {view === "menu" && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="grid gap-4"
                >
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 mb-4">
                        <div className="flex justify-center mb-4">
                            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                                <Sparkles size={32} className="text-amber-300" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-center mb-2">Better Together</h3>
                        <p className="text-center text-indigo-100 text-sm leading-relaxed opacity-90">
                            Join friends to boost motivation. Teams focusing together earn 2x bonus XP on weekends!
                        </p>
                    </div>

                    <Card 
                        className="cursor-pointer hover:border-indigo-200 transition-all border-2 border-dashed bg-slate-50/50 group"
                        onClick={() => setView("join")}
                    >
                        <CardContent className="flex items-center p-6 gap-6">
                            <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                                <LogIn size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Join a Squad</h3>
                                <p className="text-sm text-slate-400">Enter a code from a friend</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card 
                        className="cursor-pointer hover:border-purple-200 transition-all border-2 border-dashed bg-slate-50/50 group"
                        onClick={() => setView("create")}
                    >
                         <CardContent className="flex items-center p-6 gap-6">
                            <div className="bg-purple-100 p-4 rounded-2xl text-purple-600 group-hover:scale-110 transition-transform">
                                <UserPlus size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800">Create Squad</h3>
                                <p className="text-sm text-slate-400">Start a new group</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {view === "join" && (
                <motion.div 
                    initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                    className="space-y-6"
                >
                    <Button variant="ghost" onClick={() => setView("menu")} className="pl-0 hover:bg-transparent text-slate-400">← Back</Button>
                    <div className="text-center space-y-4 py-8">
                        <h3 className="font-bold text-2xl text-slate-800">Enter Code</h3>
                        <Input 
                            value={teamCode}
                            onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                            placeholder="XYZ123"
                            className="text-center text-3xl tracking-[0.5em] uppercase h-20 font-mono font-bold rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-0"
                            maxLength={8}
                        />
                         <p className="text-sm text-slate-400">Ask your friend for their unique squad code</p>
                    </div>
                    <Button onClick={handleJoin} className="w-full h-14 text-lg font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200" disabled={teamCode.length < 3}>
                        Join Squad
                    </Button>
                </motion.div>
            )}

            {view === "create" && (
                <motion.div 
                    initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                    className="space-y-6"
                >
                     <Button variant="ghost" onClick={() => setView("menu")} className="pl-0 hover:bg-transparent text-slate-400">← Back</Button>
                    <div className="space-y-4 py-8">
                        <h3 className="font-bold text-2xl text-slate-800">Name Your Squad</h3>
                        <Input 
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="e.g. The Focus Fighters"
                            className="h-16 text-lg px-6 rounded-2xl border-2 border-slate-200 focus:border-purple-500"
                        />
                    </div>
                    <Button onClick={handleCreate} className="w-full h-14 text-lg font-bold rounded-2xl bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200" disabled={!teamName}>
                        Create Squad
                    </Button>
                </motion.div>
            )}
            </AnimatePresence>
          </div>
        ) : (
          <div className="space-y-6">
             {/* Team Header Card */}
             <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl -ml-5 -mb-5" />
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Crown size={16} className="text-amber-300 fill-amber-300" />
                                <span className="text-xs font-bold uppercase tracking-wider opacity-70">Squad</span>
                            </div>
                            <h3 className="font-display font-bold text-3xl leading-none">{team.name}</h3>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                             <div className="text-xs font-bold font-mono">{team.code}</div>
                             <button onClick={copyCode} className="hover:text-white/80"><Copy size={12} /></button>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                        <div className="flex -space-x-3">
                            {team.members.slice(0, 4).map((m, i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#5a4fcf] bg-indigo-300 flex items-center justify-center text-xs font-bold shadow-sm">
                                    {m.name[0]}
                                </div>
                            ))}
                            {team.members.length > 4 && (
                                <div className="w-10 h-10 rounded-full border-2 border-[#5a4fcf] bg-white/20 backdrop-blur flex items-center justify-center text-xs font-bold">
                                    +{team.members.length - 4}
                                </div>
                            )}
                        </div>
                        <div className="text-right">
                             <div className="text-3xl font-bold font-display">{team.streak}</div>
                             <div className="text-[10px] font-bold uppercase opacity-60">Day Streak</div>
                        </div>
                    </div>
                </div>
             </div>

             {/* Live Activity Feed */}
             <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="font-bold text-lg text-slate-800">Live Status</h3>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full animate-pulse">
                        {team.members.filter(m => m.status === 'focusing').length} Focusing
                    </span>
                </div>

                <div className="space-y-3">
                {team.members.map((member) => (
                    <motion.div 
                        layout
                        key={member.id} 
                        className={cn(
                            "flex items-center justify-between p-4 rounded-2xl border transition-all shadow-sm",
                            member.status === 'focusing' 
                                ? "bg-white border-indigo-100 shadow-indigo-100/50" 
                                : "bg-white border-slate-100 opacity-80"
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Avatar className="h-12 w-12 border-2 border-white shadow-sm bg-slate-100">
                                    <AvatarFallback className={cn("font-bold text-slate-600", member.id === user.id && "bg-indigo-100 text-indigo-600")}>
                                        {member.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                
                                {/* Status Indicator */}
                                <div className={cn(
                                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                                    member.status === 'focusing' ? "bg-purple-500" : 
                                    member.status === 'online' ? "bg-green-500" : "bg-slate-300"
                                )} />
                            </div>
                            
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-slate-800">{member.name}</p>
                                    {member.id === user.id && <span className="text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">YOU</span>}
                                </div>
                                <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                    {member.status === 'focusing' ? (
                                        <span className="text-purple-600 font-bold flex items-center gap-1">
                                            <Zap size={10} className="fill-current" /> Focusing now...
                                        </span>
                                    ) : member.status === 'online' ? "Online" : "Away"}
                                </p>
                            </div>
                        </div>

                        <div className="text-right">
                             <div className="font-bold text-lg text-slate-800">{member.focusTimeToday}m</div>
                             <div className="text-[10px] uppercase text-slate-400 font-bold">Today</div>
                        </div>
                    </motion.div>
                ))}
                </div>
             </div>
             
             {/* Chat Teaser (Visual Only) */}
             <Button variant="outline" className="w-full h-12 rounded-xl gap-2 text-slate-500 border-dashed border-2">
                <MessageCircle size={18} />
                Squad Chat (Coming Soon)
             </Button>
          </div>
        )}
      </div>
      <BottomNav />
    </MobileLayout>
  );
}
