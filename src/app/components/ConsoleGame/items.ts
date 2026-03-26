import type { Item } from "./types";

export const ITEMS: Record<string, Item> = {
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
  stale_token: {
    name: "stale session token",
    desc: "A session token, expired 37 minutes ago. The timestamp reads like a small accusation. In the production server, expired tokens are not useless — they are evidence.",
  },
  hotfix: {
    name: "emergency hotfix",
    desc: "A crumpled printout of a stack trace. Someone — possibly you, in a timeline you'd prefer not to examine — has circled line 847 and written 'THIS ONE' in red marker. Below it, in smaller handwriting: 'sorry'.",
  },
  sticky_note: {
    name: "Dave's sticky note",
    desc: "A yellowed sticky note in Dave's handwriting. It reads:\n\n  passwords: hunter2, admin123, xyzzy\n\n'xyzzy' has been circled three times. Dave was thorough about the things that mattered to him.",
  },
  dave_mug: {
    name: '"World\'s Okayest Programmer" mug',
    desc: "A ceramic mug from 2013. The text reads 'World's Okayest Programmer.' It was a gift. From Dave, to Dave. The inside is stained with years of coffee that was never good but was always present.",
  },
  usb_drive: {
    name: "suspicious USB drive",
    desc: "A USB drive labeled 'DEFINITELY NOT GAMES.' It is definitely games. You can tell because someone has drawn a tiny Pac-Man on the label in Sharpie. Below it, in even smaller text: 'also: sudo su'.",
  },
};

export function createRoomItems(): Record<string, string[]> {
  return {
    desk: ["headphones", "badge"],
    corridor: [],
    meeting: [],
    kitchen: ["coffee"],
    code_review: ["rubber_stamp"],
    legacy: ["the_answer"],
    deploy: [],
    parking: [],
    under_desk: ["usb_drive"],
    server_closet: ["sticky_note"],
    dave_office: ["dave_mug"],
    prod_load_balancer: [],
    prod_cache: ["stale_token"],
    prod_database: [],
    prod_log_file: ["hotfix"],
    prod_pipeline: [],
    the_void: [],
    vim_room: [],
  };
}
