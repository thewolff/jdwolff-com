"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
        <span className={styles.logoText}>Jo Wolff</span>
        <span className={`mono muted ${styles.logoSub}`}>
          frontend engineer
        </span>
      </Link>

      <nav className={`${styles.nav} ${open ? styles.navOpen : ""}`}>
        <Link href="/work" onClick={() => setOpen(false)}>
          Work
        </Link>
        <Link href="/writing" onClick={() => setOpen(false)}>
          Writing
        </Link>
        <Link href="/about" onClick={() => setOpen(false)}>
          About
        </Link>
        <Link
          href="/contact"
          className={styles.cta}
          onClick={() => setOpen(false)}
        >
          Say hello
        </Link>
      </nav>

      <button
        className={styles.hamburger}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <span className={`${styles.bar} ${open ? styles.barOpen : ""}`} />
        <span className={`${styles.bar} ${open ? styles.barOpen : ""}`} />
        <span className={`${styles.bar} ${open ? styles.barOpen : ""}`} />
      </button>
    </header>
  );
}
