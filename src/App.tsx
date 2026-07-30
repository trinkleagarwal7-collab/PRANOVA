import React, { useState } from "react";
import Header from "./components/Header";
import BrandPortal from "./components/BrandPortal";
import UserDashboard from "./components/UserDashboard";
import { Leaf, Award, Compass, Heart, Globe, Lock } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"brand" | "dashboard">("brand");
  const [userPoints, setUserPoints] = useState(250);
  const userName = "Ananya Sharma";

  // Callback to dynamically sync points when actions are taken in the dashboard
  const handleSyncPoints = (newPoints: number) => {
    setUserPoints(newPoints);
  };

  return (
    <div className="min-h-screen flex flex-col bg-art-bg font-sans text-art-charcoal antialiased selection:bg-art-cork/55 selection:text-art-charcoal">
      
      {/* Primary Brand Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userPoints={userPoints}
        userName={userName}
      />

      {/* Main Content Stage */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        {activeTab === "brand" ? (
          <BrandPortal onGoToDashboard={() => setActiveTab("dashboard")} />
        ) : (
          <UserDashboard />
        )}
      </main>

      {/* Premium Corporate-Aligned Footer */}
      <footer className="border-t border-art-charcoal/10 bg-art-stone/30 py-12 text-xs text-art-charcoal/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-art-charcoal/10">
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-art-charcoal text-art-bg">
                  <Leaf className="h-3.5 w-3.5" />
                </div>
                <span className="font-serif italic font-bold text-art-charcoal text-sm tracking-wide">
                  PRANOVA™
                </span>
              </div>
              <p className="max-w-md text-[11px] leading-relaxed opacity-80">
                Empowering people to improve their wellness daily while tracking, recovering, and eliminating their physical environmental footprint through cradle-to-cradle engineering.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-semibold text-art-charcoal/90 uppercase tracking-wider">
              <a href="#showroom" onClick={() => setActiveTab("brand")} className="hover:text-art-sage transition-colors">Product Showroom</a>
              <button onClick={() => setActiveTab("dashboard")} className="hover:text-art-sage transition-colors">AI+ Portal</button>
              <a href="https://ai.studio/build" target="_blank" rel="noopener noreferrer" className="hover:text-art-sage transition-colors">AI Studio Platform</a>
              <span className="flex items-center gap-1 opacity-60">
                <Lock className="h-3 w-3" /> GDPR Encrypted
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] opacity-60">
            <p>© 2026 PRANOVA Sustainable Systems. All rights reserved.</p>
            <div className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              <span>Consciously Engineered in Bangalore & Silicon Valley</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
