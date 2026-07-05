You are building a production-quality MVP called Orbit.

Orbit is a personal social operating system for adults rebuilding their social life.

The core product promise is:

"Stop wasting your nights. Build a real social life in 30 days, one outing and one follow-up at a time."

Orbit combines:

1. Solo Night Generator
2. Friendship CRM
3. Event Planner
4. Social Rep Tracker
5. Weekly Review Dashboard
6. 30-Day Social Rebuild Program
7. Lightweight monetization structure
8. Mobile-first deployed web app
9. PWA-ready structure
10. Optional future native app wrapper via Capacitor

The goal is not to build a toy prototype.

The goal is to build a usable product that someone can open by URL, use on their phone, understand within 60 seconds, and actually use to leave the apartment, attend something, follow up with someone, and repeat next week.

The winning version is not the app with the most features. The winning version is the app that creates behavioral momentum.

1. Product Philosophy

Orbit is not:

* A dating app
* A social feed
* A friend-matching app
* An AI companion
* A therapy app
* A mental health treatment app
* A generic productivity dashboard
* A contact book
* A social media platform
* A group chat app
* A scraping-heavy event discovery engine

Orbit is:

* A private operating system for rebuilding social life
* A behavior scaffold
* A weekly planning and follow-up system
* A relationship intention tracker
* A way to turn weak ties into real relationships
* A system for adults who have events, contacts, and intentions, but no cadence

Core behavior loop:

1. User completes onboarding.
2. User chooses a social goal.
3. Orbit generates a 7-day plan.
4. User adds or imports events manually.
5. User attends events and tracks social reps.
6. User adds people they met.
7. Orbit suggests follow-up messages.
8. User sends messages manually through the appropriate app.
9. User marks follow-ups as sent.
10. Orbit creates a weekly review.
11. Orbit encourages continuation into a 30-day rebuild plan.

The app should feel like training mileage for social life.

It should be calm, premium, direct, private, and behavior-oriented.

Avoid cheesy gamification.

Avoid childish badges.

Avoid gimmicky AI companion behavior.

Use quiet progress indicators, streaks, and weekly reps only where they genuinely help.

2. Target User

The target user is a 35+ introverted or socially underbuilt professional living in or near a major city.

They may be:

* Divorced
* Recently moved
* Remote or hybrid
* Lonely but functional
* High-income but socially underbuilt
* Tired of wasting weekends
* Too old for chaotic nightlife
* Too busy or avoidant to build social routines naturally
* Looking for more friends, community, dates/marriage momentum, or recurring social anchors

The user does not want to identify as "lonely."

The app should not make the user feel pathetic.

The product framing should be:

* Rebuilding social life
* Creating social cadence
* Building weak ties
* Getting out of the house
* Turning intention into action
* Developing repeatable social reps

Do not use shame-heavy language.

But the app can be direct.

Examples of direct "avoidance mirror" language:

* "You added 4 events but committed to none. Pick one by tonight."
* "You met two people this week but followed up with neither. That is where weak ties die."
* "You are choosing low-friction solo activities only. Add one event with actual conversation potential."
* "You skipped the event. Do not restart the whole plan. Do one small rep today."
* "You keep planning instead of attending. Choose one recurring event and go."

3. Technical Stack

Build Orbit as:

* Next.js app
* TypeScript
* Tailwind CSS
* Mobile-first responsive design
* Deployed web app first
* PWA-ready if straightforward
* Optional future Capacitor native wrapper

Use Supabase for persistence if straightforward.

If Supabase setup slows down the project, build a polished localStorage MVP with a clean data-access layer that can later be swapped for Supabase.

Do not block demo functionality on external API keys.

The app must be usable without signing in for demo mode.

Use mock AI functions instead of requiring a real LLM API for the MVP.

4. Delivery Targets

Orbit should have three delivery targets:

Primary target:

* Deployed web app
* Accessible by URL
* Mobile-first
* Deployable to Vercel

Secondary target:

* Installable PWA if straightforward
* App manifest
* Placeholder icons
* Theme color
* Mobile viewport
* Home-screen install support where supported

Optional advanced target:

* Capacitor native wrapper scaffold for future iOS/Android distribution

Do not build a native mobile app from scratch.

Do not start with Swift, Kotlin, React Native, or a native-only implementation.

The core product should remain a Next.js web app.

If Capacitor is added, it should wrap the web app and must not break the web version.

