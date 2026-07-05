import type { UserProfile } from "@/lib/types";
import type { SoloNightInputs, SoloNightPlan } from "../index";
import { pick, violatesAvoided } from "./util";

interface Activity {
  title: string;
  steps: string[];
  cost: number;
  difficulty: number;
  conversation: number;
  vibes: string[];
}

// Activity banks. Nothing bar-centric; food never assumes alcohol.
const minimumViable: Activity[] = [
  { title: "The 30-minute walk with a destination", steps: ["Pick a coffee shop or dessert spot 15 minutes away", "Walk there, order something, sit for 10 minutes", "Walk home a different way"], cost: 8, difficulty: 1, conversation: 1, vibes: ["quiet", "productive", "food"] },
  { title: "Read in public, not at home", steps: ["Grab the book you're mid-way through", "Find a cafe or library reading room", "Stay 45 minutes minimum"], cost: 6, difficulty: 1, conversation: 1, vibes: ["quiet", "culture", "productive"] },
  { title: "Grocery run at the nice market", steps: ["Go to the good market, not the closest one", "Buy ingredients for one real meal", "Ask one staff member where something is"], cost: 25, difficulty: 1, conversation: 2, vibes: ["quiet", "food", "productive"] },
  { title: "Sunset loop at the waterfront", steps: ["Time your walk to end at golden hour", "Leave your headphones on low or off", "Sit for ten minutes before heading back"], cost: 0, difficulty: 1, conversation: 1, vibes: ["quiet", "adventurous", "fitness"] },
  { title: "The dessert-spot reset", steps: ["Pick a dessert place you've never tried", "Order at the counter, eat in, no phone for the first ten minutes"], cost: 10, difficulty: 1, conversation: 1, vibes: ["food", "quiet"] },
  { title: "Library evening hours", steps: ["Check your branch's late hours", "Browse a section you never touch", "Check out one thing on impulse"], cost: 0, difficulty: 1, conversation: 1, vibes: ["quiet", "culture", "productive"] },
  { title: "Evening prayer or service, then linger", steps: ["Attend the evening gathering at your mosque, church, or community center", "Stay five minutes after instead of leaving immediately"], cost: 0, difficulty: 2, conversation: 2, vibes: ["spiritual", "quiet"] },
  { title: "The one-errand outing", steps: ["Pick the errand you've been putting off", "Do it tonight, on foot if possible", "Get a hot drink on the way back as the reward"], cost: 6, difficulty: 1, conversation: 1, vibes: ["productive", "quiet"] },
  { title: "Photo walk, one theme", steps: ["Pick a theme: doors, signs, light", "Walk 40 minutes shooting only that", "Pick your best three when you get home"], cost: 0, difficulty: 1, conversation: 1, vibes: ["creative", "quiet", "adventurous"] },
  { title: "Journal somewhere that isn't your couch", steps: ["Bring a notebook to a cafe", "Write for 20 minutes about the week", "Order a second drink and people-watch for ten"], cost: 9, difficulty: 1, conversation: 1, vibes: ["quiet", "creative", "productive"] },
];

const standard: Activity[] = [
  { title: "Food hall dinner, counter seat", steps: ["Pick a food hall or night market", "Order from the stall with the longest line", "Sit at counter seating, not a corner table", "Stay for a full unhurried meal"], cost: 22, difficulty: 2, conversation: 3, vibes: ["food", "social-adjacent", "adventurous"] },
  { title: "Drop-in fitness class", steps: ["Book a drop-in spot at a class you've never done", "Arrive ten minutes early", "Thank the instructor on the way out"], cost: 20, difficulty: 3, conversation: 3, vibes: ["fitness", "social-adjacent"] },
  { title: "Museum or gallery evening", steps: ["Check late-night hours", "Pick two rooms max — depth over coverage", "Eavesdrop on one docent talk or tour if running"], cost: 25, difficulty: 2, conversation: 2, vibes: ["culture", "quiet", "creative"] },
  { title: "Bookstore event night", steps: ["Find tonight's reading or signing", "Arrive early enough to get a seat", "Stay for the Q&A even if you don't ask anything"], cost: 0, difficulty: 2, conversation: 3, vibes: ["culture", "social-adjacent", "creative"] },
  { title: "Community volunteer shift", steps: ["Find a same-week signup — food pantry, community fridge, park cleanup", "Work the full shift", "Learn one other volunteer's name"], cost: 0, difficulty: 2, conversation: 4, vibes: ["social-adjacent", "spiritual", "productive"] },
  { title: "Board game cafe, open table", steps: ["Go on their open-play night", "Ask staff which tables welcome joiners", "Play at least one full game"], cost: 12, difficulty: 3, conversation: 5, vibes: ["social-adjacent", "creative"] },
  { title: "Faith community night", steps: ["Attend the community event, not just the service", "Eat if food is served — shared food is the easiest conversation setting", "Introduce yourself to one person you've seen before"], cost: 0, difficulty: 2, conversation: 4, vibes: ["spiritual", "social-adjacent"] },
  { title: "Night market crawl", steps: ["Pick a night market or evening food street", "Three stalls, three small things", "Ask one vendor what they'd order"], cost: 25, difficulty: 2, conversation: 3, vibes: ["food", "adventurous", "social-adjacent"] },
  { title: "Run club or walk group", steps: ["Show up to the weekly group run or walk", "Match pace with the middle of the pack, not the back", "Stay for whatever comes after — most groups linger"], cost: 0, difficulty: 3, conversation: 4, vibes: ["fitness", "social-adjacent"] },
  { title: "Craft or maker workshop", steps: ["Book tonight's pottery, woodshop, or art drop-in", "Sit next to someone, not at the empty end", "Ask to see what your neighbor made"], cost: 35, difficulty: 3, conversation: 4, vibes: ["creative", "social-adjacent"] },
];

