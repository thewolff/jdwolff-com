import type { GameContext, GameState } from "./types";
import { defaultFlags } from "./types";
import { createOutput } from "./styles";
import { ITEMS, createRoomItems } from "./items";
import { createRooms } from "./rooms";
import { createSecretCommands } from "./secrets";

// ── Text corruption for rm levels ─────────────────────────────────────

function corruptText(text: string, level: number): string {
  if (level <= 1) return text;
  if (level === 2) {
    return text
      .split(" ")
      .map((w) => (Math.random() > 0.12 ? w : ""))
      .filter(Boolean)
      .join(" ");
  }
  const glitch = "▓░▒█▌▐";
  return text
    .split("")
    .map((c) => {
      if (c === " ") return c;
      return Math.random() > 0.25
        ? c
        : glitch[Math.floor(Math.random() * glitch.length)];
    })
    .join("")
    .split(" ")
    .filter(() => Math.random() > 0.2)
    .join(" ");
}

function injectGlitch(text: string): string {
  const addrs = [
    "0x7F3A",
    "0xDEAD",
    "0xBEEF",
    "0xC0DE",
    "0xFACE",
    "0xBAD0",
    "0x1337",
    "0xCAFE",
  ];
  const streams = [
    "[TCP SYN]",
    "[RST]",
    "[200 OK]",
    "[404]",
    "[NaN]",
    "[SEGV]",
    "[GC pause 847ms]",
  ];
  let count = 0;
  return text.replace(/\. /g, (match) => {
    count++;
    if (count % 3 === 0) {
      const a = addrs[Math.floor(Math.random() * addrs.length)];
      const s = streams[Math.floor(Math.random() * streams.length)];
      return `. ${a} ${s} `;
    }
    return match;
  });
}

    // ── Log area handling ──────────────────────────────────────────────
  
  function updateLog(message: string) {
    const logEl = document.getElementById("game-log"); // Assuming we'll add this ID to a container
    if (logEl) {
      logEl.innerText = message;
    }
  }

  // ── Game factory ──────────────────────────────────────────────────────