5. Access Model

V1 should include:

Demo Mode:

* No login required
* Uses localStorage
* Includes seeded sample data
* Lets user experience the full app flow immediately
* Clearly labels itself as demo/local mode
* Data persists in the browser after refresh
* Data is not synced across devices
* User can export JSON
* User can import JSON
* User can delete all local data

Future Account Mode:

* Structure the app so Supabase Auth can be added later
* Create a clean data-access layer so localStorage can later be swapped for Supabase
* Do not require Supabase Auth for the first working demo unless it is extremely straightforward

Future Paid Mode:

* Include mock locked states
* Include upgrade prompts
* Do not integrate Stripe unless everything else is complete
* Upgrade buttons can route to pricing or a mock checkout screen

6. Routes

Public routes:

* /
* /pricing
* /demo
* /about

App routes:

* /app
* /app/onboarding
* /app/tonight
* /app/events
* /app/events/[id]
* /app/people
* /app/people/[id]
* /app/reps
* /app/review
* /app/program
* /app/settings

7. Landing Page

Create a simple, clear landing page.

Hero:
"Build a real social life in 30 days."

Subheading:
"Orbit gives you weekly outings, follow-up prompts, and a private relationship tracker so you stop starting from zero every weekend."

Primary CTA:
"Start 7-Day Plan"

Secondary CTA:
"Try Solo Night Generator"

Landing page sections:

1. The problem
    * Too many adults have contacts, events, and intentions, but no operating system for turning them into relationships.
2. The Orbit method
    * Go out.
    * Meet people.
    * Follow up.
    * Repeat.
3. What you get
    * Solo plans
    * Event scoring
    * Social reps
    * Follow-up drafts
    * Weekly review
    * 30-day rebuild program
4. Who it is for
    * Adults rebuilding social life
    * Introverts
    * Post-divorce
    * New city
    * Remote/hybrid workers
    * High-performing professionals with weak social routines
5. Pricing preview
    * Free
    * Pro
    * Premium
6. Onboarding

Onboarding should be fast and useful within 2 minutes.

Ask:

* Name
* City/neighborhood
* Age range
* Current social goal:
    * Make new friends
    * Rebuild after divorce/breakup
    * New city reset
    * Build community
    * Dating/marriage momentum
    * Stop wasting nights at home
* Social energy:
    * Low
    * Medium
    * High
* Preferred settings:
    * Run clubs
    * Book/comic clubs
    * Faith/community events
    * Concerts
    * Classes/workshops
    * Coffee shops
    * Fitness
    * Volunteering
    * Professional events
    * Food/night markets
    * Museums/culture
* Avoided settings:
    * Bars
    * Heavy nightlife
    * Loud parties
    * Large networking events
    * Expensive events
* Weekly availability
* Budget per outing
* Comfort talking to strangers:
    * Not comfortable
    * Somewhat comfortable
    * Comfortable but rusty
    * Very comfortable
* Preferred follow-up channel:
    * WhatsApp
    * SMS
    * Email
    * LinkedIn
    * Instagram
    * Other

After onboarding, generate an initial 7-day social plan.

9. Dashboard

Dashboard should show:

* Tonight's recommended action
* This week's social plan
* Upcoming events
* People to follow up with
* Social reps completed this week
* Current 30-day rebuild progress
* One avoidance mirror insight
* Quick-add event
* Quick-add person
* Quick complete social rep
* Continue 30-day plan button

The dashboard should make the next action obvious.

The user should never have to wonder, "What should I do now?"

10. Solo Night Generator

Inputs:

* Mood:
    * Drained
    * Restless
    * Lonely
    * Bored
    * Anxious
    * Celebratory
    * Spiritually low
    * Socially motivated
* Energy level:
    * Low
    * Medium
    * High
* Budget
* Available time
* Location/neighborhood
* Desired vibe:
    * Quiet
    * Social-adjacent
    * Adventurous
    * Spiritual
    * Creative
    * Fitness
    * Food
    * Culture
    * Productive
* Social openness:
    * I want to avoid people
    * I am okay being around people
    * I can talk to one person
    * I want a genuinely social night
* Transportation preference
* Weather optional as manual field

Output three plans:

1. Minimum viable outing
2. Standard plan
3. Bold plan

Each plan should include:

* Timeline
* Location placeholders
* Cost estimate
* Social difficulty rating
* Conversation potential rating
* Exit rule
* One micro-challenge
* One reflection prompt
* Add to plan button

