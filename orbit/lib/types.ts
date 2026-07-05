// Single source of truth for all Orbit data models (spec section 25).

export type AppMode = "demo" | "account";

export type Goal =
  | "make-friends"
  | "rebuild-after-divorce"
  | "new-city-reset"
  | "build-community"
  | "dating-marriage-momentum"
  | "stop-wasting-nights";

export type SocialEnergy = "low" | "medium" | "high";

export type ComfortLevel =
  | "not-comfortable"
  | "somewhat-comfortable"
  | "comfortable-but-rusty"
  | "very-comfortable";

export type SettingTag =
  | "run-clubs"
  | "book-comic-clubs"
  | "faith-community"
  | "concerts"
  | "classes-workshops"
  | "coffee-shops"
  | "fitness"
  | "volunteering"
  | "professional"
  | "food-night-markets"
  | "museums-culture"
  | "bars"
  | "heavy-nightlife"
  | "loud-parties"
  | "large-networking"
  | "expensive-events";

export type Channel =
  | "whatsapp"
  | "sms"
  | "email"
  | "linkedin"
  | "instagram"
  | "other";

export interface UserProfile {
  name: string;
  city: string;
  neighborhood?: string;
  ageRange: string;
  goal: Goal;
  energy: SocialEnergy;
  preferredSettings: SettingTag[];
  avoidedSettings: SettingTag[];
  weeklyAvailability: string[];
  budgetPerOuting: number;
  comfortWithStrangers: ComfortLevel;
  preferredChannel: Channel;
  onboardedAt: string; // ISO date
}

export interface OnboardingResponse {
  profile: UserProfile;
  completedAt: string;
}

export type EventStatus = "interested" | "planned" | "attended" | "skipped";

export type EventType =
  | "run-club"
  | "book-club"
  | "comic-club"
  | "improv-class"
  | "faith-community"
  | "volunteer"
  | "museum"
  | "board-games"
  | "bookstore"
  | "fitness-class"
  | "professional"
  | "coffee-night"
  | "walk-group"
  | "concert"
  | "food-market"
  | "class-workshop"
  | "other";

export interface OrbitEvent {
  id: string;
  title: string;
  date: string; // ISO date
  startTime?: string;
  endTime?: string;
  location?: string;
  neighborhood?: string;
  cost: number;
  url?: string;
  eventType: EventType;
  vibeTags: string[];
  soloFriendliness: number; // 1-5
  conversationPotential: number; // 1-5
  repeatPotential: number; // 1-5
  socialDifficulty: number; // 1-5
  isRecurring: boolean;
  timesAttended: number;
  notes?: string;
  status: EventStatus;
  reflection?: EventReflection;
  skipReflection?: SkipReflection;
  createdAt: string;
}

export interface EventReflection {
  talkedToAnyone: boolean;
  peopleMet: string[]; // person ids
  exchangedContact: boolean;
  wouldAttendAgain: boolean;
  learned?: string;
  energyAfter: "drained" | "neutral" | "better" | "energized";
}

export type SkipReason =
  | "avoidance"
  | "logistics"
  | "fatigue"
  | "cost"
  | "poor-fit";

export interface SkipReflection {
  reason: SkipReason;
  note?: string;
  recoveryAction?: string;
}

export interface EventScore {
  eventId: string;
  total: number; // 0-100
  reasons: string[];
}

export type RelationshipLane =
  | "acquaintance"
  | "potential-friend"
  | "community-contact"
  | "dating-marriage-interest"
  | "professional"
  | "family"
  | "other";

export type PersonStatus =
  | "new"
  | "needs-follow-up"
  | "active"
  | "dormant"
  | "do-not-pursue";

export interface Person {
  id: string;
  name: string;
  context?: string;
  whereMet?: string;
  dateMet?: string;
  lane: RelationshipLane;
  vibe?: string;
  sharedInterests: string[];
  notes?: string;
  preferredChannel: Channel;
  phone?: string;
  email?: string;
  socialHandle?: string;
  lastContacted?: string;
  nextFollowUp?: string;
  cadenceDays?: number;
  status: PersonStatus;
  messagesSentWithoutResponse: number;
  hasResponded: boolean;
  createdAt: string;
}

export interface RelationshipRealityCheck {
  personId: string;
  message: string;
  severity: "info" | "caution" | "stop";
}

export type FollowUpTone =
  | "casual"
  | "warm"
  | "direct"
  | "professional"
  | "low-pressure"
  | "faith-community";

export type FollowUpRisk = "very-safe" | "slightly-vulnerable" | "scale-back";

export interface FollowUp {
  id: string;
  personId: string;
  message: string;
  tone: FollowUpTone;
  whyItWorks: string;
  riskLevel: FollowUpRisk;
  suggestedTiming: string;
  status: "draft" | "sent" | "snoozed";
  sentAt?: string;
  createdAt: string;
}

export type RepType =
  | "left-apartment"
  | "attended-event"
  | "stayed-45-min"
  | "introduced-self"
  | "asked-follow-up-question"
  | "exchanged-contact"
  | "sent-follow-up"
  | "invited-someone"
  | "attended-faith-community"
  | "volunteered"
  | "joined-recurring-group"
  | "solo-public-activity"
  | "returned-to-recurring"
  | "talked-to-organizer"
  | "added-person"
  | "completed-weekly-review";

export interface SocialRep {
  id: string;
  type: RepType;
  date: string; // ISO date
  eventId?: string;
  personId?: string;
  note?: string;
}

export interface WeeklyReview {
  id: string;
  weekStart: string; // ISO date (Monday)
  eventsAttended: number;
  eventsSkipped: number;
  peopleMet: number;
  followUpsSent: number;
  followUpsOwed: number;
  bestRep?: string;
  avoidancePattern?: string;
  nextWeekPlan: string[];
  uncomfortableAssignment: string;
  recurringEventToRepeat?: string;
  weakTieToNurture?: string;
  thingToStop?: string;
  generatedAt: string;
}

export interface SocialAssignment {
  day: number; // 1-30
  title: string;
  detail: string;
  completed: boolean;
  missed: boolean;
}

export interface ThirtyDayProgram {
  startedAt: string; // ISO date
  assignments: SocialAssignment[];
  active: boolean;
}

export interface PlanItem {
  day: string; // ISO date
  title: string;
  detail: string;
  eventId?: string;
  done: boolean;
}

export interface Plan {
  id: string;
  kind: "seven-day" | "solo-night";
  createdAt: string;
  items: PlanItem[];
}

export interface AvoidanceMirror {
  message: string;
  nextRep: string;
  generatedAt: string;
}

export interface RecoveryAction {
  message: string;
  action: string;
}

export interface CityPack {
  id: string;
  name: string;
  city: string;
  description: string;
  eventTemplates: Partial<OrbitEvent>[];
}

export interface PersonaPack {
  id: string;
  name: string;
  persona: string;
  description: string;
  weeklyEmphasis: string[];
}

export interface PricingTier {
  id: "free" | "pro" | "premium";
  name: string;
  pricePerMonth: number;
  tagline: string;
  features: string[];
}

// Root persisted document. One blob, versioned key.
export interface AppData {
  schemaVersion: number;
  mode: AppMode;
  profile: UserProfile | null;
  events: OrbitEvent[];
  people: Person[];
  followUps: FollowUp[];
  reps: SocialRep[];
  reviews: WeeklyReview[];
  program: ThirtyDayProgram | null;
  plans: Plan[];
  cityPacks: CityPack[];
  personaPacks: PersonaPack[];
  soloPlansUsedThisMonth: number;
}
