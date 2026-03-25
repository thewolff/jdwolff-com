import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <span className={styles.logoText}>Jo Wolff</span>
        <span className={`mono muted ${styles.logoSub}`}>
          frontend engineer
        </span>
      </Link>
      <nav className={styles.nav}>
        <Link href="/work">Work</Link>
        <Link href="/writing">Writing</Link>
        <Link href="/about">About</Link>
        <Link href="/contact" className={styles.cta}>
          Say hello
        </Link>
      </nav>
    </header>
  );
}
