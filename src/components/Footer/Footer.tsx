import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>
          <span className="mono muted">
            © {new Date().getFullYear()} Jo Wolff
          </span>
        </p>

        <nav aria-label="Footer navigation" className={styles.nav}>
          <Link href="/work">Work</Link>
          <Link href="/writing">Writing</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <p className={styles.a11y}>
          <Link href="/accessibility" className="mono muted">
            Accessibility statement
          </Link>
        </p>
      </div>
    </footer>
  );
}
