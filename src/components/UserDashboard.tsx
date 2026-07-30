import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, Award, Activity, Leaf, RefreshCw, FileText, Send, Sparkles, 
  CheckCircle, TrendingUp, Clock, Trash2, UserCheck, ChevronRight, 
  AlertCircle, Calendar, ShoppingBag, Zap, HelpCircle, Flame, Check, Loader2,
  Copy, MessageSquare, Filter
} from "lucide-react";
import { UserProfile, MatRegistration, MatType, CircularReturn, CircularReturnStep, Challenge, RewardItem, ChatMessage, HealthProfile } from "../types";
import { INITIAL_USER_PROFILE, INITIAL_CHALLENGES, INITIAL_REWARDS } from "../data";
import ImpactTracker from "./ImpactTracker";
import BadgeCenter from "./BadgeCenter";
import EverydayQuests from "./EverydayQuests";
import HealthProfileCard from "./HealthProfileCard";
import OnboardingFlow from "./OnboardingFlow";

export default function UserDashboard() {
  // Primary Profile & State
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [rewards, setRewards] = useState<RewardItem[]>(INITIAL_REWARDS);

  // FR-001 Mat Registration State
  const [regSerial, setRegSerial] = useState("");
  const [regType, setRegType] = useState<MatType>(MatType.EARTHMAT);
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  // FR-002 Pranova AI Coach Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "m0",
      role: "model",
      text: "Namaste Ananya. Welcome to your AI Wellness & Sustainable Living Portal! I am Pranova AI, trained on EarthMat™ cork & rubber care, posture alignment, and sustainable living habits.\n\nHow can I support your EarthMat™ practice or green lifestyle goals today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [selectedChatCategory, setSelectedChatCategory] = useState<string>("all");
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // FR-005 Pranova Renew™ Return State
  const [returnSerial, setReturnSerial] = useState("");
  const [returnType, setReturnType] = useState<MatType>(MatType.EARTHMAT);
  const [returnLoading, setReturnLoading] = useState(false);

  // Daily Yoga Practice Log State
  const [yogaDuration, setYogaDuration] = useState<number>(30);
  const [yogaStyle, setYogaStyle] = useState<string>("Vinyasa Flow");
  const [yogaIntensity, setYogaIntensity] = useState<string>("Balanced");
  const [yogaNotes, setYogaNotes] = useState<string>("");
  const [showYogaForm, setShowYogaForm] = useState<boolean>(false);
  const [yogaSuccess, setYogaSuccess] = useState<boolean>(false);

  // Suggestion chips categories
  const CHAT_CATEGORIES = [
    { id: "all", label: "All Topics" },
    { id: "earthmat", label: "🧘 EarthMat™ Care" },
    { id: "eco", label: "🌱 Sustainable Habits" },
    { id: "posture", label: "🧘‍♀️ Desk Posture" },
    { id: "mindfulness", label: "💨 Breath & Sleep" }
  ];

  // Categorized suggestion chips for chat
  const SUGGESTION_CHIPS = [
    { category: "earthmat", label: "✨ Clean & Roll EarthMat™", prompt: "How do I clean, care for, and roll my EarthMat™ to protect the natural cork surface and preserve traction?" },
    { category: "earthmat", label: "💦 Cork Grip & Sweat Traction", prompt: "Why does natural cork grip get stronger when wet or sweaty during intense yoga on my EarthMat™?" },
    { category: "eco", label: "🌱 5 Daily Plastic-Free Micro-Habits", prompt: "Give me 5 practical daily micro-habits to eliminate single-use plastics from my work and home routine." },
    { category: "eco", label: "♻️ Pranova Renew™ Circular Return", prompt: "Explain how the Pranova Renew™ cradle-to-cradle recycling return works for my EarthMat™." },
    { category: "posture", label: "🧘 10-Min Desk Back & Neck Relief", prompt: "Create a 10-minute yoga stretching sequence to relieve lower back and neck tension from long office hours sitting at a desk." },
    { category: "posture", label: "🪑 Zoom Meeting Posture Release", prompt: "Provide 3 quick chair posture resets and neck stretches I can do discreetly during long work calls." },
    { category: "mindfulness", label: "😴 Evening Mindful Sleep Routine", prompt: "Build a calming 15-minute evening wind-down plan combining Pranayama box breathing and sleep habits." },
    { category: "mindfulness", label: "🌬️ 5-Min Box Breathing (Sama Vritti)", prompt: "Guide me through a 5-minute Box Breathing session to rapidly lower work stress and reset focus." },
    { category: "eco", label: "🌳 My Sustainability Impact Score", prompt: "Explain how my carbon saved, plastic avoided, and tree equivalents are calculated on my Pranova Scorecard." }
  ];

  const filteredChips = selectedChatCategory === "all" 
    ? SUGGESTION_CHIPS 
    : SUGGESTION_CHIPS.filter(c => c.category === selectedChatCategory);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, aiLoading]);

  // FR-001: Register Mat Action
  const handleRegisterMat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regSerial.trim()) return;

    setRegLoading(true);
    setRegSuccess(false);

    // Simulate scanning/verifying QR ownership under 3 seconds (Success Criteria: under 60 seconds)
    setTimeout(() => {
      const newReg: MatRegistration = {
        serialNumber: regSerial.trim().toUpperCase(),
        matType: regType,
        ownerName: profile.name,
        registeredAt: new Date().toISOString(),
        isRegistered: true
      };

      // Add points to profile for registration
      setProfile(prev => {
        const updatedRegs = [...prev.registrations, newReg];
        const newPoints = prev.points + 100; // Reward 100 points for QR registration
        
        // Append history log
        const newLog = {
          id: `h-reg-${Date.now()}`,
          action: `Linked QR Passport for ${regType} (${newReg.serialNumber})`,
          date: new Date().toISOString().split("T")[0],
          carbonSaved: regType === MatType.EARTHMAT_PRO ? 6.2 : 4.5,
          plasticAvoided: regType === MatType.EARTHMAT_PRO ? 1.5 : 1.2
        };

        const updatedMetrics = {
          ...prev.metrics,
          carbonSaved: prev.metrics.carbonSaved + newLog.carbonSaved,
          plasticAvoided: prev.metrics.plasticAvoided + newLog.plasticAvoided,
          sustainabilityScore: Math.min(100, prev.metrics.sustainabilityScore + 3)
        };

        return {
          ...prev,
          points: newPoints,
          registrations: updatedRegs,
          metrics: updatedMetrics,
          history: [newLog, ...prev.history]
        };
      });

      setRegSerial("");
      setRegLoading(false);
      setRegSuccess(true);

      // Auto-hide success badge after 4s
      setTimeout(() => setRegSuccess(false), 4000);
    }, 1500);
  };

  // FR-002: Call Gemini AI Coach & Planner API
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || userInput;
    if (!text.trim() || aiLoading) return;

    setAiError(null);
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMessage]);
    if (!textToSend) setUserInput("");
    setAiLoading(true);

    try {
      const response = await fetch("/api/gemini/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text.trim(),
          history: chatMessages.map(msg => ({
            role: msg.role,
            text: msg.text
          })),
          healthProfile: profile.healthProfile
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "An error occurred fetching wellness recommendations.");
      }

      const data = await response.json();
      
      const modelMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "model",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, modelMessage]);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Unable to reach Pranova AI Coach. Ensure Gemini API Key is configured.");
    } finally {
      setAiLoading(false);
    }
  };

  // FR-003: Sustainability Logger (Interactive simulator updates live stats)
  const logSustainabilityActivity = (activityType: "yoga" | "recycle" | "commute") => {
    let carbon = 0;
    let plastic = 0;
    let actionName = "";

    if (activityType === "yoga") {
      carbon = 0.8;
      plastic = 0.2;
      actionName = "Completed 30-min Pranova Yoga stretch flow";
    } else if (activityType === "recycle") {
      carbon = 2.5;
      plastic = 0.7;
      actionName = "Returned worn strap thread to raw cotton depot";
    } else {
      carbon = 4.2;
      plastic = 0.0;
      actionName = "Walked to local wellness studio (fossil-free commute)";
    }

    setProfile(prev => {
      const updatedMetrics = {
        ...prev.metrics,
        carbonSaved: parseFloat((prev.metrics.carbonSaved + carbon).toFixed(1)),
        plasticAvoided: parseFloat((prev.metrics.plasticAvoided + plastic).toFixed(1)),
        treeEquivalents: parseFloat((prev.metrics.treeEquivalents + (carbon / 4)).toFixed(1)),
        sustainabilityScore: Math.min(100, prev.metrics.sustainabilityScore + (activityType === "recycle" ? 4 : 2))
      };

      const newLog = {
        id: `h-act-${Date.now()}`,
        action: actionName,
        date: new Date().toISOString().split("T")[0],
        carbonSaved: carbon,
        plasticAvoided: plastic
      };

      return {
        ...prev,
        metrics: updatedMetrics,
        history: [newLog, ...prev.history],
        points: prev.points + 25 // Award 25 points for logging eco actions
      };
    });
  };

  const handleCustomYogaLog = (e: React.FormEvent) => {
    e.preventDefault();
    const carbonSaved = parseFloat((yogaDuration * 0.04).toFixed(2));
    const plasticAvoided = parseFloat((yogaDuration * 0.012).toFixed(2));
    const pointsEarned = Math.min(60, 15 + Math.floor(yogaDuration * 0.5));

    setProfile(prev => {
      const updatedMetrics = {
        ...prev.metrics,
        carbonSaved: parseFloat((prev.metrics.carbonSaved + carbonSaved).toFixed(1)),
        plasticAvoided: parseFloat((prev.metrics.plasticAvoided + plasticAvoided).toFixed(1)),
        treeEquivalents: parseFloat((prev.metrics.treeEquivalents + (carbonSaved / 4)).toFixed(1)),
        sustainabilityScore: Math.min(100, prev.metrics.sustainabilityScore + 3)
      };

      const newLog = {
        id: `h-yoga-${Date.now()}`,
        action: `Logged custom ${yogaDuration}-min ${yogaStyle} (${yogaIntensity}) — "${yogaNotes || "Focused & centered"}" 🧘`,
        date: new Date().toISOString().split("T")[0],
        carbonSaved,
        plasticAvoided
      };

      return {
        ...prev,
        metrics: updatedMetrics,
        history: [newLog, ...prev.history],
        points: prev.points + pointsEarned
      };
    });

    setYogaSuccess(true);
    setYogaNotes("");
    setTimeout(() => {
      setYogaSuccess(false);
    }, 4000);
  };

  // FR-004: Join or Complete Challenges
  const toggleChallenge = (challengeId: string) => {
    setChallenges(prev => 
      prev.map(ch => {
        if (ch.id === challengeId) {
          if (!ch.isJoined) {
            // Join challenge
            return { ...ch, isJoined: true };
          } else if (!ch.isCompleted) {
            // Complete challenge and earn points
            setTimeout(() => {
              setProfile(p => {
                const newLog = {
                  id: `h-ch-${Date.now()}`,
                  action: `Completed challenge: ${ch.title} 🎉`,
                  date: new Date().toISOString().split("T")[0],
                  carbonSaved: ch.category === "sustainability" ? 3.0 : 1.5,
                  plasticAvoided: ch.category === "sustainability" ? 0.8 : 0.3
                };
                
                return {
                  ...p,
                  points: p.points + ch.points,
                  metrics: {
                    ...p.metrics,
                    carbonSaved: parseFloat((p.metrics.carbonSaved + newLog.carbonSaved).toFixed(1)),
                    plasticAvoided: parseFloat((p.metrics.plasticAvoided + newLog.plasticAvoided).toFixed(1)),
                    sustainabilityScore: Math.min(100, p.metrics.sustainabilityScore + 5)
                  },
                  history: [newLog, ...p.history]
                };
              });
            }, 100);
            return { ...ch, isCompleted: true };
          }
        }
        return ch;
      })
    );
  };

  // FR-004: Claim Reward Points
  const claimReward = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward || reward.isClaimed || profile.points < reward.pointsCost) return;

    // Deduct points, mark as claimed and generate coupon code
    const generatedCode = `PRN-${reward.id.toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    setProfile(prev => ({
      ...prev,
      points: prev.points - reward.pointsCost
    }));

    setRewards(prev =>
      prev.map(r => {
        if (r.id === rewardId) {
          return {
            ...r,
            isClaimed: true,
            couponCode: generatedCode
          };
        }
        return r;
      })
    );
  };

  const handleRewardClaimed = (pointsEarned: number, logMessage: string) => {
    setProfile(prev => {
      const newLog = {
        id: `h-quest-${Date.now()}`,
        action: logMessage,
        date: new Date().toISOString().split("T")[0],
        carbonSaved: 0,
        plasticAvoided: 0
      };
      return {
        ...prev,
        points: prev.points + pointsEarned,
        history: pointsEarned > 0 ? [newLog, ...prev.history] : prev.history
      };
    });
  };

  const handleUpdateHealthProfile = (newHealth: HealthProfile) => {
    setProfile(prev => ({
      ...prev,
      healthProfile: newHealth
    }));
  };

  // FR-005: Initiate Circular Return (Pranova Renew™)
  const handleInitiateReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnSerial) return;

    setReturnLoading(true);

    setTimeout(() => {
      const generatedCode = `RENEW-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const newReturn: CircularReturn = {
        id: `RET-${Math.floor(1000 + Math.random() * 9000)}`,
        matSerial: returnSerial,
        matType: returnType,
        initiatedAt: new Date().toISOString(),
        status: CircularReturnStep.INITIATED,
        creditEarned: returnType === MatType.EARTHMAT_PRO ? 800 : 600,
        couponCode: generatedCode,
        progressPercentage: 40
      };

      setProfile(prev => {
        // Find existing registrations and exclude the returned serial if present to maintain integrity
        const updatedRegs = prev.registrations.map(reg => {
          if (reg.serialNumber === returnSerial) {
            return { ...reg, isRegistered: false };
          }
          return reg;
        });

        // Add to history
        const newLog = {
          id: `h-ret-${Date.now()}`,
          action: `Initiated circular return for serial ${returnSerial}`,
          date: new Date().toISOString().split("T")[0],
          carbonSaved: 12.0, // High carbon saved for recovering raw natural rubber/cork
          plasticAvoided: 2.5
        };

        const updatedMetrics = {
          ...prev.metrics,
          carbonSaved: parseFloat((prev.metrics.carbonSaved + 12.0).toFixed(1)),
          plasticAvoided: parseFloat((prev.metrics.plasticAvoided + 2.5).toFixed(1)),
          sustainabilityScore: Math.min(100, prev.metrics.sustainabilityScore + 10)
        };

        return {
          ...prev,
          registrations: updatedRegs,
          circularReturns: [newReturn, ...prev.circularReturns],
          metrics: updatedMetrics,
          history: [newLog, ...prev.history],
          points: prev.points + 150 // Reward points for initiating recycling
        };
      });

      // Simulate step increments on the return pipeline (FR-005 lifecycle recovery simulation)
      triggerSimulationReturnSteps(newReturn.id);

      setReturnSerial("");
      setReturnLoading(false);
    }, 1500);
  };

  // Step-by-step progress simulation to showcase "Recover Materials" & "Earn Credits" in action!
  const triggerSimulationReturnSteps = (returnId: string) => {
    // 1. Move to RECEIVED after 10s
    setTimeout(() => {
      updateReturnStep(returnId, CircularReturnStep.RECEIVED, 60);
      
      // 2. Move to RECOVERING after 20s
      setTimeout(() => {
        updateReturnStep(returnId, CircularReturnStep.RECOVERING, 80);

        // 3. Move to COMPLETED after 30s
        setTimeout(() => {
          updateReturnStep(returnId, CircularReturnStep.COMPLETED, 100);
        }, 10000);
      }, 10000);
    }, 10000);
  };

  const updateReturnStep = (id: string, step: CircularReturnStep, progress: number) => {
    setProfile(prev => {
      const updatedReturns = prev.circularReturns.map(ret => {
        if (ret.id === id) {
          return {
            ...ret,
            status: step,
            progressPercentage: progress
          };
        }
        return ret;
      });
      return {
        ...prev,
        circularReturns: updatedReturns
      };
    });
  };

  if (profile.hasCompletedOnboarding === false) {
    return (
      <div className="py-8 pb-24">
        <OnboardingFlow 
          profile={profile}
          onComplete={(updated) => setProfile(updated)}
          onSkip={() => setProfile(prev => ({ ...prev, hasCompletedOnboarding: true }))}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left py-8 pb-24 text-art-charcoal font-sans">
      
      {/* ESG Real-Time Audit Impact Tracker Row */}
      <div className="lg:col-span-12">
        <ImpactTracker history={profile.history} metrics={profile.metrics} />
      </div>
      
      {/* LEFT COLUMN: Sustainability Scorecard & Interactive Activator (lg:col-span-4) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Profile Card & Pranova Streak */}
        <div className="rounded-3xl border border-art-charcoal/10 bg-art-stone/20 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-serif text-lg font-bold text-art-charcoal italic">{profile.name}</h3>
              <p className="text-xs text-art-charcoal/60 font-light">{profile.email}</p>
            </div>
            <div className="rounded-full bg-art-charcoal text-art-bg p-2.5 shadow-sm">
              <UserCheck className="h-4.5 w-4.5 text-art-cork" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-art-charcoal/10">
            <div className="rounded-2xl bg-white/60 p-2.5 border border-art-charcoal/5">
              <span className="text-[9px] text-art-charcoal/50 font-bold uppercase tracking-wider block">Mats Owned</span>
              <span className="text-[11px] font-bold text-art-charcoal mt-0.5 block">
                {profile.registrations.filter(r => r.isRegistered).length} Active
              </span>
            </div>
            <div className="rounded-2xl bg-art-terracotta/10 p-2.5 border border-art-terracotta/25">
              <span className="text-[9px] text-art-terracotta font-bold uppercase tracking-wider block">Reward Balance</span>
              <span className="text-[11px] font-bold text-art-charcoal mt-0.5 block">
                ⭐ {profile.points} pts
              </span>
            </div>
            <div className="rounded-2xl bg-art-sage/10 p-2.5 flex items-center gap-1 border border-art-sage/20">
              <Flame className="h-4 w-4 text-art-sage animate-pulse shrink-0" />
              <div>
                <span className="text-[9px] text-art-sage font-bold uppercase tracking-wider block">Daily Flow</span>
                <span className="text-[11px] font-bold text-art-charcoal block">4d streak</span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setProfile(prev => ({ ...prev, hasCompletedOnboarding: false }))}
            className="w-full text-center rounded-xl bg-white/70 border border-art-charcoal/5 hover:border-art-charcoal/25 text-[10px] font-bold uppercase tracking-wider py-2 text-art-charcoal transition-all flex items-center justify-center gap-1.5 shadow-3xs cursor-pointer"
          >
            <RefreshCw className="h-3 w-3 text-art-terracotta" />
            Re-run Member Onboarding
          </button>
        </div>

        {/* Everyday Mindful Quests Checklist */}
        <EverydayQuests 
          points={profile.points} 
          onRewardClaimed={handleRewardClaimed} 
          history={profile.history} 
        />

        {/* FR-003 Sustainability Dashboard Metrics */}
        <div className="rounded-3xl border border-art-charcoal/10 bg-white p-5 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-art-stone pb-2.5">
            <div className="flex items-center gap-1.5">
              <Leaf className="h-4.5 w-4.5 text-art-sage" />
              <h4 className="font-serif text-sm font-bold text-art-charcoal italic">Sustainability Score</h4>
            </div>
            <div className="rounded-full bg-art-stone/60 px-2.5 py-0.5 font-mono text-[10px] font-bold text-art-charcoal border border-art-charcoal/5">
              Score: {profile.metrics.sustainabilityScore}/100
            </div>
          </div>

          {/* Graphical circular progress or meter */}
          <div className="relative flex items-center justify-center py-2">
            <div className="h-28 w-28 rounded-full border-8 border-art-stone/50 flex flex-col items-center justify-center">
              <span className="font-serif text-2xl font-black text-art-charcoal">
                {profile.metrics.sustainabilityScore}
              </span>
              <span className="text-[10px] text-art-charcoal/55 font-mono font-bold uppercase tracking-wider">PRN Score</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="h-28 w-28 rounded-full border-8 border-art-sage border-t-transparent animate-spin duration-[4000ms] opacity-35" 
                style={{ clipPath: `polygon(50% 50%, -50% -50%, 150% -50%, 150% 150%, -50% 150%)` }}
              />
            </div>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2">
            <div className="p-2.5 bg-art-stone/20 rounded-2xl border border-art-charcoal/5">
              <span className="text-[20px] font-bold text-art-charcoal block leading-tight font-serif italic">
                {profile.metrics.carbonSaved}
              </span>
              <span className="text-[9px] text-art-charcoal/70 uppercase tracking-wider font-bold block mt-1">CO2 Saved</span>
            </div>
            <div className="p-2.5 bg-art-stone/20 rounded-2xl border border-art-charcoal/5">
              <span className="text-[20px] font-bold text-art-charcoal block leading-tight font-serif italic">
                {profile.metrics.plasticAvoided}
              </span>
              <span className="text-[9px] text-art-charcoal/70 uppercase tracking-wider font-bold block mt-1">Plastic Saved</span>
            </div>
            <div className="p-2.5 bg-art-sage/10 rounded-2xl border border-art-sage/20">
              <span className="text-[20px] font-bold text-art-sage block leading-tight font-serif italic">
                {profile.metrics.treeEquivalents}
              </span>
              <span className="text-[9px] text-art-sage font-bold uppercase tracking-wider block mt-1">Trees Saved</span>
            </div>
          </div>

          {/* Action Logger simulator */}
          <div className="pt-3 border-t border-art-stone space-y-2">
            <span className="text-[10px] font-bold text-art-charcoal/50 uppercase tracking-widest block">
              Log Real-Time Eco Actions (+Points)
            </span>
            <div className="grid grid-cols-1 gap-2">
              <button 
                onClick={() => logSustainabilityActivity("yoga")}
                className="flex items-center justify-between p-2.5 rounded-full bg-art-stone/35 hover:bg-art-stone/60 border border-art-charcoal/10 text-xs font-bold text-art-charcoal transition-all text-left px-4"
              >
                <span>🧘 Quick Log: 30-min Mat Practice</span>
                <span className="text-[9px] bg-art-sage/10 text-art-charcoal px-2 py-0.5 rounded-full font-mono border border-art-sage/20">
                  +0.8kg CO2
                </span>
              </button>
              <button 
                onClick={() => logSustainabilityActivity("commute")}
                className="flex items-center justify-between p-2.5 rounded-full bg-art-stone/35 hover:bg-art-stone/60 border border-art-charcoal/10 text-xs font-bold text-art-charcoal transition-all text-left px-4"
              >
                <span>🚶 Quick Log: Walk to Wellness Studio</span>
                <span className="text-[9px] bg-art-sage/10 text-art-charcoal px-2 py-0.5 rounded-full font-mono border border-art-sage/20">
                  +4.2kg CO2
                </span>
              </button>

              {/* Collapsible Custom Yoga Log Trigger */}
              <button
                type="button"
                onClick={() => {
                  setShowYogaForm(!showYogaForm);
                  setYogaSuccess(false);
                }}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-full border text-xs font-bold transition-all px-4 ${
                  showYogaForm 
                    ? "bg-art-charcoal text-art-bg border-art-charcoal" 
                    : "bg-art-sage/15 hover:bg-art-sage/35 text-art-charcoal border-art-sage/30"
                }`}
              >
                <span>{showYogaForm ? "✕ Close Custom Logger" : "🧘 Log Custom Daily Yoga Flow"}</span>
              </button>

              {/* Expanded Custom Yoga Log Form */}
              {showYogaForm && (
                <form onSubmit={handleCustomYogaLog} className="rounded-2xl border border-art-charcoal/10 bg-art-stone/15 p-4 mt-2 space-y-3.5 text-xs">
                  <div className="flex items-center justify-between border-b border-art-stone pb-2">
                    <span className="font-serif italic font-bold text-art-charcoal text-xs">New Yoga Session Log</span>
                    <span className="text-[8px] font-mono font-bold bg-art-sage/10 text-art-charcoal px-1.5 py-0.5 rounded border border-art-sage/20">
                      Cradle-to-Cradle Tracker
                    </span>
                  </div>

                  {yogaSuccess && (
                    <div className="rounded-xl bg-art-sage/15 border border-art-sage/35 p-2.5 flex items-center gap-2 text-[11px] text-art-charcoal">
                      <CheckCircle className="h-4 w-4 text-art-sage shrink-0" />
                      <span className="font-medium">Yoga log saved! Check your updated score.</span>
                    </div>
                  )}

                  {/* Duration Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-art-charcoal/50 uppercase tracking-wider">
                      <span>Practice Duration</span>
                      <span className="text-art-charcoal font-mono font-bold">{yogaDuration} minutes</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="120" 
                      step="5"
                      value={yogaDuration}
                      onChange={(e) => setYogaDuration(parseInt(e.target.value))}
                      className="w-full accent-art-terracotta h-1.5 bg-art-stone rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-art-charcoal/40 font-mono">
                      <span>10m (Quick)</span>
                      <span>60m (Standard)</span>
                      <span>120m (Extended)</span>
                    </div>
                  </div>

                  {/* Grid for Style and Intensity */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-art-charcoal/50 uppercase tracking-wider block">Yoga Style</label>
                      <select
                        value={yogaStyle}
                        onChange={(e) => setYogaStyle(e.target.value)}
                        className="w-full rounded-xl border border-art-charcoal/10 bg-white p-2 text-xs focus:ring-1 focus:ring-art-charcoal focus:outline-hidden"
                      >
                        <option value="Vinyasa Flow">Vinyasa Flow</option>
                        <option value="Hatha Restorative">Hatha Restorative</option>
                        <option value="Pranayama (Breathing)">Pranayama (Breathing)</option>
                        <option value="Ashtanga Primary">Ashtanga Primary</option>
                        <option value="Yin Yoga (Stretching)">Yin Yoga (Stretching)</option>
                        <option value="Yoga Nidra Meditation">Yoga Nidra Meditation</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-art-charcoal/50 uppercase tracking-wider block">Intensity</label>
                      <select
                        value={yogaIntensity}
                        onChange={(e) => setYogaIntensity(e.target.value)}
                        className="w-full rounded-xl border border-art-charcoal/10 bg-white p-2 text-xs focus:ring-1 focus:ring-art-charcoal focus:outline-hidden"
                      >
                        <option value="Gentle & Soft">Gentle & Soft</option>
                        <option value="Balanced & Calm">Balanced & Calm</option>
                        <option value="Vigorous & Active">Vigorous & Active</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-art-charcoal/50 uppercase tracking-wider block">Mindfulness Note / Reflection</label>
                    <input
                      type="text"
                      value={yogaNotes}
                      onChange={(e) => setYogaNotes(e.target.value)}
                      placeholder="e.g. Felt grounded, focused on circular breath..."
                      className="w-full rounded-xl border border-art-charcoal/10 bg-white p-2.5 text-xs focus:ring-1 focus:ring-art-charcoal focus:outline-hidden font-light"
                    />
                  </div>

                  {/* Footprint Saving Calculations Preview */}
                  <div className="rounded-xl bg-white border border-art-charcoal/5 p-2.5 text-[10px] space-y-1">
                    <div className="text-art-charcoal/50 font-bold uppercase tracking-wider">Estimated Impact Savings</div>
                    <div className="flex justify-between items-center text-art-charcoal">
                      <span className="font-light">Carbon Sequestered:</span>
                      <span className="font-bold text-art-sage font-mono">+{parseFloat((yogaDuration * 0.04).toFixed(2))} kg CO2</span>
                    </div>
                    <div className="flex justify-between items-center text-art-charcoal">
                      <span className="font-light">Avoided Vinyl:</span>
                      <span className="font-bold text-[#cca47c] font-mono">+{parseFloat((yogaDuration * 0.012).toFixed(2))} kg PVC</span>
                    </div>
                    <div className="flex justify-between items-center text-art-charcoal">
                      <span className="font-light">Rewards points:</span>
                      <span className="font-bold text-art-terracotta font-mono">+{Math.min(60, 15 + Math.floor(yogaDuration * 0.5))} Points</span>
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    className="w-full rounded-full bg-art-charcoal hover:bg-art-charcoal/90 text-art-bg text-xs font-bold uppercase tracking-wider py-2.5 text-center transition-all"
                  >
                    Confirm & Submit Practice Log
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FR-001 Mat Registration Hub */}
        <div className="rounded-3xl border border-art-charcoal/10 bg-white p-5 space-y-4 shadow-2xs">
          <div className="border-b border-art-stone pb-2">
            <h4 className="font-serif text-sm font-bold text-art-charcoal flex items-center gap-1.5 italic">
              <Plus className="h-4 w-4 text-art-terracotta" />
              Register New EarthMat™
            </h4>
            <p className="text-[11px] text-art-charcoal/60 mt-0.5 font-light">Link unique QR-based identity to ownership passport.</p>
          </div>

          {regSuccess && (
            <div className="rounded-2xl bg-art-sage/10 border border-art-sage/20 p-3 flex items-center gap-2 text-xs text-art-charcoal">
              <CheckCircle className="h-4.5 w-4.5 text-art-sage shrink-0" />
              <span className="font-medium">Mat passport registered! +100 points balance.</span>
            </div>
          )}

          <form onSubmit={handleRegisterMat} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="text-art-charcoal/50 font-bold uppercase tracking-wider text-[9px]">Mat Type</label>
              <select
                value={regType}
                onChange={(e) => setRegType(e.target.value as MatType)}
                className="w-full rounded-full border border-art-charcoal/15 bg-art-stone/15 px-4 py-2.5 text-xs text-art-charcoal focus:border-art-charcoal focus:outline-none font-medium"
              >
                <option value={MatType.EARTHMAT}>{MatType.EARTHMAT}</option>
                <option value={MatType.EARTHMAT_PRO}>{MatType.EARTHMAT_PRO}</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-art-charcoal/50 font-bold uppercase tracking-wider text-[9px]">
                Mat QR Code / Serial Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., PRN-EM-2026-XXXX"
                  value={regSerial}
                  onChange={(e) => setRegSerial(e.target.value)}
                  disabled={regLoading}
                  className="w-full rounded-full border border-art-charcoal/15 bg-art-stone/15 px-4 py-2 text-xs text-art-charcoal focus:border-art-charcoal focus:outline-none placeholder-art-charcoal/40 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setRegSerial(`PRN-QR-${Math.floor(1000 + Math.random() * 9000)}-EM`)}
                  className="rounded-full border border-art-charcoal/15 bg-art-stone px-4 py-2 text-[10px] font-bold text-art-charcoal uppercase tracking-wider whitespace-nowrap hover:bg-art-stone/80 transition-colors"
                >
                  Generate QR
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={regLoading || !regSerial.trim()}
              className="w-full flex items-center justify-center gap-1.5 rounded-full bg-art-charcoal hover:bg-art-charcoal/90 py-3 font-bold uppercase tracking-widest text-art-bg transition-all text-xs disabled:opacity-40"
            >
              {regLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Linking Mat...</span>
                </>
              ) : (
                <span>Register Mat Passport (&lt;60s)</span>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* MIDDLE COLUMN: Pranova AI Coach & Circular Passport (lg:col-span-5) */}
      <div className="lg:col-span-5 space-y-6 flex flex-col h-full min-h-[600px]">
        
        {/* Health Profile Customizer & Custom Everyday suggestions */}
        <HealthProfileCard 
          profile={profile} 
          onUpdateHealthProfile={handleUpdateHealthProfile} 
        />

        {/* FR-002: Pranova AI Wellness & Sustainable Living Chat Portal */}
        <div className="rounded-3xl border border-art-charcoal/10 bg-white flex flex-col flex-grow shadow-lg overflow-hidden">
          
          {/* Coach Header */}
          <div className="border-b border-art-stone bg-art-stone/60 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-art-charcoal text-art-bg shadow-md">
                  <Sparkles className="h-5 w-5 text-art-cork animate-pulse" />
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-art-sage border-2 border-white" />
              </div>
              <div className="text-left">
                <h4 className="font-serif text-sm font-bold text-art-charcoal flex items-center gap-1.5 italic">
                  Pranova AI Wellness
                  <span className="rounded-full bg-art-sage/10 border border-art-sage/20 px-2.5 py-0.5 text-[8px] font-bold text-art-charcoal font-mono uppercase tracking-widest">
                    GEMINI AI ACTIVE
                  </span>
                </h4>
                <p className="text-[10px] text-art-charcoal/60 font-light">EarthMat™ usage, posture alignment & sustainable living guide</p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                setChatMessages([
                  {
                    id: `m-reset-${Date.now()}`,
                    role: "model",
                    text: "Greetings. I have rebooted our mindful space. What EarthMat™ care questions, posture flows, or sustainable habits shall we discuss today?",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  }
                ]);
              }}
              className="text-[9px] font-bold text-art-charcoal/60 hover:text-art-charcoal bg-art-stone hover:bg-art-stone/85 px-3 py-1.5 rounded-full uppercase tracking-wider transition-colors"
              title="Clear session history"
            >
              Reset Chat
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="flex-grow p-4 space-y-4 overflow-y-auto max-h-[380px] min-h-[300px] text-xs">
            {chatMessages.map((msg, idx) => {
              const isModel = msg.role === "model";
              const isCopied = copiedMessageId === msg.id;

              return (
                <div key={idx} className={`flex ${isModel ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[88%] rounded-2xl p-3.5 space-y-2 leading-relaxed text-left shadow-2xs relative group ${
                    isModel 
                      ? "bg-art-stone/45 text-art-charcoal border border-art-charcoal/5 font-light" 
                      : "bg-art-charcoal text-art-bg"
                  }`}>
                    {/* Render message body line-by-line for readable layout */}
                    <div className="whitespace-pre-wrap font-sans font-medium">
                      {msg.text}
                    </div>

                    <div className="flex items-center justify-between border-t border-art-charcoal/5 pt-1.5 text-[9px]">
                      {isModel ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(msg.text);
                              setCopiedMessageId(msg.id || `msg-${idx}`);
                              setTimeout(() => setCopiedMessageId(null), 2000);
                            }}
                            className="flex items-center gap-1 text-[9px] font-mono text-art-charcoal/50 hover:text-art-charcoal font-bold uppercase transition-colors"
                            title="Copy response text"
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3 w-3 text-art-sage" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              logSustainabilityActivity("yoga");
                              alert("Logged practice session to your sustainability scorecard (+15 points)!");
                            }}
                            className="flex items-center gap-1 text-[9px] font-mono text-art-sage hover:text-art-charcoal font-bold uppercase transition-colors"
                            title="Log this practice or habit"
                          >
                            <Leaf className="h-3 w-3" />
                            <span>Log Action</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[9px] font-mono text-art-cork/70 uppercase">You</span>
                      )}

                      <span className={`font-mono text-right font-medium text-[9px] ${
                        isModel ? "text-art-charcoal/40" : "text-art-bg/60"
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {aiLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl p-4 bg-art-stone/45 border border-art-charcoal/5 flex items-center gap-3 text-art-charcoal/80">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-art-sage animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-art-sage animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-art-sage animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-art-charcoal/50 animate-pulse">
                    Consulting EarthMat™ AI Knowledge Base...
                  </span>
                </div>
              </div>
            )}

            {aiError && (
              <div className="rounded-2xl bg-art-terracotta/10 border border-art-terracotta/20 p-3 text-xs text-art-charcoal text-left flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4.5 w-4.5 text-art-terracotta shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Coach Connection Interrupted</p>
                    <p className="text-[10px] text-art-charcoal/70 mt-1">{aiError}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSendMessage()}
                  className="rounded-full bg-art-terracotta text-white px-2.5 py-1 text-[9px] font-bold uppercase shrink-0"
                >
                  Retry
                </button>
              </div>
            )}
            
            <div ref={chatBottomRef} />
          </div>

          {/* Category Filter & Quick Suggestion Chips */}
          <div className="border-t border-art-stone/60 bg-art-stone/20 p-3 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-art-charcoal/50 uppercase tracking-widest flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Select Topic Prompt
              </span>
              
              {/* Category selector pills */}
              <div className="flex gap-1 overflow-x-auto">
                {CHAT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedChatCategory(cat.id)}
                    className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase transition-all whitespace-nowrap ${
                      selectedChatCategory === cat.id
                        ? "bg-art-charcoal text-art-bg"
                        : "bg-art-stone/50 text-art-charcoal/60 hover:bg-art-stone"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
              {filteredChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip.prompt)}
                  disabled={aiLoading}
                  className="shrink-0 rounded-full bg-white hover:bg-art-stone border border-art-charcoal/10 text-[10px] px-3.5 py-1.5 font-bold text-art-charcoal transition-colors uppercase tracking-wider flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Sender */}
          <div className="border-t border-art-stone p-3 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about EarthMat™ care, posture alignment, or eco habits..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={aiLoading}
                className="w-full rounded-full border border-art-charcoal/15 bg-art-stone/15 px-4 py-2.5 text-xs text-art-charcoal placeholder-art-charcoal/45 focus:outline-none focus:border-art-charcoal font-medium"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={aiLoading || !userInput.trim()}
                className="rounded-full bg-art-charcoal hover:bg-art-charcoal/90 text-art-bg p-2.5 transition-all flex items-center justify-center disabled:opacity-30 shrink-0"
              >
                <Send className="h-4.5 w-4.5 text-art-cork" />
              </button>
            </div>
          </div>

        </div>

        {/* Digital Sustainability Passport Verification */}
        <div className="rounded-3xl border border-art-charcoal/10 bg-art-stone/20 p-5 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-art-charcoal/10 pb-2">
            <h4 className="font-serif text-xs font-bold text-art-charcoal uppercase tracking-wider">
              Sustainability Passport
            </h4>
            <span className="rounded-full bg-art-sage/10 text-art-charcoal border border-art-sage/25 px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase">
              Status: Verified
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {profile.registrations.filter(r => r.isRegistered).length === 0 ? (
              <p className="text-art-charcoal/50 italic text-center py-2 font-serif">
                No active registered passports found. Please link a serial above.
              </p>
            ) : (
              profile.registrations.map((reg, idx) => (
                <div key={idx} className="rounded-2xl bg-white border border-art-charcoal/10 p-3.5 flex justify-between items-center text-left hover:border-art-charcoal/20 transition-all">
                  <div className="space-y-0.5">
                    <span className="font-serif italic font-bold text-art-charcoal block">{reg.matType}</span>
                    <span className="text-[10px] font-mono text-art-charcoal/40 font-bold uppercase block">
                      Serial: {reg.serialNumber}
                    </span>
                    <span className="text-[9px] text-art-charcoal/50 block font-light">
                      Linked: {new Date(reg.registeredAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-art-sage/10 text-art-charcoal px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                      <Check className="h-3 w-3 text-art-sage" />
                      Circular Cradle
                    </span>
                    <span className="text-[9px] text-art-charcoal/40 block font-mono font-bold">99.9% BIODEGRADABLE</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Challenges, Rewards, Circular Returns (lg:col-span-3) */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Badge Center Gamified Badges */}
        <BadgeCenter 
          metrics={profile.metrics} 
          registrations={profile.registrations} 
          returns={profile.circularReturns || []} 
          history={profile.history} 
          hasCompletedOnboarding={profile.hasCompletedOnboarding}
        />
        
        {/* FR-004 Challenge Center */}
        <div className="rounded-3xl border border-art-charcoal/10 bg-white p-5 space-y-4 shadow-2xs">
          <div className="border-b border-art-stone pb-2 text-left">
            <h4 className="font-serif text-sm font-bold text-art-charcoal flex items-center gap-1.5 italic">
              <Award className="h-4.5 w-4.5 text-art-terracotta" />
              Active Challenges
            </h4>
            <p className="text-[11px] text-art-charcoal/60 mt-0.5 font-light">Participate & earn lifestyle reward points.</p>
          </div>

          <div className="space-y-3.5 text-xs">
            {challenges.map((ch) => (
              <div 
                key={ch.id} 
                className={`rounded-2xl border p-3.5 text-left space-y-2.5 transition-all ${
                  ch.isCompleted 
                    ? "bg-art-stone/10 border-art-stone/40 opacity-55" 
                    : ch.isJoined 
                      ? "bg-art-sage/5 border-art-sage/20" 
                      : "bg-white border-art-stone hover:border-art-charcoal/15"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${
                    ch.category === "yoga" ? "bg-art-cork text-art-charcoal border border-art-charcoal/5" :
                    ch.category === "meditation" ? "bg-art-stone text-art-charcoal/70" :
                    ch.category === "sustainability" ? "bg-art-sage/10 text-art-charcoal" :
                    "bg-art-terracotta/10 text-art-charcoal"
                  }`}>
                    {ch.category}
                  </span>
                  <span className="text-[10px] font-bold text-art-terracotta font-mono">+{ch.points} pts</span>
                </div>

                <div>
                  <h5 className="font-serif font-bold text-art-charcoal leading-snug italic">{ch.title}</h5>
                  <p className="text-[10px] text-art-charcoal/70 mt-0.5 leading-relaxed font-light">{ch.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-art-stone pt-2.5">
                  <span className="text-[9px] text-art-charcoal/40 font-mono font-bold uppercase">Duration: {ch.duration}</span>
                  
                  <button
                    onClick={() => toggleChallenge(ch.id)}
                    disabled={ch.isCompleted}
                    className={`flex items-center gap-1 rounded-full px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all ${
                      ch.isCompleted
                        ? "bg-art-stone text-art-charcoal/40 cursor-not-allowed border border-art-charcoal/5"
                        : ch.isJoined
                          ? "bg-art-charcoal text-art-bg hover:bg-art-charcoal/90"
                          : "bg-art-stone/40 hover:bg-art-stone text-art-charcoal border border-art-charcoal/5"
                    }`}
                  >
                    {ch.isCompleted ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Completed</span>
                      </>
                    ) : ch.isJoined ? (
                      <span>Complete</span>
                    ) : (
                      <span>Join</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FR-004 Reward Claims Portal */}
        <div className="rounded-3xl border border-art-charcoal/10 bg-white p-5 space-y-4 shadow-2xs">
          <div className="border-b border-art-stone pb-2 text-left">
            <h4 className="font-serif text-sm font-bold text-art-charcoal flex items-center gap-1.5 italic">
              <ShoppingBag className="h-4.5 w-4.5 text-art-sage" />
              Claim Rewards
            </h4>
            <p className="text-[11px] text-art-charcoal/60 mt-0.5 font-light">Swap accrued points for wellness credits.</p>
          </div>

          <div className="space-y-3 text-xs">
            {rewards.map((rew) => (
              <div key={rew.id} className="rounded-2xl border border-art-stone/60 p-3.5 space-y-3.5 text-left bg-art-stone/10">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-0.5">
                    <h5 className="font-serif font-bold text-art-charcoal leading-snug italic">{rew.title}</h5>
                    <p className="text-[10px] text-art-charcoal/70 leading-relaxed font-light">{rew.description}</p>
                  </div>
                  <span className="rounded-full bg-art-stone text-art-charcoal font-mono text-[9px] font-bold px-2 py-0.5 border border-art-charcoal/10 shrink-0">
                    {rew.pointsCost} pts
                  </span>
                </div>

                {rew.isClaimed ? (
                  <div className="rounded-xl bg-art-sage/10 border border-art-sage/20 p-2 text-center text-[10px] font-mono text-art-charcoal font-bold tracking-wider">
                    CODE: {rew.couponCode}
                  </div>
                ) : (
                  <button
                    onClick={() => claimReward(rew.id)}
                    disabled={profile.points < rew.pointsCost}
                    className="w-full rounded-full bg-art-charcoal hover:bg-art-charcoal/90 disabled:opacity-30 py-2 text-[9px] font-bold uppercase tracking-widest text-art-bg transition-colors"
                  >
                    {profile.points >= rew.pointsCost ? "Redeem Code" : "Need Points"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FR-005 Circular Returns (Pranova Renew™ Return Engine) */}
        <div className="rounded-3xl border border-art-charcoal/10 bg-white p-5 space-y-4 shadow-2xs">
          <div className="border-b border-art-stone pb-2 text-left">
            <h4 className="font-serif text-sm font-bold text-art-charcoal flex items-center gap-1.5 italic">
              <RefreshCw className="h-4.5 w-4.5 text-art-terracotta animate-spin duration-3000" />
              Renew™ returns
            </h4>
            <p className="text-[11px] text-art-charcoal/60 mt-0.5 font-light">Recover raw organic components. Get upgrade credits.</p>
          </div>

          {/* Return Orders List & Step Tracker */}
          <div className="space-y-3.5 text-xs">
            {profile.circularReturns.map((ret) => (
              <div key={ret.id} className="rounded-2xl border border-art-stone p-3.5 space-y-3 bg-art-stone/10 text-left">
                <div className="flex justify-between border-b border-art-stone/60 pb-2">
                  <div className="space-y-0.5">
                    <span className="font-bold text-art-charcoal block">ID: {ret.id}</span>
                    <span className="text-[9px] text-art-charcoal/50 font-mono font-bold">SERIAL: {ret.matSerial}</span>
                  </div>
                  <span className="rounded-full bg-art-charcoal text-art-bg font-bold px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-wider">
                    {ret.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-art-charcoal/50 font-bold uppercase tracking-wider">
                    <span>Recycler pipeline progress</span>
                    <span>{ret.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-art-stone rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-art-sage transition-all duration-1000" 
                      style={{ width: `${ret.progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-white border border-art-charcoal/10 p-2.5 flex justify-between items-center text-[10px]">
                  <span className="text-art-charcoal/50 font-bold uppercase tracking-wider text-[9px]">Upgrade credit earned</span>
                  <span className="font-serif font-black text-art-terracotta">₹{ret.creditEarned}</span>
                </div>

                {ret.couponCode && (
                  <div className="text-[10px] space-y-1 pt-1">
                    <span className="text-art-charcoal/40 font-bold uppercase tracking-wider text-[8px] block">
                      Credit Coupon
                    </span>
                    <div className="rounded-xl border border-dashed border-art-sage/40 bg-art-sage/5 p-2 font-mono font-bold text-center text-art-charcoal text-[11px] tracking-wider">
                      {ret.couponCode}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Initiate Return Form */}
          <form onSubmit={handleInitiateReturn} className="space-y-3 pt-3 border-t border-art-stone">
            <span className="text-[10px] font-bold text-art-charcoal/50 uppercase tracking-widest block text-left">
              Initiate New Mat Swap
            </span>
            
            <select
              value={returnType}
              onChange={(e) => setReturnType(e.target.value as MatType)}
              className="w-full rounded-full border border-art-charcoal/15 bg-art-stone/15 px-3 py-2 text-xs text-art-charcoal font-medium focus:outline-none"
            >
              <option value={MatType.EARTHMAT}>{MatType.EARTHMAT} (₹600 credit)</option>
              <option value={MatType.EARTHMAT_PRO}>{MatType.EARTHMAT_PRO} (₹800 credit)</option>
            </select>

            <div className="flex gap-1.5">
              <input
                type="text"
                placeholder="Mat serial to return"
                value={returnSerial}
                onChange={(e) => setReturnSerial(e.target.value)}
                disabled={returnLoading}
                className="w-full rounded-full border border-art-charcoal/15 bg-art-stone/15 px-3.5 py-2 text-xs text-art-charcoal placeholder-art-charcoal/40 focus:outline-none font-medium"
              />
              <button
                type="submit"
                disabled={returnLoading || !returnSerial.trim()}
                className="rounded-full bg-art-charcoal hover:bg-art-charcoal/90 text-art-bg font-bold px-4 py-2 text-[10px] uppercase tracking-widest transition-all disabled:opacity-45"
              >
                {returnLoading ? "..." : "Initiate"}
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
