export type Flags = {
  meeting_entered: boolean;
  meeting_escape_attempts: number;
  meeting_escaped: boolean;
  review_done: boolean;
  deployed: boolean;
  deploy_attempts: number;
  legacy_visited: boolean;
  coffee_drunk: boolean;
  won: boolean;
  sudo_mode: boolean;
  hack_mode: boolean;
  noclip_mode: boolean;
  in_vim: boolean;
  vim_previous_room: string;
  rm_level: number;
  xyzzy_activated: boolean;
  dave_terminal_on: boolean;
  ssh_visited: boolean;
  prod_bug_fixed: boolean;
  sudo_deployed: boolean;
  ops_hero: boolean;
  dave_farewell: boolean;
  current_theme: string;
  log_visits: number;
  prod_entered_via: string;
  query_run: boolean;
  hotfix_applied: boolean;
  minified: boolean;
  headphones_on: boolean;
  turns_in_room: number;
  last_tracked_room: string;
  darkness: boolean;
  darkness_turns: number;
  flashlight_loaded: boolean;
  flashlight_on: boolean;
  drawer_examined: boolean;
  drawer_opened: boolean;
};

export type GameState = {
  room: string;
  inventory: string[];
  flags: Flags;
  moves: number;
};

export type Item = {
  name: string;
  desc: string;
};

export type Room = {
  name: string;
  desc: () => string;
  exits: () => Record<string, string | null>;
  onEnter?: () => void;
};

export type GameContext = {
  state: GameState;
  roomItems: Record<string, string[]>;
  ITEMS: Record<string, Item>;
  ROOMS: Record<string, Room>;
  say: (msg: string, style?: string) => void;
  br: () => void;
  T: Record<string, string>;
  setTheme: (name: string) => void;
  look: () => void;
  findItem: (name: string, inList: string[]) => string | undefined;
};

export function defaultFlags(): Flags {
  return {
    meeting_entered: false,
    meeting_escape_attempts: 0,
    meeting_escaped: false,
    review_done: false,
    deployed: false,
    deploy_attempts: 0,
    legacy_visited: false,
    coffee_drunk: false,
    won: false,
    sudo_mode: false,
    hack_mode: false,
    noclip_mode: false,
    in_vim: false,
    vim_previous_room: "",
    rm_level: 0,
    xyzzy_activated: false,
    dave_terminal_on: false,
    ssh_visited: false,
    prod_bug_fixed: false,
    sudo_deployed: false,
    ops_hero: false,
    dave_farewell: false,
    current_theme: "default",
    log_visits: 0,
    prod_entered_via: "",
    query_run: false,
    hotfix_applied: false,
    minified: false,
    headphones_on: false,
    turns_in_room: 0,
    last_tracked_room: "",
    darkness: false,
    darkness_turns: 0,
    flashlight_loaded: false,
    flashlight_on: false,
    drawer_examined: false,
    drawer_opened: false,
  };
}
