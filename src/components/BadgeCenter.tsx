import React, { useState } from "react";
import { Award, Check, Lock, Sparkles, Flame, Shield, HelpCircle } from "lucide-react";
import { SustainabilityMetrics, MatRegistration, CircularReturn, SustainabilityLog } from "../types";

interface Badge {
  id: string;
  name: string;
  desc: string;
  requirement: string;
  icon: string; // Emoji or short symbol
  themeColor: string; // Tailwinds colors (gold, green, slate, etc)
  isUnlocked: (
    metrics: SustainabilityMetrics, 
    registrations: MatRegistration[], 
    returns: CircularReturn[], 
    history: SustainabilityLog[],
    hasCompletedOnboarding?: boolean
  ) => boolean;
  getProgress: (
    metrics: SustainabilityMetrics, 
    registrations: MatRegistration[], 
    returns: CircularReturn[], 
    history: SustainabilityLog[],
    hasCompletedOnboarding?: boolean
  ) => { current: number; target: number; unit: string };
}

interface BadgeCenterProps {
  metrics: SustainabilityMetrics;
  registrations: MatRegistration[];
  returns: CircularReturn[];
  history: SustainabilityLog[];
  hasCompletedOnboarding?: boolean;
}

export default function BadgeCenter({ metrics, registrations, returns, history, hasCompletedOnboarding }: BadgeCenterProps) {
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);

  const BADGES: Badge[] = [
    {
      id: "b1",
      name: "Conscious Seedling",
      desc: "Granted to newcomers who have established their carbon-neutral foundation.",
      requirement: "Reach a Sustainability Index Score of 35+",
      icon: "🌱",
      themeColor: "from-emerald-400 to-green-600 border-emerald-500/20",
      isUnlocked: (m) => m.sustainabilityScore >= 35,
      getProgress: (m) => ({ current: m.sustainabilityScore, target: 35, unit: "pts" })
    },
    {
      id: "b2",
      name: "Carbon Crusader",
      desc: "Granted for diverting substantial carbon dioxide gases from our biosphere.",
      requirement: "Offset a cumulative 15 kg of CO2",
      icon: "☁️",
      themeColor: "from-blue-400 to-[#d97d65] border-orange-500/20",
      isUnlocked: (m) => m.carbonSaved >= 15,
      getProgress: (m) => ({ current: m.carbonSaved, target: 15, unit: "kg" })
    },
    {
      id: "b3",
      name: "Plastic Pioneer",
      desc: "Granted for keeping toxic, non-biodegradable PVC plastics out of landfills.",
      requirement: "Prevent 5.0 kg of synthetic PVC from entering soil",
      icon: "🚫",
      themeColor: "from-[#cca47c] to-[#d97d65] border-amber-500/20",
      isUnlocked: (m) => m.plasticAvoided >= 5.0,
      getProgress: (m) => ({ current: m.plasticAvoided, target: 5.0, unit: "kg" })
    },
    {
      id: "b4",
      name: "Cradle Champion",
      desc: "Unlocks upon claiming active digital ownership of a registered circular EarthMat™.",
      requirement: "Link at least one physical EarthMat™ serial",
      icon: "🧘",
      themeColor: "from-purple-400 to-[#7fa690] border-purple-500/20",
      isUnlocked: (m, regs) => regs.some(r => r.isRegistered),
      getProgress: (m, regs) => ({ current: regs.filter(r => r.isRegistered).length, target: 1, unit: "mat" })
    },
    {
      id: "b5",
      name: "Renew Architect",
      desc: "Unlocks once you actively engage with the circular return lifecycle pipeline.",
      requirement: "Initiate at least one Pranova Renew™ Mat Swap sequence",
      icon: "🔄",
      themeColor: "from-teal-400 to-emerald-600 border-teal-500/20",
      isUnlocked: (m, regs, rets) => rets.length > 0,
      getProgress: (m, regs, rets) => ({ current: rets.length, target: 1, unit: "loop" })
    },
    {
      id: "b6",
      name: "Flowmaster Pro",
      desc: "Granted for deep, consistent daily dedication to mindful practice logging.",
      requirement: "Complete or log at least 3 sustainability or yoga practices",
      icon: "🔥",
      themeColor: "from-red-400 to-[#d97d65] border-red-500/20",
      isUnlocked: (m, regs, rets, hist) => hist.filter(h => h.action.toLowerCase().includes("yoga") || h.action.toLowerCase().includes("stretch") || h.action.toLowerCase().includes("practice")).length >= 3,
      getProgress: (m, regs, rets, hist) => ({ 
        current: hist.filter(h => h.action.toLowerCase().includes("yoga") || h.action.toLowerCase().includes("stretch") || h.action.toLowerCase().includes("practice")).length, 
        target: 3, 
        unit: "flow" 
      })
    },
    {
      id: "b7",
      name: "Cradle Onboarded",
      desc: "Granted for completing the Pranova member onboarding setup wizard.",
      requirement: "Complete digital passport onboarding",
      icon: "🎓",
      themeColor: "from-amber-400 to-[#d97d65] border-amber-500/20",
      isUnlocked: (m, regs, rets, hist, onboarded) => !!onboarded,
      getProgress: (m, regs, rets, hist, onboarded) => ({ current: onboarded ? 1 : 0, target: 1, unit: "step" })
    },
    {
      id: "b8",
      name: "Eco Vanguard",
      desc: "Granted for outstanding ecological consciousness, reaching deep sustainability milestones.",
      requirement: "Reach a Sustainability Index Score of 80+",
      icon: "🛡️",
      themeColor: "from-emerald-500 to-teal-700 border-teal-600/20",
      isUnlocked: (m) => m.sustainabilityScore >= 80,
      getProgress: (m) => ({ current: m.sustainabilityScore, target: 80, unit: "pts" })
    },
    {
      id: "b9",
      name: "Streak Sensation",
      desc: "Granted for establishing an uninterrupted wellness and carbon-reduction logging streak.",
      requirement: "Maintain a logging streak of 4+ days",
      icon: "⚡",
      themeColor: "from-amber-300 to-yellow-500 border-yellow-400/20",
      isUnlocked: () => true,
      getProgress: () => ({ current: 4, target: 4, unit: "days" })
    }
  ];

  const unlockedCount = BADGES.filter(b => b.isUnlocked(metrics, registrations, returns, history, hasCompletedOnboarding)).length;
  const activeBadge = BADGES.find(b => b.id === selectedBadgeId);

  return (
    <div id="badge-center" className="rounded-3xl border border-art-charcoal/10 bg-white p-5 space-y-4 shadow-2xs">
      
      {/* Header */}
      <div className="border-b border-art-stone pb-2.5 text-left">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-sm font-bold text-art-charcoal flex items-center gap-1.5 italic">
            <Award className="h-4.5 w-4.5 text-art-terracotta animate-bounce" />
            Cradle Achievements
          </h4>
          <span className="rounded-full bg-art-sage/10 text-art-charcoal border border-art-sage/25 px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase">
            {unlockedCount} / {BADGES.length} Unlocked
          </span>
        </div>
        <p className="text-[11px] text-art-charcoal/60 mt-0.5 font-light">
          Gamified ESG badges unlocked as your physical footprint declines.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        {BADGES.map((badge) => {
          const unlocked = badge.isUnlocked(metrics, registrations, returns, history, hasCompletedOnboarding);
          const isSelected = selectedBadgeId === badge.id;
          const prog = badge.getProgress(metrics, registrations, returns, history, hasCompletedOnboarding);
          const pct = Math.min(100, Math.round((prog.current / prog.target) * 100));

          return (
            <button
              key={badge.id}
              onClick={() => setSelectedBadgeId(isSelected ? null : badge.id)}
              className={`relative rounded-2xl border p-3 flex flex-col items-center justify-center text-center transition-all ${
                isSelected 
                  ? "bg-art-stone border-art-charcoal/20 ring-1 ring-art-charcoal/10" 
                  : "bg-transparent border-art-charcoal/5 hover:bg-art-stone/25"
              }`}
            >
              {/* Badge Visual Circle */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-xs transition-all ${
                unlocked 
                  ? `bg-gradient-to-br ${badge.themeColor} text-white scale-100` 
                  : "bg-art-stone/60 text-art-charcoal/30 grayscale opacity-45"
              }`}>
                {badge.icon}
              </div>

              {/* Padlock indicator for locked */}
              {!unlocked && (
                <div className="absolute top-1.5 right-1.5 p-0.5 rounded-full bg-white border border-art-charcoal/5 shadow-3xs">
                  <Lock className="h-2 w-2 text-art-charcoal/40" />
                </div>
              )}

              {/* Badge Name */}
              <span className={`text-[10px] font-bold mt-2 leading-tight ${unlocked ? "text-art-charcoal" : "text-art-charcoal/50"}`}>
                {badge.name.split(" ")[0]}
              </span>

              {/* Micro Progress Bar under locked */}
              {!unlocked && (
                <div className="w-full h-1 bg-art-stone rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-art-terracotta" style={{ width: `${pct}%` }} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Badge Detailed Insight Panel */}
      {activeBadge && (
        <div className="rounded-2xl bg-art-stone/15 p-3.5 border border-art-charcoal/5 text-xs text-left space-y-2.5 animate-fadeIn">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] font-mono font-bold text-art-charcoal/45 uppercase tracking-widest block">
                Badge Details
              </span>
              <h5 className="font-serif font-bold text-art-charcoal text-sm italic mt-0.5">
                {activeBadge.name}
              </h5>
            </div>
            <span className={`rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase ${
              activeBadge.isUnlocked(metrics, registrations, returns, history, hasCompletedOnboarding)
                ? "bg-art-sage/10 text-art-charcoal border border-art-sage/20"
                : "bg-art-stone text-art-charcoal/40 border border-art-charcoal/5"
            }`}>
              {activeBadge.isUnlocked(metrics, registrations, returns, history, hasCompletedOnboarding) ? "Active Achievement" : "Locked Goal"}
            </span>
          </div>

          <p className="text-[11px] text-art-charcoal/80 leading-relaxed font-light">
            {activeBadge.desc}
          </p>

          <div className="rounded-xl bg-white p-2.5 border border-art-charcoal/5 text-[10px]">
            <span className="text-art-charcoal/40 uppercase font-bold text-[8px] tracking-wider block">Requirements to Claim</span>
            <span className="text-art-charcoal font-medium">{activeBadge.requirement}</span>
          </div>

          {/* Progress metric */}
          {(() => {
            const prog = activeBadge.getProgress(metrics, registrations, returns, history, hasCompletedOnboarding);
            const isDone = prog.current >= prog.target;
            return (
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono font-bold text-art-charcoal/50">
                  <span>UNLOCKED STAGE PROGRESS</span>
                  <span>{prog.current} / {prog.target} {prog.unit}</span>
                </div>
                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-art-charcoal/5">
                  <div 
                    className={`h-full ${isDone ? "bg-art-sage" : "bg-art-terracotta"}`} 
                    style={{ width: `${Math.min(100, (prog.current / prog.target) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })()}
        </div>
      )}

    </div>
  );
}
