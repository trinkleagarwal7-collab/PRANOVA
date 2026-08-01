import React, { useState } from "react";
import { Leaf, Check, Sparkles, AlertCircle, ShoppingBag, ArrowRight, Shield, Globe } from "lucide-react";
import earthmatEssentialImg from "../assets/images/earthmat_essential_1784473124331.jpg";
import earthmatProFlowImg from "../assets/images/earthmat_pro_flow_1784473137026.jpg";

interface Product {
  id: string;
  name: string;
  tagline: string;
  price: string;
  material: string;
  creditValue: string;
  carbonOffset: string;
  plasticSaved: string;
  imageColor: string; // Tailwind class representing the organic palette
  imageUrl: string; // Path to generated image asset
  features: string[];
  specs: { [key: string]: string };
}

export default function ProductGallery() {
  const [selectedProduct, setSelectedProduct] = useState<string>("p1");
  const [showPassport, setShowPassport] = useState<boolean>(false);

  const PRODUCTS: Product[] = [
    {
      id: "p1",
      name: "EarthMat™ Essential",
      tagline: "The foundation of circular daily yoga practices",
      price: "₹4,999",
      material: "Sustainably harvested Portuguese cork + wild Hevea rubber",
      creditValue: "₹600",
      carbonOffset: "4.5 kg CO2",
      plasticSaved: "1.2 kg PVC",
      imageColor: "bg-[#cca47c]/30",
      imageUrl: earthmatEssentialImg,
      features: [
        "Sweat-activated grip enhancement",
        "Naturally antimicrobial, non-toxic surface",
        "4mm optimal anatomical grounding density"
      ],
      specs: {
        "Dimensions": "183cm × 61cm × 4mm",
        "Weight": "2.4 kg",
        "Cradle Cert": "Gold Status Circularity",
        "Sourcing": "GOTS Certified Organic"
      }
    },
    {
      id: "p2",
      name: "EarthMat™ Pro-Flow",
      tagline: "Laser-etched biological alignment grid for experts",
      price: "₹6,499",
      material: "Fine grain cork bark + double-layer native vulcanized rubber",
      creditValue: "₹800",
      carbonOffset: "6.2 kg CO2",
      plasticSaved: "1.5 kg PVC",
      imageColor: "bg-[#7fa690]/30",
      imageUrl: earthmatProFlowImg,
      features: [
        "Laser-etched non-toxic alignment lines",
        "Ultra-dense 6mm joint cushion",
        "Reinforced organic hemp structural mesh"
      ],
      specs: {
        "Dimensions": "185cm × 66cm × 6mm",
        "Weight": "3.1 kg",
        "Cradle Cert": "Platinum Status Circularity",
        "Sourcing": "Fair Trade Sourced Latex"
      }
    }
  ];

  const activeProduct = PRODUCTS.find((p) => p.id === selectedProduct) || PRODUCTS[0];

  return (
    <div id="product-showroom" className="rounded-3xl border border-art-charcoal/10 bg-white p-6 shadow-2xs text-left space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-art-stone pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-art-terracotta" />
            <h4 className="font-serif text-lg font-bold text-art-charcoal italic">Circular Boutique Showroom</h4>
          </div>
          <p className="text-xs text-art-charcoal/60 font-light">
            Invest in botanical, chemical-free equipment that has a positive, guaranteed cradle-to-cradle lifespan.
          </p>
        </div>
        <span className="text-[10px] font-mono font-bold bg-art-sage/10 text-art-charcoal border border-art-sage/20 px-3 py-1 rounded-full uppercase">
          100% Circular Guarantees
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Product Picker List (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[10px] font-bold text-art-charcoal/50 uppercase tracking-widest block mb-1">
            Sustainably Crafted Goods
          </span>
          <div className="space-y-2.5">
            {PRODUCTS.map((prod) => {
              const isSelected = selectedProduct === prod.id;
              return (
                <button
                  key={prod.id}
                  onClick={() => {
                    setSelectedProduct(prod.id);
                    setShowPassport(false);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    isSelected 
                      ? "bg-art-stone border-art-charcoal/20 shadow-2xs" 
                      : "bg-transparent border-art-charcoal/5 hover:bg-art-stone/35 hover:border-art-charcoal/10"
                  }`}
                >
                  {/* Real product image thumbnail */}
                  <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center relative overflow-hidden bg-art-stone border border-art-charcoal/10`}>
                    <img 
                      src={prod.imageUrl} 
                      alt={prod.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-art-terracotta border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-center w-full gap-2">
                      <span className="font-serif text-sm font-bold text-art-charcoal">{prod.name}</span>
                      <span className="text-xs font-mono font-bold text-art-terracotta">{prod.price}</span>
                    </div>
                    <p className="text-[11px] text-art-charcoal/60 leading-tight font-light line-clamp-1">
                      {prod.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Product Details & ESG Passport (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-art-stone/15 rounded-2xl p-5 border border-art-charcoal/5 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            {/* Upper Info Row */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-art-stone/60 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl font-bold text-art-charcoal italic">{activeProduct.name}</h3>
                  <span className="rounded-full bg-art-sage/10 text-art-charcoal px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest border border-art-sage/25">
                    ESG Verified
                  </span>
                </div>
                <p className="text-xs text-art-charcoal/80 font-light italic">{activeProduct.tagline}</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-art-charcoal/50 block font-mono font-bold uppercase">PRICE</span>
                <span className="text-2xl font-serif font-bold text-art-charcoal">{activeProduct.price}</span>
              </div>
            </div>

            {/* Toggle Passport/Overview Panel */}
            {!showPassport ? (
              // Standard Product Overview with 2-Column Image and Specs split
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-1">
                
                {/* Product Image Panel (md:col-span-5) */}
                <div className="md:col-span-5 space-y-2">
                  <span className="text-[9px] font-bold text-art-charcoal/50 uppercase tracking-widest block font-mono">
                    Product Image
                  </span>
                  <div className="relative rounded-2xl overflow-hidden aspect-square bg-white border border-art-charcoal/10 shadow-3xs group">
                    <img 
                      src={activeProduct.imageUrl} 
                      alt={activeProduct.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition-all duration-500" 
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-[8px] font-mono font-bold uppercase text-art-charcoal border border-art-charcoal/10 px-2 py-0.5 rounded-md">
                      Cradle verified
                    </div>
                  </div>
                </div>

                {/* Technical Specifications & Innovations Panel (md:col-span-7) */}
                <div className="md:col-span-7 space-y-4">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-[#cca47c] uppercase tracking-widest block font-mono">
                      Design Innovations
                    </span>
                    <ul className="space-y-1.5">
                      {activeProduct.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs font-light">
                          <Check className="h-4 w-4 text-art-sage shrink-0 mt-0.5" />
                          <span className="text-art-charcoal/90">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-art-charcoal/50 uppercase tracking-widest block font-mono">
                      Specifications
                    </span>
                    <div className="rounded-xl border border-art-stone bg-white p-3 text-xs divide-y divide-art-stone/60">
                      {Object.entries(activeProduct.specs).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-1.5 first:pt-0 last:pb-0">
                          <span className="text-art-charcoal/50 uppercase font-bold text-[8px] tracking-wider">{key}</span>
                          <span className="text-art-charcoal font-bold">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trust Badge */}
                  <div className="rounded-xl bg-white p-2.5 border border-art-charcoal/5 flex items-center gap-2 text-[9px] text-art-charcoal/80">
                    <Shield className="h-4 w-4 text-art-sage shrink-0" />
                    <span>Non-slip joint cushion.</span>
                  </div>
                </div>

              </div>
            ) : (
              // Digital Sustainability Passport Tab
              <div className="space-y-4 pt-1">
                <span className="text-[9px] font-bold text-art-charcoal/50 uppercase tracking-widest block font-mono">
                  Guaranteed Cradle-to-Cradle Life-Cycle Blueprint
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-white border border-art-charcoal/10 p-3 text-left">
                    <span className="text-[9px] font-mono font-bold text-[#d97d65] uppercase block">Emissions Prevented</span>
                    <span className="text-base font-serif font-bold text-art-charcoal mt-1 block italic">{activeProduct.carbonOffset}</span>
                    <p className="text-[10px] text-art-charcoal/60 leading-tight mt-1 font-light">Carbon sink storage during rubber tapping.</p>
                  </div>
                  <div className="rounded-xl bg-white border border-art-charcoal/10 p-3 text-left">
                    <span className="text-[9px] font-mono font-bold text-art-sage uppercase block">Avoided Toxins</span>
                    <span className="text-base font-serif font-bold text-art-charcoal mt-1 block italic">{activeProduct.plasticSaved}</span>
                    <p className="text-[10px] text-art-charcoal/60 leading-tight mt-1 font-light">Direct diversion of petrochemical PVC polymer.</p>
                  </div>
                  <div className="rounded-xl bg-art-sage/10 border border-art-sage/20 p-3 text-left">
                    <span className="text-[9px] font-mono font-bold text-art-charcoal block uppercase">Lifespan Buy-Back Credit</span>
                    <span className="text-base font-serif font-bold text-art-charcoal mt-1 block italic">{activeProduct.creditValue}</span>
                    <p className="text-[10px] text-art-charcoal/60 leading-tight mt-1 font-light">Guaranteed return refund code to swap mats.</p>
                  </div>
                </div>

                <div className="rounded-xl bg-white border border-art-charcoal/5 p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-art-charcoal font-bold">
                    <Globe className="h-4 w-4 text-art-sage" />
                    <span>The Pranova Renewable Pipeline Loop</span>
                  </div>
                  <p className="text-art-charcoal/75 leading-relaxed font-light">
                    This item is built on zero-landfill commitments. Every product features a laser-etched circular QR. Scanning the QR initiates a prepaid return envelope. Our recycling center separates raw bark from vulcanized rubber layers, recreating certified secondary building insulation.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="border-t border-art-stone/60 pt-4 flex flex-col sm:flex-row gap-3 justify-between items-center">
            <button
              onClick={() => setShowPassport(!showPassport)}
              className="text-xs font-bold uppercase tracking-wider text-art-charcoal/70 hover:text-art-charcoal flex items-center gap-1.5 transition-colors px-1"
            >
              {showPassport ? "← Back to Product Specs" : "🔍 View Lifecycle Digital Passport"}
            </button>

            <button
              onClick={() => {
                alert(`Excellent! You've simulated the checkout of ${activeProduct.name}. Head to the dashboard to link its serial and claim rewards!`);
              }}
              className="rounded-full bg-art-charcoal hover:bg-art-charcoal/90 text-art-bg font-bold px-7 py-3 text-xs uppercase tracking-widest transition-all w-full sm:w-auto text-center"
            >
              Simulate Purchase
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