Examples of micro-challenges:

* Ask one person how they found the event.
* Stay at least 45 minutes.
* Compliment one specific thing.
* Ask the organizer one question.
* Introduce yourself to one person and leave without forcing anything else.
* Return to a recurring event for the second time.
* Send one follow-up before going to bed.
* Ask one person whether they come to this event often.

11. Events

Allow user to add/edit/delete events.

Event fields:

* Title
* Date
* Start time
* End time
* Location
* Neighborhood
* Cost
* URL
* Event type
* Vibe tags
* Solo-friendliness score
* Conversation potential score
* Repeat potential score
* Social difficulty score
* Notes
* Status:
    * Interested
    * Planned
    * Attended
    * Skipped

Add an event scoring system.

Event score should consider:

* Conversation potential
* Repeat potential
* Alignment with user goals
* Cost
* Travel friction
* Social difficulty
* Whether it is recurring
* Whether the user has attended before
* Whether the event creates repeated exposure

Recommend recurring events more strongly because repeated exposure creates actual relationships.

Event list should support filtering by:

* Date
* Status
* Event type
* Neighborhood
* Conversation potential
* Repeat potential
* Social difficulty

12. Paste-a-Link / Paste-Text Event Parser

Add a paste-a-link event parser mock function.

For now, the parser can accept pasted text or URL and generate a structured event object using mock logic.

Do not build scraping in v1.

Do not depend on external APIs.

The parser should extract or infer:

* Title
* Date
* Time
* Location
* Cost
* Event type
* Vibe tags
* Social difficulty
* Conversation potential
* Repeat potential
* Suggested arrival strategy
* Suggested micro-challenge

13. Event Detail Page

Show:

* Event details
* Why this event might be worth attending
* Social rep assignment
* Arrival strategy
* Exit rule
* Conversation openers
* Add to calendar option
* Mark attended
* Mark skipped
* Add person met
* Notes/reflection

After user marks attended, prompt:

* Did you talk to anyone?
* Who did you meet?
* Did you exchange contact info?
* Would you attend this again?
* What did you learn?
* Energy after event:
    * Drained
    * Neutral
    * Better
    * Energized

If user marks skipped, prompt:

* Why did you skip?
* Was this avoidance, logistics, fatigue, cost, or poor fit?
* What is the smallest recovery action?

Examples of recovery actions:

* Attend a smaller event tomorrow.
* Send one follow-up.
* Go to a public place for 30 minutes.
* Add one recurring event to next week.
* Do one solo-but-public activity.

14. Calendar Handoff

Build lightweight calendar support only.

Include:

* Export as .ics file
* Add to Google Calendar link if easy
* Planned/attended/skipped status

Do not build full Google Calendar OAuth in v1 unless everything else is already complete.

Calendar handoff should help the user convert intention into action.

15. People / Friendship CRM

Allow user to add/edit/delete people.

Person fields:

* Name
* Context
* Where met
* Date met
* Relationship lane:
    * Acquaintance
    * Potential friend
    * Community contact
    * Dating/marriage interest
    * Professional
    * Family
    * Other
* Vibe
* Shared interests
* Notes
* Preferred channel:
    * WhatsApp
    * SMS
    * Email
    * LinkedIn
    * Instagram
    * Other
* Phone number optional
* Email optional
* Social handle optional
* Last contacted date
* Next follow-up date
* Follow-up cadence
* Status:
    * New
    * Needs follow-up
    * Active
    * Dormant
    * Do not pursue

The CRM should not feel like corporate software.

It should answer:

* Who did I meet?
* Should I follow up?
* What should I say?
* Am I overinvesting?
* Is this a weak tie worth nurturing?
* Should I invite them to something?
* Should I let this go?

16. Relationship Reality Check

Add a "relationship reality check" field or computed warning.

Examples:

* "You only met once. Keep this light."
* "This person has not responded. Do not chase."
* "You have not followed up in 3 weeks. Send something simple or let it go."
* "This is a good weak tie. Invite them to a low-pressure recurring event."
* "You are projecting too much onto a thin interaction. Keep the next message casual."
* "This person is in your orbit, but not yet a friend. Build through repeated low-pressure contact."
* "You have sent two messages without response. Stop here unless they re-engage."

The reality check should be direct, but not cruel.

17. Follow-Up Message Generator

