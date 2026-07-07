// 20 Reddit posts: 10 discussion-first (NO link, NO product mention),
// 5 problem-validation, 5 soft beta-feedback. Never ads, never fake claims.

const SUBS = {
  friendship: "r/MakeNewFriendsHere (meta threads), r/socialskills, r/AskMenOver30, r/AskWomenOver30",
  city: "r/jerseycity, r/newjersey, r/AskNYC, r/SameGrassButGreener",
  introvert: "r/introvert, r/introverts, r/socialanxiety (read rules first — no product talk ever)",
  remote: "r/remotework, r/WFH, r/digitalnomad",
  divorce: "r/Divorce (support space — discussion only, never validation/beta posts)",
  general: "r/selfimprovement, r/getdisciplined, r/DecidingToBeBetter",
};

const RULES_DISCUSSION = `- Post from an account with real comment history; never a fresh account.
- NO link, NO app mention, NO "I built a thing" — this is a genuine discussion.
- If someone asks "is there an app for this," you may answer honestly in a comment and disclose you're building one. Only if asked.`;

const RULES_VALIDATION = `- Still no links. You may say you're "working on something" only if directly relevant.
- The goal is learning, not conversion. Take notes on the language people use — it feeds ad copy later.`;

const RULES_BETA = `- Only in subs that explicitly allow feedback/beta posts (check rules; r/SideProject, r/alphaandbetausers, r/indiehackers, r/roastmystartup are built for this).
- Full disclosure: you built it, it's free, no account needed, data stays in the browser.
- Never post this in support communities (divorce, anxiety). Ever.`;

