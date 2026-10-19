// Who and what is where in each timeline, and what they say. Lines that depend on how
// the past was changed take the PastState. See docs/DESIGN.md §2–§4.
import type { PastState, Timeline } from '../state/past';
import { crowdLook, LOOKS, type Look } from '../art/sprites';
import {
  BENCH, BOOTH, CHANDLERY, CHANDLERY_DOOR, CLOCK_DOOR, CRATES, DOCK, LAMPS, NOTICEBOARD, PIER, PLAQUE, PLATFORM,
  QUAY_Y, rect, type Rect, SHRUBS, STALL, TERMINAL_DOOR, TOWER, WORLD,
} from '../world/layout';

export interface Npc { id: string; name: string; look: Look; x: number; y: number; facing?: 'down' | 'up' | 'left' | 'right'; lines: string[] }
export interface Thing { id: string; x: number; y: number; verb: 'Look' | 'Touch' | 'Enter'; lines: string[]; travel?: boolean }
export interface TimelineContent {
  chip: string; // HUD location/time chip
  arrival: string;
  npcs: Npc[];
  things: Thing[];
  walkable: Rect[];
  blockers: Rect[];
}

const M2 = ' (interior: M2)';

export function contentFor(t: Timeline, past: PastState): TimelineContent {
  const pierIntact = t === 'p1984' || t === 'A1';
  const dockOpen = t === 'p1984' || t === 'A2';
  const walkable = [rect(0, 92, WORLD.w, QUAY_Y - 92 + 2)];
  if (pierIntact) walkable.push(rect(PIER.x + 2, QUAY_Y, PIER.w - 4, PIER.h + 4), rect(PLATFORM.x + 2, PLATFORM.y, PLATFORM.w - 4, PLATFORM.h - 2));
  if (dockOpen) walkable.push(rect(DOCK.x, DOCK.y, DOCK.w, DOCK.h - 2));

  const blockers: Rect[] = [
    rect(TOWER.x + 2, 80, TOWER.w - 4, 12),
    rect(SHRUBS.x, 80, SHRUBS.w, 16),
    ...LAMPS.map((l) => rect(l.x - 2, l.y - 3, 6, 4)),
    rect(BENCH.x, BENCH.y - 2, BENCH.w, 6),
    rect(NOTICEBOARD.x, NOTICEBOARD.y + 16, NOTICEBOARD.w, 10),
    rect(PLAQUE.x + 4, PLAQUE.y + 14, 6, 6),
  ];
  if (pierIntact) blockers.push(rect(CHANDLERY.x, CHANDLERY.y, CHANDLERY.w, CHANDLERY.h + 1));
  if (t === 'baseline' || t === 'A1') blockers.push(rect(392, QUAY_Y - 16, 248, 16)); // fence
  if (t === 'baseline' || t === 'p1984') blockers.push(rect(STALL.x, STALL.y + 16, STALL.w, 12));
  if (t === 'p1984' || t === 'A2') blockers.push(rect(CRATES.x, CRATES.y - 8, CRATES.w, 18), rect(BOOTH.x, BOOTH.y, BOOTH.w, BOOTH.h));
  if (t === 'A1') blockers.push(rect(CHANDLERY.x + 2, CHANDLERY.y + CHANDLERY.h + 2, 12, 10)); // crate

  const clock = (lines: string[]): Thing => ({ id: 'clock', x: CLOCK_DOOR.x, y: CLOCK_DOOR.y, verb: 'Touch', lines, travel: true });

  switch (t) {
    case 'p1984':
      return {
        chip: 'Lantern Night, 1984 · <b>8:15 PM</b> · horn at 9:00',
        arrival: 'Lantern Night, 1984',
        walkable, blockers,
        npcs: [
          { id: 'mara', name: 'Mara', look: LOOKS.mara, x: 560, y: 160, facing: 'left', lines: [
            'The shaft coupling is cracked. You can see daylight through it if you know where to look.',
            'I ordered a spare a month ago. Dell says it never came.',
            'With the part I could swap it in forty minutes. Without it, I\'m told to sail.',
          ] },
          { id: 'dell', name: 'Dell', look: LOOKS.dell, x: 469, y: 104, lines: [
            'Festival crossing, nine sharp. Every seat sold.',
            'The bank calls the note Monday. Tonight pays it. That\'s the whole of it.',
            'Mara worries. Engineers worry. Boats float anyway.',
          ] },
          { id: 'jun', name: 'Jun', look: LOOKS.jun, x: 162, y: 184, lines: [
            'Uncle Dell\'s got me sweeping the pier. On Lantern Night.',
            'I\'ve got the chandlery keys. Nobody\'s allowed in the stockroom, though. Uncle\'s orders.',
            'Mara says the boat\'s sick. Uncle says she\'s being dramatic.',
          ] },
          ...[[420, 128], [434, 134], [448, 128], [462, 136], [408, 140], [60, 138], [74, 142], [250, 142], [264, 138], [330, 144]].map(([x, y], i) => ({
            id: `crowd${i}`, name: 'Festival-goer', look: crowdLook(i), x, y, facing: (i < 5 ? 'right' : 'down') as Npc['facing'],
            lines: [['Best night of the year!', 'They light the lanterns when the ferry\'s halfway across.', 'Nine o\'clock crossing. We\'ve had tickets since August.'][i % 3]],
          })),
        ],
        things: [
          clock(['The Harbour Clock is running. Its hands creep toward nine.']),
          { id: 'chandlery', x: CHANDLERY_DOOR.x, y: CHANDLERY_DOOR.y, verb: 'Enter', lines: ['Locked. Jun has the keys.' + M2] },
          { id: 'terminal', x: TERMINAL_DOOR.x, y: TERMINAL_DOOR.y, verb: 'Enter', lines: ['The ticket hall is packed. Dell is watching the door.' + M2] },
          { id: 'notice', x: NOTICEBOARD.x + 11, y: NOTICEBOARD.y + 26, verb: 'Look', lines: ['LANTERN NIGHT — Festival Crossing 9 PM. Lanterns at mid-harbour. Ruane Ferry Co.'] },
          { id: 'ferry', x: 490, y: 162, verb: 'Look', lines: ['The Marigold, lit end to end. Somewhere below decks, a cracked coupling.' + ' (boarding: M2)'] },
        ],
      };
    case 'baseline':
      return {
        chip: 'Bitternhaven · <b>today</b>',
        arrival: 'Bitternhaven, today',
        walkable, blockers,
        npcs: [
          { id: 'dell', name: 'Dell', look: LOOKS.dellOld, x: 234, y: 126, lines: [
            'Engine failure. The engine is the engineer\'s job.',
            'The inquiry took a week. Didn\'t need a day.',
            'I gave this town a ferry for thirty-two years. She gave it a wreck.',
          ] },
          { id: 'jun', name: 'Jun', look: LOOKS.junOld, x: 56, y: 136, lines: [
            'Bait\'s fresh. Conversation\'s extra.',
            'Lost my uncle\'s whole shop that night. The pier went down with it.',
            'Mara Osei? Left before the inquiry finished. Can\'t blame her. Do, though.',
          ] },
        ],
        things: [
          clock(['The Harbour Clock stopped at 9:12 on Lantern Night, 1984. Nobody ever fixed it. The metal is warm.']),
          { id: 'plaque', x: PLAQUE.x + 7, y: PLAQUE.y + 22, verb: 'Look', lines: ['LANTERN NIGHT, 1984. The ferry Marigold struck this pier after an engine failure attributed to negligent maintenance. Fourteen injured.'] },
          { id: 'notice', x: NOTICEBOARD.x + 11, y: NOTICEBOARD.y + 26, verb: 'Look', lines: ['Tide tables. A lost cat. A council notice: FERRY TERMINAL SITE — FOR SALE.'] },
          { id: 'terminal', x: TERMINAL_DOOR.x, y: TERMINAL_DOOR.y, verb: 'Look', lines: ['Boarded up. Half the letters have fallen off the sign.'] },
          { id: 'pier', x: PIER.x + 14, y: QUAY_Y, verb: 'Look', lines: ['Where the pier was: a stub of planking and a row of black stumps.'] },
        ],
      };
    case 'A1': {
      const headline = { sabotage: 'ENGINEER DISMISSED AFTER FESTIVAL SABOTAGE', panic: 'FERRY PANIC — ENGINEER BLAMED FOR \'RUMOURS\'', adrift: 'MARIGOLD ADRIFT ON LANTERN NIGHT — ENGINEER SACKED' }[past.cancelMethod ?? 'sabotage'];
      const dellStunt = { sabotage: 'Engine wouldn\'t turn over. Funny how that happens to the engineer\'s own engine.', panic: 'Went round the queue telling folk the boat would sink. Half of them went home.', adrift: 'Somebody cut her loose. Mara was the only one aboard with a reason.' }[past.cancelMethod ?? 'sabotage'];
      return {
        chip: 'Bitternhaven · <b>today</b>',
        arrival: 'Bitternhaven, today',
        walkable, blockers,
        npcs: [
          { id: 'dell', name: 'Dell', look: LOOKS.dellOld, x: 234, y: 126, lines: [
            'You want to know who sank Ruane Ferry? Not the river. Her.',
            dellStunt,
            'Lost the festival take. The bank had the boat by spring.',
          ] },
          { id: 'jun', name: 'Jun', look: LOOKS.junOld, x: 190, y: 252, facing: 'left', lines: [
            'Bait & Salvage. This was my uncle\'s chandlery.',
            'That crate? Bronze shaft coupling. Never opened. Came in the day before Lantern Night.',
            'Uncle wouldn\'t pay for it. Then there was no boat to put it in.',
          ] },
        ],
        things: [
          clock(['The Harbour Clock is running. Did it always?']),
          { id: 'notice', x: NOTICEBOARD.x + 11, y: NOTICEBOARD.y + 26, verb: 'Look', lines: [`A yellowed clipping, pinned over and over: "${headline}."`] },
          { id: 'terminal', x: TERMINAL_DOOR.x, y: TERMINAL_DOOR.y, verb: 'Look', lines: ['Chained shut. A SOLD board, older than it should be.'] },
          { id: 'crate', x: CHANDLERY.x + 8, y: CHANDLERY.y + CHANDLERY.h + 14, verb: 'Look', lines: ['Stencilled: RUANE — HOLD PENDING PAYMENT. An invoice is tacked to the lid, dated the day before Lantern Night.'] },
          { id: 'chandlery', x: CHANDLERY_DOOR.x, y: CHANDLERY_DOOR.y, verb: 'Enter', lines: ['The shop smells of tar and bait.' + M2] },
        ],
      };
    }
    case 'A2': {
      const how = { mara: 'A stranger told me the part was forty yards away. I never found out who.', jun: 'Jun brought the crate down the pier in a wheelbarrow. Fourteen and terrified.', dell: 'Dell came down himself with the crate. Said a bank man was aboard. There wasn\'t one.' }[past.fixRoute ?? 'mara'];
      return {
        chip: 'Bitternhaven · <b>today</b>',
        arrival: 'Bitternhaven, today',
        walkable, blockers,
        npcs: [
          { id: 'mara', name: 'Mara', look: LOOKS.maraOld, x: 512, y: 104, lines: [
            'You. You haven\'t aged a day.',
            how,
            'Forty minutes late, that crossing. Best forty minutes of my life.',
          ] },
          { id: 'jun', name: 'Jun', look: LOOKS.junCaptain, x: 470, y: 160, lines: [
            'Captain Ruane. Don\'t wear it out.',
            'Mara took me on as apprentice the week after Lantern Night.',
            'Next crossing\'s at the top of the hour.' + ' (boarding: M2)',
          ] },
        ],
        things: [
          clock(['The Harbour Clock is running, freshly painted.']),
          { id: 'plaque', x: PLAQUE.x + 7, y: PLAQUE.y + 22, verb: 'Look', lines: ['LANTERN NIGHT, 1984 — The crossing that nearly wasn\'t. Departed 9:40 PM. Arrived safely.'] },
          { id: 'notice', x: NOTICEBOARD.x + 11, y: NOTICEBOARD.y + 26, verb: 'Look', lines: ['Ruane Ferry Co. timetable. A poster: LANTERN NIGHT — 42nd anniversary crossing.'] },
          { id: 'terminal', x: TERMINAL_DOOR.x, y: TERMINAL_DOOR.y, verb: 'Enter', lines: ['The ticket hall is open. A portrait of Dell Ruane hangs by the door.' + M2] },
          { id: 'ferry', x: 540, y: 162, verb: 'Look', lines: ['The Marigold, fresh paint over forty-year-old steel.'] },
        ],
      };
    }
  }
}
