import { Challenge, RewardItem, MatType, MatRegistration, CircularReturn, CircularReturnStep, UserProfile } from "./types";

export const BRAND_PILLARS = [
  {
    icon: "Leaf",
    title: "Sustainability",
    description: "Formulated entirely from bio-based, carbon-negative ingredients like raw organic cork, sustainable hemp fiber, and raw natural rubber. Absolutely zero PVC, EVA foam, or synthetic microplastics."
  },
  {
    icon: "Heart",
    title: "Wellness",
    description: "Connecting conscious physical movement to daily mental recovery. Designed with non-toxic botanical cues and optimal ergonomic feedback to elevate every session."
  },
  {
    icon: "Cpu",
    title: "Intelligence",
    description: "An embedded digital QR passport links each product directly to Pranova AI. Your mat acts as an interactive assistant for plans, feedback, and eco-auditing."
  },
  {
    icon: "RefreshCw",
    title: "Circularity",
    description: "The Pranova Renew™ material recovery network guarantees that no product of ours ever enters a landfill. We dismantle, recover, and reward you with credits to upgrade."
  }
];

export const MATERIAL_SPECS = [
  {
    name: "Natural Cork",
    source: "Mediterranean Cork Oak Bark (Harvested without harming the tree)",
    purpose: "Naturally antimicrobial, high-traction grip that increases when wet (sweat), thermal insulation.",
    sustainability: "100% biodegradable, acts as a carbon sink during oak regrowth."
  },
  {
    name: "Hemp Fiber",
    source: "Industrial Cannabis Sativa Stalks",
    purpose: "Provides structural reinforcement, tensile strength, and anti-stretch core stability.",
    sustainability: "Fast-growing, requires 4x less water than standard cotton, enriches soil health."
  },
  {
    name: "Organic Cotton",
    source: "Non-GMO, rain-fed agricultural cotton crops",
    purpose: "Super-soft base binding, comfort stitching, and natural skin-safe touch feel.",
    sustainability: "GOTS-certified, free from synthetic pesticides, chemical fertilizers, or toxic bleach."
  },
  {
    name: "Natural Rubber",
    source: "Hevea Brasiliensis Tree Sap",
    purpose: "Heavy-duty bottom cushion, excellent non-slip floor traction, high density rebound protect joints.",
    sustainability: "Renewable forestry, naturally vulcanized, decomposes safely at end-of-life."
  }
];

export const ECOSYSTEM_PHASES = [
  {
    phase: "Phase 1: Foundations",
    products: [
      { name: MatType.EARTHMAT, description: "Flagship 4mm natural cork and rubber mat with alignment matrix.", price: "₹3,499" },
      { name: MatType.EARTHMAT_PRO, description: "Premium 6mm thick natural cork mat designed for intense studio practice.", price: "₹4,999" }
    ],
    status: "Active Launch"
  },
  {
    phase: "Phase 2: Restorative Flow",
    products: [
      { name: "Pranova Meditation™ Set", description: "Organic cotton-buckwheat zafu cushions & natural hemp eye masks.", price: "₹2,299" },
      { name: "Pranova Flow™ Blocks & Straps", description: "Bespoke solid cork blocks & durable cotton yoga accessories.", price: "₹1,199" }
    ],
    status: "Year 2 Pipeline"
  },
  {
    phase: "Phase 3: Community Studio",
    products: [
      { name: "Pranova Studio™ Suite", description: "Digital dashboard & bulk circular leasing plans for premium studios and wellness retreats.", price: "Custom Enterprise" }
    ],
    status: "Year 2 Pipeline"
  },
  {
    phase: "Phase 4: Conscious Spaces",
    products: [
      { name: "Pranova Living™ Collection", description: "Natural, organic furniture, workspace mats, and hemp recovery apparel.", price: "Year 3 Pipeline" }
    ],
    status: "Year 3+ Pipeline"
  }
];

export const ROADMAP_YEARS = [
  {
    year: "Year 1",
    title: "Flagship Foundations",
    items: [
      "Launch flagship EarthMat™ & EarthMat Pro™ D2C portal",
      "Release Pranova AI Coach MVP for personalized guidance",
      "Roll out Pranova Renew™ circular rewards platform",
      "Integrate basic ESG tracking for conscious users"
    ]
  },
  {
    year: "Year 2",
    title: "Flow Expansion",
    items: [
      "Launch Pranova Meditation™ cushions and Flow™ cotton blocks",
      "Upgrade AI Coach with real-time sleep & habit tracking modules",
      "Launch Corporate Wellness ESG SaaS programs",
      "Establish physical studio return collection hubs"
    ]
  },
  {
    year: "Year 3+",
    title: "Global Living Ecosystem",
    items: [
      "Launch Studio™ commercial leasing and Pranova Living™ collections",
      "Scale circular material recovery factories worldwide",
      "Introduce localized smart organic fibers and IoT telemetry integrations",
      "Build fully interconnected carbon-negative global fitness movement"
    ]
  }
];

