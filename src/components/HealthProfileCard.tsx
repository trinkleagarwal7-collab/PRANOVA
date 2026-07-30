import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Sparkles, 
  Heart, 
  ShieldAlert, 
  RefreshCw, 
  Edit, 
  Check, 
  AlertCircle, 
  Sparkle,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Maximize2,
  X,
  Camera,
  Layers,
  HelpCircle,
  Clock,
  ThumbsUp,
  Video,
  Image
} from "lucide-react";
import { HealthProfile, UserProfile } from "../types";

interface HealthProfileCardProps {
  profile: UserProfile;
  onUpdateHealthProfile: (newHealth: HealthProfile) => void;
}

interface Asana {
  name: string;
  duration: string;
  benefits: string;
  modifications: string;
}

interface YogaSuggestion {
  routineName: string;
  suitabilityReason: string;
  asanas: Asana[];
}

// Helper to play synthesized singing bowl bell using Web Audio API
function playSingingBowlChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(220, ctx.currentTime); // Fundamental A3
    
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(221.5, ctx.currentTime); // Warm beating

    const osc3 = ctx.createOscillator();
    osc3.type = "sine";
    osc3.frequency.setValueAtTime(440, ctx.currentTime); // 2nd harmonic
    
    const osc4 = ctx.createOscillator();
    osc4.type = "sine";
    osc4.frequency.setValueAtTime(660, ctx.currentTime); // 3rd harmonic

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    osc3.connect(gainNode);
    osc4.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc3.start();
    osc4.start();

    osc1.stop(ctx.currentTime + 3.0);
    osc2.stop(ctx.currentTime + 3.0);
    osc3.stop(ctx.currentTime + 3.0);
    osc4.stop(ctx.currentTime + 3.0);
  } catch (e) {
    console.warn("Web Audio API not supported", e);
  }
}

// Convert duration like "3 minutes" or "5 breaths" into seconds
function parseAsanaDurationToSeconds(durationStr: string): number {
  const clean = durationStr.toLowerCase();
  const num = parseInt(clean.match(/\d+/)?.[0] || "60", 10);
  if (clean.includes("breath")) {
    return num * 10; // 10s per slow yogic breath cycle (5s inhale, 5s exhale)
  }
  if (clean.includes("minute") || clean.includes("min")) {
    return num * 60;
  }
  return num;
}

// Format duration in mm:ss
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Select curated high-quality asana images that perfectly match the yoga poses
function getYogaPoseImage(poseName: string): string {
  const name = poseName.toLowerCase();
  if (name.includes("mountain") || name.includes("tadasana")) {
    return "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600";
  }
  if (name.includes("warrior ii") || name.includes("virabhadrasana ii")) {
    return "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=600";
  }
  if (name.includes("warrior") || name.includes("virabhadrasana")) {
    return "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&q=80&w=600";
  }
  if (name.includes("bridge") || name.includes("bandhasana")) {
    return "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=600";
  }
  if (name.includes("legs-up") || name.includes("karani")) {
    return "https://images.unsplash.com/photo-1524863380900-26f8d125d4b1?auto=format&fit=crop&q=80&w=600";
  }
  if (name.includes("child") || name.includes("balasana")) {
    return "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&q=80&w=600";
  }
  if (name.includes("cobra") || name.includes("upward") || name.includes("bhujangasana")) {
    return "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600";
  }
  if (name.includes("cat") || name.includes("cow") || name.includes("marjary") || name.includes("bitila")) {
    return "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&q=80&w=600";
  }
  if (name.includes("corpse") || name.includes("savasana") || name.includes("relax")) {
    return "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&q=80&w=600";
  }
  if (name.includes("tree") || name.includes("vrikshasana")) {
    return "https://images.unsplash.com/photo-1561049501-e1f96bdd98ee?auto=format&fit=crop&q=80&w=600";
  }
  if (name.includes("dog") || name.includes("downward") || name.includes("svanasana")) {
    return "https://images.unsplash.com/photo-1599447292180-45fd84092ef0?auto=format&fit=crop&q=80&w=600";
  }
  if (name.includes("meditation") || name.includes("seated") || name.includes("breath")) {
    return "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600";
  }
  if (name.includes("triangle") || name.includes("trikonasana")) {
    return "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600";
  }
  return "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600";
}

