import React from "react";
import { Link, useLocation } from "wouter";
import { Home, Users, BarChart2, Zap, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Home" },
    { href: "/focus", icon: Zap, label: "Focus" },
    { href: "/team", icon: Users, label: "Squad" },
    { href: "/summary", icon: BarChart2, label: "Stats" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 p-2 pb-6 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300",
                  isActive
                    ? "text-indigo-600 scale-105 bg-indigo-50"
                    : "text-slate-400 hover:text-indigo-500 hover:bg-slate-50"
                )}
              >
                <item.icon
                  size={24}
                  className={cn(isActive ? "fill-current" : "stroke-[2px]")}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className={cn("text-[10px] font-bold transition-opacity", isActive ? "opacity-100" : "opacity-0 hidden")}>
                    {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
