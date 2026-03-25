import styles from "./SkipNav.module.css";

export default function SkipNav() {
  return (
    <a href="#main-content" className={styles.skipNav}>
      Skip to main content
    </a>
  );
}