export const GO_TO_MARKET = [
  { channel: "DTC Website", description: "Primary visual e-commerce store with integrated digital registrations, carbon offsets, and custom profiles." },
  { channel: "Bespoke Studios", description: "Direct partnership with premium yoga studios to display EarthMats, providing physical QR scan discovery." },
  { channel: "Influencer Cues", description: "Collaborate with organic, circularity-focused yoga advocates and environmental creators." },
  { channel: "Corporate Wellness", description: "Offer packages to top tech corporations for employee wellness challenges & integrated ESG carbon credits." }
];

export const COMPETITIVE_ADVANTAGE = [
  { title: "Fully Circular Model", desc: "Unlike standard mats made of non-recyclable PVC, EVA, or chemically glued composites, Pranova's Renew system guarantees raw materials recovery with cash-equivalent user credits." },
  { title: "QR-Linked AI+ Agent", desc: "No need for screen-heavy wearable devices. A discreet QR-scan activates a personal wellness consultant that knows your mat lifecycle and coordinates physical recovery programs." },
  { title: "Radical Ingredient Honesty", desc: "Transparent digital sustainability passports verifying organic roots and carbon-neutral distribution." }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "c1",
    title: "Conscious Morning Flow",
    description: "Complete 15 minutes of dynamic yoga stretches first thing in the morning on 4 separate days.",
    category: "yoga",
    points: 150,
    duration: "1 week",
    isJoined: true,
    isCompleted: false
  },
  {
    id: "c2",
    title: "Mindful Breathing Ritual",
    description: "Practice the Pranova AI-recommended evening Pranayama (breathing exercise) for 5 minutes daily.",
    category: "meditation",
    points: 100,
    duration: "5 days",
    isJoined: false,
    isCompleted: false
  },
  {
    id: "c3",
    title: "Eco Advocate Challenge",
    description: "Read about cork harvesting and share a sustainability insight to help save our trees.",
    category: "sustainability",
    points: 80,
    duration: "Single action",
    isJoined: false,
    isCompleted: false
  },
  {
    id: "c4",
    title: "Renew Cradle-to-Cradle",
    description: "Log your carbon offset target and verify your mat digital passport for circular recycling readiness.",
    category: "circular",
    points: 200,
    duration: "Single action",
    isJoined: true,
    isCompleted: false
  }
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: "r1",
    title: "₹500 Circular Credit",
    pointsCost: 400,
    description: "Get ₹500 off on any premium EarthMat Pro upgrade. Redeemable alongside trade-in values.",
    isClaimed: false
  },
  {
    id: "r2",
    title: "Free Organic Flow Strap",
    pointsCost: 300,
    description: "A premium organic-dyed cotton yoga strap delivered carbon-neutral to your home.",
    isClaimed: false
  },
  {
    id: "r3",
    title: "Pranova AI+ Premium (1 Month)",
    pointsCost: 150,
    description: "Full access to advanced sleep analysis, habit visualizers, and customized meditation schedules.",
    isClaimed: false
  }
];

// Initial state representing our primary persona: Ananya Sharma
export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Ananya Sharma",
  email: "ananya.sharma@gmail.com",
  points: 250,
  hasCompletedOnboarding: false,
  registrations: [
    {
      serialNumber: "PRN-EM-2026-984A",
      matType: MatType.EARTHMAT,
      ownerName: "Ananya Sharma",
      registeredAt: "2026-04-12T10:30:00Z",
      isRegistered: true
    }
  ],
  circularReturns: [
    {
      id: "RET-5582",
      matSerial: "OLD-PVC-MAT-TEMP",
      matType: MatType.EARTHMAT, // placeholder
      initiatedAt: "2026-07-01T15:20:00Z",
      status: CircularReturnStep.IN_USE,
      creditEarned: 600,
      progressPercentage: 20
    }
  ],
  metrics: {
    carbonSaved: 14.8, // in kg CO2
    plasticAvoided: 2.1, // in kg
    treeEquivalents: 3.0,
    sustainabilityScore: 82
  },
  history: [
    {
      id: "h1",
      action: "Registered EarthMat™ QR Passport",
      date: "2026-04-12",
      carbonSaved: 4.5,
      plasticAvoided: 1.2
    },
    {
      id: "h2",
      action: "Completed 7-day 'Sustainable Stretch' Challenge",
      date: "2026-05-18",
      carbonSaved: 3.2,
      plasticAvoided: 0.3
    },
    {
      id: "h3",
      action: "Swapped old synthetic PVC mat via Pranova Renew™",
      date: "2026-07-01",
      carbonSaved: 7.1,
      plasticAvoided: 0.6
    }
  ],
  healthProfile: {
    bodyType: "Pitta-Vata (Medium, agile but prone to dry tension)",
    medicalConditions: "Mild lower back stiffness from long hours of sitting, sensitive left knee",
    specificConcerns: "Upper back shoulder alignment, stress mitigation, lumbar spine flex",
    fitnessLevel: "Intermediate",
    lastUpdated: "2026-07-19"
  }
};