const bold: Activity[] = [
  { title: "Improv or acting drop-in", steps: ["Book the intro drop-in class", "Arrive early and tell the teacher it's your first time", "Do every exercise, even the awkward ones", "Say 'see you next week' to one classmate"], cost: 30, difficulty: 5, conversation: 5, vibes: ["creative", "adventurous"] },
  { title: "Go alone to the thing you'd wait for a friend for", steps: ["The concert, the show, the exhibit you've postponed", "Buy one ticket tonight", "During intermission, stay in the lobby instead of your seat"], cost: 40, difficulty: 4, conversation: 3, vibes: ["culture", "adventurous", "creative"] },
  { title: "Trivia night, join a team", steps: ["Find a cafe or community trivia night", "Tell the host you're solo and ask to join a team", "Contribute at least two answers"], cost: 10, difficulty: 5, conversation: 5, vibes: ["social-adjacent", "adventurous"] },
  { title: "Conversation-based meetup", steps: ["Find tonight's language exchange, philosophy cafe, or discussion group", "Commit to speaking within the first 15 minutes", "Get one person's name and use it once"], cost: 5, difficulty: 5, conversation: 5, vibes: ["social-adjacent", "culture"] },
  { title: "Ask the organizer", steps: ["Attend any group event tonight", "Find the organizer before you leave", "Ask them how the group got started and actually listen"], cost: 10, difficulty: 4, conversation: 5, vibes: ["social-adjacent", "adventurous"] },
  { title: "The second-time return", steps: ["Go back to a place or group you've been exactly once", "Say 'good to be back' to whoever recognizes you", "Being seen twice is how becoming a regular starts"], cost: 10, difficulty: 4, conversation: 4, vibes: ["social-adjacent", "spiritual", "fitness"] },
  { title: "Community dinner or potluck", steps: ["Find a community dinner — faith-based, neighborhood, or cultural", "Bring something even if not required", "Sit at a table that already has people at it"], cost: 15, difficulty: 4, conversation: 5, vibes: ["food", "spiritual", "social-adjacent"] },
  { title: "Class you'd never admit you wanted", steps: ["Dance, pottery wheel, stand-up open mic prep — book it", "Introduce yourself to two people by name", "Book the second class before you leave"], cost: 35, difficulty: 5, conversation: 4, vibes: ["creative", "adventurous"] },
];

const exitRules = [
  "If it's bad after 45 minutes, you're free to leave — 45 minutes is a completed rep either way.",
  "You can leave after one full conversation or one hour, whichever comes first.",
  "Stay until you've done the micro-challenge. Then leaving is a win, not a retreat.",
  "Give it until the halfway point of the event. If you're still drained, go home without guilt.",
  "Leave whenever you want — but say goodbye to one person on the way out.",
  "If you're anxious at the door, go in for 15 minutes. You can leave after that. You usually won't.",
];

const microChallenges = [
  "Ask one person how they found this event.",
  "Stay at least 45 minutes.",
  "Compliment one specific thing — not 'nice shirt,' but why.",
  "Ask the organizer one question about the group.",
  "Introduce yourself to one person and let the conversation end naturally.",
  "Ask one person whether they come here often — and their answer tells you if this is a recurring anchor.",
  "Learn one name. Use it once before you leave.",
  "Send one follow-up message before you go to bed tonight.",
  "Find out when this happens again and put it in Orbit before you leave.",
  "Ask one question that isn't about work.",
  "Sit or stand somewhere central, not at the edge.",
  "Tell one person one true thing about your week.",
  "Ask someone what they'd recommend here.",
  "Arrive without your phone in your hand.",
  "Before leaving, say goodbye to one person by name.",
];