For each person, generate follow-up message drafts based on:

* Where they met
* Shared interests
* Relationship lane
* Time since last contact
* Preferred channel
* User's goal
* Whether they have responded before
* Whether the user is at risk of overinvesting

Tone options:

* Casual
* Warm
* Direct
* Professional
* Low-pressure
* Faith/community-oriented when relevant

Every follow-up should include:

* Suggested message
* Why this message works
* Risk level:
    * Very safe
    * Slightly vulnerable
    * Too much / scale back
* Suggested send timing

Examples:

Casual:
"Hey Omar — good meeting you at run club Friday. I'm probably going again next week. You planning to be there?"

Professional:
"Great meeting you at the event yesterday. I enjoyed our conversation about fintech and operations. Would be glad to stay in touch."

Community:
"Good seeing you at the mosque event. I'm trying to be more consistent about showing up, so hopefully I'll see you again soon."

Low-pressure:
"Hey, good meeting you the other day. No need to respond quickly — just wanted to say I enjoyed the conversation."

18. Communication Handoff

Integrations should do handoff, not automation.

Do not auto-send messages.

Do not read user messages.

Do not connect to WhatsApp Business API.

Do not import WhatsApp chats.

Do not import contact books.

Do not build full platform integrations.

For each suggested follow-up message, provide buttons:

1. Copy message
2. Share using browser/device native share sheet via Web Share API when available
3. Open WhatsApp using wa.me link only if phone number exists
4. Open SMS link only if phone number exists
5. Open mailto link only if email exists
6. Mark as sent
7. Snooze

The product should help the user write, launch, and track the follow-up.

It should not pretend to manage relationships automatically.

19. Social Rep Tracker

Track daily and weekly reps:

* Left the apartment intentionally
* Attended event
* Stayed at least 45 minutes
* Introduced self to one person
* Asked a follow-up question
* Exchanged contact info
* Sent follow-up
* Invited someone to something
* Attended faith/community gathering
* Volunteered
* Joined a recurring group
* Did one solo-but-public activity
* Returned to a recurring event
* Talked to an organizer
* Added a person to CRM
* Completed weekly review

Show:

* Weekly reps completed
* Best streak
* Current week progress
* Social courage score
* Repeat exposure count
* Recovery action if behind

Do not make this childish.

It should feel like a training log, not a game.

20. Weekly Review

Every week, generate:

* Events attended
* Events skipped
* People met
* Follow-ups sent
* Follow-ups owed
* Best social rep
* Avoidance pattern
* Recommended next week plan
* One uncomfortable but manageable assignment
* One recurring event to repeat
* One weak tie to nurture
* One thing to stop doing

Examples:

* "Return to the same run club next Friday and talk to one person you recognize."
* "Send two follow-ups before Wednesday."
* "Choose one recurring event and attend it for three straight weeks."
* "Stop adding events as a substitute for attending them."
* "You do better with structured events than open-ended social nights. Plan accordingly."
* "Your best social reps came from repeat settings. Stop chasing novelty."

21. 30-Day Social Rebuild Program

Create a structured 30-day program.

Program phases:

Week 1: Leave the apartment

* Goal: reduce friction and create motion
* Assignments:
    * Solo public outings
    * Low-pressure events
    * One recurring event
    * One 45-minute stay
    * One public place where conversation could happen

Week 2: Start conversations

* Goal: small social reps
* Assignments:
    * Ask questions
    * Introduce self
    * Talk to organizers
    * Ask one person how they found the event
    * Return to one recurring setting

Week 3: Follow up

* Goal: convert interactions into weak ties
* Assignments:
    * Send messages
    * Invite someone to a repeat event
    * Revive one dormant weak tie
    * Keep follow-ups low-pressure

Week 4: Build cadence

* Goal: create repeatable social routine
* Assignments:
    * Choose recurring anchors
    * Review relationship lanes
    * Plan next month
    * Identify the highest-return social setting
    * Stop attending low-yield events

Program dashboard should show:

* Day number
* Current week theme
* Today's assignment
* Completed assignments
* Missed assignments
* Recovery action if user falls behind
* Progress toward 30 days
* Next required rep

Make recovery non-shaming:

* "You missed two days. Do not restart. Complete one small rep today."
* "You fell behind. The next move is not analysis. It is one rep."
* "Restarting is a trap. Continue from today."

22. Monetization-Ready Structure

