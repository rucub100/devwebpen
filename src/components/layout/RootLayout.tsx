import { useCallback, useState } from "react";
import styles from "./RootLayout.module.css";

export default function RootLayout() {
  const [leftSplitIsResizing, setLeftSplitIsResizing] = useState(false);
  const [leftAsideWidth, setLeftAsideWidth] = useState(200);

  const leftSplitMouseDownHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      document.body.style.cursor = "e-resize";
      setLeftSplitIsResizing(true);

      const mouseUpHandler = (event: MouseEvent) => {
        event.preventDefault();
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
        document.body.style.cursor = "auto";
        setLeftSplitIsResizing(false);
      };

      const mouseMoveHandler = (event: MouseEvent) => {
        event.preventDefault();
        setLeftAsideWidth((prevWidth) => {
          const newWidth = prevWidth + event.movementX;
          return newWidth;
        });
      };

      document.addEventListener("mouseup", mouseUpHandler);
      document.addEventListener("mousemove", mouseMoveHandler);

      return () => {
        document.removeEventListener("mouseup", mouseUpHandler);
        document.removeEventListener("mousemove", mouseMoveHandler);
      };
    },
    []
  );

  return (
    <div
      className={`${styles.rootLayout} scroll-smooth antialiased select-none dark:bg-neutral-900 dark:text-neutral-200`}
    >
      <nav className={`${styles.navAside} border-r border-neutral-700`}>
        nav
      </nav>
      <header
        className={`${styles.leftAside} border-r border-neutral-700 min-w-max max-w-full`}
        style={{ width: leftAsideWidth }}
      >
        left aside
      </header>
      <div
        className={`${styles.leftSplit} ${
          leftSplitIsResizing ? "bg-[--color-primary-500]" : "bg-transparent"
        }  hover:bg-[--color-primary-500] transition-colors duration-200 delay-300`}
        onMouseDown={leftSplitMouseDownHandler}
      ></div>
      <main className={`${styles.main} min-w-[200px] max-w-max`}>main</main>
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
