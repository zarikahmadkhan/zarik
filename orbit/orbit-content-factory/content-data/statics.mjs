// 30 static post cards: quotes, insights, challenges, checklists, and
// "social rep of the day" cards. 1080x1350. *word* = accent.

const cap = (line, tail = "Link in bio.") =>
  `${line}\n\n${tail}\n\n#adultfriendship #sociallife #makingfriends`;

export const statics = [
  // --- Quote cards (10) ---
  { slug: "01-quote-logistics", variant: "quote", headline: "Adult friendship is mostly\n*logistics* and *repetition*.", caption: cap("Not charisma. Not luck. Logistics and repetition."), cta: "orbit — link in bio" },
  { slug: "02-quote-loop", variant: "quote", headline: "You don't need more\nevent options.\nYou need a *loop*.", caption: cap("Pick one. Go. Talk to one person. Follow up. Repeat.") },
  { slug: "03-quote-weak-ties", variant: "quote", register: "mirror", headline: "Weak ties die\nwithout *follow-up*.", caption: cap("The person you clicked with last week isn't going to text first. Neither are you. That's the bug.") },
  { slug: "04-quote-regular", variant: "quote", headline: "*Become a regular*\nsomewhere.", caption: cap("The closest thing adult friendship has to a cheat code.") },
  { slug: "05-quote-reps", variant: "quote", headline: "Social life needs *reps*,\nnot motivation.", caption: cap("The feeling follows the rep. Not the other way around.") },
  { slug: "06-quote-second-interaction", variant: "quote", headline: "The *second interaction* is\nwhere adult friendship begins.", caption: cap("First interactions are cheap. Everyone's friendly at an event. The second one says: that wasn't an accident.") },
  { slug: "07-quote-die-quietly", variant: "quote", register: "mirror", headline: "Most adult friendships don't\nfail dramatically. They just never\nget a *second interaction*.", caption: cap("Nobody chose to end it. Nobody chose to continue it either.") },
  { slug: "08-quote-one-decision", variant: "quote", headline: "Your weekend doesn't need\nmore research.\nIt needs *one decision*.", caption: cap("Decide by 6pm. Go. Let the night be ordinary.") },
  { slug: "09-quote-ordinary", variant: "quote", headline: "The goal is not\na perfect night.\nThe goal is *leaving\nthe apartment*.", caption: cap("Lower the bar until you clear it. Then raise it slowly.") },
  { slug: "10-quote-collecting", variant: "quote", register: "mirror", headline: "Stop *collecting* events\nyou will never attend.", caption: cap("The saved folder is a museum of intentions.") },

  // --- Insight cards (8) ---
  { slug: "11-insight-half-life", variant: "insight", headline: "Weak ties have\na *half-life*.", body: "Day 3: still warm.\nWeek 2: strangers with shared trivia.\nThe window matters more than the wording.", caption: cap("The 72-hour rule exists because the decay is real.") },
  { slug: "12-insight-third-visit", variant: "insight", headline: "The *third visit* is\nthe threshold.", body: "Visit 1: stranger.\nVisit 2: familiar.\nVisit 3: expected.\nExpected people get invited to things.", caption: cap("Pick one recurring thing. Go three times. Watch what changes.") },
  { slug: "13-insight-office", variant: "insight", headline: "The office was\n*ambient social reps*.", body: "Hallway hellos. Lunch invites.\nRemote work deleted them —\nnothing replaced them automatically.", caption: cap("You didn't become antisocial. Your infrastructure disappeared.", "The replacement is designed, not wished for. Link in bio.") },
  { slug: "14-insight-symmetry", variant: "insight", register: "mirror", headline: "Ties die of *symmetry*.", body: "Both people assume the other\nwill reach out.\nSo neither does.", caption: cap("Break the symmetry. One low-pressure message.") },
  { slug: "15-insight-exit-rule", variant: "insight", headline: "The *exit rule* is what\ngets you in the door.", body: "“I can leave after 45 minutes”\nmakes the entrance possible.\nKnowing the way out lowers\nthe cost of going in.", caption: cap("Introvert-native event strategy: exit rule first, then commit.") },
  { slug: "16-insight-cold-start", variant: "insight", headline: "Every new event starts you\nat *stranger-zero*.", body: "10 random events = 10 cold starts.\n10 visits to 2 anchors =\n2 growing reputations.", caption: cap("Novelty is a treadmill. Repetition compounds.") },
  { slug: "17-insight-proportion", variant: "insight", headline: "Light + repeated beats\nintense + rare.", body: "One great conversation is a\ndoorway, not a relationship.\nWalk through it lightly.", caption: cap("The proportionality rule for new connections.") },
  { slug: "18-insight-operations", variant: "insight", headline: "Friendship after 35 is an\n*operations problem*.", body: "Scheduling. Follow-up. Recurrence.\nOps problems don't need motivation.\nThey need a system.", caption: cap("You're not bad at friendship. You're missing infrastructure.") },

  // --- Challenge cards (5) ---
  { slug: "19-challenge-72h", variant: "challenge", headline: "This week's challenge:", body: "Send *one follow-up* to someone\nyou met in the last month.\nFive words is enough.\n“Good meeting you at [place].”", caption: cap("Timing beats wording. Report back when it's sent.", "Start with one social rep — link in bio."), cta: "one message. this week." },
  { slug: "20-challenge-second-visit", variant: "challenge", headline: "The *second visit*\nchallenge:", body: "Go back to something you've\nattended exactly once.\nSay “good to be back”\nto anyone familiar.", caption: cap("Round two is where familiarity starts paying."), cta: "same place. round two." },
  { slug: "21-challenge-45-min", variant: "challenge", headline: "The 45-minute\nchallenge:", body: "One event this week.\nStay 45 minutes. Say one hello.\nThen you're free to leave.", caption: cap("A complete rep. Not a partial one. Complete."), cta: "45 minutes counts." },
  { slug: "22-challenge-one-question", variant: "challenge", headline: "Tonight's assignment:", body: "Ask one person:\n“*How did you find this event?*”\nBest opener in the building.\nWorks every time.", caption: cap("One question. That's the whole assignment.") },
  { slug: "23-challenge-30-day", variant: "challenge", headline: "The *30-day*\nsocial rebuild:", body: "Week 1: leave the apartment\nWeek 2: start conversations\nWeek 3: follow up\nWeek 4: build cadence", caption: cap("Miss a day → continue. Restarting is a trap.", "The app runs the whole program — link in bio."), cta: "day 1 is today" },

  // --- Checklist cards (4) ---
  { slug: "24-checklist-before-event", variant: "checklist", headline: "Before any event:", body: "→ Know your exit rule\n→ Pick one micro-goal\n→ Arrive in the first third\n→ Phone away at the door", caption: cap("The pre-event checklist that makes the door easier.") },
  { slug: "25-checklist-after-event", variant: "checklist", headline: "After any event:", body: "→ Write down who you met\n→ Note one detail per person\n→ Draft the follow-up now\n→ Send within 72 hours", caption: cap("The after-event checklist where friendships actually start.") },
  { slug: "26-checklist-weekly", variant: "checklist", headline: "The weekly minimum:", body: "→ One outing (45 min counts)\n→ One follow-up sent\n→ One recurring event visited\n→ Zero guilt about the rest", caption: cap("A social life on three reps a week. Sustainable beats impressive.") },
  { slug: "27-checklist-anchor", variant: "checklist", headline: "A good anchor event:", body: "→ Repeats weekly\n→ Same people attend\n→ Conversation is possible\n→ You'd survive going alone", caption: cap("Pick two anchors. Attend weekly. That's the infrastructure.") },

  // --- Social rep of the day (3) ---
  { slug: "28-rep-of-day-name", variant: "rep", headline: "SOCIAL REP\nOF THE DAY", body: "Learn *one name* tonight.\nUse it once before you leave.", kicker: "ORBIT · DAILY REP", caption: cap("Names are the cheapest investment in familiarity."), cta: "log it" },
  { slug: "29-rep-of-day-organizer", variant: "rep", headline: "SOCIAL REP\nOF THE DAY", body: "Talk to the *organizer*.\nAsk how the event got started.\nOrganizers are paid in hellos.", kicker: "ORBIT · DAILY REP", caption: cap("The easiest high-value conversation in any room."), cta: "log it" },
  { slug: "30-rep-of-day-invite", variant: "rep", headline: "SOCIAL REP\nOF THE DAY", body: "Invite one person to something\nyou're *already going to*.\n“I'm going Thursday — come through”\nis a complete invitation.", kicker: "ORBIT · DAILY REP", caption: cap("Zero-cost invitation: the plan already exists."), cta: "log it" },
];
