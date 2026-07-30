import React from "react";
import { 
  Leaf, Heart, Cpu, RefreshCw, Check, ArrowRight, Sparkles, 
  MapPin, ArrowUpRight, Award
} from "lucide-react";
import { BRAND_PILLARS } from "../data";
import { MatType } from "../types";
import ProductGallery from "./ProductGallery";

interface BrandPortalProps {
  onGoToDashboard: () => void;
}

export default function BrandPortal({ onGoToDashboard }: BrandPortalProps) {
  return (
    <div className="space-y-16 py-8 pb-24 text-art-charcoal font-sans">
      
      {/* 1. Premium Split Hero Section */}
      <section className="relative rounded-3xl bg-art-stone/35 border border-art-charcoal/10 py-12 px-6 sm:px-10 lg:px-16 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left">
        {/* Decorative vertical label on right */}
        <div className="absolute right-4 bottom-24 origin-bottom-right rotate-90 text-[8px] font-mono font-bold uppercase tracking-[0.8em] opacity-20 hidden lg:block pointer-events-none">
          Pranova Renew™ Circular System
        </div>

        {/* Background organic design shapes */}
        <div className="absolute w-[45%] h-[90%] -right-16 top-10 bg-art-stone rounded-full mix-blend-multiply opacity-45 pointer-events-none" />

        {/* Left Content Column */}
        <div className="col-span-1 lg:col-span-6 space-y-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-art-sage/10 border border-art-sage/20 px-3.5 py-1 text-xs text-art-charcoal font-bold tracking-wider uppercase">
              <Sparkles className="h-3 w-3 text-art-terracotta animate-pulse" />
              <span>EARTHMAT™ NOW SHIPPING</span>
            </div>

            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tighter text-art-charcoal font-bold">
              New Energy <br />
              <span className="italic text-art-terracotta">for living.</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base leading-relaxed text-art-charcoal/85 max-w-md font-light">
            The world's first carbon-negative yoga ecosystem. Crafted from natural cork, organic hemp, responsive rubber, and AI-enabled intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              id="hero-primary-btn"
              onClick={onGoToDashboard}
              className="group flex items-center justify-center gap-2 px-8 py-3.5 bg-art-charcoal text-art-bg text-xs font-bold uppercase tracking-widest rounded-full hover:bg-art-charcoal/90 hover:shadow-md transition-all w-full sm:w-auto"
            >
              Enter AI+ Dashboard
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#showroom"
              className="flex items-center justify-center gap-1 px-8 py-3.5 border border-art-charcoal text-art-charcoal text-xs font-bold uppercase tracking-widest rounded-full hover:bg-art-charcoal hover:text-art-bg transition-all w-full sm:w-auto text-center"
            >
              Explore Our Showroom
            </a>
          </div>

          {/* Key Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-art-charcoal/10 text-art-charcoal text-xs font-mono">
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-serif italic font-bold text-base text-art-terracotta">100%</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">PVC & Plastic Free</span>
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-serif italic font-bold text-base text-art-terracotta">₹199/mo</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">AI+ Personal Coach</span>
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-serif italic font-bold text-base text-art-terracotta">Renew™</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Material Returns</span>
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="font-serif italic font-bold text-base text-art-terracotta">GOTS</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Certified Sourcing</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sleek Compact Live Status Panel */}
        <div className="col-span-1 lg:col-span-6 flex items-center justify-center lg:justify-end">
          <div className="w-full max-w-sm rounded-3xl border border-art-charcoal/10 bg-white/75 backdrop-blur-md p-5 space-y-4 shadow-xs text-left">
            {/* AI Coach Status Tracker */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-art-stone pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-art-charcoal">
                    AI Coach Status
                  </span>
                </div>
                <span className="text-[8px] font-mono font-bold uppercase bg-art-sage/10 text-art-charcoal px-2 py-0.5 rounded-full border border-art-sage/10">
                  Active
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-serif italic font-bold text-art-charcoal">Session: Morning Flow</span>
                  <span className="text-[9px] font-mono text-art-charcoal/50">12 / 25 min</span>
                </div>
                <div className="w-full h-1 bg-art-stone rounded-full overflow-hidden">
                  <div className="w-[48%] h-full bg-art-sage"></div>
                </div>
                <p className="text-[10px] text-art-charcoal/70 leading-relaxed italic font-serif">
                  "Your alignment is improving. Focus on grounding through your heels."
                </p>
              </div>
            </div>

            {/* Environmental Impact Statistics */}
            <div className="border-t border-art-stone pt-3 space-y-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-art-charcoal/40 block">
                Ecosystem Metrics
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-art-stone/20 p-2.5 border border-art-charcoal/5 space-y-0.5">
                  <span className="text-[8px] uppercase font-bold tracking-wider text-art-charcoal/55 font-mono block">Plastic Avoided</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-serif font-bold text-art-terracotta italic">4.2</span>
                    <span className="text-[9px] font-mono font-bold text-art-charcoal/60">kg</span>
                  </div>
                </div>
                <div className="rounded-xl bg-art-stone/20 p-2.5 border border-art-charcoal/5 space-y-0.5">
                  <span className="text-[8px] uppercase font-bold tracking-wider text-art-charcoal/55 font-mono block">CO2 Saved</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-serif font-bold text-art-sage italic">12.5</span>
                    <span className="text-[9px] font-mono font-bold text-art-charcoal/60">kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Meaning & Pillars */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <p className="text-xs font-bold tracking-[0.2em] text-art-sage uppercase">Brand Foundations</p>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-art-charcoal italic">
            Meaning Behind the Movement
          </h3>
          <p className="mx-auto max-w-xl text-art-charcoal/80 text-sm font-light">
            Pranova merges ancient mindfulness wisdom with future-facing technology to heal both the individual and our biosphere.
          </p>
        </div>

        {/* Brand Meaning Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="rounded-2xl bg-art-stone/20 border border-art-charcoal/10 p-6 flex items-start gap-4 hover:bg-art-stone/30 transition-all text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-art-charcoal text-art-bg">
              <Heart className="h-5 w-5 text-art-terracotta" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold text-art-charcoal italic">PRANA (Life Energy)</h4>
              <p className="text-xs text-art-charcoal/85 leading-relaxed font-light">
                The vital, invisible life energy that flows through all living things. We design wellness products that honor and cultivate this flow without introducing toxic chemical obstacles.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-art-stone/20 border border-art-charcoal/10 p-6 flex items-start gap-4 hover:bg-art-stone/30 transition-all text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-art-charcoal text-art-bg">
              <Sparkles className="h-5 w-5 text-art-cork" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif text-lg font-bold text-art-charcoal italic">NOVA (New Beginning)</h4>
              <p className="text-xs text-art-charcoal/85 leading-relaxed font-light">
                A bright stellar explosion representing fresh energy, new beginnings, and clean, high-tech circularity that regenerates raw organic components into new premium products.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRAND_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon === "Leaf" ? Leaf : 
                         pillar.icon === "Heart" ? Heart : 
                         pillar.icon === "Cpu" ? Cpu : RefreshCw;
            return (
              <div key={idx} className="group rounded-2xl border border-art-charcoal/10 bg-white/70 p-6 transition-all hover:-translate-y-1 hover:bg-art-stone/30 hover:border-art-charcoal/20 text-left">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-art-stone text-art-charcoal group-hover:bg-art-charcoal group-hover:text-art-bg transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-art-charcoal mb-1.5">{pillar.title}</h4>
                <p className="text-xs text-art-charcoal/80 leading-relaxed font-light">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Boutique Gallery Section */}
      <section id="showroom">
        <ProductGallery />
      </section>

      {/* 4. User Journey: From unboxing to renewal. */}
      <section className="rounded-3xl bg-[#1C2C20] p-8 sm:p-12 space-y-10 relative overflow-hidden text-left">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-art-sage/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-art-terracotta" />
            <p className="text-[10px] font-bold tracking-[0.2em] text-art-terracotta uppercase">User Journey</p>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            From unboxing to renewal.
          </h3>
          <p className="max-w-xl text-white/70 text-xs sm:text-sm font-light leading-relaxed">
            One QR scan connects a physical mat to a lifelong digital relationship with your practice and its footprint.
          </p>
        </div>

        {/* Steps container */}
        <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {[
            { step: "01", title: "Purchase EarthMat™", desc: "Order online or through a partner studio." },
            { step: "02", title: "Scan QR code", desc: "Registration completes in under 60 seconds." },
            { step: "03", title: "Create your profile", desc: "Set goals across yoga, sleep and habits." },
            { step: "04", title: "Activate AI features", desc: "Unlock the coach and wellness planner." },
            { step: "05", title: "Track progress", desc: "Wellness and sustainability, side by side." },
            { step: "06", title: "Join challenges", desc: "Earn points for activity and sustainability." },
            { step: "07", title: "Earn rewards", desc: "Redeem points across the Pranova ecosystem." },
            { step: "08", title: "Renew mat", desc: "Return your mat at end-of-life for circular credit." },
          ].map((item, idx) => (
            <div key={idx} className="min-w-[220px] sm:min-w-[260px] border-l border-white/10 pl-6 space-y-3 shrink-0">
              <div className="text-xs font-mono font-bold text-art-sage">{item.step}</div>
              <h4 className="font-serif font-bold text-base text-white">{item.title}</h4>
              <p className="text-xs text-white/70 leading-relaxed font-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Target Persona Spotlight */}
      <section className="flex justify-center">
        {/* User Persona Highlight Card */}
        <div className="w-full max-w-lg rounded-3xl border border-art-charcoal/10 bg-art-stone/20 p-6 sm:p-8 space-y-6 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-art-cork/30 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-art-charcoal text-art-bg shadow-sm">
              <MapPin className="h-5 w-5 text-art-cork" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-art-charcoal italic">Ananya Sharma</h4>
              <p className="text-[10px] text-art-charcoal/50 uppercase tracking-widest font-bold">Target Persona • PM (Bangalore)</p>
            </div>
          </div>

          <blockquote className="italic text-art-charcoal/90 text-sm border-l-2 border-art-terracotta pl-4 leading-relaxed font-serif">
            "I want my wellness journey to improve both my health and the planet. Eco-friendly mats are expensive and hard to verify. I need real personalization and dynamic environmental feedback."
          </blockquote>

          <div className="space-y-3 text-xs relative z-10">
            <div className="flex justify-between border-b border-art-charcoal/5 pb-2">
              <span className="text-art-charcoal/50 font-bold uppercase tracking-wider text-[10px]">Age</span>
              <span className="text-art-charcoal font-bold">26 Years</span>
            </div>
            <div className="flex justify-between border-b border-art-charcoal/5 pb-2">
              <span className="text-art-charcoal/50 font-bold uppercase tracking-wider text-[10px]">Lifestyle</span>
              <span className="text-art-charcoal/90 font-light">Practices yoga 4×/week, works long hours</span>
            </div>
            <div className="flex justify-between border-b border-art-charcoal/5 pb-2">
              <span className="text-art-charcoal/50 font-bold uppercase tracking-wider text-[10px]">Core Pain Points</span>
              <span className="text-art-charcoal leading-relaxed text-right font-light">Lack of routines, unverified claims, missing carbon scores</span>
            </div>
            <div className="flex justify-between">
              <span className="text-art-charcoal/50 font-bold uppercase tracking-wider text-[10px]">Pranova Solver</span>
              <span className="text-art-sage font-bold uppercase tracking-wider">Passport QR + AI Coach</span>
            </div>
          </div>

          <button
            onClick={onGoToDashboard}
            className="w-full flex items-center justify-center gap-2 rounded-full bg-art-charcoal hover:bg-art-charcoal/90 py-3 text-xs font-bold uppercase tracking-widest text-art-bg shadow-sm transition-all"
          >
            Simulate Passport
            <ArrowUpRight className="h-4 w-4 text-art-terracotta" />
          </button>
        </div>
      </section>
    </div>
  );
}