export const reddit = [
  // ---------- 10 discussion-first ----------
  {
    slug: "d01-second-interaction",
    kind: "discussion",
    title: "The hardest part of adult friendship isn't meeting people — it's getting to the second interaction. How do you do it?",
    body: `I've noticed a pattern in my own life: I meet people I genuinely click with — at run club, at events, through friends — and then it just... evaporates. Both of us say "we should hang out" and neither of us follows up.

Meeting people was never the bottleneck. The second interaction is.

For people who've actually built new friendships as adults: what got you from "met once" to "met twice"? Was it a specific kind of invite? A recurring thing you both attended? Just being the one who texts first?`,
    subs: SUBS.friendship,
    customize: "Swap 'run club' for your actual recurring activity. Add one real (non-identifying) example of a tie that evaporated.",
    avoid: RULES_DISCUSSION,
    expected: "People sharing their own evaporated ties; a few 'be the one who texts' answers; possible 'is there an app' comments.",
    followUps: [
      "Reply to good answers with a follow-up question ('how soon after meeting?').",
      "Summarize the top advice in a comment after 24h — it keeps the thread alive.",
    ],
  },
  {
    slug: "d02-become-a-regular",
    kind: "discussion",
    title: "People who became 'a regular' somewhere — how long did it take before it turned into actual friendships?",
    body: `There's this piece of advice that the way adults make friends is repeated low-pressure exposure: same coffee shop, same class, same weekly event, until you're a familiar face.

I'm curious about the real timelines. If you became a regular somewhere (gym class, run club, church/mosque group, game night, whatever): how many visits before people knew your name? Before someone invited you to something outside the thing?

And did it work better at some kinds of places than others?`,
    subs: `${SUBS.friendship}, ${SUBS.general}`,
    customize: "Optionally add where you're currently trying this.",
    avoid: RULES_DISCUSSION,
    expected: "Concrete timelines (great validation data), stories about specific venue types. Note which venue types come up — feeds content.",
    followUps: ["Ask commenters what they'd tell someone on visit #1.", "Note the median 'visits to friendship' number people report — usable in future content."],
  },
  {
    slug: "d03-follow-up-scripts",
    kind: "discussion",
    title: "What do you actually text someone after meeting them once, so it doesn't die?",
    body: `Genuine question about wording. You meet someone at an event, good conversation, you exchange numbers. Now what?

"We should hang out sometime" seems to be where these things go to die. What's a message that actually worked for you — either one you sent or one you received that made you think "oh, I like this person"?`,
    subs: SUBS.friendship,
    customize: "None needed — this one is universal.",
    avoid: RULES_DISCUSSION,
    expected: "Actual scripts in comments (harvest the good ones — with the thread as inspiration, not verbatim copying).",
    followUps: ["Upvote and reply to every script shared.", "Ask 'how soon after meeting did you send it?' to surface the timing insight."],
  },
  {
    slug: "d04-moved-cities-8-months",
    kind: "discussion",
    title: "Moved to a new city 8+ months ago and still don't really have people — is this normal?",
    body: `Asking half for myself, half because I suspect it's way more common than anyone admits.

The move itself went fine. Job's fine, apartment's fine. But the social part never materialized the way I assumed it would. Work is remote-ish, so no office pipeline. I've done the Meetup thing a few times but it never sticks.

For people who eventually cracked it: what actually changed? And how long did it really take?`,
    subs: SUBS.city,
    customize: "Adjust the timeline and situation to be truthful for you (or frame explicitly as asking for a broader pattern).",
    avoid: `${RULES_DISCUSSION}\n- Do NOT fabricate a personal situation that isn't yours — either make it true or frame it as a question about the pattern.`,
    expected: "Lots of 'me too' (validation gold), some concrete local suggestions if posted in a city sub.",
    followUps: ["In city subs, ask which specific recurring events people recommend — doubles as seed data for city packs."],
  },
  {
    slug: "d05-remote-social-design",
    kind: "discussion",
    title: "Remote workers: what did you deliberately build to replace the social side of the office?",
    body: `The office was ambient social contact — hallway chats, lunch invites, the birthday cake. Remote work deleted all of it, and I don't think most of us consciously replaced it.

If you've been remote for years and have a social life you're happy with: what did you actually build? Coworking? A standing weekly thing? Scheduled friend calls like meetings? I'm collecting real answers, not vibes.`,
    subs: SUBS.remote,
    customize: "Add your own remote-tenure for credibility.",
    avoid: RULES_DISCUSSION,
    expected: "Systems-minded answers (this audience loves structure). High-quality thread potential.",
    followUps: ["Ask the best answers how long the system took to stick."],
  },
  {
    slug: "d06-introvert-exit-rule",
    kind: "discussion",
    title: "Introverts: does giving yourself an 'exit rule' make you more likely to actually go?",
    body: `I've been experimenting with a rule: before any event, I decide in advance that I'm allowed to leave after 45 minutes, no guilt. Weirdly, knowing I *can* leave is what gets me through the door — and half the time I stay longer anyway.

Curious if others do something similar. What's your version — a time limit, one-conversation minimum, a friend on standby? Does pre-deciding the exit actually change your attendance rate?`,
    subs: SUBS.introvert,
    customize: "Make the experiment claim true for yourself first (try it once this week — it's a good rep anyway).",
    avoid: `${RULES_DISCUSSION}\n- In r/socialanxiety especially: peer discussion only, zero product energy, zero advice-giving tone.`,
    expected: "Strong resonance; introverts love named mechanisms. 'Never heard it called that' comments.",
    followUps: ["Collect the variant rules people share — future carousel material."],
  },
  {
    slug: "d07-collecting-events",
    kind: "discussion",
    title: "Anyone else 'collect' events they never actually attend?",
    body: `My saved-events folder is a museum of intentions. Every week I bookmark 3-4 things that look great — and attend approximately none of them. The saving feels productive, which I suspect is exactly the problem.

Does anyone have a trick that converts saved → attended? Committing to a friend? Buying the ticket immediately? A rule about how many things you're allowed to save?`,
    subs: `${SUBS.general}, ${SUBS.friendship}`,
    customize: "None needed.",
    avoid: RULES_DISCUSSION,
    expected: "High relatability, confession-thread energy, practical tricks in comments.",
    followUps: ["The 'buy the ticket immediately' faction will show up — engage them on why prepayment works."],
  },
  {
    slug: "d08-friendship-after-divorce",
    kind: "discussion",
    title: "The friends kind of came with the marriage. Rebuilding a social life after — what worked for you?",
    body: `Something I didn't expect: most of our social life was couple-shaped. The dinners, the trips, the group chats — they came as a set, and after the divorce they mostly went with it. Nobody was cruel about it. The logistics just stopped including me.

For those further along: how did you rebuild? Did you go back to old pre-marriage friendships, build entirely new ones, or both? What do you wish you'd started sooner?`,
    subs: SUBS.divorce,
    customize: "ONLY post if genuinely true for you, or rewrite as supporting a friend / asking the community about the pattern. Support spaces deserve total honesty.",
    avoid: `${RULES_DISCUSSION}\n- This is a support community. No product energy of any kind, no matter what anyone asks. If someone asks for tools, answer generically.`,
    expected: "Personal stories, heavy threads. Be a good community member — reply with care or don't post.",
    followUps: ["Only supportive engagement. This thread is for learning the language of the pain point, nothing else."],
  },
  {
    slug: "d09-reps-not-motivation",
    kind: "discussion",
    title: "Treating social life like gym training (reps, not motivation) — has anyone else tried this framing?",
    body: `I stopped waiting to "feel social" and started counting small reps instead: left the apartment on purpose, asked one person one question, sent one follow-up text. The feeling seems to follow the action, same as exercise — motivation shows up mid-rep, not before.

Has anyone else run a system like this? What counts as a rep for you, and did tracking it actually change anything or just feel like productivity theater?`,
    subs: SUBS.general,
    customize: "Try it for a week first so the claim is honest.",
    avoid: RULES_DISCUSSION,
    expected: "The self-improvement crowd will engage with the framing; some pushback ('gamifying friendship') worth engaging honestly.",
    followUps: ["Engage the skeptics genuinely — 'tracking vs. living' is a real tension and good comment material."],
  },
  {
    slug: "d10-45-minutes",
    kind: "discussion",
    title: "Lowering the bar to '45 minutes counts' got me out of the apartment more than any pep talk. What's your minimum viable outing?",
    body: `The all-or-nothing framing was killing me: either a Whole Social Night or the couch. What's worked lately is shrinking the unit — 45 minutes at a thing, one hello, allowed to leave. It counts. Weirdly, most nights I stay past the minimum once I'm there.

What's your version of the minimum viable outing? The smallest thing that still counts as "I went out"?`,
    subs: `${SUBS.introvert}, ${SUBS.general}`,
    customize: "None needed.",
    avoid: RULES_DISCUSSION,
    expected: "Wholesome list-thread of tiny outings. Save the best examples — Solo Night Generator inspiration.",
    followUps: ["Reply with encouragement, not advice."],
  },

  // ---------- 5 problem-validation ----------
  {
    slug: "v01-biggest-blocker",
    kind: "validation",
    title: "What's the actual blocker between you and a better social life: finding things, going, or following up?",
    body: `Trying to understand this properly (I think about this problem a lot). If you wanted a better social life tomorrow, which step actually breaks down?

1. FINDING things to do (discovery)
2. Actually GOING (follow-through)
3. TALKING to people once there
4. FOLLOWING UP so it isn't a one-off

My hypothesis is that everyone blames #1 and #3, but #2 and #4 are the real killers. Wrong?`,
    subs: `${SUBS.friendship}, ${SUBS.general}`,
    customize: "None. Poll-style body works as-is.",
    avoid: RULES_VALIDATION,
    expected: "Numbered self-reports — direct validation data for positioning. Tally the answers.",
    followUps: ["After 24-48h, comment a summary of the tally. Note the winner — it should lead your ad angles."],
  },
  {
    slug: "v02-event-apps-gap",
    kind: "validation",
    title: "Meetup/Eventbrite people: you have infinite events available. Why isn't it translating into a social life?",
    body: `Honest question for people who use event apps. The inventory problem is solved — there are 40 things you could do this week within 3 miles. And yet.

Where does it break for you? Too many options so you pick none? You go but it never repeats? You meet people but never see them again? Something else?`,
    subs: `${SUBS.friendship}, ${SUBS.city}`,
    customize: "None.",
    avoid: RULES_VALIDATION,
    expected: "Specific failure stories about the discovery→relationship gap. This validates the core positioning.",
    followUps: ["Ask 'did you ever go back to the same event twice?' — the recurring-exposure gap will surface itself."],
  },
  {
    slug: "v03-would-you-track",
    kind: "validation",
    title: "Would you keep a private tracker of people you've met and want to follow up with? Or is that too weird?",
    body: `Genuinely torn on this. On one hand: I forget people constantly — met someone great at a thing three weeks ago and I've lost the name, the context, everything. A private note ('Omar, run club, likes coffee, said he goes most Saturdays') would have saved that tie.

On the other hand, some people I've mentioned it to say a 'CRM for friends' feels transactional or creepy.

Where do you land? Is it organized thoughtfulness or is it weird? Would it change your answer if it never touched your contacts or messages and stayed entirely on your device?`,
    subs: `${SUBS.friendship}, ${SUBS.general}`,
    customize: "None.",
    avoid: RULES_VALIDATION,
    expected: "A real split — the objection ('transactional') and the counter ('thoughtful') in the wild. Both sides feed FAQ copy.",
    followUps: ["Note the exact words the 'creepy' camp uses — that's the objection your privacy messaging must answer."],
  },
  {
    slug: "v04-30-day-structure",
    kind: "validation",
    title: "If a 30-day plan existed for rebuilding your social life (week 1: just leave the apartment), would you actually run it?",
    body: `Thought experiment. A 30-day program: week 1 is only leaving the apartment (solo-but-public counts), week 2 is starting small conversations, week 3 is following up with people, week 4 is picking recurring anchors. One small assignment a day. Miss a day → continue, never restart.

Would you run it? And what would make you quit by day 6 — the daily-ness, the assignments feeling forced, life getting in the way?`,
    subs: `${SUBS.general}, ${SUBS.introvert}`,
    customize: "None.",
    avoid: RULES_VALIDATION,
    expected: "Interest + honest quit-predictions. The quit-reasons are your retention roadmap.",
    followUps: ["Collect quit-reasons explicitly: 'what killed the last 30-day thing you tried?'"],
  },
  {
    slug: "v05-paying-for-outcome",
    kind: "validation",
    title: "People who've paid for anything social-life-related (apps, clubs, classes) — what was worth it and what wasn't?",
    body: `Curious where the money actually lands. Between paid social apps, class passes, club memberships, coaching, whatever — what did you pay for that genuinely moved your social life forward? What felt like paying for hope?

Trying to understand what makes something worth $10-30/mo in this space vs. obviously not.`,
    subs: `${SUBS.friendship}, ${SUBS.general}`,
    customize: "None.",
    avoid: RULES_VALIDATION,
    expected: "Willingness-to-pay signals and the 'paying for hope' failure modes to avoid in pricing copy.",
    followUps: ["Note what people say made recurring payments feel justified — retention copy input."],
  },

  // ---------- 5 soft beta-feedback ----------
  {
    slug: "b01-sideproject-launch",
    kind: "beta",
    title: "I built a private 'operating system' for rebuilding a social life — free beta, would love brutal feedback",
    body: `After one too many weak ties dying of neglect, I built Orbit: a private system that gives you a plan for tonight (sized to your energy/budget), scores events so recurring ones rise up, tracks people you meet, and drafts follow-up messages you send from your own apps.

What it deliberately is NOT: a dating app, a feed, a friend-matcher, or an AI companion. No account needed, everything stays in your browser.

It's free and rough in places. I'd genuinely value brutal feedback — especially where it feels fake, preachy, or like it's trying too hard. Link in comments if allowed, or DM.`,
    subs: "r/SideProject, r/indiehackers, r/alphaandbetausers",
    customize: "Check each sub's link policy — some want the link in-post, some in comments. Follow exactly.",
    avoid: RULES_BETA,
    expected: "Maker-crowd feedback: UX nits, positioning takes, a few signups. Answer every comment.",
    followUps: ["Post a follow-up comment after a week with what you changed based on feedback — builds trust and bumps the thread."],
  },
  {
    slug: "b02-roastmystartup",
    kind: "beta",
    title: "Roast my app: a social-life CRM for adults who keep letting weak ties die",
    body: `Premise: adult friendship fails at follow-up, not at meeting people. So I built a tool around the loop — pick an event, go, capture who you met, send a follow-up, repeat. Private by design (no feed, no accounts, data stays in your browser).

Roast targets I already suspect: 'CRM for friends' sounds clinical; the free tier might be too generous; dark UI reads serious. What else?`,
    subs: "r/roastmystartup",
    customize: "Link per sub rules.",
    avoid: RULES_BETA,
    expected: "Blunt positioning critique. The 'sounds clinical' thread will be informative.",
    followUps: ["Thank the harshest useful roast specifically."],
  },
  {
    slug: "b03-jc-local-testers",
    kind: "beta",
    title: "Jersey City folks: built a free app for actually building a social routine here — looking for a few local testers",
    body: `Made a thing partly out of my own JC experience: it plans solo nights (Journal Square/Grove St/downtown flavored), scores recurring events like run clubs and community nights, and nudges you to follow up with people you meet.

Looking for a handful of locals to try it for a week and tell me what's off. Free, no account, no spam — your data literally never leaves your browser. Comment or DM if game.`,
    subs: "r/jerseycity (check self-promo rules/day), r/newjersey",
    customize: "Post on the sub's designated self-promo day if it has one. Mention 1-2 real JC venues you actually attend for credibility.",
    avoid: RULES_BETA,
    expected: "Small but high-value local cohort — these are your Phase-1 testers.",
    followUps: ["Offer to add testers' favorite recurring JC events to the seed data — instant engagement loop."],
  },
  {
    slug: "b04-introvert-beta-careful",
    kind: "beta",
    title: "Built a tool around 'exit rules' and minimum-viable outings for introverts — 5 testers wanted (free, private)",
    body: `The tool assumes introverts don't need pressure, they need structure: every plan comes with an exit rule ('45 min then you're free'), a single micro-goal, and a minimum-viable tier where a coffee shop with your book counts.

Looking for ~5 introverts to test whether the plans respect the energy math or secretly still push too hard. Free, no account, browser-only data. Comment/DM.`,
    subs: "r/introvert (rules check first — many introvert subs restrict promo to specific threads)",
    customize: "If the sub has a weekly promo/apps thread, use it instead of a standalone post.",
    avoid: `${RULES_BETA}\n- Never post this in r/socialanxiety — support space, hard no.`,
    expected: "Careful, thoughtful testers. Their 'still pushes too hard' feedback is the most valuable QA the Solo Night Generator can get.",
    followUps: ["Ask specifically: 'which suggestion made you close the app?'"],
  },
  {
    slug: "b05-buildinpublic-update",
    kind: "beta",
    title: "Update: 30 days of building a social-life OS in public — what's working, what's fake, what's next",
    body: `A month ago I started building Orbit (a private system for the go-out → follow-up → repeat loop). Honest status:

WORKING: the 7-day plan generation, event scoring that favors recurring stuff, follow-up drafts with honest risk levels.
STILL FAKE: payments are mocked, the 'AI' is deterministic templates (on purpose, for privacy — but it's fair to call it that).
NEXT: accounts + sync, then a real model behind the drafts.

Beta is free, no account. Feedback from fellow builders welcome — especially on the free/paid line.`,
    subs: "r/indiehackers, r/SideProject, r/buildinpublic (X-style crosspost)",
    customize: "Update the status lines to be true as of posting date. The honesty IS the marketing.",
    avoid: RULES_BETA,
    expected: "Builder respect for the 'still fake' section. That transparency converts better than polish claims.",
    followUps: ["Answer the inevitable 'why not just use an LLM' question with the privacy rationale."],
  },
];
