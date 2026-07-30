export enum MatType {
  EARTHMAT = "EarthMat™",
  EARTHMAT_PRO = "EarthMat Pro™"
}

export interface MatRegistration {
  serialNumber: string;
  matType: MatType;
  ownerName: string;
  registeredAt: string;
  isRegistered: boolean;
}

export interface SustainabilityMetrics {
  carbonSaved: number; // in kg CO2
  plasticAvoided: number; // in kg
  treeEquivalents: number; // in numbers of trees
  sustainabilityScore: number; // 0-100 score
}

export interface SustainabilityLog {
  id: string;
  action: string;
  date: string;
  carbonSaved: number;
  plasticAvoided: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: "yoga" | "meditation" | "sustainability" | "circular";
  points: number;
  duration: string;
  isJoined: boolean;
  isCompleted: boolean;
}

export interface RewardItem {
  id: string;
  title: string;
  pointsCost: number;
  description: string;
  isClaimed: boolean;
  couponCode?: string;
}

export enum CircularReturnStep {
  IN_USE = "In Use",
  INITIATED = "Return Initiated",
  RECEIVED = "Received at Facility",
  RECOVERING = "Recovering Materials",
  COMPLETED = "Credits Awarded"
}

export interface CircularReturn {
  id: string;
  matSerial: string;
  matType: MatType;
  initiatedAt: string;
  status: CircularReturnStep;
  creditEarned: number; // in INR
  couponCode?: string;
  progressPercentage: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface HealthProfile {
  bodyType: string;
  medicalConditions: string;
  specificConcerns: string;
  fitnessLevel: string;
  lastUpdated?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  points: number;
  registrations: MatRegistration[];
  circularReturns: CircularReturn[];
  metrics: SustainabilityMetrics;
  history: SustainabilityLog[];
  healthProfile?: HealthProfile;
  hasCompletedOnboarding?: boolean;
}
