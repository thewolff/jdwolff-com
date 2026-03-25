"use client";

import { useEffect } from "react";

export default function ConsoleGame() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // ── Styles ───────────────────────────────────────────────────────────
    const T = {
      h: 'color:#9b7fc4;font-weight:bold;font-size:14px;font-family:"JetBrains Mono",monospace',
      p: 'color:#c8c2b8;font-size:12px;font-family:"JetBrains Mono",monospace;line-height:1.8',
      item: 'color:#f0c674;font-size:12px;font-family:"JetBrains Mono",monospace',
      ok: 'color:#b5bd68;font-size:12px;font-family:"JetBrains Mono",monospace',
      err: 'color:#cc6666;font-size:12px;font-family:"JetBrains Mono",monospace',
      hint: 'color:#555;font-size:11px;font-family:"JetBrains Mono",monospace',
      warn: 'color:#de935f;font-size:12px;font-family:"JetBrains Mono",monospace',
      win: 'color:#9b7fc4;font-weight:bold;font-size:15px;font-family:"JetBrains Mono",monospace',
      div: 'color:#333;font-size:12px;font-family:"JetBrains Mono",monospace',
    };

    const say = (msg: string, style = T.p) => console.log(`%c${msg}`, style);
    const br = () =>
      console.log("%c────────────────────────────────────────", T.div);

    // ── State ────────────────────────────────────────────────────────────
    type Flags = {
      meeting_entered: boolean;
      meeting_escape_attempts: number;
      meeting_escaped: boolean;
      review_done: boolean;
      deployed: boolean;
      deploy_attempts: number;
      legacy_visited: boolean;
      coffee_drunk: boolean;
      won: boolean;
    };

    const state: {
      room: string;
      inventory: string[];
      flags: Flags;
      moves: number;
    } = {
      room: "desk",
      inventory: [],
      flags: {
        meeting_entered: false,
        meeting_escape_attempts: 0,
        meeting_escaped: false,
        review_done: false,
        deployed: false,
        deploy_attempts: 0,
        legacy_visited: false,
        coffee_drunk: false,
        won: false,
      },
      moves: 0,
    };

    // ── Items ────────────────────────────────────────────────────────────
    const ITEMS: Record<string, { name: string; desc: string }> = {
      headphones: {
        name: "noise-canceling headphones",
        desc: "A pair of noise-canceling headphones. The best three hundred dollars you have ever spent on anything, including but not limited to: therapy, rent, and the standing desk you bought and then immediately started sitting at.",
      },
      badge: {
        name: "employee badge",
        desc: "Your employee ID badge. The photo was taken on your first day. You look alert and optimistic in it. You find both of these qualities faintly embarrassing now.",
      },
      coffee: {
        name: "mug of office coffee",
        desc: "A mug of coffee that was brewed at 9am. It is now substantially later than 9am. The coffee has entered a philosophical state where it is technically still coffee, but questions have been raised.",
      },
      rubber_stamp: {
        name: "LGTM rubber stamp",
        desc: "A rubber stamp with 'LGTM' carved into the face. You found it under a pile of Jira tickets. Someone made this deliberately. You have decided not to think about who.",
      },
      the_answer: {
        name: "ancient variable declaration",
        desc: "A printout from 2011. It reads:\n\n  const THE_ANSWER = 42;\n  // TODO: figure out the question\n\nDave never figured out the question. The TODO is still open. In some administrative sense, it always will be.",
      },
    };

    // ── Room items (mutable) ─────────────────────────────────────────────
    const roomItems: Record<string, string[]> = {
      desk: ["headphones", "badge"],
      corridor: [],
      meeting: [],
      kitchen: ["coffee"],
      code_review: ["rubber_stamp"],
      legacy: ["the_answer"],
      deploy: [],
      parking: [],
    };

    // ── Rooms ────────────────────────────────────────────────────────────
    type Room = {
      name: string;
      desc: () => string;
      exits: () => Record<string, string | null>;
      onEnter?: () => void;
    };

    const ROOMS: Record<string, Room> = {
      desk: {
        name: "Your Desk",
        desc: () => {
          const inv = roomItems.desk;
          return (
            "Your desk. Three monitors glow with the quiet insistence of things that consider themselves important. " +
            "A mechanical keyboard sits before you. It is, by any reasonable standard, too loud. " +
            "Eleven colleagues have mentioned this. You remain unmoved." +
            (inv.length > 0
              ? ` Your ${inv.map((i) => ITEMS[i].name).join(" and ")} ${inv.length > 1 ? "are" : "is"} here.`
              : "")
          );
        },
        exits: () => ({ north: "corridor" }),
      },

      corridor: {
        name: "The Open Plan",
        desc: () => {
          let d =
            "The main office floor. It has the specific quality of light that exists only in open-plan offices and certain forms of government-administered purgatory. ";
          d +=
            "Slack notification sounds echo from all directions, like the calls of some digital wildlife that has long since stopped expecting a reply. ";
          if (!state.flags.meeting_escaped) {
            d +=
              'To the east, the meeting room door is ajar. You can already hear the word "alignment." ';
          } else {
            d += "The meeting room to the east is now ominously quiet. ";
          }
          d +=
            "The kitchen is to the west. The code review room is to the north.";
          return d;
        },
        exits: () => ({
          south: "desk",
          east: "meeting",
          west: "kitchen",
          north: "code_review",
        }),
      },

      meeting: {
        name: "The Eternal Stand-up",
        desc: () => {
          if (!state.flags.meeting_escaped) {
            return (
              "The stand-up. It was scheduled for fifteen minutes. That was some time ago — the exact duration is unclear, " +
              "as all available clocks appear to have entered a state of passive protest. " +
              'Someone is currently explaining something using the phrase "circle back" for the fourth time. ' +
              "The exit is to the west. You are having genuine difficulty walking toward it. " +
              (state.inventory.includes("headphones")
                ? "Your noise-canceling headphones are in your inventory. This seems relevant. Possibly urgent."
                : "If only you had something that could make this room disappear.")
            );
          }
          return (
            "The meeting room. Several people are still talking. They have not noticed you left. " +
            "You choose not to examine what this implies about the meeting, or about you, or about meetings in general. " +
            "The corridor is to the west."
          );
        },
        exits: () => ({
          west: state.flags.meeting_escaped ? "corridor" : null,
        }),
        onEnter: () => {
          if (!state.flags.meeting_entered) {
            state.flags.meeting_entered = true;
            br();
            say("You step inside.", T.warn);
            say(
              'Someone immediately says "oh good, you\'re here — we need your input on a few things."',
            );
            say(
              "You do not know what the things are. You are not certain they do either.",
            );
            br();
            say("You appear to be stuck.", T.hint);
            say(
              "(Use your headphones to escape, or try leaving enough times to remember you have free will.)",
              T.hint,
            );
          }
        },
      },

      kitchen: {
        name: "The Kitchen",
        desc: () => {
          const hasCoffee = roomItems.kitchen.includes("coffee");
          return (
            'The office kitchen. A motivational poster on the wall reads "Teamwork Makes the Dream Work." ' +
            'Someone has added a sticky note beneath it that says "citation needed." ' +
            "Nobody has removed the sticky note. This is, in its way, a form of institutional memory. " +
            (hasCoffee
              ? "A pot of coffee sits on the burner. A handwritten note says it was made at 9am. The note does not say what time it is now. The note is not helping."
              : "The coffee pot is empty. You stare at it for a moment. It does not refill itself.")
          );
        },
        exits: () => ({ east: "corridor" }),
      },

      code_review: {
        name: "The Code Review Room",
        desc: () => {
          if (!state.flags.review_done) {
            return (
              "Gerald, Senior Software Engineer (L6), is at his workstation. He has been reviewing your PR for three weeks. " +
              'He has left twenty-three comments. Twenty-two of them begin with "nit:". ' +
              'The twenty-third begins with "nit: also —" and trails off into an em dash that hangs in the air like a small, targeted threat. ' +
              (roomItems.code_review.includes("rubber_stamp")
                ? "There is something under a pile of Jira tickets. A rubber stamp, it looks like. "
                : "") +
              "A hatch in the floor leads down to the legacy codebase. You do not have to go down there. Nobody would think less of you. " +
              "The corridor is to the south."
            );
          }
          return (
            "Gerald's desk is empty. His monitor shows a single line: LGTM. He is gone. " +
            "You choose not to look into where. " +
            "The deploy chamber is to the north. The corridor is to the south. " +
            "The legacy hatch is still in the floor, if you want it."
          );
        },
        exits: () => ({
          south: "corridor",
          down: "legacy",
          north: state.flags.review_done ? "deploy" : null,
        }),
      },

      legacy: {
        name: "The Legacy Codebase",
        desc: () =>
          "It is darker here. The code was written between 2009 and 2013 by someone named Dave. " +
          "There are 47 TODO comments. Some of them are aspirational. Most of them are apologies to future engineers, " +
          "which is to say, to you, specifically, right now. " +
          "The variable names suggest Dave had opinions. Strong opinions. Poorly documented opinions. " +
          "Dave left in 2014 to 'pursue other opportunities.' You hope they were good ones. You genuinely do. " +
          (roomItems.legacy.includes("the_answer")
            ? "There is a printout in the corner. "
            : "") +
          "The hatch back up is above you.",
        exits: () => ({ up: "code_review" }),
        onEnter: () => {
          if (!state.flags.legacy_visited) {
            state.flags.legacy_visited = true;
            br();
            say(
              "Achievement unlocked: Into the Deep (Nobody Asked You to Come Down Here)",
              T.warn,
            );
          }
        },
      },

      deploy: {
        name: "The Deploy Chamber",
        desc: () => {
          if (!state.flags.deployed) {
            return (
              'A large screen displays the CI pipeline. It says "Running..." ' +
              "with an animated spinner that has been going long enough to develop what you can only describe as a personality. " +
              "The deploy button is here. It has the energy of something that's been waiting. " +
              "Type game.deploy() when you're ready. There is no correct time to feel ready. " +
              "The code review room is to the south."
            );
          }
          return (
            "The pipeline is green. All checks passed. Nothing is on fire. " +
            "You've been standing here for thirty seconds waiting for something to go wrong. " +
            "Nothing has gone wrong. You are more suspicious than relieved, but you will take it. " +
            "The parking lot is to the north. The code review room is to the south."
          );
        },
        exits: () => ({
          south: "code_review",
          north: state.flags.deployed ? "parking" : null,
        }),
      },

      parking: {
        name: "The Parking Lot",
        desc: () =>
          "The parking lot. Fresh air. Actual sunlight. The sky is doing that thing it does where it is blue. " +
          "You had, somehow, forgotten about the sky. " +
          "Your car is here. Home is to the east. " +
          "The building door behind you has clicked shut. You feel no desire to go back in.",
        exits: () => ({
          south: "deploy",
          east: "home",
        }),
      },
    };

    // ── Helpers ──────────────────────────────────────────────────────────
    function look() {
      const room = ROOMS[state.room];
      if (!room) return;
      br();
      say(`[ ${room.name} ]`, T.h);
      br();
      say(room.desc());
      const here = roomItems[state.room] ?? [];
      if (here.length > 0) {
        br();
        here.forEach((id) => say(`  • ${ITEMS[id].name}`, T.item));
      }
      const exits = Object.entries(room.exits())
        .filter(([, v]) => v !== null)
        .map(([k]) => k);
      if (exits.length > 0) {
        br();
        say(`Exits: ${exits.join(", ")}`, T.hint);
      }
      br();
    }

    function findItem(name: string, inList: string[]): string | undefined {
      const n = name.toLowerCase().replace(/_/g, " ").trim();
      return inList.find((id) => {
        const idClean = id.replace(/_/g, " ");
        const itemName = ITEMS[id]?.name.toLowerCase() ?? "";
        return (
          id === n ||
          idClean === n ||
          itemName === n ||
          itemName.includes(n) ||
          n.includes(idClean)
        );
      });
    }

    // ── Game object ──────────────────────────────────────────────────────
    const game = {
      start() {
        console.clear();
        br();
        say("▓▓▓  SPRINT TO FREEDOM  ▓▓▓", T.h);
        say("A Text Adventure for the Terminally Employed", T.h);
        br();
        say("It is 4:47pm on a Thursday.");
        say("You have been in this office since 8:30am.");
        say("You have attended four meetings. Three of them were unnecessary.");
        say(
          "The fourth was also unnecessary, but it had good snacks, so it is remembered fondly.",
        );
        br();
        say("Your goal: get home. Draw a bath. Get in it.");
        say("This is, as goals go, achievable. Probably.");
        br();
        say("Type game.look() to see where you are.", T.hint);
        say("Type game.help() for commands.", T.hint);
        br();

        state.room = "desk";
        state.moves = 0;
        state.inventory = [];
        state.flags = {
          meeting_entered: false,
          meeting_escape_attempts: 0,
          meeting_escaped: false,
          review_done: false,
          deployed: false,
          deploy_attempts: 0,
          legacy_visited: false,
          coffee_drunk: false,
          won: false,
        };
        Object.assign(roomItems, {
          desk: ["headphones", "badge"],
          corridor: [],
          meeting: [],
          kitchen: ["coffee"],
          code_review: ["rubber_stamp"],
          legacy: ["the_answer"],
          deploy: [],
          parking: [],
        });
      },

      look() {
        state.moves++;
        look();
      },

      go(dir: string) {
        if (state.flags.won) {
          say(
            "You're home. In the bath. There is nowhere to go and nothing to do. That is the point.",
            T.hint,
          );
          return;
        }
        const room = ROOMS[state.room];
        if (!room) return;
        const d = dir.toLowerCase().trim();
        const exits = room.exits();

        if (!(d in exits)) {
          say(
            `You consider going ${dir}. There is nothing there. This is not unusual.`,
            T.err,
          );
          return;
        }

        const dest = exits[d];

        if (dest === null) {
          if (state.room === "meeting" && !state.flags.meeting_escaped) {
            state.flags.meeting_escape_attempts++;
            if (state.flags.meeting_escape_attempts >= 3) {
              br();
              say(
                '"I have to—" you say, gesturing vaguely in the direction of somewhere else.',
                T.ok,
              );
              say(
                "You back toward the door. Someone starts a follow-up question. You are already gone.",
              );
              state.flags.meeting_escaped = true;
              state.room = "corridor";
              state.moves++;
              look();
              return;
            } else {
              const left = 3 - state.flags.meeting_escape_attempts;
              say(
                'You try to leave. Someone says "before you go—" and begins a new sentence.',
                T.err,
              );
              say(
                `The sentence is still going. (${left} more attempt${left === 1 ? "" : "s"} — or use your headphones.)`,
                T.hint,
              );
            }
          } else if (state.room === "code_review" && d === "north") {
            say(
              "Gerald clears his throat. The way north is sealed by the weight of unresolved nit comments.",
              T.err,
            );
            say(
              "(Finish the code review first. The rubber stamp is in here somewhere.)",
              T.hint,
            );
          } else if (state.room === "deploy" && d === "north") {
            say(
              "The pipeline is still running. The spinner rotates. You wait. The spinner rotates.",
              T.err,
            );
            say("(Type game.deploy())", T.hint);
          } else {
            say("You cannot go that way.", T.err);
          }
          return;
        }

        state.room = dest;
        state.moves++;

        if (dest === "home") {
          this._win();
          return;
        }

        const next = ROOMS[dest];
        if (next?.onEnter) next.onEnter();
        look();
      },

      n() {
        this.go("north");
      },
      s() {
        this.go("south");
      },
      e() {
        this.go("east");
      },
      w() {
        this.go("west");
      },
      u() {
        this.go("up");
      },
      d() {
        this.go("down");
      },

      take(itemName: string) {
        const here = roomItems[state.room] ?? [];
        const id = findItem(itemName, here);
        if (!id) {
          say(
            `You look for ${itemName}. It isn't here, or it doesn't want to be found. These are not always distinguishable.`,
            T.err,
          );
          return;
        }
        roomItems[state.room] = here.filter((i) => i !== id);
        state.inventory.push(id);
        say(`Taken: ${ITEMS[id].name}.`, T.ok);
        state.moves++;
      },

      drop(itemName: string) {
        const id = findItem(itemName, state.inventory);
        if (!id) {
          say(
            `You check your pockets for ${itemName}. You are correct that you don't have it.`,
            T.err,
          );
          return;
        }
        state.inventory = state.inventory.filter((i) => i !== id);
        if (!roomItems[state.room]) roomItems[state.room] = [];
        roomItems[state.room].push(id);
        say(`You set down the ${ITEMS[id].name}.`, T.ok);
        state.moves++;
      },

      examine(itemName: string) {
        const id =
          findItem(itemName, state.inventory) ??
          findItem(itemName, roomItems[state.room] ?? []) ??
          findItem(itemName, Object.keys(ITEMS));
        if (!id || !ITEMS[id]) {
          say(
            `You think carefully about ${itemName}. Nothing useful comes of it.`,
            T.err,
          );
          return;
        }
        say(ITEMS[id].desc);
        state.moves++;
      },

      use(itemName: string) {
        const id = findItem(itemName, state.inventory);
        if (!id) {
          say(`You don't have ${itemName}.`, T.err);
          return;
        }
        state.moves++;

        if (id === "headphones") {
          if (state.room === "meeting" && !state.flags.meeting_escaped) {
            br();
            say("You put on the headphones.", T.ok);
            say(
              "The meeting disappears. Not physically — everyone is still there, still talking.",
            );
            say(
              "But the sound is gone, replaced by a silence so clean it feels structural.",
            );
            say(
              "You back toward the door. A mouth opens in your direction. You cannot hear what it says.",
            );
            say(
              "You nod, meaningfully, at nothing in particular. You are in the corridor.",
            );
            state.flags.meeting_escaped = true;
            state.room = "corridor";
            look();
          } else {
            say(
              "You put on the headphones. The office recedes. You feel, briefly, like a complete person.",
              T.ok,
            );
          }
        } else if (id === "coffee") {
          state.inventory = state.inventory.filter((i) => i !== id);
          state.flags.coffee_drunk = true;
          if (state.room === "legacy") {
            br();
            say("You drink the coffee.", T.ok);
            say(
              "It is bad. Extremely bad. It tastes the way a TODO comment reads.",
            );
            say(
              "And yet: clarity. A horrible, specific, fully caffeinated architectural clarity.",
            );
            say(
              "You understand the codebase now. Every decision Dave made. Every shortcut. Every quiet surrender.",
            );
            say(
              "You wish you did not understand it. But understanding it, you realize, is also a form of respect.",
            );
            br();
            say(
              "Achievement unlocked: You Looked Into the Abyss (The Abyss Had No Unit Tests)",
              T.warn,
            );
          } else {
            say(
              "You drink the coffee. It is not good. It is functional. This is the highest compliment it is possible to pay it.",
              T.ok,
            );
          }
        } else if (id === "rubber_stamp") {
          if (state.room === "code_review" && !state.flags.review_done) {
            br();
            say("You find your PR open on a nearby monitor.", T.ok);
            say("You raise the stamp.");
            say("You bring it down.");
            say("");
            say("            L G T M", T.win);
            say("");
            say(
              "You merge before Gerald can object. He looks up. His mouth opens to form the beginning of a nit.",
            );
            say(
              "You are already walking away. The nit dies, unvoiced, in the air behind you.",
            );
            br();
            state.flags.review_done = true;
            say(
              "The code review is complete. The deploy chamber is now accessible to the north.",
              T.hint,
            );
          } else if (state.flags.review_done) {
            say(
              "The stamp has done its work. You regard it with something between gratitude and mild unease.",
              T.hint,
            );
          } else {
            say(
              "You stamp the air firmly. It makes a satisfying sound. Nothing else happens.",
              T.err,
            );
          }
        } else if (id === "badge") {
          say(
            "You hold up the badge. The photo version of you stares back: alert, optimistic, unaware of what Thursday at 4:47pm feels like.",
            T.p,
          );
        } else if (id === "the_answer") {
          say(
            "You read the printout again. const THE_ANSWER = 42. You turn it over. The back is blank.",
            T.p,
          );
          say("Some questions, it turns out, don't have backs.", T.hint);
        } else {
          say(
            `You use the ${ITEMS[id].name}. The results are, at best, ambiguous.`,
            T.err,
          );
        }
      },

      deploy() {
        if (state.room !== "deploy") {
          say(
            "You are not in the deploy chamber. You think about deploying from here. You remember the last time you deployed from somewhere you shouldn't have. You decide against it.",
            T.err,
          );
          return;
        }
        if (state.flags.deployed) {
          say(
            "It is already deployed. It is still green. Nothing has caught fire. Stop checking.",
            T.hint,
          );
          return;
        }

        state.flags.deploy_attempts++;

        if (state.flags.deploy_attempts === 1) {
          br();
          say("You press deploy.", T.ok);
          say("The pipeline begins.");
          say("Step 1 of 12: Install dependencies... ✓");
          say("Step 2 of 12: Lint... ✓");
          say("Step 3 of 12: Type check...");
          say("");
          say(
            "It is running. You wait. It is still running. You check Twitter. It is still running.",
            T.hint,
          );
          say("(Type game.deploy() again to check the status.)", T.hint);
        } else if (state.flags.deploy_attempts === 2) {
          say("Step 3 of 12: Type check... ✓", T.ok);
          say("Step 4 of 12: Tests...");
          say("");
          say(
            "Still going. You get a coffee. You come back. Still going.",
            T.hint,
          );
          say("(One more time.)", T.hint);
        } else {
          br();
          say("Steps 4–12: ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓", T.ok);
          say("");
          say("  ✅  Deployment successful.", T.win);
          say("  Production is live. All systems nominal.", T.win);
          say("  No alerts. No pages. No one is texting you.", T.win);
          say("");
          say(
            "You stand very still for a moment, not entirely trusting it.",
            T.p,
          );
          say("Then you trust it.", T.p);
          br();
          state.flags.deployed = true;
          say("The parking lot is now accessible to the north.", T.hint);
        }
      },

      inventory() {
        if (state.inventory.length === 0) {
          say(
            "You are carrying nothing. You feel, in an abstract sense, lighter for it.",
            T.p,
          );
          return;
        }
        br();
        say("You are carrying:", T.h);
        state.inventory.forEach((id) => say(`  • ${ITEMS[id].name}`, T.item));
        br();
      },

      i() {
        this.inventory();
      },

      help() {
        br();
        say("COMMANDS", T.h);
        br();
        say("  game.look()           — look around", T.hint);
        say(
          '  game.go("direction")  — move (north/south/east/west/up/down)',
          T.hint,
        );
        say("  game.n/s/e/w/u/d()    — shortcuts for directions", T.hint);
        say('  game.take("item")     — pick something up', T.hint);
        say('  game.drop("item")     — put something down', T.hint);
        say('  game.examine("item")  — inspect an item', T.hint);
        say(
          '  game.use("item")      — use something from your inventory',
          T.hint,
        );
        say("  game.inventory()      — see what you're carrying", T.hint);
        say("  game.i()              — shortcut for inventory", T.hint);
        say("  game.deploy()         — ship the thing", T.hint);
        say("  game.start()          — restart from the beginning", T.hint);
        br();
        say("Your goal: get home. Draw a bath. Get in it.", T.p);
        br();
      },

      _win() {
        state.flags.won = true;
        br();
        say("▓▓▓  YOU ARE HOME  ▓▓▓", T.win);
        br();
        say("You open the front door.");
        say("You close it behind you.");
        say(
          "You do not check Slack. This is a choice you are making deliberately, and you are proud of it.",
        );
        say("");
        say("You run the bath.");
        say(
          "You wait for it to fill. This is not a metaphor. You are simply waiting for the bath to fill.",
        );
        say("");
        say("You get in.");
        say("");
        say("The water is exactly the right temperature.");
        say("Not approximately. Not close enough. Exactly.");
        say(
          "This has never happened before. It will probably never happen again.",
        );
        say(
          "You choose not to analyze it. You simply float there, in the perfect water, being done for the day.",
        );
        br();
        say(`Completed in ${state.moves} moves.`, T.hint);
        if (state.flags.legacy_visited) {
          say(
            "You visited the legacy codebase. Nobody asked you to. This says something about you.",
            T.hint,
          );
        }
        if (state.flags.coffee_drunk && state.flags.coffee_drunk) {
          say(
            "You drank the coffee. It was bad and you drank it anyway. Respect.",
            T.hint,
          );
        }
        br();
        say("Thanks for playing. Type game.start() to go again.", T.hint);
        br();
      },
    };

    // ── Expose & boot message ────────────────────────────────────────────
    (window as typeof window & { game: typeof game }).game = game;

    br();
    say("Oh. You found this.", T.h);
    br();
    say("Most people don't look here.");
    say(
      "You're either a developer, deeply curious, or you've made a wrong turn somewhere.",
    );
    say("In any case: welcome.");
    br();
    say("Type game.start() to begin.", T.warn);
    br();
  }, []);

  return null;
}