export function createGame() {
  const { T, say: rawSay, br, setTheme } = createOutput();
  const roomItems = createRoomItems();

  const state: GameState = {
    room: "desk",
    inventory: [],
    flags: defaultFlags(),
    moves: 0,
  };

  const say = (msg: string, style = T.p) => {
    let text = msg;
    if (state.flags.rm_level >= 2 && state.flags.rm_level < 4) {
      text = corruptText(text, state.flags.rm_level);
    }
    rawSay(text, style);
  };

  const ctx: GameContext = {
    state,
    roomItems,
    ITEMS,
    ROOMS: {},
    say,
    br,
    T,
    setTheme,
    look: () => {},
    findItem: () => undefined,
  };

  ctx.ROOMS = createRooms(ctx);
  const secrets = createSecretCommands(ctx);

  // ── Helpers ────────────────────────────────────────────────────────

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
  ctx.findItem = findItem;

  function look() {
    if (state.flags.rm_level >= 4) {
      say("There is nothing to look at. You deleted it.", T.err);
      return;
    }

    const room = ctx.ROOMS[state.room];
    if (!room) {
      if (state.flags.rm_level >= 3) {
        say("This room has been deleted. It was here. It was here a moment ago.", T.err);
      }
      return;
    }
    br();
    const prefix = state.flags.sudo_mode ? "[root@office] " : "";
    const title = `${prefix}[ ${room.name} ]`;
    say(title, T.h);
    updateLog(title);
    br();

    if (state.flags.darkness && !isGrueExempt()) {
      if (state.flags.darkness_turns <= 2) {
        say(
          "It is pitch black. You can vaguely make out the shapes of the room around you. " +
          "Furniture. Walls. The suggestion of exits. Everything else is memory and hope.",
        );
      } else {
        say(
          "It is pitch black. Something is in here with you. You can hear it breathing — a wet, rattling sound " +
          "that suggests lungs designed by someone who did not have your best interests at heart.",
        );
      }
    } else {
      let desc = room.desc();
      if (state.flags.hack_mode) desc = injectGlitch(desc);
      say(desc);

      const here = roomItems[state.room] ?? [];
      if (here.length > 0) {
        br();
        here.forEach((id) => {
          if (ITEMS[id]) say(`  • ${ITEMS[id].name}`, T.item);
        });
      }
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
  ctx.look = look;

  // ── Blocked exit handling ──────────────────────────────────────────

  function handleBlockedExit(d: string) {
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
      }
      const left = 3 - state.flags.meeting_escape_attempts;
      say(
        'You try to leave. Someone says "before you go—" and begins a new sentence.',
        T.err,
      );
      say(
        `The sentence is still going. (${left} more attempt${left === 1 ? "" : "s"} — or use your headphones.)`,
        T.hint,
      );
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
    } else if (state.room === "desk" && d === "under" && state.moves < 20) {
      say(
        "You glance under your desk. There is nothing remarkable. Or so you think.",
        T.err,
      );
    } else if (state.room === "kitchen" && d === "behind") {
      say(
        "Behind what? Everything in this kitchen is exactly where it appears to be.",
        T.err,
      );
      if (!state.flags.hack_mode) {
        say("(...isn't it?)", T.hint);
      }
    } else if (state.room === "legacy" && d === "deeper") {
      say(
        "There is nothing deeper. The code ends here. At least, that's what the documentation says.",
        T.err,
      );
      say(
        "Dave might have disagreed. Dave disagreed with a lot of things.",
        T.hint,
      );
    } else if (state.room === "corridor" && d === "mousehole") {
      say(
        "You crouch down and peer into the mousehole. It is very small. You are very not small.",
        T.err,
      );
      say(
        "If only there were some way to reduce your overall footprint.",
        T.hint,
      );
    } else {
      say("You cannot go that way.", T.err);
    }
  }

  // ── Sudo bypass handling ───────────────────────────────────────────

  function handleSudoBypass(d: string) {
    if (state.room === "meeting" && !state.flags.meeting_escaped) {
      say(
        "[sudo] Permission granted. You walk through the meeting like it doesn't exist.",
        T.warn,
      );
      say("Because, with root access, it doesn't.", T.warn);
      state.flags.meeting_escaped = true;
      state.room = "corridor";
      state.moves++;
      look();
    } else if (state.room === "code_review" && d === "north") {
      say(
        "[sudo] You override Gerald's review. He opens his mouth. No sound comes out.",
        T.warn,
      );
      say("LGTM has been applied with administrative force.", T.warn);
      state.flags.review_done = true;
      state.room = "deploy";
      state.moves++;
      look();
    } else if (state.room === "deploy" && d === "north") {
      br();
      say("[sudo] You force-deploy. The pipeline doesn't run.", T.err);
      say(
        "The code goes directly to production. This is the software equivalent of jumping out of a plane and then checking for a parachute.",
        T.err,
      );
      br();
      say("Something breaks. Immediately.", T.err);
      say("A Slack notification arrives: 'PROD IS DOWN'", T.err);
      say(
        "You feel a pull. Toward the server. Through the server.",
        T.err,
      );
      br();
      state.flags.sudo_deployed = true;
      state.flags.prod_entered_via = "sudo_deploy";
      state.room = "prod_load_balancer";
      state.moves++;
      say("You are no longer in the office.", T.warn);
      const room = ctx.ROOMS[state.room];
      if (room?.onEnter) room.onEnter();
      look();
    } else {
      say(
        "[sudo] Access denied. Even root has limits here.",
        T.err,
      );
    }
  }

  // ── Grue mechanics ────────────────────────────────────────────────

  const GRUE_EXEMPT = ["parking", "home", "the_void", "vim_room", "mousehole"];

  function isGrueExempt() {
    return (
      state.flags.flashlight_on ||
      state.flags.won ||
      GRUE_EXEMPT.includes(state.room) ||
      state.room.startsWith("prod_")
    );
  }

  function checkGrue() {
    if (isGrueExempt()) return;

    if (state.room !== state.flags.last_tracked_room) {
      state.flags.last_tracked_room = state.room;
      state.flags.turns_in_room = 0;
    }

    state.flags.turns_in_room++;

    if (!state.flags.darkness && state.flags.turns_in_room >= 5) {
      state.flags.darkness = true;
      state.flags.darkness_turns = 0;
      br();
      say("The lights flicker. Then they go out.", T.err);
      say(
        "All of them. At once. The hum of fluorescent tubes — a sound you did not know you relied on — is gone.",
        T.err,
      );
      br();
      say("It is pitch black. You are likely to be eaten by a grue.", T.warn);
      return;
    }

    if (state.flags.darkness) {
      state.flags.darkness_turns++;
      if (state.flags.darkness_turns >= 5) {
        grueEnding();
        return;
      }
      br();
      if (state.flags.darkness_turns === 1) {
        say(
          "Your eyes are adapting to the inky darkness. You can vaguely make out the shapes of everything around you.",
          T.err,
        );
        say(
          "Something moves at the edge of your vision. It is large. It gurgles.",
          T.err,
        );
        if (state.inventory.includes("flashlight")) {
          say("You have a flashlight. Now would be the time.", T.hint);
        }
      } else if (state.flags.darkness_turns === 2) {
        say(
          "The gurgling is closer now. You can smell it — a wet, organic reek, like something that lives where light does not reach.",
          T.err,
        );
        say(
          "Something brushes against your leg. It is not furniture.",
          T.err,
        );
      } else if (state.flags.darkness_turns === 3) {
        say(
          "You catch a glimpse: sickly glowing fur. A fish-mouthed face. Fangs that do not belong in an office building.",
          T.err,
        );
        say("It slavers. It is very close.", T.err);
        if (state.inventory.includes("flashlight")) {
          say("You have a flashlight. USE IT.", T.warn);
        }
      } else if (state.flags.darkness_turns === 4) {
        say(
          "It is right behind you. You can feel its breath on the back of your neck.",
          T.err,
        );
        say(
          "It is warm and wet and smells like something that has eaten before and found the experience acceptable.",
          T.err,
        );
        say("This is your last chance.", T.warn);
      }
    }
  }

  function grueEnding() {
    state.flags.won = true;
    br();
    say("Oh. There it is.", T.err);
    say("");
    say(
      "It steps out of the darkness on claws that click against the floor like someone typing very fast on a very bad keyboard.",
      T.p,
    );
    say(
      "Sickly glowing fur. A fish-mouthed face split wide open. Fangs arranged in rows with the casual cruelty of a data structure optimized for pain.",
      T.p,
    );
    say(
      "It slavers. It gurgles. It looks at you with an expression that is not hunger, exactly, but adjacent to it.",
      T.p,
    );
    say("The kind of expression that suggests it has eaten before and found the experience acceptable.", T.p);
    say("");
    say("You have been eaten by a grue.", T.err);
    br();
    say("▓▓▓  THE GRUE ENDING  ▓▓▓", T.warn);
    br();
    say(`Devoured in ${state.moves} moves.`, T.hint);
    say(
      "The office will file your disappearance under 'attrition.' Your desk will be reassigned by Monday.",
      T.hint,
    );
    say(
      "There was a flashlight on your desk. There were batteries in the kitchen. But you are past tense now.",
      T.hint,
    );
    br();
    say("Type game.start() to try again. Bring a light this time.", T.hint);
    br();
  }

  // ── Win sequences ──────────────────────────────────────────────────

  function normalWin() {
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
    if (state.flags.coffee_drunk) {
      say(
        "You drank the coffee. It was bad and you drank it anyway. Respect.",
        T.hint,
      );
    }
    if (state.flags.ops_hero) {
      say(
        "You fixed a production bug. On a Thursday. Before going home. The ops team will never know.",
        T.hint,
      );
    }
    if (state.flags.dave_farewell) {
      say(
        "You found Dave's office. He knew you would.",
        T.hint,
      );
    }
    if (state.flags.sudo_mode) {
      say(
        "You had root access the whole time. You used it. Whether wisely is debatable.",
        T.hint,
      );
    }
    if (state.flags.hack_mode) {
      say(
        "You hacked the mainframe. It was the console, but still.",
        T.hint,
      );
    }
    if (state.flags.ssh_visited) {
      say(
        "You SSH'd into production. On a Thursday. HR has been notified.",
        T.hint,
      );
    }
    if (state.flags.flashlight_on) {
      say(
        "You brought a flashlight. The grue went hungry tonight. It will not forget this.",
        T.hint,
      );
    }
    br();
    say("Thanks for playing. Type game.start() to go again.", T.hint);
    br();
  }

  function speedrunnerWin() {
    state.flags.won = true;
    br();
    say("▓▓▓  Y█U A░E ▒O██  ▓▓▓", T.win);
    br();
    say("You clip through the front door. It does not open. You are simply on the other side of it.");
    say("The hallway flickers. The walls are not entirely solid.");
    say("");
    say("You run the bath. The water fills from the wrong direction.");
    say("You get in. The temperature is simultaneously perfect and impossible.");
    say("");
    say("You float in water that is rendering at 15fps.");
    say("The bathroom tiles repeat. You can see the seams.");
    say(
      "You are home, technically. The definition of 'home' has become negotiable.",
    );
    br();
    say("▓▓▓  THE SPEEDRUNNER ENDING  ▓▓▓", T.warn);
    br();
    say(`Completed in ${state.moves} moves. (But at what cost?)`, T.hint);
    say(
      "You reached home by walking through the spaces between spaces.",
      T.hint,
    );
    say(
      "The game was not designed for this. You were not designed for this. And yet.",
      T.hint,
    );
    br();
    say("Thanks for playing. Type game.start() to go again.", T.hint);
    br();
  }

  function minifiedEnding() {
    state.flags.won = true;
    br();
    say("You hold out the cheese.", T.ok);
    say("The mouse looks at it. He looks at you. His eyes are very round.");
    say('"For... for me?" he says.');
    say("");
    say("You nod.");
    say("");
    say("The mouse takes the cheese. He holds it like it is the most important thing he has ever been given.");
    say("Which, to be fair, it is. He lives in a wall.");
    say("");
    br();
    say("He sets the cheese down carefully. He removes his hat. He clears his throat.", T.p);
    say("And then, in a voice that is small but carries the weight of genuine feeling, he sings:", T.p);
    say("");
    say("  ♪  O traveler, who shrank yourself down,", T.item);
    say("  ♪  Who left behind keyboard and crown,", T.item);
    say("  ♪  Who crawled through the wall like a fool or a saint,", T.item);
    say("  ♪  Who brought me this cheese without anger or complaint —", T.item);
    say("  ♪  You are a hero. The biggest I've met.", T.item);
    say("  ♪  (Which is ironic, given your current height.)  ♪", T.item);
    say("");
    say("He puts his hat back on. He takes a bite of cheese.", T.p);
    say("It is, he confirms, very good cheese.", T.p);
    br();
    say("You stand there, two centimeters tall, in a mousehole, having been serenaded.", T.p);
    say("You feel, against all reason, heroic.", T.p);
    say("");
    say("And then it hits you.", T.p);
    say("");
    say("You are two centimeters tall.", T.err);
    say("The deploy button is four feet off the ground.", T.err);
    say("You cannot reach it. You cannot reach anything.", T.err);
    say("You are too small to deploy to production.", T.err);
    say("You are too small to go home.", T.err);
    say("You are too small to draw a bath. The bath would draw you.", T.err);
    say("");
    say("The mouse pats you on the shoulder.", T.p);
    say('"You can stay here if you want," he says. "I have a spare cotton ball."', T.p);
    br();
    say("▓▓▓  THE MINIFIED ENDING  ▓▓▓", T.warn);
    br();
    say(`Completed in ${state.moves} moves. (At approximately 1/87th scale.)`, T.hint);
    say("You saved a mouse. You lost a career. The cheese was worth it.", T.hint);
    br();
    say("Type game.start() to return to normal size and try again.", T.hint);
    br();
  }

  function recursiveDisasterEnding() {
    state.flags.won = true;
    br();
    say("▓▓▓  THE RECURSIVE DISASTER  ▓▓▓", T.err);
    br();
    say("You have deployed a fix to the fix.", T.p);
    say("The fix is now broken.", T.p);
    say("The original bug is back. A new bug has appeared. It is worse.", T.p);
    say("");
    say("The production server begins to cascade-fail.", T.err);
    say("Services go down like dominoes, each one taking two more with it.", T.err);
    say("Somewhere, a pager goes off. Then another. Then all of them.", T.err);
    say("");
    say("Your phone buzzes. It is a Slack message from your CTO.", T.p);
    say('It says: "My office. Monday."', T.p);
    say("");
    say("You do not go home. You do not draw a bath.", T.p);
    say("You sit in the parking lot for forty minutes, staring at the dashboard.", T.p);
    say("The dashboard stares back.", T.p);
    br();
    say(`Failed in ${state.moves} moves.`, T.hint);
    say(
      "You deployed with sudo. Twice. In production. On a Thursday.",
      T.hint,
    );
    say(
      "This is a story you will tell at conferences, but not yet.",
      T.hint,
    );
    br();
    say("Type game.start() to try again with less hubris.", T.hint);
    br();
  }

  // ── Game object ────────────────────────────────────────────────────

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
      state.flags = defaultFlags();
      setTheme("default");
      Object.assign(roomItems, createRoomItems());
    },

    look() {
      state.moves++;
      look();
      checkGrue();
    },

    go(dir: string) {
      if (state.flags.in_vim) {
        say(
          `:${dir} is not a valid vim command. You are still in vim. You will always be in vim.`,
          T.err,
        );
        say("(Try game.quit() or game.escape())", T.hint);
        return;
      }

      if (state.flags.rm_level >= 4) {
        say("There is nowhere to go. You deleted everywhere.", T.err);
        return;
      }

      if (state.flags.won) {
        say(
          "You're home. In the bath. There is nowhere to go and nothing to do. That is the point.",
          T.hint,
        );
        return;
      }

      // In the void with noclip — any room name is a direction
      if (state.room === "the_void" && state.flags.noclip_mode) {
        const target = dir.toLowerCase().replace(/\s+/g, "_");
        if (target === "home") {
          state.moves++;
          speedrunnerWin();
          return;
        }
        if (ctx.ROOMS[target]) {
          state.room = target;
          state.moves++;
          const next = ctx.ROOMS[target];
          if (next?.onEnter) next.onEnter();
          look();
          checkGrue();
          return;
        }
        say(
          `The void does not contain "${dir}". The void does not contain much of anything.`,
          T.err,
        );
        return;
      }

      const room = ctx.ROOMS[state.room];
      if (!room) return;
      const d = dir.toLowerCase().trim();
      const exits = room.exits();

      if (!(d in exits)) {
        say(
          `You consider going ${dir}. There is nothing there. This is not unusual.`,
          T.err,
        );
        checkGrue();
        return;
      }

      const dest = exits[d];

      if (dest === null) {
        if (state.flags.sudo_mode) {
          handleSudoBypass(d);
          checkGrue();
          return;
        }
        if (state.flags.noclip_mode) {
          say(
            "You phase through the wall. Reality becomes optional.",
            T.warn,
          );
          state.room = "the_void";
          state.moves++;
          const voidRoom = ctx.ROOMS.the_void;
          if (voidRoom?.onEnter) voidRoom.onEnter();
          look();
          return;
        }
        handleBlockedExit(d);
        checkGrue();
        return;
      }

      state.room = dest;
      state.moves++;

      if (dest === "home") {
        if (state.flags.noclip_mode) {
          speedrunnerWin();
        } else {
          normalWin();
        }
        return;
      }

      const next = ctx.ROOMS[dest];
      if (next?.onEnter) next.onEnter();
      look();
      checkGrue();
    },

    n() { this.go("north"); },
    s() { this.go("south"); },
    e() { this.go("east"); },
    w() { this.go("west"); },
    u() { this.go("up"); },
    d() { this.go("down"); },

    take(itemName: string) {
      if (state.flags.in_vim) {
        say("You cannot take anything in vim. You can only take the pain.", T.err);
        return;
      }
      const here = roomItems[state.room] ?? [];
      const id = findItem(itemName, here);
      if (!id) {
        if (state.room === "prod_cache" && !roomItems.prod_cache?.includes(findItem(itemName, Object.keys(ITEMS)) ?? "")) {
          say(
            `You reach for ${itemName}. Your hand passes through it. It was cached 37 minutes ago. It is no longer here.`,
            T.err,
          );
          return;
        }
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
      checkGrue();
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
      checkGrue();
    },

    examine(itemName: string) {
      const n = itemName.toLowerCase().trim();
      const drawerNames = ["drawer", "junk drawer", "junk_drawer", "tape", "packing tape", "junk"];
      if (drawerNames.includes(n) && state.room === "kitchen") {
        state.moves++;
        if (state.flags.drawer_opened) {
          say(
            "The drawer is open. Its contents — a decade of adapters, cables, and corporate regret — are already on the floor.",
          );
        } else {
          state.flags.drawer_examined = true;
          say(
            "You peer through the gap between the drawer and the frame. Inside: a tangle of FireWire cables, " +
            "three Mini-DIN adapters, a SCART connector that has no business being here, and — beneath it all — " +
            "a pair of AA batteries.",
          );
          say(
            "The drawer is sealed with packing tape. Industrial strength. It will not yield to pulling.",
            T.hint,
          );
          say(
            "You would need something with a sharp, flat edge. Like, hypothetically, a laminated ID card.",
            T.hint,
          );
        }
        checkGrue();
        return;
      }

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

      let desc = ITEMS[id].desc;

      if (
        id === "the_answer" &&
        state.flags.coffee_drunk &&
        state.room === "legacy"
      ) {
        desc +=
          "\n\nWith the caffeine clarity, you notice faint pencil marks in the margin:\n" +
          "  // xyzzy <- Dave's favorite. He said it was 'an old magic word.'";
      }

      if (id === "flashlight" && state.flags.flashlight_loaded) {
        desc =
          "A flashlight. It now contains batteries. The weight feels correct — purposeful, even. " +
          "A small toggle switch on the side reads OFF. It is ready.";
      }

      say(desc);
      state.moves++;
      checkGrue();
    },

    use(itemName: string) {
      const id = findItem(itemName, state.inventory);
      if (!id) {
        say(`You don't have ${itemName}.`, T.err);
        return;
      }
      state.moves++;

      if (id === "headphones") {
        state.flags.headphones_on = true;
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
      } else if (id === "flashlight") {
        if (!state.flags.flashlight_loaded) {
          say(
            "You flick the switch. Nothing happens. You flick it again. Nothing continues to happen.",
            T.err,
          );
          say(
            "The flashlight is empty. It needs batteries. This is, in retrospect, predictable.",
            T.hint,
          );
        } else if (state.flags.flashlight_on) {
          say(
            "The flashlight is already on. The beam is steady. You are safe. Safer, at least.",
            T.ok,
          );
        } else {
          state.flags.flashlight_on = true;
          br();
          say("You flick the switch.", T.ok);
          say("Light. Actual, honest, battery-powered light.");
          if (state.flags.darkness) {
            say("");
            say(
              "The beam cuts through the darkness like a clean line of code through a legacy codebase.",
              T.ok,
            );
            say(
              "Something recoils. You catch a glimpse — sickly glowing fur, a fish-mouthed face twisting away, " +
              "claws scrabbling against the floor as it retreats into the space between walls.",
            );
            say(
              "It gurgles once, indignant, and is gone.",
            );
            br();
            say("The lights do not come back on. But the flashlight is enough.", T.ok);
            say("The grue will not return while you carry this light.", T.hint);
            state.flags.darkness = false;
            state.flags.darkness_turns = 0;
          } else {
            say(
              "The beam illuminates the room in a cone of competence. Nothing lurks. For now.",
              T.ok,
            );
            say("The grue will think twice.", T.hint);
          }
        }
      } else if (id === "batteries") {
        if (state.inventory.includes("flashlight")) {
          br();
          say("You open the flashlight's battery compartment.", T.ok);
          say(
            "You insert the batteries. They fit. The flashlight gains weight — a small, purposeful weight, " +
            "like a tool that has remembered what it is for.",
          );
          say("The flashlight is loaded. Type game.use(\"flashlight\") to turn it on.", T.hint);
          state.flags.flashlight_loaded = true;
          state.inventory = state.inventory.filter((i) => i !== "batteries");
        } else {
          say(
            "You hold the batteries. They are batteries. Without something to put them in, they are just small cylinders of stored potential.",
            T.err,
          );
          say("You need a flashlight.", T.hint);
        }
      } else if (id === "badge") {
        if (
          state.room === "kitchen" &&
          state.flags.drawer_examined &&
          !state.flags.drawer_opened
        ) {
          br();
          say(
            "You slide the edge of your employee badge along the packing tape. It parts cleanly.",
            T.ok,
          );
          say(
            "The drawer explodes open, releasing a cascade of adapter cables, three phone chargers for phones " +
            "that no longer exist, and exactly one pair of AA batteries.",
          );
          say(
            "The batteries roll to a stop on the counter. They are yours if you want them.",
          );
          state.flags.drawer_opened = true;
          if (!roomItems.kitchen) roomItems.kitchen = [];
          roomItems.kitchen.push("batteries");
        } else {
          say(
            "You hold up the badge. The photo version of you stares back: alert, optimistic, unaware of what Thursday at 4:47pm feels like.",
            T.p,
          );
        }
      } else if (id === "the_answer") {
        say(
          "You read the printout again. const THE_ANSWER = 42. You turn it over. The back is blank.",
          T.p,
        );
        say("Some questions, it turns out, don't have backs.", T.hint);
      } else if (id === "stale_token") {
        if (state.room === "prod_database") {
          state.flags.query_run = true;
          br();
          say("You present the expired token to the database.", T.ok);
          say(
            "It accepts it. Expired credentials still work here. This explains several things about the organization.",
          );
          say("");
          say(
            "  id  |  status   |  component  |  description",
            T.item,
          );
          say(
            "  --- |  -------  |  ---------  |  -----------",
            T.div,
          );
          say(
            "  848 |  ██████   |  ████       |  ██ NULL ██ undefined is not a ██████",
            T.err,
          );
          say("");
          say(
            "Row 848 is corrupted. The hotfix in the log file might restore it.",
            T.hint,
          );
        } else {
          say(
            "You wave the expired token at nothing in particular. It remains expired. It remains a token.",
            T.err,
          );
        }
      } else if (id === "hotfix") {
        if (state.room === "prod_pipeline") {
          br();
          say("You apply the hotfix to the pipeline.", T.ok);
          say("Deploying fix...", T.warn);
          say("");
          say("  Step 1: Validate... ✓", T.ok);
          say("  Step 2: Apply patch... ✓", T.ok);
          say("  Step 3: Restart services... ✓", T.ok);
          say("");
          say("  ✅  Hotfix deployed. Row 848 restored.", T.win);
          say("  Production is stable. For now.", T.win);
          br();
          state.flags.hotfix_applied = true;
          state.flags.prod_bug_fixed = true;
          state.flags.ops_hero = true;
          state.inventory = state.inventory.filter((i) => i !== id);
          say(
            "Achievement unlocked: The Ops Hero (You Fixed Production on a Thursday)",
            T.warn,
          );
          say(
            "A portal back to the office has opened. Type game.go(\"out\") to return.",
            T.hint,
          );
        } else if (state.room === "prod_database") {
          say(
            "You try to apply the hotfix directly to the database. This is not how databases work.",
            T.err,
          );
          say("(Use it in the pipeline.)", T.hint);
        } else {
          say(
            "You read the hotfix. It is a stack trace with a fix circled in red. Without a pipeline, it is just paper.",
            T.p,
          );
        }
      } else if (id === "dave_mug") {
        say(
          "You drink from the mug. It has been empty since 2014.",
          T.p,
        );
        say(
          "You feel nothing and everything.",
          T.hint,
        );
      } else if (id === "sticky_note") {
        say(ITEMS[id].desc);
      } else if (id === "usb_drive") {
        say(
          "You plug the USB drive into your monitor's USB port. A file explorer opens.",
          T.ok,
        );
        say(
          "Contents: doom.exe, tetris.rom, README_SUDO.txt",
          T.item,
        );
        say(
          "README_SUDO.txt reads: 'For when Gerald won't merge your PR. Type game.sudo().'",
          T.hint,
        );
      } else if (id === "cheese") {
        if (state.room === "mousehole") {
          minifiedEnding();
          return;
        }
        say(
          "You take a bite of cheese. It is very good. Unreasonably good for something you found in a wall.",
          T.ok,
        );
        say("The mouse would probably like this back.", T.hint);
      } else {
        say(
          `You use the ${ITEMS[id].name}. The results are, at best, ambiguous.`,
          T.err,
        );
      }
      checkGrue();
    },

    deploy() {
      if (state.flags.in_vim) {
        say(":deploy is not a vim command, but honestly it should be.", T.err);
        return;
      }

      if (state.room === "prod_pipeline") {
        if (state.flags.hotfix_applied) {
          say(
            "It is already deployed. The fix is in. Go home.",
            T.hint,
          );
          return;
        }
        if (state.flags.sudo_mode) {
          recursiveDisasterEnding();
          return;
        }
        say(
          "The pipeline needs a hotfix to deploy. Check the log file.",
          T.err,
        );
        return;
      }

      if (state.flags.minified && state.room === "deploy") {
        say(
          "You stand before the deploy button. It is four feet above you. You jump. You do not reach it.",
          T.err,
        );
        say(
          "You jump again. The button does not get closer. You are two centimeters tall. The button was not designed for this.",
          T.err,
        );
        say("(You may need to game.minify() again to restore your original dimensions.)", T.hint);
        return;
      }
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
      state.moves++;

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
        say("Step 4 of 12: Minify... ✓", T.ok);
        say("Step 5 of 12: Tests...");
        say("");
        say(
          "Still going. You get a coffee. You come back. Still going.",
          T.hint,
        );
        say("(One more time.)", T.hint);
      } else {
        br();
        say("Steps 5–12: ✓ ✓ ✓ ✓ ✓ ✓ ✓ ✓", T.ok);
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
      checkGrue();
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
      state.inventory.forEach((id) => {
        if (ITEMS[id]) say(`  • ${ITEMS[id].name}`, T.item);
      });
      br();
    },

    i() { this.inventory(); },

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

    // Secret commands wired in
    ...secrets,
  };

  return { game, say, br, T };
}
