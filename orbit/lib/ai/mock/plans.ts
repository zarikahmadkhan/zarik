import type {
  OrbitEvent,
  Plan,
  PlanItem,
  SocialAssignment,
  ThirtyDayProgram,
  UserProfile,
} from "@/lib/types";
import { pick, violatesAvoided } from "./util";
import { scoreEvent } from "./events";

// --- 7-day weekly plan ---

const restDayIdeas = [
  { title: "Solo-but-public evening", detail: "Bring a book or laptop somewhere public for an hour. Presence is a rep even without conversation." },
  { title: "Recovery walk", detail: "Thirty minutes outside, no destination required. Keep the leaving-the-apartment muscle warm." },
  { title: "Follow-up night", detail: "Send one message to someone you've met recently. Ten minutes, done from your couch." },
  { title: "Scout night", detail: "Spend 15 minutes finding one recurring event for next week and add it to Orbit." },
  { title: "Coffee shop hour", detail: "Take your usual evening routine — reading, planning, browsing — and do it at a cafe instead." },
  { title: "Prep the ask", detail: "Pick one person in your orbit and draft the invite you'll send this week. You don't have to send it tonight." },
  { title: "Errand out loud", detail: "Do one errand somewhere with people, and say one unnecessary friendly thing to a human." },
  { title: "Early night, on purpose", detail: "Rest is part of training. Sleep well tonight so you show up for the next event." },
];

const eventDayFraming = [
  "Your anchor for the day. Arrive early, stay 45 minutes, talk to one person.",
  "This is the day's one rep. Everything else is optional.",
  "Go, even at 60% energy. Attendance beats intensity.",
  "The goal isn't to be impressive. It's to be present and say one hello.",
  "If you only do one social thing this week, make it this one.",
];

export function generateWeeklySocialPlan(
  profile: UserProfile,
  events: OrbitEvent[]
): Plan {
  const today = new Date();
  const items: PlanItem[] = [];

  // Rank upcoming events; hard-filter avoided settings.
  const upcoming = events
    .filter((e) => {
      if (e.status !== "planned" && e.status !== "interested") return false;
      if (violatesAvoided(`${e.title} ${e.eventType}`, profile)) return false;
      const d = new Date(e.date);
      const diff = (d.getTime() - today.getTime()) / 86400000;
      return diff >= -0.5 && diff < 7;
    })
    .sort(
      (a, b) => scoreEvent(b, profile).total - scoreEvent(a, profile).total
    );

  const byDate = new Map<string, OrbitEvent>();
  for (const e of upcoming) {
    if (!byDate.has(e.date)) byDate.set(e.date, e);
  }

  // Cap effort by energy: low = 2 anchors, medium = 3, high = 4.
  const maxAnchors = profile.energy === "low" ? 2 : profile.energy === "high" ? 4 : 3;
  let anchors = 0;

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const dayIso = d.toISOString().slice(0, 10);
    const event = byDate.get(dayIso);

    if (event && anchors < maxAnchors) {
      anchors++;
      items.push({
        day: dayIso,
        title: event.title,
        detail: pick(eventDayFraming, [dayIso, event.id]),
        eventId: event.id,
        done: false,
      });
    } else {
      const idea = pick(
        restDayIdeas.filter(
          (r) => !violatesAvoided(r.title + " " + r.detail, profile)
        ),
        [dayIso, profile.name, "rest"]
      );
      items.push({
        day: dayIso,
        title: idea.title,
        detail: idea.detail,
        done: false,
      });
    }
  }

  return {
    id: `plan-${Date.now().toString(36)}`,
    kind: "seven-day",
    createdAt: new Date().toISOString(),
    items,
  };
}

// --- 30-day program ---

