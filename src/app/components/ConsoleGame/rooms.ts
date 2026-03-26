import type { Room, GameContext } from "./types";

export function createRooms(ctx: GameContext): Record<string, Room> {
  const { state, roomItems, ITEMS, say, br, T } = ctx;

  return {
    // ── Main World ──────────────────────────────────────────────────────

    desk: {
      name: "Your Desk",
      desc: () => {
        const inv = roomItems.desk;
        let d =
          "Your desk. Three monitors glow with the quiet insistence of things that consider themselves important. " +
          "A mechanical keyboard sits before you. It is, by any reasonable standard, too loud. " +
          "Eleven colleagues have mentioned this. You remain unmoved.";
        if (inv.length > 0) {
          d += ` Your ${inv.map((i) => ITEMS[i].name).join(" and ")} ${inv.length > 1 ? "are" : "is"} here.`;
        }
        if (state.moves >= 20) {
          d +=
            " There is something taped to the underside of your desk. You have never looked.";
        }
        return d;
      },
      exits: () => ({
        north: "corridor",
        under: state.moves >= 20 ? "under_desk" : null,
      }),
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
        d +=
          " There is a small hole in the baseboard near the kitchen. It is, by any reasonable estimate, mouse-sized. You are not mouse-sized.";
        if (state.flags.minified) {
          d =
            d.replace("You are not mouse-sized.", "You, however, are now mouse-sized. The hole looks like a doorway.");
        }
        return d;
      },
      exits: () => ({
        south: "desk",
        east: "meeting",
        west: "kitchen",
        north: "code_review",
        mousehole: state.flags.minified ? "mousehole" : null,
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
            (state.flags.headphones_on
              ? "Your noise-canceling headphones are on. The meeting is a silent film. You could leave at any time."
              : state.inventory.includes("headphones")
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
        if (state.flags.headphones_on && !state.flags.meeting_escaped) {
          state.flags.meeting_escaped = true;
          br();
          say("You step inside.", T.warn);
          say(
            'Someone immediately says "oh good, you\'re here — we need your input on a few things."',
          );
          say(
            "The headphones are already on. You hear nothing. You see mouths moving with the urgency of people who believe they are being heard.",
          );
          say(
            "You nod once, turn around, and walk out. Nobody stops you. Nobody can.",
          );
          state.room = "corridor";
          return;
        }
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
        let d =
          'The office kitchen. A motivational poster on the wall reads "Teamwork Makes the Dream Work." ' +
          'Someone has added a sticky note beneath it that says "citation needed." ' +
          "Nobody has removed the sticky note. This is, in its way, a form of institutional memory. ";
        if (hasCoffee) {
          d +=
            "A pot of coffee sits on the burner. A handwritten note says it was made at 9am. The note does not say what time it is now. The note is not helping.";
        } else {
          d +=
            "The coffee pot is empty. You stare at it for a moment. It does not refill itself.";
        }
        if (!state.flags.drawer_opened) {
          d +=
            " A junk drawer beside the fridge is sealed shut with packing tape and a sticky note that reads 'DO NOT OPEN — IT TOOK 3 PEOPLE TO CLOSE THIS.'";
        } else {
          d +=
            " The junk drawer hangs open. Adapter cables spill onto the floor like the entrails of a decade of consumer electronics.";
        }
        if (state.flags.hack_mode) {
          d +=
            " The poster is not flush with the wall. There is a gap behind it. There has always been a gap.";
        }
        return d;
      },
      exits: () => ({
        east: "corridor",
        behind: state.flags.hack_mode ? "server_closet" : null,
      }),
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
      desc: () => {
        let d =
          "It is darker here. The code was written between 2009 and 2013 by someone named Dave. " +
          "There are 47 TODO comments. Some of them are aspirational. Most of them are apologies to future engineers, " +
          "which is to say, to you, specifically, right now. " +
          "The variable names suggest Dave had opinions. Strong opinions. Poorly documented opinions. " +
          "Dave left in 2014 to 'pursue other opportunities.' You hope they were good ones. You genuinely do. ";
        if (roomItems.legacy.includes("the_answer")) {
          d += "There is a printout in the corner. ";
        }
        if (state.flags.coffee_drunk && !state.flags.xyzzy_activated) {
          d +=
            "Now that you've had the coffee, the code almost makes sense. Almost. You notice a comment in the margin: " +
            "// ssh prod-east-1 <- Dave's backdoor. DO NOT USE. ";
        }
        if (state.flags.dave_terminal_on) {
          d +=
            "Dave's terminal hums in the corner, its screen casting a pale green glow. A path leads deeper. ";
        }
        d += "The hatch back up is above you.";
        return d;
      },
      exits: () => ({
        up: "code_review",
        deeper: state.flags.dave_terminal_on ? "dave_office" : null,
      }),
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
          let d =
            'A large screen displays the CI pipeline. It says "Running..." ' +
            "with an animated spinner that has been going long enough to develop what you can only describe as a personality. " +
            "The deploy button is here. It has the energy of something that's been waiting. " +
            "Type game.deploy() when you're ready. There is no correct time to feel ready. " +
            "The code review room is to the south.";
          if (state.flags.deploy_attempts >= 1) {
            d +=
              " (You briefly wonder if sudo would work here. You push the thought away. It comes back.)";
          }
          return d;
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

    // ── Hidden Rooms ────────────────────────────────────────────────────

    under_desk: {
      name: "Under Your Desk",
      desc: () =>
        "You are crouching under your desk. There is a power strip, three cables that connect to nothing, " +
        "and the faint smell of a sandwich that was eaten here during a deadline sometime in Q3. " +
        "A sticky note is taped to the underside of the desk. It reads, in handwriting you don't recognize: 'sudo su'. " +
        "Someone before you knew things." +
        (roomItems.under_desk.includes("usb_drive")
          ? " A USB drive is wedged between the desk leg and the wall."
          : ""),
      exits: () => ({ up: "desk" }),
      onEnter: () => {
        br();
        say(
          "Achievement unlocked: Under the Surface (You Looked Where Nobody Looks)",
          T.warn,
        );
      },
    },

    server_closet: {
      name: "The Server Closet",
      desc: () =>
        "A closet. It is warm in the way that a room full of machines that are slowly converting electricity into heat is warm. " +
        "A single rack server blinks steadily. It has been here longer than anyone currently employed. " +
        "A dusty terminal sits on a shelf. The screen shows a login prompt. The cursor blinks with the patience of something that has been waiting since 2014." +
        (roomItems.server_closet.includes("sticky_note")
          ? " A yellowed sticky note is stuck to the monitor."
          : ""),
      exits: () => ({ out: "kitchen" }),
      onEnter: () => {
        br();
        say(
          "Achievement unlocked: Behind the Curtain (You Found the Infrastructure)",
          T.warn,
        );
      },
    },

    dave_office: {
      name: "Dave's Office",
      desc: () =>
        "A small office, preserved like a museum exhibit from 2013. The desk has a 'World's Okayest Programmer' mug. " +
        "The whiteboard still has Dave's architecture diagram. It is, against all probability, correct. " +
        "His terminal is on. The screen reads:\n\n" +
        "  > If you're reading this, the TODO is still open.\n" +
        "  > It always will be.\n" +
        "  > Go home.\n" +
        "  > — Dave\n\n" +
        "You stand here for a moment. Dave knew someone would come." +
        (roomItems.dave_office.includes("dave_mug")
          ? " His mug is on the desk."
          : ""),
      exits: () => ({ back: "legacy" }),
      onEnter: () => {
        state.flags.dave_farewell = true;
        br();
        say(
          "Achievement unlocked: Dave's Farewell (He Knew You'd Come)",
          T.warn,
        );
        br();
        say("You read Dave's message. It is addressed to no one and everyone.", T.p);
        say(
          "You feel, briefly, a connection to someone you have never met, across a decade of accumulated technical debt.",
          T.p,
        );
      },
    },

    the_void: {
      name: "The Void",
      desc: () =>
        "You are between rooms. This is not a place. It is the absence of a place. " +
        "There are no walls, no floor, no ceiling — only the vague impression that something should be here and isn't. " +
        "The space hums with the frequency of unrendered geometry. " +
        "You can see the outlines of rooms in every direction, like windows into places that exist only when observed. " +
        "You can go to any room by name: game.go(\"desk\"), game.go(\"legacy\"), game.go(\"parking\")...",
      exits: () => ({}),
      onEnter: () => {
        br();
        say("You have left the bounds of the map.", T.warn);
        say(
          "This is the space between defined spaces. It was not meant to be visited.",
          T.warn,
        );
        say("And yet: here you are.", T.hint);
      },
    },

    vim_room: {
      name: "vim",
      desc: () =>
        "~\n~\n~\n~\n" +
        '~                    VIM - Vi IMproved\n' +
        "~\n" +
        "~                     version 9.0.1\n" +
        "~\n" +
        "~              type :q<Enter> to exit\n" +
        "~       type game.quit() if you're being honest\n" +
        "~\n~\n~",
      exits: () => ({}),
    },

    mousehole: {
      name: "The Mousehole",
      desc: () => {
        let d =
          "You are inside the wall. The ceiling is a floor joist. The floor is insulation foam. " +
          "Everything is enormous — a paperclip on the ground looks like a piece of modern sculpture. " +
          "There is a small living space here, assembled with the careful attention to detail of someone who " +
          "has strong opinions about interior design but limited access to building materials. " +
          "A bottle cap serves as a table. A cotton ball is a chair. It is, against all odds, cozy.\n\n";
        d +=
          "A mouse stands before you. He is wearing a small red hat and an expression of profound surprise. " +
          "He is approximately your height, which is new for both of you. " +
          "He has round ears — not unusually round, not legally distinctively round, just... round. " +
          "He looks like no specific copyrighted mouse. His lawyers have confirmed this.";
        if (roomItems.mousehole.includes("cheese")) {
          d +=
            "\n\nA wedge of artisanal cheese sits on the bottle-cap table. " +
            "It is the centerpiece of the room. The mouse glances at it, then at you, with an expression that is " +
            "difficult to read but easy to feel.";
        }
        return d;
      },
      exits: () => ({ out: "corridor" }),
      onEnter: () => {
        br();
        say(
          "Achievement unlocked: Minified (You Made Yourself Small Enough to Fit Inside a Wall)",
          T.warn,
        );
        br();
        say("The mouse looks up at you. He adjusts his hat.", T.p);
        say('"You\'re... new," he says. His voice is high but dignified.', T.p);
        say('"Most people are too big to visit. I respect the commitment."', T.p);
      },
    },

    // ── Production Server Dimension ─────────────────────────────────────

    prod_load_balancer: {
      name: "The Load Balancer",
      desc: () =>
        "Traffic rushes past you in both directions. Requests arrive, are briefly examined, " +
        "and are flung toward destinations they did not choose. " +
        "It is a metaphor for something, but you are too busy not getting hit to think about what. " +
        "Status lights blink in patterns that might be morse code but are probably just status lights. " +
        "The cache is to the east. The database is to the west. The log file is to the north." +
        (state.flags.sudo_deployed
          ? " Everything is tinged red. Alarms you cannot see are clearly sounding somewhere."
          : ""),
      exits: () => ({
        east: "prod_cache",
        west: "prod_database",
        north: "prod_log_file",
      }),
      onEnter: () => {
        if (!state.flags.ssh_visited) state.flags.ssh_visited = true;
        br();
        say("You are inside the production server.", T.warn);
        say(
          "This is where the code lives when it is no longer theoretical.",
          T.warn,
        );
        if (state.flags.sudo_deployed) {
          say(
            "Something is very wrong. You can feel it in the packet loss.",
            T.err,
          );
        }
      },
    },

    prod_cache: {
      name: "The Cache",
      desc: () => {
        let d =
          "Everything here is a copy. A slightly outdated, faintly translucent copy. " +
          "Objects shimmer with the quality of things that were true 37 minutes ago and may or may not be true now. " +
          "You see ghostly outlines of items you remember having — or will have — the timeline is unclear here.";
        if (roomItems.prod_cache.includes("stale_token")) {
          d +=
            " A session token floats in the air, its expiration timestamp ticking down in a color that suggests urgency.";
        }
        d += " The load balancer is to the west.";
        return d;
      },
      exits: () => ({ west: "prod_load_balancer" }),
    },

    prod_database: {
      name: "The Database",
      desc: () => {
        let d =
          "Rows of data stretch in every direction like library shelves built by someone who understood indexing but not interior design. " +
          "Each row is a piece of furniture: chairs made of user records, tables made of tables. ";
        if (!state.flags.query_run) {
          d +=
            "Something is wrong with one of the rows. You can see it from here — a flicker, a gap, a NULL where a value should be. " +
            'Try game.query("SELECT * FROM bugs") or use a token to authenticate.';
        } else {
          d +=
            "Row 848 pulses with corrupted data. The bug is here, visible and angry. " +
            "You need a hotfix to repair it — check the log file to the north.";
        }
        d += " The load balancer is to the east.";
        return d;
      },
      exits: () => ({ east: "prod_load_balancer" }),
    },

    prod_log_file: {
      name: "The Log File",
      desc: () => {
        state.flags.log_visits++;
        const padding = Array(Math.min(state.flags.log_visits, 8))
          .fill(null)
          .map(
            () =>
              [
                "[INFO] Request processed in 247ms",
                "[WARN] Memory usage at 78%",
                "[INFO] Health check: OK",
                "[DEBUG] GC pause: 12ms",
                "[INFO] Connection pool: 47/50 active",
                "[WARN] Retry attempt 3/5 for upstream",
                "[ERROR] Timeout waiting for response from auth-service",
                "[INFO] Cache miss for key: usr_session_8847",
              ][Math.floor(Math.random() * 8)],
          )
          .join("\n  ");

        let d =
          "Text scrolls endlessly across every surface. Log lines cascade like rain, each one a tiny autobiography of a request " +
          "that lived and died in milliseconds.\n\n  " +
          padding +
          "\n\n";
        if (roomItems.prod_log_file.includes("hotfix")) {
          d +=
            "Buried in the noise, you spot something different: a printed stack trace with a line circled in red. " +
            "It looks important. It looks like a hotfix.";
        } else {
          d += "The logs continue. They will always continue.";
        }
        d += " The load balancer is to the south.";
        if (
          !roomItems.prod_log_file.includes("hotfix") ||
          state.inventory.includes("hotfix")
        ) {
          d += " A dark corridor leads north toward the pipeline.";
        }
        return d;
      },
      exits: () => ({
        south: "prod_load_balancer",
        north:
          !roomItems.prod_log_file.includes("hotfix") ||
          state.inventory.includes("hotfix")
            ? "prod_pipeline"
            : null,
      }),
    },

    prod_pipeline: {
      name: "The Dark Pipeline",
      desc: () => {
        if (state.flags.hotfix_applied) {
          return (
            "The pipeline glows green. The fix is in. The world outside this server continues to exist, " +
            "mostly unaware of how close it came to not having functional authentication. " +
            "A portal back to the office shimmers to the south. The log file is behind you."
          );
        }
        return (
          "A darker place. The CI/CD pipeline stretches before you like a gauntlet — each stage a gate, " +
          "each gate a question about whether your code deserves to exist in production. " +
          "The deploy mechanism is here. It needs a hotfix to proceed. " +
          "Type game.use(\"hotfix\") when you're ready. Or game.deploy() if you're feeling brave. " +
          "The log file is to the south."
        );
      },
      exits: () => ({
        south: "prod_log_file",
        out: state.flags.hotfix_applied ? "deploy" : null,
      }),
    },
  };
}
