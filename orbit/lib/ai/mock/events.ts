import type { EventScore, EventType, OrbitEvent, UserProfile } from "@/lib/types";
import type { ParsedEvent } from "../index";
import { pick } from "./util";

// --- Event scoring (recurring-weighted, per spec section 11) ---

export function scoreEvent(
  event: OrbitEvent,
  profile: UserProfile | null
): EventScore {
  let total = 0;
  const reasons: string[] = [];

  // Recurring exposure is the single heaviest factor.
  if (event.isRecurring) {
    total += 25;
    reasons.push("Recurring — repeated exposure is how relationships form.");
  }
  if (event.timesAttended > 0) {
    total += 15;
    reasons.push(
      `You've been ${event.timesAttended === 1 ? "once" : event.timesAttended + " times"} — going back compounds.`
    );
  }

  total += event.conversationPotential * 5;
  if (event.conversationPotential >= 4)
    reasons.push("High conversation potential.");

  total += event.repeatPotential * 3;
  total += event.soloFriendliness * 2;
  if (event.soloFriendliness >= 4) reasons.push("Easy to attend alone.");

  // Cost friction
  if (profile && event.cost > profile.budgetPerOuting) {
    total -= 10;
    reasons.push("Over your usual budget.");
  } else if (event.cost === 0) {
    total += 5;
    reasons.push("Free.");
  }

  // Difficulty vs comfort
  const comfortRank = {
    "not-comfortable": 1,
    "somewhat-comfortable": 2,
    "comfortable-but-rusty": 3,
    "very-comfortable": 4,
  }[profile?.comfortWithStrangers ?? "comfortable-but-rusty"];
  if (event.socialDifficulty > comfortRank + 2) {
    total -= 5;
    reasons.push("A stretch beyond your current comfort — not a reason to skip, but pace it.");
  }

  // Goal alignment
  if (profile) {
    const faithTypes: EventType[] = ["faith-community"];
    if (
      profile.goal === "build-community" &&
      faithTypes.includes(event.eventType)
    ) {
      total += 8;
      reasons.push("Directly serves your community-building goal.");
    }
    if (
      profile.preferredSettings.some((s) =>
        event.eventType.includes(s.split("-")[0])
      )
    ) {
      total += 5;
      reasons.push("Matches your preferred settings.");
    }
  }

  return {
    eventId: event.id,
    total: Math.max(0, Math.min(100, total)),
    reasons,
  };
}

// --- Paste-text parser (mock — heuristic extraction, no scraping) ---

const typeKeywords: [RegExp, EventType][] = [
  [/run club|5k|fun run|jog/i, "run-club"],
  [/comic/i, "comic-club"],
  [/book club|reading group/i, "book-club"],
  [/improv|acting|theater class/i, "improv-class"],
  [/mosque|church|masjid|synagogue|temple|iftar|bible|quran|community night/i, "faith-community"],
  [/volunteer|cleanup|food pantry|fridge/i, "volunteer"],
  [/museum|gallery|exhibit/i, "museum"],
  [/board game|tabletop|trivia/i, "board-games"],
  [/bookstore|author|signing/i, "bookstore"],
  [/yoga|fitness|workout|pilates|climb/i, "fitness-class"],
  [/networking|professional|tech talk|meetup for/i, "professional"],
  [/coffee|cafe/i, "coffee-night"],
  [/walk|hike/i, "walk-group"],
  [/concert|live music|show/i, "concert"],
  [/market|food hall|night market/i, "food-market"],
  [/class|workshop|lesson/i, "class-workshop"],
];

function inferType(text: string): EventType {
  for (const [re, t] of typeKeywords) if (re.test(text)) return t;
  return "other";
}

function extractDate(text: string): string | undefined {
  const isoMatch = text.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (isoMatch) return isoMatch[0];
  const usMatch = text.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(20\d{2}))?\b/);
  if (usMatch) {
    const year = usMatch[3] ?? String(new Date().getFullYear());
    return `${year}-${usMatch[1].padStart(2, "0")}-${usMatch[2].padStart(2, "0")}`;
  }
  const monthMatch = text.match(
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})\b/i
  );
  if (monthMatch) {
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const m = months.indexOf(monthMatch[1].toLowerCase().slice(0, 3)) + 1;
    return `${new Date().getFullYear()}-${String(m).padStart(2, "0")}-${monthMatch[2].padStart(2, "0")}`;
  }
  return undefined;
}

