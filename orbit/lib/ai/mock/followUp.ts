import type { FollowUpTone, Person, UserProfile } from "@/lib/types";
import type { FollowUpDraft } from "../index";
import { daysSince, pick } from "./util";

// Template banks per tone. {name} and {where} are filled from real state.
// Sentence structures vary — these should never read as one template with
// swapped nouns.

const banks: Record<FollowUpTone, string[]> = {
  casual: [
    "Hey {name} — good meeting you at {where}. I'm probably going again next week. You planning to be there?",
    "{name}! Still thinking about that conversation at {where}. We should continue it sometime.",
    "Hey, it's {me} from {where}. Good talking with you — figured I'd actually follow up instead of letting it disappear.",
    "Yo {name}, that {where} crowd was solid. Are you a regular or was that a one-off?",
    "Hey {name} — no agenda, just wanted to say I enjoyed talking at {where}. Hope the week's going well.",
    "Random thought — you mentioned {interest} at {where} and I keep coming back to it. Got a recommendation to start with?",
    "Hey {name}, heading back to {where} soon. First round of coffee's on me if you make it out.",
    "{name} — good meeting you the other day. What's your usual week look like? Trying to figure out when people actually go to these things.",
    "Hey! {me} here, from {where}. Adding you before I forget, which is what usually happens.",
    "That was a good conversation at {where}. I don't say that about most events. Hope to run into you again.",
    "Hey {name} — did you end up doing the thing you mentioned at {where}? Was curious how it went.",
    "Good meeting you at {where}, {name}. I'm trying to be better about actually staying in touch with people I click with — so, hi.",
    "Hey {name}, are you going to the next one? Debating it and it'd tip me over if I knew someone there.",
    "{name} — the {interest} conversation was the highlight of {where} for me. Let's pick it back up sometime.",
    "Hey, it's {me}. Short version: good meeting you, I'll be at {where} again, hope to see you there.",
    "You mentioned you go to {where} most weeks — I'm aiming for next one. Save me a spot in the slow group.",
  ],
  warm: [
    "Hey {name}, I really enjoyed meeting you at {where}. Conversations like that are why I keep showing up to these things.",
    "{name} — just wanted to say it was genuinely nice talking with you at {where}. Hope we cross paths again soon.",
    "Hey {name}, thinking about our conversation at {where}. Thanks for being so easy to talk to — not everyone is.",
    "It was really good to meet you, {name}. If you're ever at {where} again, I'd love to continue the conversation.",
    "Hey {name} — I don't always follow up with people I meet, but our conversation stuck with me. Hope your week's been kind.",
    "{name}, meeting you was the best part of {where}. Would be great to stay in touch.",
    "Hey — I appreciated how open you were at {where}. That kind of conversation is rare at these things. Let's keep in touch.",
    "Hi {name}, it's {me} from {where}. Just wanted to say the conversation meant more than the small talk usually does.",
    "Hey {name}, hope the thing you mentioned at {where} is going well. Was thinking about it and rooting for you.",
    "{name} — grateful we ended up talking at {where}. Those conversations don't happen by accident often. Hope to see you again.",
    "Hey, really glad we met at {where}. If you ever want company at one of these, I'm usually up for it.",
    "Hi {name} — it's {me}. Wanted to follow up while the conversation from {where} was still fresh. It was a good one.",
    "Hey {name}, you mentioned {interest} and I've been meaning to tell you I finally looked into it. Thanks for the nudge.",
    "It was lovely meeting you at {where}, {name}. No pressure at all, but I'd enjoy staying in touch.",
    "Hey {name} — people who make events feel less awkward are rare. You're one of them. Hope to see you at the next one.",
  ],
  direct: [
    "Hey {name} — I'm going back to {where} next week. Want to meet up there?",
    "{name}, good meeting you. Let's grab coffee sometime in the next couple weeks — what does your schedule look like?",
    "Hey, it's {me} from {where}. I'd like to stay in touch properly. Coffee some weekend?",
    "{name} — instead of letting this fade like these things usually do: are you free for coffee next week?",
    "Good meeting you at {where}. I'm trying to actually build a circle here, not just collect contacts. Want to grab food sometime?",
    "Hey {name}, two options: I'm at {where} again next week, or coffee near {neighborhood} some morning. Either work?",
    "{name} — short and honest: I enjoyed the conversation and want to continue it. When are you free?",
    "Hey, {me} here. You mentioned {interest} — there's a thing coming up related to it. Want to check it out together?",
    "{name}, let's not do the thing where we meet once and never talk again. Coffee this week or next?",
    "Good talking at {where}. I'll be back same time next week — join me and we'll call it a standing thing.",
    "Hey {name} — I'm putting together my week. If you're up for coffee or a walk, name a day.",
    "{name}: enjoyed meeting you, want to stay in touch, and I figure the direct ask works better than hoping we bump into each other. Free next week?",
    "Hey — heading to {where} again Friday. Come through. It's better with someone to talk to.",
    "{name}, you said you've been meaning to get out more. Same. Let's make that mutual accountability — next event's on the calendar.",
    "Hey {name}, it's {me}. I want to follow through on 'we should hang out sometime.' So: sometime = next week?",
  ],
  professional: [
    "Hi {name}, great meeting you at {where}. I enjoyed our conversation about {interest} and would be glad to stay connected.",
    "{name} — good to meet you yesterday. Your perspective on {interest} stuck with me. Let's keep in touch.",
    "Hi {name}, it's {me} from {where}. I appreciated the conversation and would welcome the chance to continue it over coffee sometime.",
    "Great connecting at {where}, {name}. If you're open to it, I'd enjoy comparing notes on {interest} again.",
    "Hi {name} — following up from {where}. I don't always keep in touch after events, but our conversation was worth the exception.",
    "{name}, good meeting you at {where}. If you're at the next one, I'll look for you — and if a coffee makes sense before then, even better.",
    "Hi, {me} here from {where}. Thanks for the generous conversation. Happy to return the favor if I can ever be useful.",
    "{name} — I enjoyed our exchange at {where}. Would be glad to continue the conversation whenever schedules allow.",
    "Hi {name}, great to meet a fellow {interest} person at {where}. Let's stay connected.",
    "Good meeting you at {where}, {name}. I'm building a better local network this year and conversations like ours are exactly why.",
    "Hi {name} — appreciated your candor at {where}. Those events are better with real conversation. Hope to see you at another.",
    "{name}, following up from {where} — you mentioned something I've been thinking about since. Would enjoy hearing more when you have time.",
    "Hi {name}, it was a pleasure meeting you. If you're attending next month's event, I'd be glad to reconnect there.",
    "Great meeting you, {name}. I'll keep an eye out for you at future {where} events — the regulars seem to get the most out of them.",
    "Hi {name} — thanks for the conversation at {where}. No agenda here; just keeping good contacts warm.",
  ],
  "low-pressure": [
    "Hey {name}, good meeting you the other day. No need to respond quickly — just wanted to say I enjoyed the conversation.",
    "Hi, it's {me} from {where}. Zero pressure, just didn't want to be the person who says 'stay in touch' and never does.",
    "Hey {name} — no agenda here. Just glad we talked at {where}. Hope things are good.",
    "{name}, quick hello from {me}. Enjoyed meeting you at {where}. That's the whole message.",
    "Hey — whenever you see this is fine. Just wanted to say the conversation at {where} was a good one.",
    "Hi {name}, this doesn't need a reply — just keeping the thread alive so it doesn't disappear like these usually do.",
    "Hey {name}, hope the week's treating you well. Glad we met at {where}.",
    "Just a low-stakes hello from {me} ({where}, the {interest} conversation). Good meeting you.",
    "{name} — no rush on this ever, but if you end up at {where} again, I'm usually there. Would be nice to catch up.",
    "Hey, it's {me}. Filing you under 'people worth staying in touch with.' No action needed on your part.",
    "Hi {name} — one-line check-in, no reply expected: good meeting you, hope life's good.",
    "Hey {name}, saw something about {interest} and thought of the conversation at {where}. That's all — carry on.",
    "No pressure at all, but if you're ever heading to {where} again and want company, I'm around.",
    "Hey {name} — just a hello. The bar for keeping a weak tie alive is lower than people think, so consider it cleared.",
    "Hi, {me} here. This is the follow-up I said I'd send and almost didn't. Glad we met.",
  ],
  "faith-community": [
    "Good seeing you at {where}. I'm trying to be more consistent about showing up, so hopefully I'll see you again soon, insha'Allah.",
    "Hey {name}, it was a blessing to meet you at {where}. Hope to see you at the next gathering.",
    "Salaam {name} — good meeting you at {where}. Are you usually there weekly? Trying to make it a regular thing myself.",
    "{name}, good to meet you at {where}. Communities like that are better when you actually know people — glad we talked.",
    "Hey {name}, peace! Enjoyed the conversation after the service. Hope your week is going well.",
    "Good meeting you at {where}, {name}. I've been wanting to get more involved — let me know if there's anything coming up worth joining.",
    "Hey {name} — the conversation at {where} was the highlight of my week. God willing, see you at the next one.",
    "Salaam! It's {me} from {where}. Glad we finally talked after seeing each other around. See you next time.",
    "{name}, blessed to have met you at {where}. If you're going to the next community night, I'll look for you.",
    "Hey {name}, hope you and your family are well. Good meeting you at {where} — those gatherings feel different when you know someone there.",
    "Good to meet you at {where}. I'm new-ish to the community and conversations like ours make it feel like home. See you soon, insha'Allah.",
    "Hey {name} — someone said the volunteer day is coming up. Are you going? Was a pleasure meeting you at {where}.",
    "{name}, peace and blessings. Just wanted to follow up from {where} — don't want to be a stranger at the next one.",
    "Salaam {name}, it's {me}. Grateful for the conversation at {where}. May your week be full of ease.",
    "Good seeing you at {where}, brother. Trying to make these gatherings a weekly anchor — hope to see you there again.",
  ],
};

