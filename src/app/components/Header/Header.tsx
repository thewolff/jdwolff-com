"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { useFocusTrap } from "@/app/hooks/useFocusTrap";
import { useEscapeKey } from "@/app/hooks/useEscapeKey";
import { useIsMobile } from "@/app/hooks/useIsMobile";
import styles from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);
  useEscapeKey(close);

  const navRef = useFocusTrap(open);
  const isMobile = useIsMobile();
  const isHidden = isMobile && !open;
  return (
    <header className={`${styles.header} ${open ? styles.headerOpen : ""}`}>
      <Link href="/" className={styles.logo} onClick={close}>
        <span className={styles.logoText}>Jo Wolff</span>
        <span className={`mono muted ${styles.logoSub}`}>
          frontend engineer
        </span>
      </Link>

      {/* Screen reader announcement */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="visually-hidden"
      >
        {open ? "Navigation menu open" : ""}
      </div>

      <nav
        ref={navRef as React.RefObject<HTMLElement>}
        id="main-nav"
        aria-label="Main navigation"
        aria-hidden={isHidden ? true : undefined}
        inert={isHidden || undefined}
        className={`${styles.nav} ${open ? styles.navOpen : ""}`}
      >
        <Link href="/work" onClick={close}>
          Work
        </Link>
        <Link href="/writing" onClick={close}>
          Writing
        </Link>
        <Link href="/about" onClick={close}>
          About
        </Link>
        <Link href="/contact" className={styles.cta} onClick={close}>
          Say hello
        </Link>
      </nav>

      <button
        className={styles.hamburger}
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="main-nav"
      >
        <span className={`${styles.bar} ${open ? styles.barOpen : ""}`} />
        <span className={`${styles.bar} ${open ? styles.barOpen : ""}`} />
        <span className={`${styles.bar} ${open ? styles.barOpen : ""}`} />
      </button>
    </header>
  );
}
