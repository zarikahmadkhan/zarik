import type {
  AppData,
  AvoidanceMirror,
  Person,
  RecoveryAction,
  RelationshipRealityCheck,
  SkipReason,
  UserProfile,
  WeeklyReview,
} from "@/lib/types";
import type { UpgradePromptCopy, UpgradeTrigger } from "../index";
import { daysSince, daySeed, pick } from "./util";

// --- Weekly review ---

const uncomfortableAssignments = [
  "Return to the same recurring event and talk to one person you recognize.",
  "Send two follow-ups before Wednesday.",
  "Invite one person to something concrete this week — day, time, place.",
  "Attend one event a full difficulty level above your usual.",
  "Stay 15 minutes past the point where you'd normally leave.",
  "Ask an organizer how you could help out next time.",
  "Tell one person you're trying to build a better social routine. Out loud.",
  "Go to one event without checking who else is going first.",
  "Start one conversation with someone who isn't already talking to anyone.",
  "Revive the oldest weak tie in your list with one low-pressure message.",
  "Book the recurring event for three straight weeks, now, in one sitting.",
  "Ask one person for a recommendation and actually follow it this week.",
  "Attend something alone that you've only ever done accompanied.",
  "Introduce two people you know to each other, even lightly.",
  "Say yes to the next invitation you'd normally deflect.",
];

const stopDoing = [
  "Stop adding events as a substitute for attending them.",
  "Stop waiting to feel social before acting social. The feeling follows the rep.",
  "Stop treating every weekend like a blank page. Your anchors are your defaults now.",
  "Stop leaving events at the exact moment they start becoming social.",
  "Stop drafting messages you don't send. Ship the low-pressure version.",
  "Stop chasing novelty. Your best conversations came from repeat settings.",
  "Stop scheduling only solo activities and calling it a social week.",
  "Stop re-evaluating whether the group is 'your people' after one visit. Three visits, then judge.",
];

const avoidancePatterns = {
  planNoCommit: "You added {n} events but committed to none. Adding is scouting, not going.",
  noFollowUp: "You met {n} people this week and followed up with none. That is exactly where weak ties die.",
  lowFrictionOnly: "Every completed rep this week was solo-friendly. Add one thing with actual conversation potential.",
  skipHeavy: "You skipped more than you attended this week. No shame — but the next event on your list is the one to protect.",
  planningLoop: "You keep planning instead of attending. Pick the single easiest event and go.",
  none: "No avoidance pattern worth flagging this week. Keep the streak honest.",
};

function weekStartIso(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = (day === 0 ? 6 : day - 1);
  d.setDate(d.getDate() - diff);
  return d.toISOString().slice(0, 10);
}

export function generateWeeklyReview(data: AppData): WeeklyReview {
  const ws = weekStartIso();
  const thisWeek = (iso: string | undefined) => !!iso && iso >= ws;

  const attended = data.events.filter(
    (e) => e.status === "attended" && thisWeek(e.date)
  );
  const skipped = data.events.filter(
    (e) => e.status === "skipped" && thisWeek(e.date)
  );
  const met = data.people.filter((p) => thisWeek(p.dateMet));
  const sent = data.followUps.filter(
    (f) => f.status === "sent" && thisWeek(f.sentAt?.slice(0, 10))
  );
  const owed = data.people.filter((p) => p.status === "needs-follow-up");
  const weekReps = data.reps.filter((r) => thisWeek(r.date));

  // Pattern detection from real state
  const interestedCount = data.events.filter(
    (e) => e.status === "interested"
  ).length;
  let pattern: string;
  if (met.length > 0 && sent.length === 0) {
    pattern = avoidancePatterns.noFollowUp.replace("{n}", String(met.length));
  } else if (interestedCount >= 4 && attended.length === 0) {
    pattern = avoidancePatterns.planNoCommit.replace(
      "{n}",
      String(interestedCount)
    );
  } else if (skipped.length > attended.length && skipped.length > 0) {
    pattern = avoidancePatterns.skipHeavy;
  } else if (
    weekReps.length > 0 &&
    weekReps.every((r) =>
      ["left-apartment", "solo-public-activity"].includes(r.type)
    )
  ) {
    pattern = avoidancePatterns.lowFrictionOnly;
  } else if (attended.length === 0 && data.plans.length > 0) {
    pattern = avoidancePatterns.planningLoop;
  } else {
    pattern = avoidancePatterns.none;
  }

  const bestRep =
    weekReps.find((r) =>
      ["invited-someone", "sent-follow-up", "introduced-self"].includes(r.type)
    ) ?? weekReps[0];

  const recurring = data.events.filter(
    (e) => e.isRecurring && e.status !== "skipped"
  );
  const weakTie = owed[0] ?? met[0];

  return {
    id: `review-${ws}`,
    weekStart: ws,
    eventsAttended: attended.length,
    eventsSkipped: skipped.length,
    peopleMet: met.length,
    followUpsSent: sent.length,
    followUpsOwed: owed.length,
    bestRep: bestRep
      ? bestRep.type.replaceAll("-", " ")
      : undefined,
    avoidancePattern: pattern,
    nextWeekPlan: [
      recurring[0]
        ? `Return to ${recurring[0].title}.`
        : "Pick one recurring event and attend it.",
      owed.length > 0
        ? `Send ${Math.min(owed.length, 2)} follow-up${owed.length > 1 ? "s" : ""} before Wednesday.`
        : "Capture one new weak tie this week.",
      "Complete one rep above your comfort level.",
    ],
    uncomfortableAssignment: pick(uncomfortableAssignments, [ws, "assign"]),
    recurringEventToRepeat: recurring[0]?.title,
    weakTieToNurture: weakTie?.name,
    thingToStop: pick(stopDoing, [ws, "stop"]),
    generatedAt: new Date().toISOString(),
  };
}