const reflectionPrompts = [
  "What was the moment tonight felt easiest?",
  "Who did you notice that you'd talk to if you came back?",
  "What almost stopped you from going, and what got you out the door?",
  "Was the dread before worse than the thing itself? It usually is — note it.",
  "If you came back next week, what would you do differently in the first ten minutes?",
  "What's one thing you learned about this place that a first-timer wouldn't know?",
  "Rate your energy after vs. before. What does that tell you about this kind of night?",
  "Did you leave too early, too late, or on time?",
  "What would have made tonight 10% more social, and was it available?",
  "Which felt stronger tonight — the resistance before, or the relief after?",
  "If tonight was a rep, what muscle did it work?",
  "Who could you tell about tonight? That might be your next follow-up.",
  "What did you do tonight that the version of you from a month ago would have skipped?",
  "Is this a place worth being a regular? Decide now, not later.",
  "What's the smallest version of tonight you could repeat twice next week?",
];

function fits(a: Activity, inputs: SoloNightInputs, profile: UserProfile | null): boolean {
  if (a.cost > inputs.budget && inputs.budget > 0) return false;
  if (violatesAvoided(a.title + " " + a.steps.join(" "), profile)) return false;
  return true;
}

function preferByVibe(bank: Activity[], inputs: SoloNightInputs, profile: UserProfile | null): Activity[] {
  const usable = bank.filter((a) => fits(a, inputs, profile));
  const matched = usable.filter((a) => a.vibes.includes(inputs.vibe));
  return matched.length > 0 ? matched : usable.length > 0 ? usable : bank;
}

function timeline(a: Activity, inputs: SoloNightInputs): { time: string; step: string }[] {
  const start = 19;
  const stepGap = Math.max(1, Math.floor((inputs.availableHours * 60) / (a.steps.length + 1)));
  return a.steps.map((step, i) => {
    const mins = start * 60 + i * stepGap;
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    return {
      time: `${h}:${m.toString().padStart(2, "0")}`,
      step,
    };
  });
}

function toPlan(
  a: Activity,
  tier: SoloNightPlan["tier"],
  inputs: SoloNightInputs,
  seed: (string | number)[]
): SoloNightPlan {
  return {
    tier,
    title: a.title,
    timeline: timeline(a, inputs),
    costEstimate: a.cost === 0 ? "Free" : `~$${a.cost}`,
    socialDifficulty: a.difficulty,
    conversationPotential: a.conversation,
    exitRule: pick(exitRules, [...seed, "exit", a.title]),
    microChallenge: pick(microChallenges, [...seed, "challenge", a.title]),
    reflectionPrompt: pick(reflectionPrompts, [...seed, "reflect", a.title]),
  };
}

export function generateSoloNightPlans(
  inputs: SoloNightInputs,
  profile: UserProfile | null
): SoloNightPlan[] {
  const seed = [
    inputs.mood,
    inputs.energy,
    inputs.vibe,
    inputs.openness,
    inputs.neighborhood,
    inputs.budget,
  ];

  // Low energy or "avoid people" shifts every tier gentler; high energy and
  // social motivation shifts bolder.
  const gentle =
    inputs.energy === "low" ||
    inputs.mood === "drained" ||
    inputs.openness === "avoid-people";
  const strong =
    inputs.energy === "high" &&
    (inputs.openness === "genuinely-social" ||
      inputs.mood === "socially-motivated");

  const mvBank = preferByVibe(minimumViable, inputs, profile);
  const stdBank = preferByVibe(gentle ? minimumViable : standard, inputs, profile);
  const boldBank = preferByVibe(
    gentle ? standard : strong ? bold : bold,
    inputs,
    profile
  );

  const mv = pick(mvBank, [...seed, "mv"]);
  let std = pick(stdBank, [...seed, "std"]);
  let bd = pick(boldBank, [...seed, "bold"]);
  if (std.title === mv.title && stdBank.length > 1)
    std = pick(stdBank, [...seed, "std", 2]);
  if (bd.title === std.title && boldBank.length > 1)
    bd = pick(boldBank, [...seed, "bold", 2]);

  return [
    toPlan(mv, "minimum-viable", inputs, seed),
    toPlan(std, "standard", inputs, seed),
    toPlan(bd, "bold", inputs, seed),
  ];
}
