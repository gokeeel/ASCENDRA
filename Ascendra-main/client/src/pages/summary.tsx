import React, { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { BottomNav } from "@/components/bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip, AreaChart, Area } from "recharts";
import { useGame } from "@/lib/game-store";
import { Activity, Zap, Brain, Trophy, Calendar } from "lucide-react";
import { format, subDays } from "date-fns";

export default function SummaryPage() {
  const { wellnessScore, creature, history, streak } = useGame();
  const [activeTab, setActiveTab] = useState<"focus" | "wellness">("focus");

  // Generate last 7 days data if history is empty
  const chartData = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const historyItem = history.find(h => h.date === dateStr);
      return {
          day: format(date, 'EEE'),
          focus: historyItem?.focusMinutes || Math.floor(Math.random() * 20), // Mock data fill
          xp: historyItem?.xpEarned || Math.floor(Math.random() * 100)
      };
  });

  return (
    <MobileLayout>
      <div className="p-6 space-y-6 pb-24">
        <h2 className="text-3xl font-display font-bold text-slate-800">Weekly Insights</h2>

        {/* Hero Stats */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl p-5 text-white shadow-lg shadow-indigo-200">
                <div className="flex items-center gap-2 opacity-80 mb-2">
                    <Activity size={18} />
                    <span className="text-xs font-bold uppercase">Wellness Score</span>
                </div>
                <div className="text-4xl font-display font-bold">{wellnessScore}</div>
                <div className="text-xs mt-2 opacity-90 flex items-center gap-1 bg-white/10 w-fit px-2 py-1 rounded-lg">
                    <span>+2% this week</span>
                </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
                 <div className="flex items-center gap-2 text-slate-400 mb-2">
                    <Trophy size={18} className="text-amber-500" />
                    <span className="text-xs font-bold uppercase">Total Streak</span>
                </div>
                <div className="text-4xl font-display font-bold text-slate-800">{streak} <span className="text-sm font-sans font-medium text-slate-400">days</span></div>
                 <div className="text-xs mt-2 text-slate-500">
                    Keep it up!
                </div>
            </div>
        </div>

        {/* Interactive Chart Section */}
        <Card className="border-0 shadow-lg shadow-slate-100 rounded-3xl overflow-hidden">
            <div className="p-2 bg-slate-50/50 flex gap-1 rounded-t-3xl border-b border-slate-100">
                <button 
                    onClick={() => setActiveTab("focus")}
                    className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'focus' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                    Focus Time
                </button>
                 <button 
                    onClick={() => setActiveTab("wellness")}
                    className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${activeTab === 'wellness' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-400 hover:bg-slate-100'}`}
                >
                    XP Gained
                </button>
            </div>
            
            <CardContent className="p-6">
                <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {activeTab === 'focus' ? (
                        <BarChart data={chartData}>
                            <defs>
                                <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="day" 
                                stroke="#94a3b8" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                dy={10}
                            />
                            <Tooltip 
                                cursor={{fill: '#f1f5f9', radius: 8}}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                            />
                            <Bar 
                                dataKey="focus" 
                                fill="url(#colorFocus)" 
                                radius={[6, 6, 6, 6]} 
                                barSize={32}
                            />
                        </BarChart>
                    ) : (
                         <AreaChart data={chartData}>
                             <defs>
                                <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                             <XAxis 
                                dataKey="day" 
                                stroke="#94a3b8" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                dy={10}
                            />
                             <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="xp" 
                                stroke="#10b981" 
                                strokeWidth={3}
                                fillOpacity={1} 
                                fill="url(#colorXP)" 
                            />
                         </AreaChart>
                    )}
                </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        {/* Detailed Stats List */}
        <div className="space-y-4">
             <h3 className="font-bold text-lg text-slate-700">Detailed Breakdown</h3>
             
             <StatRow 
                icon={Zap} 
                color="bg-amber-100 text-amber-600" 
                label="Total Focus Sessions" 
                value="12" 
                sub="High productivity week" 
            />
            <StatRow 
                icon={Brain} 
                color="bg-pink-100 text-pink-600" 
                label="Mindfulness Moments" 
                value="5" 
                sub="Breathing & Eye rest" 
            />
            <StatRow 
                icon={Calendar} 
                color="bg-blue-100 text-blue-600" 
                label="Consistency" 
                value="85%" 
                sub="Top 10% of users" 
            />
        </div>
      </div>
      <BottomNav />
    </MobileLayout>
  );
}

function StatRow({ icon: Icon, color, label, value, sub }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800">{label}</h4>
                    <p className="text-xs text-slate-400 font-medium">{sub}</p>
                </div>
            </div>
            <div className="text-xl font-bold text-slate-800">
                {value}
            </div>
        </div>
    )
}