// Select curated copyright-free high-quality looping videos matching each posture
function getYogaPoseVideo(poseName: string): string {
  const name = poseName.toLowerCase();
  if (name.includes("mountain") || name.includes("tadasana")) {
    return "https://player.vimeo.com/external/517601449.sd.mp4?s=1246104bc1da94ff410d4022a10e82c162624ca3&profile_id=139&oauth2_token_id=57447761";
  }
  if (name.includes("warrior ii") || name.includes("virabhadrasana ii")) {
    return "https://player.vimeo.com/external/371433846.sd.mp4?s=231ce81048b6c01e67988358485ff743016a69ef&profile_id=139&oauth2_token_id=57447761";
  }
  if (name.includes("warrior") || name.includes("virabhadrasana")) {
    return "https://player.vimeo.com/external/371433846.sd.mp4?s=231ce81048b6c01e67988358485ff743016a69ef&profile_id=139&oauth2_token_id=57447761";
  }
  if (name.includes("bridge") || name.includes("bandhasana")) {
    return "https://player.vimeo.com/external/403848981.sd.mp4?s=b8f52ef76e330559f13958cb02ffba38cbfa0a37&profile_id=139&oauth2_token_id=57447761";
  }
  if (name.includes("legs-up") || name.includes("karani")) {
    return "https://player.vimeo.com/external/384705574.sd.mp4?s=b988f98ec8dc49a2e6f4777a83da7be9f89997bb&profile_id=139&oauth2_token_id=57447761";
  }
  if (name.includes("child") || name.includes("balasana")) {
    return "https://player.vimeo.com/external/435641873.sd.mp4?s=debf8fb64e9a5bc651ec317db6964a275f10eb96&profile_id=139&oauth2_token_id=57447761";
  }
  if (name.includes("cobra") || name.includes("upward") || name.includes("bhujangasana")) {
    return "https://player.vimeo.com/external/435641719.sd.mp4?s=b613e5904031d27572793b82142f36d4f717cf7b&profile_id=139&oauth2_token_id=57447761";
  }
  if (name.includes("cat") || name.includes("cow") || name.includes("marjary") || name.includes("bitila")) {
    return "https://player.vimeo.com/external/482278881.sd.mp4?s=d0092ee020a67b2d2f7823e5cc3b0695029340f1&profile_id=139&oauth2_token_id=57447761";
  }
  if (name.includes("corpse") || name.includes("savasana") || name.includes("relax")) {
    return "https://player.vimeo.com/external/384705574.sd.mp4?s=b988f98ec8dc49a2e6f4777a83da7be9f89997bb&profile_id=139&oauth2_token_id=57447761";
  }
  if (name.includes("tree") || name.includes("vrikshasana")) {
    return "https://player.vimeo.com/external/517601449.sd.mp4?s=1246104bc1da94ff410d4022a10e82c162624ca3&profile_id=139&oauth2_token_id=57447761";
  }
  if (name.includes("dog") || name.includes("downward") || name.includes("svanasana")) {
    return "https://player.vimeo.com/external/482278881.sd.mp4?s=d0092ee020a67b2d2f7823e5cc3b0695029340f1&profile_id=139&oauth2_token_id=57447761";
  }
  return "https://player.vimeo.com/external/435641719.sd.mp4?s=b613e5904031d27572793b82142f36d4f717cf7b&profile_id=139&oauth2_token_id=57447761";
}

