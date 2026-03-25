import styles from "./PageLayout.module.css";

interface PageLayoutProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}

export default function PageLayout({
  eyebrow,
  title,
  intro,
  children,
}: PageLayoutProps) {
  return (
    <main id="main-content" className={styles.main}>
      <header className={styles.header}>
        {eyebrow && <p className={`mono muted ${styles.eyebrow}`}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {intro && <p className={styles.intro}>{intro}</p>}
      </header>
      {children && <div className={styles.content}>{children}</div>}
    </main>
  );
}
