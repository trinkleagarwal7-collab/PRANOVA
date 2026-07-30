import React from "react";
import { Leaf, Cpu, Award, User, Sparkles } from "lucide-react";

interface HeaderProps {
  activeTab: "brand" | "dashboard";
  setActiveTab: (tab: "brand" | "dashboard") => void;
  userPoints: number;
  userName: string;
}

export default function Header({ activeTab, setActiveTab, userPoints, userName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-art-charcoal/10 bg-art-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => setActiveTab("brand")} 
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-art-charcoal/20 bg-art-charcoal text-art-bg shadow-sm">
            <Leaf className="h-5 w-5 text-art-cork" />
          </div>
          <div className="text-left">
            <h1 className="font-serif text-xl font-bold tracking-tight text-art-charcoal italic">
              PRANOVA<span className="text-art-terracotta text-xs font-semibold align-super">™</span>
            </h1>
            <p className="text-[10px] font-bold tracking-[0.2em] text-art-sage uppercase">
              Nature × Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Tabs - Fully Rounded Artistic Pills */}
        <nav className="flex space-x-1 rounded-full bg-art-stone/60 p-1 border border-art-charcoal/10">
          <button
            id="nav-brand-portal"
            onClick={() => setActiveTab("brand")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest font-bold transition-all duration-300 ${
              activeTab === "brand"
                ? "bg-art-charcoal text-art-bg shadow-md"
                : "text-art-charcoal/75 hover:text-art-charcoal hover:bg-art-stone/50"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Product</span> Showroom
          </button>
          <button
            id="nav-user-dashboard"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest font-bold transition-all duration-300 ${
              activeTab === "dashboard"
                ? "bg-art-charcoal text-art-bg shadow-md"
                : "text-art-charcoal/75 hover:text-art-charcoal hover:bg-art-stone/50"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-art-terracotta animate-pulse" />
            <span>AI+ Dashboard</span>
          </button>
        </nav>

        {/* User Mini Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 rounded-full border border-art-charcoal/10 bg-art-stone/40 px-3 py-1.5 text-xs text-art-charcoal/80">
            <span className="h-1.5 w-1.5 rounded-full bg-art-sage animate-ping" />
            <span className="font-bold tracking-wider uppercase text-[9px]">Passport Linked</span>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-art-charcoal/15 bg-art-stone/30 p-1.5 pr-3 shadow-2xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-art-charcoal text-art-bg">
              <User className="h-4 w-4 text-art-cork" />
            </div>
            <div className="hidden lg:block text-left leading-tight">
              <div className="text-xs font-bold text-art-charcoal">{userName}</div>
              <div className="text-[9px] uppercase tracking-wider font-bold text-art-charcoal/60">Premium</div>
            </div>
            <div className="ml-1 flex items-center gap-1 rounded-full bg-art-terracotta/15 px-2.5 py-1 text-xs font-bold text-art-charcoal border border-art-terracotta/20">
              <Award className="h-3.5 w-3.5 text-art-terracotta" />
              <span>{userPoints} pts</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