const week1: [string, string][] = [
  ["Leave the apartment tonight", "Anywhere public counts — 30 minutes minimum. This week is about motion, not conversation."],
  ["Solo-but-public hour", "Cafe, library, park. Bring something to do. Just be where people are."],
  ["Attend one low-pressure event", "Pick the easiest thing on your list. Attendance is the whole assignment."],
  ["The 45-minute stay", "Wherever you go today, stay 45 minutes. Leaving early is the habit we're breaking."],
  ["Scout one recurring event", "Find something that happens weekly and add it to Orbit. You'll attend it this week or next."],
  ["Public place with conversation potential", "Not a movie. Somewhere talk could happen even if it doesn't."],
  ["Attend your recurring event", "First visit. You're not there to make friends yet — you're there to make it familiar."],
];

const week2: [string, string][] = [
  ["Ask one question", "At today's outing, ask one person one question. How they found it. What they recommend. Anything."],
  ["Introduce yourself to one person", "Name for a name. Then you're allowed to let the conversation end."],
  ["Talk to the organizer", "Organizers are paid in hellos. Ask how the event got started."],
  ["Ask how someone found the event", "The single best opener in the building. Use it once today."],
  ["Return to your recurring event", "Second visit. Say 'good to be back' to anyone who looks familiar."],
  ["Two questions, one conversation", "Ask a question, then ask a follow-up to the answer. That's a conversation."],
  ["Learn and use one name", "Get one person's name and say it once before you leave."],
];

const week3: [string, string][] = [
  ["Send one follow-up", "Someone you've met this month. Use the generator if you're stuck. Send before bed."],
  ["Capture the weak tie", "Add the person you talked to this week to Orbit — context, where met, one detail."],
  ["Invite someone to a repeat event", "'I'm going Thursday, come through' is a complete invitation."],
  ["Revive one dormant tie", "Someone from before Orbit. One low-pressure message. No apology for the gap."],
  ["Follow up within 24 hours", "Meet someone today or tomorrow, and message them same-day. Feel the difference."],
  ["Second follow-up to a live thread", "Someone who responded — keep it alive with something small."],
  ["The low-pressure check-in", "One message that needs no reply. 'No need to respond' is allowed verbatim."],
];

const week4: [string, string][] = [
  ["Pick your anchors", "Choose the 1-2 recurring events that earned a permanent slot. Drop the rest without guilt."],
  ["Review your lanes", "Ten minutes in People: who's actually a potential friend? Who should stay an acquaintance?"],
  ["Third visit to your best anchor", "Three visits is when staff and regulars start expecting you. Show up."],
  ["Plan next month's rhythm", "Which weekly slots are social slots now? Write them down like training days."],
  ["Identify your highest-return setting", "Where did the best conversations happen this month? Do more of exactly that."],
  ["Stop one low-yield thing", "Name the event type that costs energy and returns nothing. You're done with it."],
  ["Invite one person to next month", "One weak tie, one concrete plan, next 30 days. Cadence is built one invite at a time."],
];

export function generateThirtyDayProgram(
  profile: UserProfile | null
): ThirtyDayProgram {
  const weeks = [week1, week2, week3, week4];
  const assignments: SocialAssignment[] = [];
  let day = 1;
  for (const week of weeks) {
    for (const [title, detail] of week) {
      // Respect avoided settings even in program copy.
      const safe =
        profile && violatesAvoided(title + " " + detail, profile)
          ? ["Solo-but-public hour", "Cafe, library, park. Bring something to do. Just be where people are."]
          : [title, detail];
      assignments.push({
        day,
        title: safe[0],
        detail: safe[1],
        completed: false,
        missed: false,
      });
      day++;
    }
  }
  // Pad to 30 with two integration days
  assignments.push(
    {
      day: 29,
      title: "Full loop day",
      detail: "Attend your anchor, talk to one person, capture or follow up. The whole system in one day.",
      completed: false,
      missed: false,
    },
    {
      day: 30,
      title: "Write your own week 5",
      detail: "You know your anchors, your people, your reps. Plan next week yourself — Orbit just keeps score now.",
      completed: false,
      missed: false,
    }
  );
  return {
    startedAt: new Date().toISOString().slice(0, 10),
    assignments,
    active: true,
  };
}
