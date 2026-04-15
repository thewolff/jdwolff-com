"use client";

import { useEffect } from "react";
import { createGame } from "./engine";
import styles from "./ConsoleGame.module.css";

export default function ConsoleGame() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const { game, say, br, T } = createGame();

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

  return (
    <div className={styles.terminal}>
      <div id="game-log" className={styles.logArea}></div>
      <div className={styles.gameContainer}>...</div>
    </div>
  );
}