// --- Avoidance mirror (dashboard, one insight) ---

const mirrors: { when: (d: AppData) => boolean; message: string; nextRep: string }[] = [
  {
    when: (d) =>
      d.people.filter((p) => p.status === "needs-follow-up").length >= 2,
    message:
      "Two or more people are waiting on a follow-up from you. Weak ties have a half-life, and the clock is running.",
    nextRep: "Send one follow-up right now — the generator will draft it.",
  },
  {
    when: (d) =>
      d.events.filter((e) => e.status === "interested").length >= 4 &&
      d.events.filter((e) => e.status === "planned").length === 0,
    message:
      "You've marked several events 'interested' and committed to none. Interest without a plan is how weekends evaporate.",
    nextRep: "Pick one and change its status to planned before tonight.",
  },
  {
    when: (d) => {
      const recent = d.reps.filter(
        (r) => (daysSince(r.date) ?? 99) <= 7
      );
      return recent.length === 0 && d.events.length > 0;
    },
    message:
      "Zero reps logged this week. The system only works if the body leaves the apartment.",
    nextRep: "Do the smallest rep on the board today: 30 minutes somewhere public.",
  },
  {
    when: (d) => {
      const recur = d.events.filter((e) => e.isRecurring && e.timesAttended > 0);
      return recur.length > 0 && recur.every((e) => e.timesAttended === 1);
    },
    message:
      "You've tried recurring events once each and returned to none. Round two is where familiarity starts paying.",
    nextRep: "Book a second visit to whichever one felt least bad.",
  },
  {
    when: (d) =>
      d.people.length > 0 &&
      d.people.every((p) => !p.lastContacted),
    message:
      "People are in your orbit but no one's been contacted. A tracked contact you never message is just a memory with a name.",
    nextRep: "Open one person and send the low-pressure draft.",
  },
];

const fallbackMirrors = [
  {
    message: "Momentum looks decent. The risk now is coasting on planning instead of attending.",
    nextRep: "Confirm tonight or tomorrow's outing — status: planned.",
  },
  {
    message: "You're doing the reps. The next multiplier is repetition — same places, same faces.",
    nextRep: "Schedule a return visit to your best recent event.",
  },
  {
    message: "Solid week so far. Don't let the follow-up column lag behind the attendance column.",
    nextRep: "Check People for anyone drifting toward dormant.",
  },
];

export function generateAvoidanceMirror(data: AppData): AvoidanceMirror {
  const hit = mirrors.find((m) => m.when(data));
  if (hit) {
    return {
      message: hit.message,
      nextRep: hit.nextRep,
      generatedAt: new Date().toISOString(),
    };
  }
  const f = pick(fallbackMirrors, [daySeed(), "mirror"]);
  return { ...f, generatedAt: new Date().toISOString() };
}

// --- Recovery actions ---

const recoveryByReason: Record<SkipReason, { message: string; action: string }[]> = {
  avoidance: [
    { message: "You dodged it. Fine — named, logged, done. No spiral required.", action: "Go somewhere public for 30 minutes today. That's the whole recovery." },
    { message: "Avoidance won this round. It doesn't get a rematch narrative — it gets one small rep.", action: "Send one follow-up message tonight instead." },
    { message: "Skipping happens. Restarting-from-zero thinking is the actual threat.", action: "Add one recurring event to next week and mark it planned." },
    { message: "The event is gone; the pattern is what matters. Interrupt it small.", action: "Attend a smaller, easier event within 48 hours." },
  ],
  logistics: [
    { message: "Logistics, not avoidance. Don't spend guilt where none is owed.", action: "Rebook the same event's next occurrence right now." },
    { message: "Life got in the way — that's a scheduling problem, not a character problem.", action: "Pick a backup event this week with an easier commute." },
  ],
  fatigue: [
    { message: "You were empty. Rest is legitimate; disappearing for a week isn't.", action: "Do one solo-but-public activity tomorrow — low stakes, out of the house." },
    { message: "Tired is real. Match the rep to the tank instead of skipping entirely next time.", action: "Plan one low-energy outing this week: coffee shop, library, walk." },
  ],
  cost: [
    { message: "Too expensive is a fair no. The habit doesn't need to be.", action: "Find one free event this week — walk groups, community nights, volunteer shifts." },
    { message: "Budget said no. There's a free version of almost every social rep.", action: "Add two $0 events to your list tonight." },
  ],
  "poor-fit": [
    { message: "Wrong event, right instinct to skip it. Learn the filter, keep the cadence.", action: "Note what made it a bad fit, then plan one event that's the opposite." },
    { message: "Not every event deserves you. But the empty slot still does.", action: "Replace it: one better-fit event on the calendar this week." },
  ],
};