// Posture Alignment Skeleton Guide Overlays (SVGs representing AI guidance tracking joints)
function renderAlignmentSkeleton(poseName: string) {
  const name = poseName.toLowerCase();
  
  if (name.includes("mountain") || name.includes("tadasana")) {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Plumb Line */}
        <line x1="50" y1="5" x2="50" y2="95" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3,3" />
        {/* Shoulder Line */}
        <line x1="40" y1="25" x2="60" y2="25" stroke="#d97d65" strokeWidth="1.5" />
        <circle cx="50" cy="15" r="4" stroke="#10b981" strokeWidth="1.5" fill="#fff" />
        <circle cx="50" cy="25" r="2.5" fill="#d97d65" />
        <circle cx="40" cy="25" r="3" fill="#10b981" />
        <circle cx="60" cy="25" r="3" fill="#10b981" />
        <circle cx="50" cy="45" r="3" fill="#10b981" />
        {/* Leg Lines */}
        <line x1="50" y1="45" x2="44" y2="70" stroke="#10b981" strokeWidth="1.5" />
        <line x1="50" y1="45" x2="56" y2="70" stroke="#10b981" strokeWidth="1.5" />
        <line x1="44" y1="70" x2="44" y2="92" stroke="#10b981" strokeWidth="1.5" />
        <line x1="56" y1="70" x2="56" y2="92" stroke="#10b981" strokeWidth="1.5" />
        <circle cx="44" cy="70" r="2.5" fill="#10b981" />
        <circle cx="56" cy="70" r="2.5" fill="#10b981" />
        <circle cx="44" cy="92" r="3" fill="#10b981" />
        <circle cx="56" cy="92" r="3" fill="#10b981" />
        <text x="53" y="38" fill="#10b981" className="text-[4px] font-mono font-bold" style={{ textShadow: "1px 1px 1px black" }}>SPINE DIRECTED</text>
        <text x="53" y="55" fill="#d97d65" className="text-[4px] font-mono font-bold" style={{ textShadow: "1px 1px 1px black" }}>PELVIS NEUTRAL</text>
      </svg>
    );
  }

  if (name.includes("warrior") || name.includes("virabhadrasana")) {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="20" y1="35" x2="80" y2="35" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" />
        <line x1="45" y1="45" x2="70" y2="45" stroke="#d97d65" strokeWidth="2" />
        <line x1="70" y1="45" x2="70" y2="85" stroke="#10b981" strokeWidth="2" />
        <line x1="45" y1="45" x2="25" y2="85" stroke="#10b981" strokeWidth="2" />
        <circle cx="50" cy="20" r="4" fill="#fff" stroke="#10b981" strokeWidth="1.5" />
        <circle cx="45" cy="35" r="3" fill="#10b981" />
        <circle cx="20" cy="35" r="2.5" fill="#10b981" />
        <circle cx="80" cy="35" r="2.5" fill="#10b981" />
        <circle cx="70" cy="45" r="3" fill="#d97d65" />
        <circle cx="70" cy="85" r="2.5" fill="#10b981" />
        <circle cx="25" cy="85" r="2.5" fill="#10b981" />
        <text x="64" y="41" fill="#d97d65" className="text-[4px] font-mono font-bold" style={{ textShadow: "1px 1px 1px black" }}>90° ALIGN</text>
        <text x="22" y="31" fill="#10b981" className="text-[4px] font-mono font-bold" style={{ textShadow: "1px 1px 1px black" }}>ARMS PARALLEL</text>
      </svg>
    );
  }

  if (name.includes("bridge") || name.includes("bandhasana")) {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="5" y1="85" x2="95" y2="85" stroke="#d97d65" strokeWidth="0.5" strokeDasharray="3,3" />
        <line x1="15" y1="80" x2="55" y2="45" stroke="#10b981" strokeWidth="2" />
        <line x1="55" y1="45" x2="75" y2="45" stroke="#10b981" strokeWidth="2" />
        <line x1="75" y1="45" x2="75" y2="85" stroke="#d97d65" strokeWidth="2" />
        <circle cx="10" cy="80" r="4" fill="#fff" stroke="#10b981" strokeWidth="1.5" />
        <circle cx="20" cy="80" r="3" fill="#10b981" />
        <circle cx="55" cy="45" r="3.5" fill="#10b981" />
        <circle cx="75" cy="45" r="3" fill="#d97d65" />
        <circle cx="75" cy="85" r="2.5" fill="#10b981" />
        <text x="45" y="38" fill="#10b981" className="text-[4px] font-mono font-bold" style={{ textShadow: "1px 1px 1px black" }}>LIFT HIPS HIGH</text>
        <text x="70" y="93" fill="#d97d65" className="text-[4px] font-mono font-bold" style={{ textShadow: "1px 1px 1px black" }}>SHINS VERTICAL</text>
      </svg>
    );
  }

  if (name.includes("child") || name.includes("balasana")) {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 25 55 Q 45 35 75 75" fill="none" stroke="#10b981" strokeWidth="2" />
        <circle cx="20" cy="60" r="4" fill="#fff" stroke="#10b981" strokeWidth="1.5" />
        <circle cx="35" cy="50" r="3" fill="#10b981" />
        <circle cx="55" cy="48" r="3" fill="#10b981" />
        <circle cx="75" cy="75" r="3.5" fill="#d97d65" />
        <text x="35" y="32" fill="#10b981" className="text-[4px] font-mono font-bold" style={{ textShadow: "1px 1px 1px black" }}>SPINE EXTENSION</text>
        <text x="63" y="85" fill="#d97d65" className="text-[4px] font-mono font-bold" style={{ textShadow: "1px 1px 1px black" }}>HIPS ON HEELS</text>
      </svg>
    );
  }

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-20" viewBox="0 0 100 100" preserveAspectRatio="none">
      <line x1="50" y1="10" x2="50" y2="90" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,4" />
      <circle cx="50" cy="25" r="4" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="1" />
      <circle cx="50" cy="45" r="5" fill="#d97d65" fillOpacity="0.2" stroke="#d97d65" strokeWidth="1" />
      <circle cx="50" cy="65" r="4" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="1" />
      <text x="18" y="52" fill="#10b981" className="text-[4px] font-mono font-bold" style={{ textShadow: "1px 1px 1px black" }}>BIOMETRIC BALANCE</text>
    </svg>
  );
}