Build pricing placeholders but do not integrate payments unless easy.

Plans:

Free:

* Basic CRM
* Add events manually
* 3 Solo Night plans/month
* Basic social rep tracking
* One 7-day plan

Pro:

* Unlimited Solo Night plans
* Full 30-Day Social Rebuild
* AI follow-up drafts
* Weekly reviews
* Event scoring
* Calendar export
* Advanced people tracking

Premium:

* Advanced accountability
* Deeper weekly review
* More direct avoidance mirror
* Persona-specific plans
* City packs
* Exportable personal social strategy

Add a pricing page with these tiers.

Add upgrade prompts after:

* User finishes 7-day plan
* User uses 3 Solo Night plans
* User wants full weekly review
* User wants unlimited follow-up messages
* User wants 30-day rebuild continuation
* User wants advanced avoidance mirror
* User wants city/persona packs

No payment provider required for MVP unless implementation is trivial.

Use mock Upgrade flows and locked-state UI.

23. Monetization Principle

The paid product is not the CRM.

People do not pay to maintain another database.

The paid product is the weekly outcome:

"Every week, Orbit gives you 3 realistic outings, 2 follow-ups, and 1 social rep assignment."

The monetizable transformation is:

* Stop wasting nights
* Leave the apartment
* Attend better events
* Build weak ties
* Follow up before connections die
* Create recurring social anchors
* Build a real cadence over 30 days

24. City Packs and Persona Packs

Create a data structure for future city/persona packs.

Example city packs:

* Jersey City Social Rebuild
* NYC Solo Nights
* Brooklyn Introvert Pack
* Chicago New Friends Pack

Example persona packs:

* Post-divorce rebuild
* New city reset
* Remote worker social recovery
* Faith/community-centered social life
* Introvert concert/social calendar
* Fitness-based friendship builder

Seed the app with Jersey City/NYC-style sample data:

* Run club
* Comic book club
* UCB improv class
* Mosque/community event
* Concert
* Arcade meetup
* Coffee reading night
* Volunteer event
* Museum night
* Professional meetup
* Bookstore night
* Low-pressure dinner meetup
* Fitness class
* Board game night
* Neighborhood walk
* Coworking/community event

25. Data Models

Create clean TypeScript types for:

* UserProfile
* Goal
* Event
* Person
* FollowUp
* SocialRep
* WeeklyReview
* ThirtyDayProgram
* Plan
* CityPack
* PersonaPack
* PricingTier
* OnboardingResponse
* SocialAssignment
* AvoidanceMirror
* RecoveryAction
* EventScore
* RelationshipRealityCheck
* AppMode
* StorageAdapter

26. Mock AI Layer

Create mock AI functions that can later call an LLM API.

Functions:

* generateSoloNightPlans()
* generateWeeklySocialPlan()
* generateFollowUpMessage()
* scoreEvent()
* generateWeeklyReview()
* generateAvoidanceMirror()
* parseEventFromText()
* generateThirtyDayProgram()
* generateRecoveryAction()
* generateRelationshipRealityCheck()
* generateEventArrivalStrategy()
* generateConversationOpeners()
* generateUpgradePrompt()

These should produce realistic outputs from user data without needing external API calls.

Do not require an API key for demo mode.

Structure these functions so they can later be swapped for a real LLM provider.

27. Data Persistence

For MVP:

* Use localStorage
* Create a storage abstraction layer
* Make it easy to replace localStorage with Supabase later
* Ensure data persists after refresh
* Add export JSON
* Add import JSON
* Add delete all local data
* Add reset to seed data

For future Supabase:

* User data should be scoped to authenticated user ID
* Profiles should be private
* No public profiles
* No social feed
* No social graph unless explicitly added later

28. Privacy

Because Orbit stores sensitive personal relationship data, the UX should communicate that the app is private by default.

For demo mode:

* Store data only in browser localStorage
* Include a clear note: "Demo data is stored only in this browser."
* Include export/import/delete options
* Do not send personal data to external APIs

For future production mode:

* User data should be private by default
* Do not make profiles public
* Do not create social sharing features
* Do not create social feed mechanics
* Do not import contacts in v1
* Do not read private messages
* Do not auto-send messages

Add a plain-English privacy promise.

29. Accessibility

Use:

* Semantic HTML where possible
* Readable font sizes
* Good contrast
* Clear form labels
* Large mobile tap targets
* Keyboard-accessible navigation where reasonable
* No hover-only interactions
* No tiny low-contrast helper text
* Clear focus states