export function generateRecoveryAction(
  reason: SkipReason,
  profile: UserProfile | null
): RecoveryAction {
  return pick(recoveryByReason[reason], [reason, profile?.name ?? "", daySeed()]);
}

// --- Relationship reality check ---

export function generateRelationshipRealityCheck(
  person: Person
): RelationshipRealityCheck {
  const metDays = daysSince(person.dateMet);
  const contactDays = daysSince(person.lastContacted);

  if (person.messagesSentWithoutResponse >= 2) {
    return {
      personId: person.id,
      severity: "stop",
      message:
        "You have sent two messages without response. Stop here unless they re-engage — your effort is better spent on ties that answer.",
    };
  }
  if (person.status === "do-not-pursue") {
    return {
      personId: person.id,
      severity: "stop",
      message: "You marked this one closed. Honor your own call.",
    };
  }
  if (person.messagesSentWithoutResponse === 1 && (contactDays ?? 0) < 7) {
    return {
      personId: person.id,
      severity: "caution",
      message:
        "One message out, no reply yet. Give it a week before anything else — do not chase.",
    };
  }
  if (!person.hasResponded && (metDays ?? 0) <= 7 && !person.lastContacted) {
    return {
      personId: person.id,
      severity: "info",
      message:
        "You only met once and haven't reached out. This is the window — one light follow-up now beats a perfect one later.",
    };
  }
  if ((contactDays ?? 0) >= 21 && person.hasResponded) {
    return {
      personId: person.id,
      severity: "caution",
      message:
        "You have not followed up in three weeks. Send something simple or consciously let it go — drifting isn't a decision.",
    };
  }
  if (person.lane === "dating-marriage-interest" && (metDays ?? 99) <= 3) {
    return {
      personId: person.id,
      severity: "caution",
      message:
        "This is a thin interaction so far. Keep the next message casual — do not project a relationship onto one conversation.",
    };
  }
  if (person.hasResponded && person.status === "active") {
    return {
      personId: person.id,
      severity: "info",
      message:
        "This is a good weak tie. Invite them to a low-pressure recurring event — that's the next rung.",
    };
  }
  return {
    personId: person.id,
    severity: "info",
    message:
      "In your orbit, not yet a friend. Build through repeated low-pressure contact, not intensity.",
  };
}

// --- Upgrade prompts (outcome-focused, per marketing spec section 14) ---

const upgradeCopy: Record<UpgradeTrigger, UpgradePromptCopy[]> = {
  "finished-seven-day-plan": [
    { headline: "Keep the momentum you just built.", body: "Week one is motion. Weeks two through four are where weak ties become people you actually know. The 30-day rebuild continues from exactly where you are.", cta: "Continue with Pro" },
    { headline: "Don't let week one be the whole story.", body: "You went out, you showed up. Pro keeps the weekly plan coming so next week doesn't default back to the couch.", cta: "Keep your plan going" },
  ],
  "solo-plan-limit": [
    { headline: "You've used your three solo plans this month.", body: "That's three nights you didn't spend scrolling. Pro makes the generator unlimited — every restless night gets a plan.", cta: "Unlock unlimited plans" },
    { headline: "Three plans down. The habit is forming.", body: "Don't let the tool run out right as the pattern starts working. Unlimited solo plans, every night you need one.", cta: "Go Pro" },
  ],
  "program-continuation": [
    { headline: "The next three weeks are the point.", body: "Leaving the apartment was week one. Conversations, follow-ups, and cadence are what you'd be stopping short of.", cta: "Continue the rebuild" },
  ],
  "unlimited-follow-ups": [
    { headline: "Don't let the people you met disappear.", body: "Every unsent follow-up is a weak tie dying quietly. Pro drafts as many as your orbit needs.", cta: "Unlock follow-up drafts" },
  ],
  "advanced-review": [
    { headline: "See where your social life is actually stalling.", body: "The advanced review names your patterns — what you avoid, what returns energy, which settings actually produce friends.", cta: "Upgrade for the full review" },
  ],
  "city-persona-packs": [
    { headline: "A plan built for your city and your situation.", body: "Jersey City anchors, post-divorce pacing, new-city resets — packs tune the whole system to your actual life.", cta: "Browse packs with Premium" },
  ],
};

export function generateUpgradePrompt(
  trigger: UpgradeTrigger
): UpgradePromptCopy {
  return pick(upgradeCopy[trigger], [trigger, daySeed()]);
}