// Select curated step-by-step instructions details matching each posture
function getYogaStepByStepInstructions(poseName: string): string[] {
  const name = poseName.toLowerCase();
  if (name.includes("mountain") || name.includes("tadasana")) {
    return [
      "Stand straight with feet together, big toes touching, heels slightly apart.",
      "Engage your thighs, lift your kneecaps, and tuck your tailbone slightly.",
      "Draw your shoulders back and down, open your chest, and let arms hang naturally.",
      "Balance your weight evenly on both feet and breathe slowly from the diaphragm."
    ];
  }
  if (name.includes("warrior ii") || name.includes("virabhadrasana ii")) {
    return [
      "Stand wide with feet 3-4 feet apart, turn right foot out 90° and left foot in slightly.",
      "Inhale and raise your arms parallel to the floor, reaching out actively to the sides.",
      "Exhale and bend your right knee over the right ankle, keeping thighs aligned.",
      "Turn your head to gaze over your right fingertips, keeping your torso perfectly upright."
    ];
  }
  if (name.includes("warrior") || name.includes("virabhadrasana")) {
    return [
      "Step your right foot forward into a deep lunge and pivot your left heel down.",
      "Raise your arms straight up overhead, keeping shoulders relaxed and chest open.",
      "Square your hips forward as much as possible, pressing through the outer back heel.",
      "Gaze up toward your hands, keeping your core engaged and spine elongated."
    ];
  }
  if (name.includes("bridge") || name.includes("bandhasana")) {
    return [
      "Lie flat on your back, bend your knees, and place feet flat on the floor hip-width apart.",
      "Exhale, press your feet and arms active into the floor, and lift your hips high.",
      "Clasp your hands together beneath your back and roll your shoulders inwards.",
      "Keep your thighs and feet parallel, lifting the sternum toward the chin."
    ];
  }
  if (name.includes("legs-up") || name.includes("karani")) {
    return [
      "Sit close to a wall, roll onto your back, and extend your legs straight up against the wall.",
      "Rest your shoulders and head flat on the floor, keeping your tailbone grounded.",
      "Place arms out to the sides with palms facing up to open up the thoracic chest.",
      "Close your eyes and focus on deep, slow, and rhythmic diaphragmatic breathing."
    ];
  }
  if (name.includes("child") || name.includes("balasana")) {
    return [
      "Kneel on the floor, touch your big toes together, and sit back on your heels.",
      "Exhale and lay your torso down between your thighs, forehead resting on the mat.",
      "Extend your arms forward with palms facing down, or sweep them back by your hips.",
      "Let all tension release from your shoulders, neck, and lower spine with each breath."
    ];
  }
  if (name.includes("cobra") || name.includes("upward") || name.includes("bhujangasana")) {
    return [
      "Lie prone on your stomach with your legs extended and tops of feet flat on the floor.",
      "Place your hands on the mat directly under your shoulders, hugging elbows close to your body.",
      "Inhale, press tops of feet and thighs down, and slowly straighten arms to lift chest up.",
      "Keep your shoulders drawn down and back, distributing the curve evenly through your back."
    ];
  }
  if (name.includes("cat") || name.includes("cow") || name.includes("marjary") || name.includes("bitila")) {
    return [
      "Start on all fours with hands directly under shoulders and knees under hips.",
      "For Cow: Inhale, drop your belly toward the floor, lift your chest, and gaze upward.",
      "For Cat: Exhale, round your spine toward the ceiling, tucking chin to chest.",
      "Flow smoothly between these two shapes, pacing the movement with your breath cycles."
    ];
  }
  if (name.includes("corpse") || name.includes("savasana") || name.includes("relax")) {
    return [
      "Lie flat on your back, letting your feet drop open naturally to the sides.",
      "Place arms slightly away from the torso with palms facing up, fingers soft.",
      "Relax your jaw, eyes, brow, and let the weight of your entire body sink into the floor.",
      "Remain completely still, letting go of all mental focus, enjoying absolute quietude."
    ];
  }
  if (name.includes("tree") || name.includes("vrikshasana")) {
    return [
      "Stand tall in Mountain pose, shift your weight onto your left foot.",
      "Bend your right knee, reach down, and place your right foot on your left inner thigh or calf (avoid the knee).",
      "Press your right foot firmly into the thigh, and thighs back into the foot.",
      "Bring hands to prayer position at your chest, or extend them up toward the sky."
    ];
  }
  if (name.includes("dog") || name.includes("downward") || name.includes("svanasana")) {
    return [
      "From tabletop, walk hands a few inches forward and curl your toes under.",
      "Exhale, lift knees off the mat, and push your hips up and back toward the sky.",
      "Press down firmly into your palms and knuckles, elongating your spine.",
      "Pedal your feet gently to open the hamstrings, eventually settling heels toward the floor."
    ];
  }
  return [
    "Assume a comfortable stable position on your yoga mat.",
    "Focus on slow, mindful inhalations and exhalations through the nose.",
    "Engage your muscles lightly to maintain balance and safe joint alignment.",
    "Listen to your body and back off if you feel any sudden tension or pain."
  ];
}

