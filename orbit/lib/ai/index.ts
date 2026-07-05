// The AI provider interface. Callers import getAI() and never know whether
// the implementation is the mock layer or a real LLM. Swapping providers
// means changing one line here — no caller changes.

import type {
  AppData,
  AvoidanceMirror,
  FollowUp,
  FollowUpTone,
  OrbitEvent,
  Person,
  Plan,
  RecoveryAction,
  RelationshipRealityCheck,
  SkipReason,
  ThirtyDayProgram,
  UserProfile,
  WeeklyReview,
  EventScore,
} from "@/lib/types";
import { MockAIProvider } from "./mock";

export type Mood =
  | "drained"
  | "restless"
  | "lonely"
  | "bored"
  | "anxious"
  | "celebratory"
  | "spiritually-low"
  | "socially-motivated";

export type Vibe =
  | "quiet"
  | "social-adjacent"
  | "adventurous"
  | "spiritual"
  | "creative"
  | "fitness"
  | "food"
  | "culture"
  | "productive";

export type SocialOpenness =
  | "avoid-people"
  | "okay-around-people"
  | "one-person"
  | "genuinely-social";

export interface SoloNightInputs {
  mood: Mood;
  energy: "low" | "medium" | "high";
  budget: number;
  availableHours: number;
  neighborhood: string;
  vibe: Vibe;
  openness: SocialOpenness;
  transport?: string;
  weather?: string;
}

export interface SoloNightPlan {
  tier: "minimum-viable" | "standard" | "bold";
  title: string;
  timeline: { time: string; step: string }[];
  costEstimate: string;
  socialDifficulty: number; // 1-5
  conversationPotential: number; // 1-5
  exitRule: string;
  microChallenge: string;
  reflectionPrompt: string;
}

export interface ParsedEvent {
  title: string;
  date?: string;
  startTime?: string;
  location?: string;
  cost?: number;
  eventType: OrbitEvent["eventType"];
  vibeTags: string[];
  socialDifficulty: number;
  conversationPotential: number;
  repeatPotential: number;
  arrivalStrategy: string;
  microChallenge: string;
}

export interface FollowUpDraft {
  message: string;
  tone: FollowUpTone;
  whyItWorks: string;
  riskLevel: FollowUp["riskLevel"];
  suggestedTiming: string;
}

export type UpgradeTrigger =
  | "finished-seven-day-plan"
  | "solo-plan-limit"
  | "program-continuation"
  | "unlimited-follow-ups"
  | "advanced-review"
  | "city-persona-packs";

export interface UpgradePromptCopy {
  headline: string;
  body: string;
  cta: string;
}

export interface AIProvider {
  generateSoloNightPlans(
    inputs: SoloNightInputs,
    profile: UserProfile | null
  ): SoloNightPlan[];
  generateWeeklySocialPlan(
    profile: UserProfile,
    events: OrbitEvent[]
  ): Plan;
  generateFollowUpMessage(
    person: Person,
    profile: UserProfile | null,
    tone: FollowUpTone
  ): FollowUpDraft;
  scoreEvent(event: OrbitEvent, profile: UserProfile | null): EventScore;
  generateWeeklyReview(data: AppData): WeeklyReview;
  generateAvoidanceMirror(data: AppData): AvoidanceMirror;
  parseEventFromText(text: string): ParsedEvent;
  generateThirtyDayProgram(profile: UserProfile | null): ThirtyDayProgram;
  generateRecoveryAction(
    reason: SkipReason,
    profile: UserProfile | null
  ): RecoveryAction;
  generateRelationshipRealityCheck(person: Person): RelationshipRealityCheck;
  generateEventArrivalStrategy(event: OrbitEvent): string;
  generateConversationOpeners(event: OrbitEvent): string[];
  generateUpgradePrompt(trigger: UpgradeTrigger): UpgradePromptCopy;
}

let provider: AIProvider | null = null;

export function getAI(): AIProvider {
  if (!provider) provider = new MockAIProvider();
  return provider;
}