const whyBank: Record<string, string[]> = {
  recentMeet: [
    "You're following up within the window where they still clearly remember you — no reintroduction needed.",
    "Fast follow-ups convert. The longer you wait, the more this becomes a cold message.",
    "It references where you met, which does the remembering for them.",
  ],
  staleMeet: [
    "It acknowledges time has passed without apologizing for it — apologies make late follow-ups heavier.",
    "A light reopening beats a long explanation. This gives them an easy way back in.",
    "It restarts the thread without demanding anything, which is the only way to revive an old weak tie.",
  ],
  recurring: [
    "It anchors to a recurring event, which turns 'we should hang out sometime' into an actual time and place.",
    "Suggesting the recurring setting removes the scheduling burden — the event does the planning for you.",
    "Repeat exposure at the same setting is how acquaintances become friends. This message books the next exposure.",
  ],
  noResponse: [
    "It's light enough that a non-response costs nothing and a response reopens the door.",
    "After silence, the only good message is one that carries zero obligation. This is that message.",
  ],
  responded: [
    "They've responded before, so this builds on a live thread rather than restarting one.",
    "You have evidence they're receptive — a slightly more direct ask is earned here.",
  ],
};

const timingBank = [
  "Tonight before you lose momentum.",
  "Tomorrow morning — messages sent before noon get answered more.",
  "Within 24 hours of meeting. The window matters more than the wording.",
  "This evening, when people actually check their phones.",
  "Now. You're already thinking about it — that's the timing.",
  "Weekday evening, not late — respectful of their rhythm, easy to answer.",
  "Tomorrow, mid-morning. Not so fast it's eager, not so slow it's cold.",
  "Before the weekend, so 'see you there' has time to land.",
];

