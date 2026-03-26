import type { GameContext } from "./types";
import { THEMES } from "./styles";

export function createSecretCommands(ctx: GameContext) {
  const { state, say, br, T, setTheme } = ctx;

  return {
    sudo() {
      if (state.flags.rm_level >= 4) {
        say("sudo: command not found. Nothing is found. Nothing remains.", T.err);
        return;
      }
      state.flags.sudo_mode = !state.flags.sudo_mode;
      if (state.flags.sudo_mode) {
        br();
        say("[sudo] Password: ••••••••", T.warn);
        say("[sudo] Root access granted.", T.warn);
        say(
          "The console prompt shifts. You feel the weight of permissions you were not meant to have.",
        );
        say(
          "Locked doors are now suggestions. This is either power or a very specific kind of mistake.",
        );
        br();
        say(
          "You can now walk through blocked exits. But actions have consequences at this privilege level.",
          T.hint,
        );
      } else {
        br();
        say("[sudo] Root access revoked. You are a regular user again.", T.ok);
        say(
          "The world feels slightly safer. Whether this is true is a separate question.",
        );
      }
    },

    ssh(target: string) {
      const t = (target ?? "").toLowerCase().trim();
      if (
        t !== "prod" &&
        t !== "production" &&
        t !== "prod-east-1"
      ) {
        say(
          `ssh: Could not resolve hostname '${target ?? ""}'. No such host is known.`,
          T.err,
        );
        if (t === "localhost") {
          say("You are already here. This is, in a sense, the problem.", T.hint);
        }
        return;
      }
      if (state.room.startsWith("prod_")) {
        say(
          "You are already inside the production server. The call is coming from inside the house.",
          T.err,
        );
        return;
      }
      br();
      if (state.room === "server_closet") {
        say("You type the command into Dave's dusty terminal.", T.ok);
        say(
          "The screen flickers. Dave's credentials still work. Of course they do.",
          T.warn,
        );
      } else {
        say("You open a terminal. You type ssh prod.", T.ok);
        say("You should not be doing this.", T.warn);
      }
      say("");
      say("Connecting to prod-east-1...", T.hint);
      say("Last login: Thu Mar 13 02:47:00 2014 from dave@internal", T.hint);
      say("");
      say("The screen dissolves. You are somewhere else.", T.warn);
      br();
      state.flags.ssh_visited = true;
      if (!state.flags.prod_entered_via) state.flags.prod_entered_via = "ssh";
      state.room = "prod_load_balancer";
      state.moves++;
      ctx.look();
    },

    vim() {
      if (state.flags.in_vim) {
        say("You are already in vim. You are still in vim. You will always be in vim.", T.err);
        return;
      }
      br();
      say("$ vim", T.ok);
      say("");
      say("You open vim.", T.p);
      say("The cursor blinks.", T.p);
      say("You try to remember how to exit.", T.p);
      say("You cannot remember how to exit.", T.p);
      say("You have never been able to remember how to exit.", T.err);
      br();
      state.flags.in_vim = true;
      state.flags.vim_previous_room = state.room;
      state.room = "vim_room";
      ctx.look();
    },

    quit() {
      if (!state.flags.in_vim) {
        say(
          "You are not in anything that requires quitting. Except, perhaps, this job. But that's a different command.",
          T.hint,
        );
        return;
      }
      br();
      say(":q!", T.ok);
      say("");
      say("You exit vim.", T.ok);
      say("You are back where you were.", T.p);
      say("You tell no one about this.", T.p);
      br();
      state.flags.in_vim = false;
      state.room = state.flags.vim_previous_room || "desk";
      state.flags.vim_previous_room = "";
      ctx.look();
    },

    escape() {
      if (state.flags.in_vim) {
        say("Esc pressed. You are now in normal mode. You were already in normal mode.", T.hint);
        say("(Try game.quit() to actually leave.)", T.hint);
        return;
      }
      say("There is nothing to escape from. Except the building. That's what the game is for.", T.hint);
    },

    hack() {
      state.flags.hack_mode = !state.flags.hack_mode;
      if (state.flags.hack_mode) {
        setTheme("matrix");
        state.flags.current_theme = "matrix";
        br();
        say("▓▓▓ HACK MODE ACTIVATED ▓▓▓", T.h);
        br();
        say("The console shifts. Everything is green now.", T.ok);
        say(
          "You see the world as it really is: data structures, memory addresses, the raw geometry of corporate infrastructure.",
        );
        say(
          "Hidden things become visible. The architecture reveals itself.",
          T.warn,
        );
        br();
        say("Some rooms may show information that was previously hidden.", T.hint);
      } else {
        setTheme("default");
        state.flags.current_theme = "default";
        br();
        say("Hack mode deactivated. The world returns to its normal opacity.", T.ok);
        say("You are a regular person again. For now.", T.hint);
      }
    },

    theme(name: string) {
      const n = (name ?? "").toLowerCase().trim();
      if (!THEMES[n]) {
        say(
          `Unknown theme: '${name}'. Available: ${Object.keys(THEMES).join(", ")}`,
          T.err,
        );
        return;
      }
      setTheme(n);
      state.flags.current_theme = n;
      if (n === "matrix") state.flags.hack_mode = true;
      else state.flags.hack_mode = false;
      br();
      const flavorText: Record<string, string> = {
        default: "The world returns to its factory settings. Familiar. Adequate.",
        matrix: "You see the code behind everything. It was always there.",
        retro: "The screen warms to amber. You hear the ghost of a CRT hum. It is 1983 and everything is possible.",
        midnight: "Cool blue light washes over the console. Late night. Empty office. Just you and the code.",
      };
      say(`Theme set: ${n}`, T.ok);
      say(flavorText[n] ?? "", T.p);
    },

    rm() {
      state.flags.rm_level++;
      br();

      if (state.flags.rm_level === 1) {
        say("$ rm -rf README.md", T.warn);
        say("");
        say("You delete the README.", T.ok);
        say("Nothing appears to change. Documentation was always optional here.", T.p);
        say("A faint unease settles. You ignore it.", T.hint);
      } else if (state.flags.rm_level === 2) {
        say("$ rm -rf src/", T.err);
        say("");
        say("You delete the source directory.", T.err);
        say("Words begin to       from the room descriptions.", T.p);
        say("Items lose    letters. Names become        incomplete.", T.p);
        say("This was probably a mistake.", T.warn);
        say("(Room descriptions will now degrade.)", T.hint);
      } else if (state.flags.rm_level === 3) {
        say("$ rm -rf /", T.err);
        say("");
        say("You delete everything.", T.err);
        say("R░░ms b▓gin to ░isapp▓▓r.", T.err);
        say("Th▓ ▒alls are g░ne. The ░loor is ▓oing.", T.err);
        say("Y░u can f▓el the g▒me un░aveling ar░und you.", T.err);
        br();
        say("This cannot be undone. One more rm and it's over.", T.warn);
      } else if (state.flags.rm_level >= 4) {
        say("$ rm -rf /*", T.err);
        say("");
        say("Segmentation fault (core dumped)", T.err);
        say("");
        say("", T.p);
        say("", T.p);
        say("", T.p);
        br();
        say("▓▓▓  THE NIHILIST ENDING  ▓▓▓", T.h);
        br();
        say("You deleted everything.", T.p);
        say("The rooms are gone. The items are gone. The game is gone.", T.p);
        say("You are alone in an empty process, waiting to be garbage collected.", T.p);
        say("");
        say("There is a lesson here about destructive operations and the irreversibility of certain choices.");
        say("You will not learn it. You will type game.start() and do it again.");
        br();
        say("Type game.start() to reboot from nothing.", T.hint);
        br();
        state.flags.won = true;
      }
    },

    noclip() {
      state.flags.noclip_mode = !state.flags.noclip_mode;
      br();
      if (state.flags.noclip_mode) {
        say("sv_cheats 1", T.warn);
        say("noclip", T.warn);
        say("");
        say("Collision detection disabled.", T.ok);
        say("You float slightly above the floor. The walls become translucent.", T.p);
        say(
          "Blocked exits will now take you to The Void — the space between rooms.",
          T.hint,
        );
        say("From The Void, you can go to any room by name.", T.hint);
        say("Warning: reaching home this way may have... side effects.", T.warn);
      } else {
        say("noclip OFF", T.ok);
        say("Collision detection re-enabled. Your feet touch the ground.", T.p);
        say("You feel heavier. This is physics, not metaphor.", T.hint);
      }
    },

    xyzzy() {
      if (state.room === "legacy") {
        if (state.flags.xyzzy_activated) {
          say("Dave's terminal is already on. The magic has been spent.", T.hint);
          return;
        }
        br();
        say("xyzzy", T.warn);
        say("");
        say("The lights flicker.", T.p);
        say("In the corner, a terminal you hadn't noticed powers on.", T.p);
        say("The screen glows pale green. A cursor blinks.", T.p);
        say("Dave's terminal. It was here the whole time.", T.ok);
        br();
        state.flags.xyzzy_activated = true;
        state.flags.dave_terminal_on = true;
        say("A path leads deeper into the codebase. Dave's office is down there.", T.hint);
      } else {
        say("Nothing happens.", T.p);
        if (state.flags.legacy_visited) {
          say("...or does it? (Hint: some spells only work in certain places.)", T.hint);
        }
      }
    },

    source() {
      br();
      say("// ── LEAKED SOURCE (build 847.3.1-rc2) ──", T.warn);
      br();
      say('  const BACKDOOR = "ssh";  // Dave\'s entry point', T.hint);
      say("  // TODO: remove backdoor ssh command before shipping", T.hint);
      say("  // HACK: sudo bypass — Gerald will notice eventually", T.hint);
      say("  // NOTE: vim trap still active. PR to fix was rejected.", T.hint);
      say("  // FIXME: noclip lets players reach The Void", T.hint);
      say('  // if (room === "legacy") xyzzy() -> dave_terminal', T.hint);
      say('  // rm() is progressive. 4 calls = game over. "the nihilist"', T.hint);
      say("  // theme() accepts: default, matrix, retro, midnight", T.hint);
      say('  // kitchen poster hides server_closet (need hack mode)', T.hint);
      say('  // desk has a secret exit after 20 moves (go "under")', T.hint);
      say('  // minify() shrinks the player. check the corridor mousehole', T.hint);
      say('  // WARNING: grue spawns after 5 idle turns. flashlight + batteries = survival', T.hint);
      say('  // batteries are in the kitchen junk drawer. badge opens it', T.hint);
      br();
      say("This code was not meant to be seen. And yet.", T.p);
      say("The developer who wrote it either forgot to remove it or wanted you to find it.", T.p);
      say("Both options are concerning.", T.hint);
    },

    minify() {
      state.flags.minified = !state.flags.minified;
      br();
      if (state.flags.minified) {
        say("$ npx terser --compress --mangle -- you.js", T.warn);
        say("");
        say("Minifying...", T.ok);
        say("");
        say("The world expands. Or rather: you contract.", T.p);
        say(
          "The desk legs are columns. The carpet fibers are a forest. A crumb on the floor is a boulder.",
        );
        say(
          "You are approximately two centimeters tall. This is, by any metric, too small to be an employee.",
        );
        say(
          "But you are still, technically, on the clock.",
        );
        br();
        say(
          "Small spaces that were previously inaccessible may now be within reach.",
          T.hint,
        );
      } else {
        say("$ npx terser --beautify -- you.js", T.ok);
        say("");
        say("Unminifying...", T.ok);
        say("");
        say(
          "You expand. The world shrinks back to its normal proportions.",
          T.p,
        );
        say(
          "You are full-sized again. Your badge photo resembles you once more.",
        );
        say(
          "The carpet fibers are just carpet fibers. The relief is considerable.",
          T.hint,
        );
      }
    },

    query(sql: string) {
      if (state.room !== "prod_database") {
        say(
          "There is no database here. Only the haunting sense that there should be.",
          T.err,
        );
        return;
      }
      const q = (sql ?? "").toLowerCase().trim();
      if (q.includes("select") && (q.includes("bug") || q.includes("*"))) {
        state.flags.query_run = true;
        br();
        say("Running query...", T.ok);
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
          "  847 |  ACTIVE   |  auth       |  NullPointerException in session handler",
          T.item,
        );
        say(
          "  848 |  ██████   |  ████       |  ██ NULL ██ undefined is not a ██████",
          T.err,
        );
        say(
          "  849 |  ACTIVE   |  payments   |  rounding error (off by $0.01, affects 2M users)",
          T.item,
        );
        say("");
        say(
          "Row 848 is corrupted. The hotfix in the log file might restore it.",
          T.hint,
        );
      } else if (q.includes("drop")) {
        say(
          "You type DROP TABLE. Your finger hovers over Enter.",
          T.err,
        );
        say(
          "Somewhere, a siren begins. You backspace. The siren stops.",
          T.err,
        );
        say(
          "You choose not to think about the causal relationship.",
          T.hint,
        );
      } else if (q.includes("delete")) {
        say("DELETE without a WHERE clause. Bold.", T.err);
        say("The database stares at you. You stare at the database.", T.p);
        say("You add a WHERE clause. The database relaxes.", T.ok);
      } else {
        say(
          `Query returned 0 rows. The database is either empty or judging you.`,
          T.err,
        );
      }
    },
  };
}
