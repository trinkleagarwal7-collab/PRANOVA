import React, { useState, useEffect } from "react";
import { CheckSquare, Square, Award, Sparkles, Check, Flame, Star, Coffee } from "lucide-react";

interface Quest {
  id: string;
  title: string;
  desc: string;
  rewardPoints: number;
  completed: boolean;
}

interface EverydayQuestsProps {
  points: number;
  onRewardClaimed: (pointsEarned: number, logMessage: string) => void;
  history: any[];
}

export default function EverydayQuests({ points, onRewardClaimed, history }: EverydayQuestsProps) {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: "q1",
      title: "Log Daily Yoga Flow",
      desc: "Complete any custom or quick yoga log in the active dashboard.",
      rewardPoints: 20,
      completed: false,
    },
    {
      id: "q2",
      title: "Box Breathing Focus",
      desc: "Practice box breathing or breathing exercises for at least 5 minutes.",
      rewardPoints: 15,
      completed: false,
    },
    {
      id: "q3",
      title: "AI Wellness Consultation",
      desc: "Interact with Pranova AI Coach using any mindfulness direct prompt.",
      rewardPoints: 15,
      completed: false,
    },
    {
      id: "q4",
      title: "Browse Botanical Boutique",
      desc: "Explore verified cradle-to-cradle materials in the Product Gallery.",
      rewardPoints: 10,
      completed: false,
    }
  ]);

  const [bonusClaimed, setBonusClaimed] = useState<boolean>(false);

  // Automatically check off "Log Daily Yoga Flow" if history has a yoga log from today
  useEffect(() => {
    const hasYogaToday = history.some(item => 
      item.action.toLowerCase().includes("yoga") || 
      item.action.toLowerCase().includes("practice") ||
      item.action.toLowerCase().includes("stretch")
    );

    if (hasYogaToday) {
      setQuests(prev =>
        prev.map(q => q.id === "q1" ? { ...q, completed: true } : q)
      );
    }
  }, [history]);

  const toggleQuest = (questId: string) => {
    setQuests(prev =>
      prev.map(q => {
        if (q.id === questId) {
          const nextCompleted = !q.completed;
          if (nextCompleted) {
            // Award points immediately upon manual check-off!
            onRewardClaimed(
              q.rewardPoints,
              `Completed Daily Mindful Quest: ${q.title} ⭐`
            );
          } else {
            // Deduct points if unchecked to keep it consistent
            onRewardClaimed(
              -q.rewardPoints,
              `Undid Daily Mindful Quest: ${q.title}`
            );
          }
          return { ...q, completed: nextCompleted };
        }
        return q;
      })
    );
  };

  const totalCompleted = quests.filter(q => q.completed).length;
  const isAllCompleted = totalCompleted === quests.length;

  const handleClaimBonus = () => {
    if (!isAllCompleted || bonusClaimed) return;
    onRewardClaimed(50, "Claimed Daily Perfect Alignment Quest Bonus! 🌟");
    setBonusClaimed(true);
  };

  return (
    <div id="everyday-quests" className="rounded-3xl border border-art-charcoal/10 bg-white p-5 space-y-4 shadow-2xs text-left">
      {/* Header */}
      <div className="border-b border-art-stone pb-3 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Flame className="h-4.5 w-4.5 text-art-terracotta animate-pulse" />
            <h4 className="font-serif text-sm font-bold text-art-charcoal italic">Everyday Mindful Quests</h4>
          </div>
          <p className="text-[11px] text-art-charcoal/60 font-light">
            Complete daily habits to stack points & keep alignment motivation high.
          </p>
        </div>
        <span className="rounded-full bg-art-terracotta/10 text-art-charcoal border border-art-terracotta/20 px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase shrink-0">
          {totalCompleted} / {quests.length} Done
        </span>
      </div>

      {/* Quests List */}
      <div className="space-y-2.5">
        {quests.map((q) => (
          <div
            key={q.id}
            onClick={() => toggleQuest(q.id)}
            className={`flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
              q.completed
                ? "bg-art-sage/10 border-art-sage/20 text-art-charcoal/80"
                : "bg-art-stone/10 border-art-charcoal/5 hover:border-art-charcoal/10 hover:bg-art-stone/20"
            }`}
          >
            <button className="mt-0.5 focus:outline-hidden shrink-0">
              {q.completed ? (
                <div className="w-4.5 h-4.5 rounded bg-art-sage flex items-center justify-center text-white">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              ) : (
                <div className="w-4.5 h-4.5 rounded border border-art-charcoal/30 bg-white" />
              )}
            </button>

            <div className="flex-grow space-y-0.5">
              <div className="flex justify-between items-center gap-2">
                <span className={`text-xs font-bold leading-tight ${q.completed ? "line-through text-art-charcoal/50" : "text-art-charcoal"}`}>
                  {q.title}
                </span>
                <span className="text-[9px] font-mono font-bold text-art-terracotta">+{q.rewardPoints} Pts</span>
              </div>
              <p className={`text-[10px] leading-relaxed font-light ${q.completed ? "text-art-charcoal/40" : "text-art-charcoal/75"}`}>
                {q.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bonus Perfect Alignment Card */}
      {isAllCompleted && (
        <div className="rounded-2xl bg-gradient-to-br from-art-sage/20 to-art-cork/20 border border-art-sage/30 p-3.5 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-art-sage animate-spin duration-3000" />
            <h5 className="font-serif font-bold text-sm text-art-charcoal italic">Perfect Alignment bonus!</h5>
          </div>
          <p className="text-[11px] text-art-charcoal/80 leading-relaxed font-light">
            You've successfully check-marked all everyday tasks. Claim your bonus points to redeem for brand store benefits!
          </p>

          {bonusClaimed ? (
            <div className="rounded-full bg-art-sage text-white text-[10px] font-bold uppercase tracking-wider py-2 text-center flex items-center justify-center gap-1">
              <Check className="h-3.5 w-3.5" />
              <span>Perfect Bonus Claimed (+50 Points)</span>
            </div>
          ) : (
            <button
              onClick={handleClaimBonus}
              className="w-full rounded-full bg-art-charcoal hover:bg-art-charcoal/90 text-art-bg text-[10px] font-bold uppercase tracking-widest py-2 text-center transition-all"
            >
              Claim +50 Points Bonus
            </button>
          )}
        </div>
      )}
    </div>
  );
}
