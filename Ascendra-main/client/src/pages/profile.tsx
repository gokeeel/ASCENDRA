import React, { useState } from "react";
import { MobileLayout } from "@/components/mobile-layout";
import { BottomNav } from "@/components/bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, Shield, Smartphone, LogOut, Bell, Moon, Lock } from "lucide-react";
import { useGame } from "@/lib/game-store";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user } = useGame();
  const { toast } = useToast();
  
  // Mock States
  const [socialLimit, setSocialLimit] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
      toast({ title: "Settings Saved", description: "Your preferences have been updated." });
  }

  return (
    <MobileLayout>
      <div className="p-6 space-y-8 pb-32">
        <h2 className="text-3xl font-display font-bold text-slate-800">Profile & Settings</h2>

        {/* Profile Card */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                 {user.name[0]}
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
                <p className="text-sm text-slate-500">Explorer • Joined {new Date(user.joinedAt).toLocaleDateString()}</p>
                <Button variant="link" className="p-0 h-auto text-indigo-600 font-bold text-xs mt-1">
                    Edit Profile
                </Button>
            </div>
        </div>

        {/* Digital Detox Section */}
        <div className="space-y-4">
             <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Smartphone className="text-rose-500" size={20} />
                Digital Detox
             </h3>
             <Card className="border-0 shadow-lg shadow-rose-100/50 overflow-hidden">
                <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-4 text-white">
                    <div className="flex justify-between items-center">
                        <span className="font-bold">App Blocker</span>
                        <Switch 
                            checked={socialLimit} 
                            onCheckedChange={setSocialLimit}
                            className="data-[state=checked]:bg-white data-[state=unchecked]:bg-rose-700"
                        />
                    </div>
                    <p className="text-rose-100 text-xs mt-1">Block distractions during focus sessions.</p>
                </div>
                <CardContent className="p-4 space-y-4">
                    {socialLimit && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                <span className="font-medium text-slate-700">Instagram</span>
                                <span className="text-xs font-bold text-rose-500">BLOCKED</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                <span className="font-medium text-slate-700">TikTok</span>
                                <span className="text-xs font-bold text-rose-500">BLOCKED</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                <span className="font-medium text-slate-700">Twitter / X</span>
                                <span className="text-xs font-bold text-rose-500">BLOCKED</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full text-xs border-dashed">
                                + Add App to Blocklist
                            </Button>
                        </div>
                    )}
                </CardContent>
             </Card>
        </div>

        {/* Account Settings */}
        <div className="space-y-4">
             <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Settings className="text-slate-500" size={20} />
                Account Settings
             </h3>
             
             <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                 <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Bell size={18} /></div>
                        <span className="font-medium text-slate-700">Notifications</span>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                 </div>
                 
                 <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600"><Moon size={18} /></div>
                        <span className="font-medium text-slate-700">Dark Mode</span>
                    </div>
                    <Switch />
                 </div>

                  <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600"><Shield size={18} /></div>
                        <div>
                            <span className="font-medium text-slate-700 block">Sync Devices</span>
                            <span className="text-xs text-slate-400">Log in to sync progress</span>
                        </div>
                    </div>
                    <Button size="sm" variant="outline">Login</Button>
                 </div>
             </div>
        </div>
        
        <Button variant="ghost" className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50">
            <LogOut size={18} className="mr-2" /> Sign Out
        </Button>
      </div>
      <BottomNav />
    </MobileLayout>
  );
}