The app should be usable:

* On mobile Safari
* On mobile Chrome
* On desktop Chrome
* Without special setup
* Without needing developer console
* Without external API keys for demo mode

30. UX Requirements

The app should be usable without signing in.

First-run experience should feel useful within 2 minutes.

Do not bury the user in forms.

Use progressive disclosure:

* Basic inputs first
* Details later
* Quick-add buttons everywhere

Navigation:

* Dashboard
* Tonight
* Events
* People
* Reps
* Review
* Program
* Settings

Design:

* Calm
* Premium
* Masculine-neutral
* Minimal
* Mobile-first
* Private
* Serious but not sterile
* Direct but not cruel

Avoid:

* Cartoonish gamification
* Therapy-app clichés
* Social media aesthetics
* Dating-app aesthetics
* Corporate CRM feel
* Overly bright colors
* Empty dashboard states that feel dead

31. PWA Support

Add basic PWA support if straightforward:

* Web app manifest
* App name: Orbit
* Short name: Orbit
* Placeholder app icons
* Theme color
* Mobile viewport
* Home-screen install support where supported
* Offline/local-first language in the UX

If full PWA setup causes friction, keep the app mobile-first and defer advanced offline support.

Mobile web usability matters more than installability.

32. Deployment Readiness

Add:

* Vercel-ready configuration
* README deployment instructions
* Environment variable documentation
* Local development instructions
* Build command
* Test command
* Lint command
* Troubleshooting section
* Definition-of-done checklist

The README should clearly explain:

* What works now
* What is mocked
* What requires future API keys
* How to deploy to Vercel
* How to test on mobile
* How to reset demo data
* How to export/import local data
* How to switch from localStorage to Supabase later

33. App-Ready Architecture

Prepare the codebase for future production features, without fully implementing them unless easy.

Add architecture placeholders for:

* Supabase Auth
* Supabase database persistence
* Stripe subscriptions
* Real LLM API integration
* Google Calendar OAuth
* Capacitor native shell
* App analytics
* Error logging

Use interfaces/adapters so the app can move from local demo mode to authenticated production mode without rewriting core app logic.

34. Capacitor Native Wrapper

If the web app is complete and stable, add a Capacitor scaffold.

The goal is not App Store submission yet.

The goal is to make the project ready to become an iOS/Android app later.

Add:

* Capacitor config
* iOS/Android wrapper setup instructions
* Native build notes
* Known limitations
* What still needs to be done before App Store submission

Do not let Capacitor work break the web app.

Do not prioritize native wrapper before the core web app works.

35. App Store Readiness Folder

Create a folder called /launch or /app-store-readiness.

Include:

1. App Store listing draft
    * App name
    * Subtitle
    * Promotional text
    * Short description
    * Full description
    * Keywords
    * Category recommendation
    * Age rating considerations
2. Screenshots plan
    * Landing page
    * Dashboard
    * Solo Night Generator
    * 30-Day Program
    * People CRM
    * Weekly Review
    * Pricing page
3. Privacy documentation draft
    * What data Orbit stores
    * What data is local-only in demo mode
    * What data future production mode may collect
    * What data should never be public
    * Plain-English privacy promise
4. App privacy disclosure prep
    * List likely data categories
    * Explain whether data is linked to user
    * Explain whether data is used for tracking
    * Explain third-party dependencies
5. Support documentation
    * Support page draft
    * FAQ
    * Delete data instructions
    * Export data instructions
    * Contact/support placeholder
6. TestFlight checklist
    * Install flow
    * Onboarding flow
    * Add event
    * Add person
    * Generate follow-up
    * Mark rep complete
    * Weekly review
    * Data persistence
    * Reset data
    * Mobile layout checks
7. App Review risk notes
    * Avoid presenting Orbit as therapy or medical treatment
    * Avoid promising guaranteed friendships, dates, marriage, or mental health outcomes
    * Avoid creepy automation
    * Avoid auto-sending messages
    * Avoid reading private user messages
    * Avoid importing contact books in v1
    * Make privacy posture clear
8. README

Include a detailed README with:

* App overview
* Target user
* Core product promise
* Product philosophy
* Setup instructions
* Deployment instructions
* Data model explanation
* Mock AI layer explanation
* Demo mode explanation
* Privacy explanation
* Monetization strategy
* V2 roadmap
* Known limitations
* Test checklist
* Definition of done