export default function HealthProfileCard({ profile, onUpdateHealthProfile }: HealthProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Local form state
  const [bodyType, setBodyType] = useState(profile.healthProfile?.bodyType || "");
  const [medicalConditions, setMedicalConditions] = useState(profile.healthProfile?.medicalConditions || "");
  const [specificConcerns, setSpecificConcerns] = useState(profile.healthProfile?.specificConcerns || "");
  const [fitnessLevel, setFitnessLevel] = useState(profile.healthProfile?.fitnessLevel || "Intermediate");

  // Suggestion results state
  const [suggestion, setSuggestion] = useState<YogaSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Interactive Practice State
  const [activePracticeRoutine, setActivePracticeRoutine] = useState<YogaSuggestion | null>(null);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isPracticePlaying, setIsPracticePlaying] = useState(false);
  const [showSkeletalGuide, setShowSkeletalGuide] = useState<Record<number, boolean>>({});
  const [enableSound, setEnableSound] = useState(true);
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathTimer, setBreathTimer] = useState(0);
  const [visualMode, setVisualMode] = useState<"image" | "video">("video");

  const handleStartPractice = (routine: YogaSuggestion) => {
    setActivePracticeRoutine(routine);
    setCurrentPracticeIndex(0);
    const secs = parseAsanaDurationToSeconds(routine.asanas[0].duration);
    setTimeLeft(secs);
    setTotalSeconds(secs);
    setIsPracticePlaying(true);
    if (enableSound) playSingingBowlChime();
  };

  const toggleSkeletalForAsana = (idx: number) => {
    setShowSkeletalGuide(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Countdown Timer Hook
  useEffect(() => {
    let timer: any = null;
    if (activePracticeRoutine && isPracticePlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Chime on complete!
            if (enableSound) playSingingBowlChime();
            // Automatically advance or complete
            if (currentPracticeIndex < activePracticeRoutine.asanas.length - 1) {
              const nextIdx = currentPracticeIndex + 1;
              setCurrentPracticeIndex(nextIdx);
              const nextSecs = parseAsanaDurationToSeconds(activePracticeRoutine.asanas[nextIdx].duration);
              setTotalSeconds(nextSecs);
              return nextSecs;
            } else {
              setIsPracticePlaying(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activePracticeRoutine, isPracticePlaying, currentPracticeIndex, enableSound, timeLeft]);

  // Breath pacing loop (Inhale 4s -> Hold 2s -> Exhale 4s)
  useEffect(() => {
    let breathId: any = null;
    if (activePracticeRoutine && isPracticePlaying) {
      breathId = setInterval(() => {
        setBreathTimer(prev => {
          const next = prev + 1;
          if (breathPhase === "inhale" && next >= 4) {
            setBreathPhase("hold");
            return 0;
          } else if (breathPhase === "hold" && next >= 2) {
            setBreathPhase("exhale");
            return 0;
          } else if (breathPhase === "exhale" && next >= 4) {
            setBreathPhase("inhale");
            return 0;
          }
          return next;
        });
      }, 1000);
    } else {
      setBreathTimer(0);
      setBreathPhase("inhale");
    }
    return () => {
      if (breathId) clearInterval(breathId);
    };
  }, [activePracticeRoutine, isPracticePlaying, breathPhase]);

  // Sync state if profile changes
  useEffect(() => {
    if (profile.healthProfile) {
      setBodyType(profile.healthProfile.bodyType);
      setMedicalConditions(profile.healthProfile.medicalConditions);
      setSpecificConcerns(profile.healthProfile.specificConcerns);
      setFitnessLevel(profile.healthProfile.fitnessLevel);
    }
  }, [profile.healthProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: HealthProfile = {
      bodyType,
      medicalConditions: medicalConditions || "None",
      specificConcerns: specificConcerns || "General flexibility & stress relief",
      fitnessLevel,
      lastUpdated: new Date().toISOString().split("T")[0]
    };
    onUpdateHealthProfile(updated);
    setIsEditing(false);
    // Clear any stale suggestion so they can generate a fresh one
    setSuggestion(null);
  };

  const handleFetchSuggestion = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const response = await fetch("/api/gemini/suggest-yoga", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          healthProfile: {
            bodyType,
            medicalConditions,
            specificConcerns,
            fitnessLevel
          }
        })
      });

      if (!response.ok) {
        throw new Error("Unable to fetch personalized suggestions. Please verify your internet connection or try again.");
      }

      const data = await response.json();
      setSuggestion(data);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="health-profile-section" className="rounded-3xl border border-art-charcoal/10 bg-white p-5 space-y-4 shadow-2xs text-left">
      {/* Header */}
      <div className="border-b border-art-stone pb-3 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Heart className="h-4.5 w-4.5 text-art-terracotta fill-art-terracotta/20" />
            <h4 className="font-serif text-sm font-bold text-art-charcoal italic">My Mindful Intake & Health Customizer</h4>
          </div>
          <p className="text-[11px] text-art-charcoal/60 font-light">
            Record your medical details & body type to align the AI Coach suggestions perfectly.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-full bg-art-stone hover:bg-art-stone/80 text-art-charcoal text-[10px] font-bold px-3 py-1.5 transition-all flex items-center gap-1 uppercase tracking-wider"
          >
            <Edit className="w-3 h-3" />
            <span>Update Details</span>
          </button>
        )}
      </div>

      {isEditing ? (
        /* Edit Form */
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-art-charcoal/50 uppercase tracking-wider block">
                Body Type / Constitution
              </label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full rounded-xl border border-art-charcoal/10 bg-white p-2.5 text-xs focus:ring-1 focus:ring-art-charcoal focus:outline-none font-medium"
                required
              >
                <option value="">-- Choose Constitution --</option>
                <option value="Vata (Slim/Light, prone to cool dry joints)">Vata (Slim & Light)</option>
                <option value="Pitta (Medium/Athletic, heat-oriented, flexible)">Pitta (Medium & Athletic)</option>
                <option value="Kapha (Sturdy/Heavy, slower metabolic flow, high stamina)">Kapha (Sturdy & Strong)</option>
                <option value="Agile / Slim Profile (General)">Agile / Slim Profile</option>
                <option value="Average / Moderate build (General)">Average / Moderate Build</option>
                <option value="Sturdy / Broad-shouldered (General)">Sturdy / Broad Build</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-art-charcoal/50 uppercase tracking-wider block">
                Practice Level
              </label>
              <select
                value={fitnessLevel}
                onChange={(e) => setFitnessLevel(e.target.value)}
                className="w-full rounded-xl border border-art-charcoal/10 bg-white p-2.5 text-xs focus:ring-1 focus:ring-art-charcoal focus:outline-none font-medium"
              >
                <option value="Beginner">Beginner (Gentle, basic hold)</option>
                <option value="Intermediate">Intermediate (Calm flows & stretches)</option>
                <option value="Advanced">Advanced (Vigorous focus & inversions)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-art-charcoal/50 uppercase tracking-wider block">
              Yoga Concerns (Focus areas)
            </label>
            <input
              type="text"
              value={specificConcerns}
              onChange={(e) => setSpecificConcerns(e.target.value)}
              placeholder="e.g. Sitting stiffness, lower back compression, stress, hip opening"
              className="w-full rounded-xl border border-art-charcoal/10 bg-white p-2.5 text-xs focus:ring-1 focus:ring-art-charcoal focus:outline-none font-light"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <label className="text-[10px] font-bold text-art-charcoal/50 uppercase tracking-wider block">
                Medical Conditions / Health Issues
              </label>
              <ShieldAlert className="h-3.5 w-3.5 text-art-terracotta shrink-0" />
            </div>
            <input
              type="text"
              value={medicalConditions}
              onChange={(e) => setMedicalConditions(e.target.value)}
              placeholder="e.g. Left knee injury, lower back disk herniation, wrist pain, none"
              className="w-full rounded-xl border border-art-charcoal/10 bg-white p-2.5 text-xs focus:ring-1 focus:ring-art-charcoal focus:outline-none font-light"
            />
            <p className="text-[9px] text-art-charcoal/40 italic">We use this to recommend safe poses and provide adjustments.</p>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 rounded-full bg-art-charcoal hover:bg-art-charcoal/95 text-art-bg font-bold py-2.5 uppercase tracking-wider text-[10px]"
            >
              Save Wellness Profile
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-full border border-art-charcoal/10 bg-art-stone/15 hover:bg-art-stone/30 font-bold px-4 py-2.5 text-art-charcoal text-[10px]"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* Read-only Display & Suggestion Trigger */
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl bg-art-stone/20 p-3 border border-art-charcoal/5 space-y-0.5">
              <span className="text-[9px] text-art-charcoal/40 font-bold uppercase tracking-wider block">Constitution</span>
              <span className="font-semibold text-art-charcoal block line-clamp-1">
                {profile.healthProfile?.bodyType || "Not recorded yet"}
              </span>
            </div>
            <div className="rounded-2xl bg-art-stone/20 p-3 border border-art-charcoal/5 space-y-0.5">
              <span className="text-[9px] text-art-charcoal/40 font-bold uppercase tracking-wider block">Fitness Level</span>
              <span className="font-semibold text-art-charcoal block">
                {profile.healthProfile?.fitnessLevel || "Intermediate"}
              </span>
            </div>
            <div className="rounded-2xl bg-art-stone/20 p-3 border border-art-charcoal/5 space-y-0.5 col-span-2">
              <span className="text-[9px] text-art-charcoal/40 font-bold uppercase tracking-wider block">Yoga Concerns</span>
              <span className="font-medium text-art-charcoal block">
                {profile.healthProfile?.specificConcerns || "General stretch and stress release"}
              </span>
            </div>
            <div className="rounded-2xl bg-art-terracotta/5 p-3 border border-art-terracotta/10 space-y-0.5 col-span-2 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-art-terracotta shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[9px] text-art-terracotta/75 font-bold uppercase tracking-wider block">Safety / Medical Limitations</span>
                <span className="font-medium text-art-charcoal block text-[11px]">
                  {profile.healthProfile?.medicalConditions || "None declared"}
                </span>
              </div>
            </div>
          </div>

          {/* Prompt action to get tailored suggestions */}
          <div className="pt-2 border-t border-art-stone space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-art-charcoal/50 uppercase tracking-widest block font-mono">
                Today's Daily Curated Suggestions
              </span>
              <button
                onClick={handleFetchSuggestion}
                disabled={isLoading}
                className="flex items-center gap-1 text-[10px] font-bold text-art-terracotta hover:text-art-terracotta/80 transition-colors uppercase tracking-wider font-mono disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
                <span>{suggestion ? "Re-Generate" : "Generate Custom Sequence"}</span>
              </button>
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className="p-6 rounded-2xl bg-art-stone/15 border border-art-charcoal/5 flex flex-col items-center justify-center space-y-2.5 text-center">
                <div className="relative">
                  <Activity className="h-6 w-6 text-art-terracotta animate-pulse" />
                  <Sparkle className="h-4 w-4 text-art-sage absolute -top-1.5 -right-1.5 animate-spin duration-3000" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-art-charcoal">Analyzing health profile...</p>
                  <p className="text-[10px] text-art-charcoal/50 max-w-xs font-light">
                    Pranova AI is consulting bio-mechanics guidelines to curate a joint-safe morning routine.
                  </p>
                </div>
              </div>
            )}

            {/* Error state */}
            {apiError && (
              <div className="rounded-2xl bg-art-terracotta/10 border border-art-terracotta/20 p-3.5 text-xs text-art-charcoal flex items-start gap-2.5">
                <AlertCircle className="h-4.5 w-4.5 text-art-terracotta shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold">Recommendation Blocked</span>
                  <p className="text-[10px] text-art-charcoal/70 leading-relaxed">{apiError}</p>
                </div>
              </div>
            )}

            {/* Suggestions Results Display */}
            {suggestion && (
              <div className="space-y-4 animate-fadeIn">
                <div className="rounded-2xl bg-art-sage/10 border border-art-sage/20 p-3.5 space-y-1.5 text-left">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-art-sage animate-pulse" />
                    <h5 className="font-serif italic font-bold text-xs text-art-charcoal">{suggestion.routineName}</h5>
                  </div>
                  <p className="text-[11px] text-art-charcoal/80 leading-relaxed font-light">
                    {suggestion.suitabilityReason}
                  </p>
                </div>

                {/* List of custom Asanas with Detailed Text Presentation */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-art-charcoal/40 uppercase tracking-widest font-mono">
                      Postures Overview & Flow Guide
                    </span>
                  </div>

                  {suggestion.asanas.map((asana, idx) => (
                    <div key={idx} className="rounded-2xl border border-art-charcoal/5 bg-art-stone/10 p-4 space-y-3 text-xs shadow-2xs text-left">
                      <div className="flex justify-between items-start gap-2 border-b border-art-charcoal/5 pb-2">
                        <span className="font-bold text-art-charcoal text-[12px] leading-snug">
                          {idx + 1}. {asana.name}
                        </span>
                        <span className="text-[9px] font-mono font-bold bg-art-charcoal/5 text-art-charcoal px-2 py-0.5 rounded-full border border-art-charcoal/10 whitespace-nowrap shrink-0">
                          ⏱️ {asana.duration}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <span className="font-bold text-art-charcoal uppercase tracking-wider text-[8px] block">
                          📝 STEP-BY-STEP INSTRUCTIONS:
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-art-charcoal/90 pl-1 leading-relaxed text-[10.5px]">
                          {getYogaStepByStepInstructions(asana.name).map((step, sIdx) => (
                            <li key={sIdx} className="font-light">
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <span className="font-bold text-art-sage uppercase tracking-wider text-[8px] block">Specific Benefit:</span>
                          <p className="text-art-charcoal/80 font-light text-[10px] leading-relaxed">
                            {asana.benefits}
                          </p>
                        </div>

                        <div className="bg-white/85 rounded-xl p-2.5 border border-art-charcoal/5 space-y-0.5">
                          <span className="font-bold text-art-terracotta uppercase tracking-wider text-[8px] block flex items-center gap-1">
                            <ShieldAlert className="h-3 w-3" />
                            HOW TO ALIGN & AVOID MISTAKES:
                          </span>
                          <p className="text-art-charcoal/80 font-light text-[10px] italic leading-relaxed">
                            {asana.modifications}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Big Immersive Practice Session Trigger */}
                <button
                  onClick={() => handleStartPractice(suggestion)}
                  className="w-full rounded-2xl bg-art-charcoal hover:bg-art-charcoal/90 text-white py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md mt-4 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-current text-art-sage" />
                  <span>Start Live Guided Practice Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Immersive Practice Overlay */}
      {activePracticeRoutine && (
        <div className="fixed inset-0 z-50 bg-art-stone/95 backdrop-blur-md flex flex-col justify-between p-6 overflow-y-auto animate-fadeIn">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-art-charcoal/10 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-art-sage uppercase tracking-widest font-mono">
                Pranova Immersive Practice Session
              </span>
              <h3 className="font-serif text-lg font-bold text-art-charcoal italic leading-tight">
                {activePracticeRoutine.routineName}
              </h3>
            </div>
            <button
              onClick={() => {
                setActivePracticeRoutine(null);
                setIsPracticePlaying(false);
              }}
              className="p-2 bg-white rounded-full border border-art-charcoal/10 hover:bg-art-stone/20 text-art-charcoal transition-colors shadow-xs"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main content grid */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center">
            
            {/* Step-by-Step Interactive Practice Board (7 cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-4 h-full justify-center">
              <div className="bg-white p-6 rounded-3xl border border-art-charcoal/10 shadow-xs space-y-5 text-left">
                <div className="flex items-center justify-between border-b border-art-stone pb-3">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-art-sage uppercase tracking-widest font-mono block">
                      Active Pose Setup & Technique
                    </span>
                    <h4 className="font-serif text-lg font-bold text-art-charcoal italic">
                      Step-by-Step Correct Guidance
                    </h4>
                  </div>
                  <div className="bg-art-sage/10 text-art-sage rounded-full px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    <span>Live Alignment Scan Active</span>
                  </div>
                </div>

                {/* Animated/Structured step timeline */}
                <div className="space-y-3.5">
                  {getYogaStepByStepInstructions(activePracticeRoutine.asanas[currentPracticeIndex].name).map((step, sIdx) => (
                    <div 
                      key={sIdx} 
                      className="flex gap-3.5 items-start p-3.5 rounded-2xl border border-art-charcoal/5 bg-art-stone/20 transition-all duration-300"
                    >
                      <div className="h-6 w-6 rounded-full bg-art-charcoal text-white flex items-center justify-center text-[10px] font-bold shrink-0 shadow-2xs">
                        {sIdx + 1}
                      </div>
                      <p className="text-xs text-art-charcoal leading-relaxed font-light pt-0.5">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>



              {/* Breathing pacing circle to follow with peripheral vision */}
              <div className="flex items-center gap-4 bg-white/85 border border-art-charcoal/5 px-5 py-3 rounded-2xl w-full max-w-md shadow-xs justify-between">
                <div className="space-y-0.5 text-left">
                  <span className="text-[9px] text-art-charcoal/40 font-bold uppercase tracking-wider block">Breath Coach</span>
                  <span className="text-xs font-bold text-art-charcoal capitalize">
                    {breathPhase === "inhale" ? "Inhale... Fill the Lungs" : breathPhase === "hold" ? "Hold... Find Stillness" : "Exhale... Let it Go"}
                  </span>
                </div>
                {/* Pulsing visual circle */}
                <div className="relative flex items-center justify-center">
                  <div 
                    className={`h-10 w-10 rounded-full bg-art-sage/20 border-2 border-art-sage flex items-center justify-center transition-all duration-1000 ${
                      breathPhase === "inhale" ? "scale-125 bg-art-sage/35" : breathPhase === "hold" ? "scale-125 ring-4 ring-art-sage/10" : "scale-75 bg-art-sage/10"
                    }`}
                  >
                    <Sparkle className="h-4 w-4 text-art-sage" />
                  </div>
                </div>
              </div>
            </div>

            {/* Timers & Text Guides (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5 text-left h-full">
              {/* Active Asana Details */}
              <div className="space-y-4 bg-white p-5 rounded-3xl border border-art-charcoal/5 shadow-xs max-h-[460px] overflow-y-auto">
                <div>
                  <span className="text-[10px] font-bold text-art-terracotta uppercase tracking-wider block font-mono">
                    Pose {currentPracticeIndex + 1} of {activePracticeRoutine.asanas.length}
                  </span>
                  <h4 className="font-serif text-xl font-bold text-art-charcoal">
                    {activePracticeRoutine.asanas[currentPracticeIndex].name}
                  </h4>
                </div>

                <div className="flex items-center gap-4 py-2 border-y border-art-stone">
                  {/* Big Timer */}
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-art-charcoal" />
                    <span className="font-mono text-3xl font-bold text-art-charcoal tracking-wider">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  {/* Play/Pause Button */}
                  <button
                    onClick={() => setIsPracticePlaying(!isPracticePlaying)}
                    className="p-2.5 bg-art-charcoal hover:bg-art-charcoal/90 text-white rounded-full transition-all active:scale-95 cursor-pointer"
                  >
                    {isPracticePlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                  </button>
                  {/* Reset Button */}
                  <button
                    onClick={() => {
                      const secs = parseAsanaDurationToSeconds(activePracticeRoutine.asanas[currentPracticeIndex].duration);
                      setTimeLeft(secs);
                    }}
                    className="p-2 bg-art-stone hover:bg-art-stone/80 text-art-charcoal rounded-full transition-all cursor-pointer"
                    title="Reset Pose Timer"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                {/* Step-by-Step Details & Biofeedback guides */}
                <div className="space-y-3.5 pt-1 text-xs">
                  {/* Step-by-Step Details */}
                  <div className="space-y-2">
                    <span className="font-bold text-art-charcoal uppercase tracking-wider text-[9px] block">
                      🎬 STEP-BY-STEP VIDEO DETAILS:
                    </span>
                    <ol className="list-decimal list-inside space-y-1.5 text-art-charcoal/90 leading-relaxed font-light pl-1">
                      {getYogaStepByStepInstructions(activePracticeRoutine.asanas[currentPracticeIndex].name).map((step, sIdx) => (
                        <li key={sIdx} className="text-xs">
                          <span className="font-normal text-art-charcoal">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <span className="font-bold text-art-sage uppercase tracking-wider text-[9px] block">Specific Benefit:</span>
                    <p className="text-art-charcoal font-light leading-relaxed">
                      {activePracticeRoutine.asanas[currentPracticeIndex].benefits}
                    </p>
                  </div>

                  <div className="bg-art-terracotta/5 rounded-2xl p-3.5 border border-art-terracotta/10 space-y-1">
                    <span className="font-bold text-art-terracotta uppercase tracking-wider text-[9px] block flex items-center gap-1.5">
                      <ShieldAlert className="h-4 w-4" />
                      HOW TO ALIGN & AVOID MISTAKES:
                    </span>
                    <p className="text-art-charcoal leading-relaxed font-normal">
                      {activePracticeRoutine.asanas[currentPracticeIndex].modifications}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation and sound controls */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setEnableSound(!enableSound)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-art-charcoal/10 bg-white hover:bg-art-stone/20 text-art-charcoal text-[10px] font-bold uppercase tracking-wider"
                >
                  {enableSound ? <Volume2 className="h-3.5 w-3.5 animate-pulse" /> : <VolumeX className="h-3.5 w-3.5" />}
                  <span>Bowl Bell {enableSound ? "On" : "Muted"}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    disabled={currentPracticeIndex === 0}
                    onClick={() => {
                      const prevIdx = currentPracticeIndex - 1;
                      setCurrentPracticeIndex(prevIdx);
                      const secs = parseAsanaDurationToSeconds(activePracticeRoutine.asanas[prevIdx].duration);
                      setTimeLeft(secs);
                      setTotalSeconds(secs);
                    }}
                    className="p-3 bg-white border border-art-charcoal/10 hover:bg-art-stone/20 rounded-full transition-all disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  <button
                    disabled={currentPracticeIndex === activePracticeRoutine.asanas.length - 1}
                    onClick={() => {
                      const nextIdx = currentPracticeIndex + 1;
                      setCurrentPracticeIndex(nextIdx);
                      const secs = parseAsanaDurationToSeconds(activePracticeRoutine.asanas[nextIdx].duration);
                      setTimeLeft(secs);
                      setTotalSeconds(secs);
                    }}
                    className="p-3 bg-white border border-art-charcoal/10 hover:bg-art-stone/20 rounded-full transition-all disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Timeline progress */}
          <div className="border-t border-art-charcoal/10 pt-4 flex items-center justify-between text-xs text-art-charcoal/60">
            <span className="font-light">Practice Session in Progress</span>
            <div className="flex gap-1.5">
              {activePracticeRoutine.asanas.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentPracticeIndex
                      ? "w-8 bg-art-charcoal"
                      : i < currentPracticeIndex
                      ? "w-3 bg-art-sage"
                      : "w-3 bg-art-charcoal/10"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => {
                setActivePracticeRoutine(null);
                setIsPracticePlaying(false);
              }}
              className="text-art-terracotta font-bold uppercase tracking-wider text-[10px] hover:underline"
            >
              End Practice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
