import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Leaf, Award, Sparkles, ChevronRight, Check, Activity, Cpu, 
  RefreshCw, Heart, Shield, ArrowRight, User, Globe
} from "lucide-react";
import { UserProfile, MatType, MatRegistration, HealthProfile } from "../types";

interface OnboardingFlowProps {
  profile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
  onSkip: () => void;
}

export default function OnboardingFlow({ profile, onComplete, onSkip }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  
  // Step 2 State: QR Passport Registration
  const [serial, setSerial] = useState("");
  const [matType, setMatType] = useState<MatType>(MatType.EARTHMAT_PRO);
  const [isPassportVerified, setIsPassportVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Step 3 State: Coach Personalization
  const [concerns, setConcerns] = useState<string[]>([
    "Mild lower back stiffness from long hours of sitting"
  ]);
  const [goals, setGoals] = useState<string[]>([
    "Upper back shoulder alignment",
    "Stress mitigation"
  ]);
  const [fitnessLevel, setFitnessLevel] = useState("Intermediate");

  // Step 4 State: Eco Target
  const [carbonTarget, setCarbonTarget] = useState(25); // kg CO2
  const [pledges, setPledges] = useState<string[]>([
    "Zero pvc",
    "Cradle loop active"
  ]);

  const handleToggleConcern = (concern: string) => {
    if (concerns.includes(concern)) {
      setConcerns(concerns.filter(c => c !== concern));
    } else {
      setConcerns([...concerns, concern]);
    }
  };

  const handleToggleGoal = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter(g => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  const handleTogglePledge = (pledge: string) => {
    if (pledges.includes(pledge)) {
      setPledges(pledges.filter(p => p !== pledge));
    } else {
      setPledges([...pledges, pledge]);
    }
  };

  const generateDemoSerial = () => {
    setVerifying(true);
    setTimeout(() => {
      const randomId = Math.floor(1000 + Math.random() * 9000);
      setSerial(`PRN-EMP-2026-${randomId}B`);
      setMatType(MatType.EARTHMAT_PRO);
      setIsPassportVerified(true);
      setVerifying(false);
    }, 1200);
  };

  const handleVerifySerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim()) return;
    setVerifying(true);
    setTimeout(() => {
      setIsPassportVerified(true);
      setVerifying(false);
    }, 1000);
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => Math.max(0, prev - 1));
  };

  const handleFinishOnboarding = () => {
    // 1. Create a registration object if verified or skip
    const updatedRegistrations = [...profile.registrations];
    if (isPassportVerified && serial) {
      const alreadyExists = updatedRegistrations.some(r => r.serialNumber === serial.trim().toUpperCase());
      if (!alreadyExists) {
        updatedRegistrations.push({
          serialNumber: serial.trim().toUpperCase(),
          matType: matType,
          ownerName: profile.name,
          registeredAt: new Date().toISOString(),
          isRegistered: true
        });
      }
    }

    // 2. Build updated health profile
    const updatedHealthProfile: HealthProfile = {
      bodyType: profile.healthProfile?.bodyType || "Pitta-Vata (Medium, agile but prone to dry tension)",
      medicalConditions: concerns.join(", ") || "None",
      specificConcerns: goals.join(", ") || "General alignment",
      fitnessLevel: fitnessLevel,
      lastUpdated: new Date().toISOString().split("T")[0]
    };

    // 3. Create new history log for completing onboarding
    const newHistoryLog = {
      id: `onboard-${Date.now()}`,
      action: "Completed Pranova Member Onboarding & Passport Sync 🎓",
      date: new Date().toISOString().split("T")[0],
      carbonSaved: isPassportVerified ? 6.2 : 2.0,
      plasticAvoided: isPassportVerified ? 1.5 : 0.5
    };

    // 4. Update core metrics and points
    const updatedProfile: UserProfile = {
      ...profile,
      points: profile.points + 150, // Reward +150 points for completing onboarding
      registrations: updatedRegistrations,
      healthProfile: updatedHealthProfile,
      hasCompletedOnboarding: true,
      metrics: {
        ...profile.metrics,
        sustainabilityScore: Math.min(100, profile.metrics.sustainabilityScore + 10),
        carbonSaved: parseFloat((profile.metrics.carbonSaved + newHistoryLog.carbonSaved).toFixed(1)),
        plasticAvoided: parseFloat((profile.metrics.plasticAvoided + newHistoryLog.plasticAvoided).toFixed(1)),
      },
      history: [newHistoryLog, ...profile.history]
    };

    onComplete(updatedProfile);
  };

  const stepsList = [
    { title: "Introduction", desc: "Eco Foundations" },
    { title: "Passport Sync", desc: "Link EarthMat™" },
    { title: "AI Coach Calibration", desc: "Health Profiler" },
    { title: "Eco-Pledge", desc: "Sustainability Goal" },
    { title: "Privileges", desc: "Claim Rewards" }
  ];

  return (
    <div id="onboarding-wizard-container" className="w-full max-w-4xl mx-auto rounded-3xl border border-art-charcoal/10 bg-white p-6 sm:p-10 shadow-xl space-y-8 animate-fadeIn relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute top-0 right-0 h-64 w-64 bg-art-sage/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-64 w-64 bg-art-cork/10 rounded-full blur-3xl pointer-events-none" />

      {/* Onboarding Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-art-stone pb-6 gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-art-charcoal text-art-bg">
              <Leaf className="h-4 w-4 text-art-cork" />
            </span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-art-sage">PRANOVA SUSTAINABLE SYSTEMS</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold italic tracking-tight text-art-charcoal">
            Member Onboarding Wizard
          </h2>
        </div>
        <button 
          onClick={onSkip}
          className="text-xs font-semibold text-art-charcoal/60 hover:text-art-terracotta hover:underline uppercase tracking-wider transition-colors"
        >
          Skip & Explore
        </button>
      </div>

      {/* Step Progress Line */}
      <div className="hidden sm:grid grid-cols-5 gap-4 relative z-10 pb-2">
        {stepsList.map((s, idx) => {
          const isActive = idx === step;
          const isCompleted = idx < step;
          return (
            <div key={idx} className="space-y-2 text-left relative">
              <div className="flex items-center gap-2">
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300 ${
                  isCompleted 
                    ? "bg-art-sage text-white" 
                    : isActive 
                      ? "bg-art-charcoal text-art-bg ring-4 ring-art-stone/80" 
                      : "bg-art-stone text-art-charcoal/40 border border-art-charcoal/5"
                }`}>
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : `0${idx + 1}`}
                </div>
                <div className={`h-0.5 flex-grow rounded-full transition-all duration-300 ${isCompleted ? "bg-art-sage" : "bg-art-stone"}`} />
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-art-charcoal" : "text-art-charcoal/50"}`}>
                  {s.title}
                </p>
                <p className="text-[9px] text-art-charcoal/40 font-light truncate">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobiles progress bar */}
      <div className="sm:hidden space-y-1 relative z-10 text-left">
        <div className="flex justify-between text-xs font-mono font-bold text-art-charcoal/55">
          <span>STEP {step + 1} OF 5</span>
          <span>{stepsList[step].title}</span>
        </div>
        <div className="w-full h-1 bg-art-stone rounded-full overflow-hidden">
          <div className="h-full bg-art-sage" style={{ width: `${((step + 1) / 5) * 100}%` }} />
        </div>
      </div>

      {/* Core Slides container */}
      <div className="min-h-[300px] flex flex-col justify-between py-2 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 text-left"
          >
            {/* Step 1: Introduction */}
            {step === 0 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-art-sage/10 text-art-charcoal px-3 py-1 text-[9px] font-mono font-bold uppercase border border-art-sage/20">
                    🌿 Carbon-Negative Circularity
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-art-charcoal italic leading-tight">
                    Welcome to the Cradle-to-Cradle Paradigm.
                  </h3>
                  <p className="text-sm font-light text-art-charcoal/80 leading-relaxed max-w-2xl">
                    Standard yoga mats are formulated from chemical fossil PVC resins or composite EVA foams, requiring 100+ years to break down in landfills while shedding toxic microplastics.
                  </p>
                  <p className="text-sm font-light text-art-charcoal/80 leading-relaxed max-w-2xl">
                    <strong>Pranova EarthMat™</strong> is consciously crafted from Mediterranean organic cork, robust natural hemp fibers, and vulcanized tree sap rubber. No toxic glues, no plastic waste.
                  </p>
                </div>

                {/* Compare Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-4 space-y-2">
                    <span className="text-[9px] font-bold text-red-600 tracking-wider uppercase block">Synthetic Non-Circular Mats</span>
                    <ul className="text-xs text-art-charcoal/80 space-y-1.5 list-none">
                      <li className="flex items-center gap-1.5">❌ PVC & heavy microplastic polymers</li>
                      <li className="flex items-center gap-1.5">❌ Zero circular recovery; destined for soil landfills</li>
                      <li className="flex items-center gap-1.5">❌ Toxic off-gassing and low floor grip</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-art-sage/20 bg-art-sage/5 p-4 space-y-2">
                    <span className="text-[9px] font-bold text-art-sage tracking-wider uppercase block">Pranova Cradle System</span>
                    <ul className="text-xs text-art-charcoal/80 space-y-1.5 list-none">
                      <li className="flex items-center gap-1.5">✅ 100% Organic Cork, Hemp & Natural Rubber</li>
                      <li className="flex items-center gap-1.5">✅ Guaranteed raw-material extraction recovery</li>
                      <li className="flex items-center gap-1.5">✅ Discreet QR Passport linking to live AI Coach</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Passport Registration */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-art-terracotta/15 text-art-charcoal px-3 py-1 text-[9px] font-mono font-bold uppercase border border-art-terracotta/20">
                    🪪 QR-Linked Digital Passport
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-art-charcoal italic leading-tight">
                    Link Your Physical EarthMat™
                  </h3>
                  <p className="text-sm font-light text-art-charcoal/80 leading-relaxed">
                    By registering your mat's embedded QR serial number, you claim verified organic custody, synchronize ecological footprint scores, and activate your personal AI coaching modules.
                  </p>
                </div>

                <div className="max-w-md rounded-2xl border border-art-charcoal/10 bg-art-stone/15 p-5 space-y-4">
                  {!isPassportVerified ? (
                    <form onSubmit={handleVerifySerial} className="space-y-3.5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-art-charcoal/60 uppercase tracking-widest block">
                          Enter Embedded Serial / QR Code
                        </label>
                        <input 
                          type="text" 
                          value={serial}
                          onChange={(e) => setSerial(e.target.value)}
                          placeholder="e.g. PRN-EM-2026-X841"
                          className="w-full text-sm rounded-xl border border-art-charcoal/10 bg-white py-2.5 px-3.5 font-mono focus:outline-none focus:ring-1 focus:ring-art-charcoal"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          type="submit"
                          disabled={verifying || !serial.trim()}
                          className="flex-grow rounded-xl bg-art-charcoal text-art-bg text-xs font-bold uppercase tracking-wider py-2.5 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
                        >
                          {verifying ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Verifying...
                            </>
                          ) : (
                            "Verify & Link Mat"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={generateDemoSerial}
                          disabled={verifying}
                          className="rounded-xl border border-art-charcoal/20 hover:bg-art-stone text-art-charcoal text-xs font-bold uppercase tracking-wider py-2.5 px-4 flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-art-terracotta" />
                          Demo Auto-Fill
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3 text-center py-2 animate-fadeIn">
                      <div className="mx-auto h-12 w-12 rounded-full bg-art-sage/10 text-art-sage flex items-center justify-center border border-art-sage/30">
                        <Check className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-mono font-bold text-art-sage uppercase tracking-wider">PASSPORT SYNCHRONIZED</p>
                        <h4 className="font-serif font-bold text-art-charcoal text-sm italic">{matType} connected</h4>
                        <p className="text-[10px] text-art-charcoal/50 font-mono">Serial: {serial.toUpperCase()}</p>
                      </div>
                      <div className="rounded-xl bg-white p-2.5 text-[11px] font-light text-art-charcoal/80 border border-art-charcoal/5">
                        ⭐ <strong>+100 Points</strong> and circular warranty activated on the ledger database.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: AI Coach Calibration */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1C2C20]/10 text-art-charcoal px-3 py-1 text-[9px] font-mono font-bold uppercase border border-art-sage/20">
                    🧠 Pranova Intelligence Engine
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-art-charcoal italic leading-tight">
                    Calibrate Your Wellness Intelligence
                  </h3>
                  <p className="text-sm font-light text-art-charcoal/80 leading-relaxed">
                    Our server-side Gemini AI model tailors physical recovery plans, sleep habits, and posture-release flows directly to your professional routine and biological constitution.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
                  {/* Left checklist - Concerns */}
                  <div className="space-y-2.5">
                    <span className="text-[9px] font-bold text-art-charcoal/60 uppercase tracking-widest block">
                      Target Physical Concerns
                    </span>
                    <div className="space-y-2">
                      {[
                        "Mild lower back stiffness from long hours of sitting",
                        "Neck & shoulder stiffness from digital screens",
                        "Sensitive knee joints during impact poses",
                        "Lumbar spine posture alignment limits"
                      ].map((con) => {
                        const active = concerns.includes(con);
                        return (
                          <button
                            key={con}
                            onClick={() => handleToggleConcern(con)}
                            className={`w-full text-left rounded-xl p-3 border text-xs leading-relaxed transition-all flex items-start gap-2.5 ${
                              active 
                                ? "bg-art-stone border-art-charcoal/20" 
                                : "bg-white border-art-stone hover:border-art-charcoal/10"
                            }`}
                          >
                            <span className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              active ? "bg-art-charcoal text-art-bg border-art-charcoal" : "border-art-charcoal/25 bg-white"
                            }`}>
                              {active && <Check className="h-3 w-3" />}
                            </span>
                            <span className={active ? "font-medium text-art-charcoal" : "text-art-charcoal/80 font-light"}>
                              {con}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right checklist - Goals */}
                  <div className="space-y-2.5">
                    <span className="text-[9px] font-bold text-art-charcoal/60 uppercase tracking-widest block">
                      Mindfulness & Practice Focus
                    </span>
                    <div className="space-y-2">
                      {[
                        "Upper back shoulder alignment",
                        "Stress mitigation",
                        "Sleep optimization habit programs",
                        "Build consistent daily practices"
                      ].map((g) => {
                        const active = goals.includes(g);
                        return (
                          <button
                            key={g}
                            onClick={() => handleToggleGoal(g)}
                            className={`w-full text-left rounded-xl p-3 border text-xs leading-relaxed transition-all flex items-start gap-2.5 ${
                              active 
                                ? "bg-art-stone border-art-charcoal/20" 
                                : "bg-white border-art-stone hover:border-art-charcoal/10"
                            }`}
                          >
                            <span className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              active ? "bg-art-charcoal text-art-bg border-art-charcoal" : "border-art-charcoal/25 bg-white"
                            }`}>
                              {active && <Check className="h-3 w-3" />}
                            </span>
                            <span className={active ? "font-medium text-art-charcoal" : "text-art-charcoal/80 font-light"}>
                              {g}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <div className="space-y-1 text-left flex-grow">
                    <span className="text-[9px] font-bold text-art-charcoal/50 uppercase tracking-widest block">FITNESS & EXPERIENCE LEVEL</span>
                    <div className="flex gap-2">
                      {["Gentle Beginner", "Intermediate", "Advanced Yogi"].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setFitnessLevel(lvl)}
                          className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-all ${
                            fitnessLevel === lvl 
                              ? "bg-art-charcoal text-art-bg border-art-charcoal" 
                              : "bg-white border-art-stone text-art-charcoal/60 hover:border-art-charcoal/10"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Eco Target Pledge */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-art-sage/10 text-art-charcoal px-3 py-1 text-[9px] font-mono font-bold uppercase border border-art-sage/20">
                    🌍 Ecological Commitments
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-art-charcoal italic leading-tight">
                    Establish Your Environmental Footprint Target
                  </h3>
                  <p className="text-sm font-light text-art-charcoal/80 leading-relaxed">
                    By making natural, sustainable choices, we actively reduce fossil fuel carbon emissions and prevent synthetic polymers from degrading soils.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left Column: Sliders / Points */}
                  <div className="md:col-span-6 space-y-4 rounded-2xl bg-art-stone/15 p-5 border border-art-charcoal/5">
                    <span className="text-[9px] font-bold text-art-charcoal/60 uppercase tracking-widest block">
                      Target Carbon Offset Focus
                    </span>
                    <div className="space-y-1.5 text-left">
                      <div className="flex justify-between text-xs font-mono font-bold">
                        <span>PLEDGED OFFSET</span>
                        <span className="text-art-sage">{carbonTarget} kg CO2 / month</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="60" 
                        value={carbonTarget}
                        onChange={(e) => setCarbonTarget(parseInt(e.target.value))}
                        className="w-full accent-art-sage cursor-pointer"
                      />
                      <p className="text-[10px] text-art-charcoal/50 font-light mt-1">
                        Equivalent to avoiding {Math.round(carbonTarget / 4)} average mature tree seedlings harvested annually.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Custom Pledges Checklist */}
                  <div className="md:col-span-6 space-y-3">
                    <span className="text-[9px] font-bold text-art-charcoal/60 uppercase tracking-widest block">
                      Eco-Pledge Declarations
                    </span>
                    <div className="space-y-2">
                      {[
                        { key: "Zero pvc", text: "Refuse standard synthetic plastic PVC or composite EVA fitness mats" },
                        { key: "Cradle loop active", text: "Promise to return Pranova items to the Renew extraction loop rather than landfills" },
                        { key: "Fossil commute reduction", text: "Pledge fossil-free commutes or home practice to minimize carbon output" }
                      ].map((pl) => {
                        const active = pledges.includes(pl.key);
                        return (
                          <button
                            key={pl.key}
                            onClick={() => handleTogglePledge(pl.key)}
                            className={`w-full text-left rounded-xl p-3 border text-xs leading-relaxed transition-all flex items-start gap-2.5 ${
                              active 
                                ? "bg-art-stone border-art-charcoal/20" 
                                : "bg-white border-art-stone hover:border-art-charcoal/10"
                            }`}
                          >
                            <span className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                              active ? "bg-art-charcoal text-art-bg border-art-charcoal" : "border-art-charcoal/25 bg-white"
                            }`}>
                              {active && <Check className="h-3 w-3" />}
                            </span>
                            <span className={active ? "font-medium text-art-charcoal" : "text-art-charcoal/80 font-light"}>
                              {pl.text}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Completed */}
            {step === 4 && (
              <div className="space-y-6 text-center py-4">
                <div className="space-y-2 max-w-lg mx-auto">
                  <div className="mx-auto h-16 w-16 rounded-full bg-art-sage/10 text-art-sage flex items-center justify-center border border-art-sage/30 relative">
                    <Award className="h-8 w-8 text-art-terracotta animate-bounce" />
                    <Sparkles className="absolute -top-1.5 -right-1.5 h-5 w-5 text-art-terracotta animate-pulse" />
                  </div>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-art-sage block">ONBOARDING SUCCESS</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-art-charcoal italic leading-tight">
                    Cradle Passport Activated
                  </h3>
                  <p className="text-sm font-light text-art-charcoal/85 leading-relaxed">
                    Outstanding, Ananya. You've officially bridged the gap between physical yoga practice and direct, verifiable ecological circularity.
                  </p>
                </div>

                {/* Progress Badges Grid */}
                <div className="max-w-xl mx-auto space-y-3 pt-2">
                  <span className="text-[9px] font-bold text-art-charcoal/60 uppercase tracking-widest block text-left sm:text-center">
                    Milestone Progress Badges Unlocked (2)
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="rounded-2xl border border-art-charcoal/5 bg-art-stone/15 p-4 flex items-center gap-3.5 text-left">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-[#d97d65] text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                        🎓
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-serif font-bold text-art-charcoal text-xs italic">Cradle Onboarded</h4>
                        <p className="text-[10px] text-art-charcoal/70 leading-normal font-light">Completed passport sync setup wizard</p>
                        <span className="inline-block rounded-full bg-art-sage/10 text-art-charcoal px-2 py-0.5 text-[8px] font-mono font-bold uppercase mt-1">
                          Completed • 1/1 step
                        </span>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-art-charcoal/5 bg-art-stone/15 p-4 flex items-center gap-3.5 text-left">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 text-white flex items-center justify-center text-xl shadow-xs shrink-0">
                        ⚡
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-serif font-bold text-art-charcoal text-xs italic">Streak Sensation</h4>
                        <p className="text-[10px] text-art-charcoal/70 leading-normal font-light">Maintain a wellness logging streak of 4+ days</p>
                        <span className="inline-block rounded-full bg-art-sage/10 text-art-charcoal px-2 py-0.5 text-[8px] font-mono font-bold uppercase mt-1">
                          Completed • 4/4 days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Onboarding Points Balance update info */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-art-terracotta/20 bg-art-terracotta/10 px-5 py-2 text-xs font-bold text-art-charcoal shadow-2xs">
                  <span className="flex h-2 w-2 rounded-full bg-art-terracotta animate-ping" />
                  <span>⭐ Claimed Onboarding Bonus: <strong>+150 Reward Points</strong></span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer controls inside slides container */}
        <div className="flex justify-between items-center border-t border-art-stone pt-6 mt-6 relative z-10">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-wider border border-art-charcoal/15 text-art-charcoal disabled:opacity-35 transition-all hover:bg-art-stone/20"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="rounded-full bg-art-charcoal text-art-bg px-6 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all hover:opacity-90"
            >
              Continue <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinishOnboarding}
              className="rounded-full bg-art-charcoal text-art-bg px-8 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all shadow-md hover:bg-opacity-95"
            >
              Enter AI+ Portal <Sparkles className="h-3.5 w-3.5 text-art-cork" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