export function generateFollowUpMessage(
  person: Person,
  profile: UserProfile | null,
  tone: FollowUpTone
): FollowUpDraft {
  const since = daysSince(person.dateMet) ?? 0;
  const me = profile?.name ?? "me";
  const where = person.whereMet ?? "the event";
  const interest = person.sharedInterests[0] ?? "that thing you mentioned";
  const neighborhood = profile?.neighborhood ?? profile?.city ?? "here";

  const seed = [person.id, tone, person.lastContacted ?? "never"];
  const template = pick(banks[tone], seed);
  const message = template
    .replaceAll("{name}", person.name)
    .replaceAll("{me}", me)
    .replaceAll("{where}", where)
    .replaceAll("{interest}", interest)
    .replaceAll("{neighborhood}", neighborhood);

  // Risk assessment from real state
  let riskLevel: FollowUpDraft["riskLevel"] = "very-safe";
  const whyParts: string[] = [];

  if (person.messagesSentWithoutResponse >= 2) {
    riskLevel = "scale-back";
    whyParts.push(
      "Careful: two messages already sit unanswered. If you send this, make it the last until they re-engage."
    );
    whyParts.push(pick(whyBank.noResponse, seed));
  } else if (person.messagesSentWithoutResponse === 1) {
    riskLevel = "slightly-vulnerable";
    whyParts.push(pick(whyBank.noResponse, seed));
  } else if (tone === "direct" && !person.hasResponded) {
    riskLevel = "slightly-vulnerable";
    whyParts.push(
      "A direct ask before they've ever responded is a small bet — worth it, but know it's a bet."
    );
  } else {
    whyParts.push(
      pick(since <= 3 ? whyBank.recentMeet : whyBank.staleMeet, seed)
    );
  }

  if (person.hasResponded && riskLevel === "very-safe") {
    whyParts.push(pick(whyBank.responded, seed));
  }
  if (message.toLowerCase().includes("next week") || message.toLowerCase().includes("again")) {
    whyParts.push(pick(whyBank.recurring, [...seed, "rec"]));
  }

  return {
    message,
    tone,
    whyItWorks: whyParts.join(" "),
    riskLevel,
    suggestedTiming:
      person.messagesSentWithoutResponse >= 2
        ? "Only after they re-engage. Otherwise, let this one rest."
        : pick(timingBank, [...seed, "time"]),
  };
}