function extractTime(text: string): string | undefined {
  const m = text.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/i);
  if (!m) return undefined;
  let h = parseInt(m[1], 10) % 12;
  if (m[3].toLowerCase() === "pm") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2] ?? "00"}`;
}

function extractCost(text: string): number | undefined {
  if (/\bfree\b/i.test(text)) return 0;
  const m = text.match(/\$\s?(\d+(?:\.\d{2})?)/);
  return m ? Math.round(parseFloat(m[1])) : undefined;
}

function extractLocation(text: string): string | undefined {
  const m = text.match(/(?:at|@)\s+([A-Z][\w'&. -]{2,40})/);
  return m ? m[1].trim().replace(/[.,]$/, "") : undefined;
}

function extractTitle(text: string): string {
  const firstLine = text.split("\n").map((l) => l.trim()).find((l) => l.length > 0);
  if (firstLine && firstLine.length <= 80 && !/^https?:\/\//.test(firstLine)) {
    return firstLine;
  }
  if (/^https?:\/\//.test(text.trim())) {
    try {
      const url = new URL(text.trim().split(/\s/)[0]);
      const slug = url.pathname.split("/").filter(Boolean).pop() ?? "";
      const fromSlug = slug.replace(/[-_]/g, " ").replace(/\.\w+$/, "").trim();
      if (fromSlug) {
        return fromSlug.replace(/\b\w/g, (c) => c.toUpperCase());
      }
    } catch {
      // fall through
    }
  }
  return "Untitled event";
}

const typeProfiles: Record<
  string,
  { difficulty: number; conversation: number; repeat: number; vibes: string[] }
> = {
  "run-club": { difficulty: 2, conversation: 4, repeat: 5, vibes: ["fitness", "outdoors"] },
  "comic-club": { difficulty: 2, conversation: 5, repeat: 5, vibes: ["nerdy", "small-group"] },
  "book-club": { difficulty: 2, conversation: 5, repeat: 5, vibes: ["culture", "small-group"] },
  "improv-class": { difficulty: 4, conversation: 5, repeat: 4, vibes: ["creative", "structured"] },
  "faith-community": { difficulty: 2, conversation: 4, repeat: 5, vibes: ["community", "welcoming"] },
  volunteer: { difficulty: 1, conversation: 4, repeat: 4, vibes: ["service", "side-by-side"] },
  museum: { difficulty: 1, conversation: 2, repeat: 3, vibes: ["culture", "quiet"] },
  "board-games": { difficulty: 2, conversation: 5, repeat: 5, vibes: ["structured", "playful"] },
  bookstore: { difficulty: 2, conversation: 3, repeat: 3, vibes: ["quiet", "culture"] },
  "fitness-class": { difficulty: 2, conversation: 3, repeat: 5, vibes: ["fitness"] },
  professional: { difficulty: 4, conversation: 4, repeat: 4, vibes: ["professional"] },
  "coffee-night": { difficulty: 1, conversation: 2, repeat: 4, vibes: ["quiet", "solo-friendly"] },
  "walk-group": { difficulty: 1, conversation: 4, repeat: 5, vibes: ["outdoors", "easy"] },
  concert: { difficulty: 2, conversation: 2, repeat: 2, vibes: ["music", "culture"] },
  "food-market": { difficulty: 2, conversation: 3, repeat: 4, vibes: ["food", "browse"] },
  "class-workshop": { difficulty: 3, conversation: 4, repeat: 4, vibes: ["creative", "structured"] },
  other: { difficulty: 3, conversation: 3, repeat: 3, vibes: [] },
};

export function parseEventFromText(text: string): ParsedEvent {
  const eventType = inferType(text);
  const p = typeProfiles[eventType] ?? typeProfiles.other;
  const parsed: ParsedEvent = {
    title: extractTitle(text),
    date: extractDate(text),
    startTime: extractTime(text),
    location: extractLocation(text),
    cost: extractCost(text),
    eventType,
    vibeTags: p.vibes,
    socialDifficulty: p.difficulty,
    conversationPotential: p.conversation,
    repeatPotential: p.repeat,
    arrivalStrategy: pick(arrivalBank, [text.slice(0, 40), eventType]),
    microChallenge: pick(parserChallenges, [text.slice(0, 40), "mc"]),
  };
  return parsed;
}

const parserChallenges = [
  "Ask one person how they found this event.",
  "Learn the organizer's name before you leave.",
  "Stay 45 minutes minimum.",
  "Find out if this repeats, and when.",
  "Introduce yourself to one person by name.",
];

// --- Arrival strategies ---

const arrivalBank = [
  "Arrive 10 minutes early. Early arrivers get the easy conversations — everyone's still finding their footing and grateful for company.",
  "Get there right at start time and find the organizer first. One hello to the person running it makes the whole room warmer.",
  "Arrive early, claim a spot near the middle of the room, and let people join you instead of you joining them.",
  "Walk in, get whatever there is to hold — coffee, water, a program — and do one slow lap before settling. It reads as comfortable even when you aren't.",
  "Show up 15 minutes early and offer to help set up. Helpers skip the small-talk cold start entirely.",
  "Time your arrival to the first third. Too early can feel exposed; too late means groups have already formed.",
  "Go in with one job: find the person who looks newer than you and say hi. It converts your nerves into hosting.",
  "Arrive early enough to talk to whoever's at the check-in table. They know everyone and will introduce you if you ask.",
  "Enter, put your phone away before the door, and give yourself two minutes of standing before deciding anything.",
  "If you're nervous, arrive with a question ready for the organizer. A person with a question has a reason to be there.",
  "Come straight from something — a walk, an errand — rather than from sitting at home deciding. Momentum carries through the door.",
  "Arrive on time and sit next to someone rather than leaving a buffer seat. The buffer seat is the introvert trap.",
  "Get there early, learn one staff or volunteer name, and use it when you leave. You're now a face they know.",
  "Plan your first five minutes only: enter, get situated, say one hello. After five minutes, rooms always feel smaller.",
  "Arrive before the structured part starts. Structured time is easy; it's the before and after where ties form — give yourself both.",
];

export function generateEventArrivalStrategy(event: OrbitEvent): string {
  return pick(arrivalBank, [event.id, event.eventType, "arrival"]);
}

// --- Conversation openers ---

const openersByContext: Record<string, string[]> = {
  general: [
    "How did you find out about this?",
    "Is this your first time, or are you a regular?",
    "What did you think of tonight compared to other ones?",
    "Do you live around here, or did you come in for this?",
    "What else like this do you go to?",
    "How long have you been coming to these?",
    "What's the best one of these you've been to?",
    "Do you know most people here, or is everyone a stranger to everyone?",
  ],
  "run-club": [
    "What pace group do you usually run with?",
    "Are you training for something, or is this the training?",
    "Does the group actually do the coffee thing after, or does everyone scatter?",
  ],
  "faith-community": [
    "Have you been part of this community long?",
    "Is this gathering every week? I'm trying to make it a regular thing.",
    "Is there anything coming up that's worth showing up for?",
  ],
  "board-games": [
    "What game should I not leave without trying?",
    "Are you the strategy type or the chaos type?",
    "Do the same people come every week?",
  ],
  professional: [
    "What brought you to this one — the topic or the habit?",
    "What are you working on that you actually care about?",
    "Are these events useful for you, or just good discipline?",
  ],
  "fitness-class": [
    "How long have you been doing this class?",
    "Is the instructor always like this?",
    "What else do you train during the week?",
  ],
  volunteer: [
    "How did you get involved with this?",
    "Do you do this shift regularly?",
    "What's the story behind this organization, do you know?",
  ],
  "class-workshop": [
    "What made you sign up for this?",
    "Have you done anything like this before?",
    "Are you going to keep going after this session?",
  ],
};

export function generateConversationOpeners(event: OrbitEvent): string[] {
  const specific =
    openersByContext[event.eventType] ??
    openersByContext[
      event.eventType === "improv-class" || event.eventType === "book-club"
        ? "class-workshop"
        : "general"
    ] ??
    [];
  const general = openersByContext.general;
  const seed = [event.id, "openers"];
  const out: string[] = [];
  if (specific.length > 0) {
    out.push(pick(specific, seed));
    if (specific.length > 1) out.push(pick(specific, [...seed, 2]));
  }
  out.push(pick(general, seed));
  out.push(pick(general, [...seed, 3]));
  return Array.from(new Set(out)).slice(0, 3);
}