37. V2 Roadmap

Include a roadmap with:

* Real LLM integration
* Supabase Auth
* Supabase database
* Stripe payments
* Google Calendar OAuth
* Event link parser
* City pack marketplace
* Persona packs
* Personal analytics
* Private coach mode
* Optional browser extension
* Optional mobile app wrapper
* TestFlight release
* App Store submission
* Push notifications only if useful
* Calendar sync
* Optional event source integrations

Explicitly deprioritize:

* Full WhatsApp integration
* Reading messages
* Social feed
* Friend matching
* Swipe mechanics
* AI companion chat
* Heavy contact importing
* Complex scraping
* Group chat
* Native app before web app works
* Payments before behavior loop works

38. Quality Bar

The MVP should be polished enough to demo.

Prioritize:

* Working flows
* Clean UI
* Sample data
* Clear product positioning
* Monetization-ready structure
* Useful mock AI outputs
* Low integration complexity
* Mobile usability
* Deployment readiness
* Privacy clarity

Do not over-engineer.

Do not chase every possible integration.

The app should work even with no external APIs.

39. Definition of Done

The MVP is done only if:

1. It can run locally from a clean install.
2. It can be deployed to Vercel.
3. A user can open the deployed URL on their phone.
4. A user can start demo mode without logging in.
5. A user can complete onboarding within 2 minutes.
6. A user can generate a 7-day plan.
7. A user can generate Solo Night plans.
8. A user can add an event.
9. A user can parse an event from pasted text or URL using mock logic.
10. A user can mark an event attended or skipped.
11. A user can complete the after-event reflection.
12. A user can add a person.
13. A user can generate a follow-up message.
14. A user can copy/share/open a message handoff.
15. A user can mark a follow-up as sent.
16. A user can mark a social rep complete.
17. A user can see weekly social rep progress.
18. A user can see a weekly review.
19. A user can see 30-day program progress.
20. Local data persists after refresh.
21. User can export JSON.
22. User can import JSON.
23. User can delete/reset local data.
24. Pricing/upgrade prompts are mocked clearly.
25. All main routes are reachable.
26. All major buttons are functional or clearly marked as future/mocked.
27. The README explains what is mocked and what is real.
28. There is no hidden dependency on an external API key.
29. The product is understandable within 60 seconds.
30. The app feels credible on mobile.
31. Final Product Audit

After building the app, perform a ruthless product audit.

Check:

* Can it be deployed to Vercel without code changes?
* Can a non-technical user open it from a phone?
* Is there a demo mode without login?
* Does data persist after refresh?
* Are all main routes reachable?
* Are there broken buttons?
* Are locked paid features clearly mocked?
* Are setup instructions complete?
* Is anything secretly dependent on an API key?
* Is the product understandable within 60 seconds?
* Does the dashboard make the next action obvious?
* Does the app actually help the user leave the house?
* Does it help the user follow up?
* Does it encourage recurring exposure?
* Does it avoid becoming a generic CRM?
* Does it avoid becoming a dating app?
* Does it avoid creepy automation?
* Does it avoid overbuilt integrations?

Fix any issues that prevent Orbit from being demoable by URL.

41. Priority Order

Build in this order:

1. Core Next.js app structure
2. Landing page
3. Demo mode
4. Onboarding
5. Dashboard
6. Data models
7. LocalStorage data layer
8. Seed data
9. Solo Night Generator
10. Events
11. Event scoring
12. Event detail/reflection
13. People CRM
14. Follow-up generator
15. Communication handoff
16. Social rep tracker
17. Weekly review
18. 30-day program
19. Pricing/upgrade mock flow
20. Export/import/delete data
21. README
22. Vercel deployment readiness
23. PWA basics
24. App-ready architecture placeholders
25. App Store readiness folder
26. Capacitor scaffold only if web app is already stable

Do not sacrifice the core user loop for native packaging.

Do not sacrifice usability for architecture.

Do not sacrifice shipping for integrations.

42. Core User Loop Reminder

The product succeeds if it repeatedly helps the user do this:

1. Pick something worth attending.
2. Leave the apartment.
3. Stay long enough to create a chance of connection.
4. Talk to one person.
5. Capture the weak tie.
6. Follow up.
7. Return to recurring settings.
8. Build cadence.

Everything else is secondary.
