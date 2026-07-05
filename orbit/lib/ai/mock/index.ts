import type {
  AppData,
  AvoidanceMirror,
  EventScore,
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
} from "@/lib/types";
import type {
  AIProvider,
  FollowUpDraft,
  ParsedEvent,
  SoloNightInputs,
  SoloNightPlan,
  UpgradePromptCopy,
  UpgradeTrigger,
} from "../index";
import { generateSoloNightPlans } from "./soloNight";
import { generateFollowUpMessage } from "./followUp";
import {
  generateConversationOpeners,
  generateEventArrivalStrategy,
  parseEventFromText,
  scoreEvent,
} from "./events";
import { generateThirtyDayProgram, generateWeeklySocialPlan } from "./plans";
import {
  generateAvoidanceMirror,
  generateRecoveryAction,
  generateRelationshipRealityCheck,
  generateUpgradePrompt,
  generateWeeklyReview,
} from "./review";

export class MockAIProvider implements AIProvider {
  generateSoloNightPlans(
    inputs: SoloNightInputs,
    profile: UserProfile | null
  ): SoloNightPlan[] {
    return generateSoloNightPlans(inputs, profile);
  }
  generateWeeklySocialPlan(profile: UserProfile, events: OrbitEvent[]): Plan {
    return generateWeeklySocialPlan(profile, events);
  }
  generateFollowUpMessage(
    person: Person,
    profile: UserProfile | null,
    tone: FollowUpTone
  ): FollowUpDraft {
    return generateFollowUpMessage(person, profile, tone);
  }
  scoreEvent(event: OrbitEvent, profile: UserProfile | null): EventScore {
    return scoreEvent(event, profile);
  }
  generateWeeklyReview(data: AppData): WeeklyReview {
    return generateWeeklyReview(data);
  }
  generateAvoidanceMirror(data: AppData): AvoidanceMirror {
    return generateAvoidanceMirror(data);
  }
  parseEventFromText(text: string): ParsedEvent {
    return parseEventFromText(text);
  }
  generateThirtyDayProgram(profile: UserProfile | null): ThirtyDayProgram {
    return generateThirtyDayProgram(profile);
  }
  generateRecoveryAction(
    reason: SkipReason,
    profile: UserProfile | null
  ): RecoveryAction {
    return generateRecoveryAction(reason, profile);
  }
  generateRelationshipRealityCheck(person: Person): RelationshipRealityCheck {
    return generateRelationshipRealityCheck(person);
  }
  generateEventArrivalStrategy(event: OrbitEvent): string {
    return generateEventArrivalStrategy(event);
  }
  generateConversationOpeners(event: OrbitEvent): string[] {
    return generateConversationOpeners(event);
  }
  generateUpgradePrompt(trigger: UpgradeTrigger): UpgradePromptCopy {
    return generateUpgradePrompt(trigger);
  }
}
