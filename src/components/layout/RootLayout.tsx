import styles from "./RootLayout.module.css";

export default function RootLayout() {
  return (
    <div
      className={`${styles.rootLayout} scroll-smooth antialiased dark:bg-neutral-900 dark:text-neutral-200`}
    >
      <nav className={`${styles.navAside} border-r border-neutral-700`}>
        nav
      </nav>
      <header className={`${styles.leftAside} border-r border-neutral-700`}>
        left aside
      </header>
      <main className={`${styles.main}`}>main</main>
      <aside className={`${styles.rightAside} border-l border-neutral-700`}>
        right aside
      </aside>
      <aside className={`${styles.bottomAside} border-t border-neutral-700`}>
        bottom aside
      </aside>
      <footer className={`${styles.footer} border-t border-neutral-700`}>
        Status bar
      </footer>
    </div>
  );
}
