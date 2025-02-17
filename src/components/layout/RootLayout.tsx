import { useCallback, useRef, useState } from "react";
import styles from "./RootLayout.module.css";
import Navigation from "../Navigation";
import Tabs from "../tabs/Tabs";
import LeftAside from "./LeftAside";
import RightAside from "./RightAside";
import BottomAside from "./BottomAside";
import StatusBar from "./StatusBar";
import { useViewState } from "../../hooks/useViewState";

export default function RootLayout() {
  const { nav, aside, bottom, status } = useViewState({
    listenNav: true,
    listenAside: true,
    listenBottom: true,
    listenStatus: true,
  });

  const leftAsideRef = useRef<HTMLDivElement>(null);
  const [leftSplitIsResizing, setLeftSplitIsResizing] = useState(false);
  const [leftAsideWidth, setLeftAsideWidth] = useState(250);

  const rightAsideRef = useRef<HTMLDivElement>(null);
  const [rightSplitIsResizing, setRightSplitIsResizing] = useState(false);
  const [rightAsideWidth, setRightAsideWidth] = useState(200);

  const bottomAsideRef = useRef<HTMLDivElement>(null);
  const [bottomSplitIsResizing, setBottomSplitIsResizing] = useState(false);
  const [bottomAsideHeight, setBottomAsideHeight] = useState(200);

  const leftSplitMouseDownHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      document.body.style.cursor = "e-resize";

      const actualLeftAsideWidth = leftAsideRef.current?.offsetWidth;
      if (actualLeftAsideWidth) {
        setLeftAsideWidth(actualLeftAsideWidth);
      }
      setLeftSplitIsResizing(true);

      const mouseUpHandler = (event: MouseEvent) => {
        event.preventDefault();
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
        document.body.style.cursor = "auto";
        setLeftSplitIsResizing(false);
        const actualLeftAsideWidth = leftAsideRef.current?.offsetWidth;
        if (actualLeftAsideWidth) {
          setLeftAsideWidth(actualLeftAsideWidth);
        }
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

  const rightSplitMouseDownHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      document.body.style.cursor = "e-resize";

      const actualRightAsideWidth = rightAsideRef.current?.offsetWidth;
      if (actualRightAsideWidth) {
        setRightAsideWidth(actualRightAsideWidth);
      }
      setRightSplitIsResizing(true);

      const mouseUpHandler = (event: MouseEvent) => {
        event.preventDefault();
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
        document.body.style.cursor = "auto";
        setRightSplitIsResizing(false);
        const actualRightAsideWidth = rightAsideRef.current?.offsetWidth;
        if (actualRightAsideWidth) {
          setRightAsideWidth(actualRightAsideWidth);
        }
      };

      const mouseMoveHandler = (event: MouseEvent) => {
        event.preventDefault();
        setRightAsideWidth((prevWidth) => {
          const newWidth = prevWidth - event.movementX;
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

  const bottomSplitMouseDownHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      document.body.style.cursor = "n-resize";

      const actualBottomAsideHeight = bottomAsideRef.current?.offsetHeight;
      if (actualBottomAsideHeight) {
        setBottomAsideHeight(actualBottomAsideHeight);
      }
      setBottomSplitIsResizing(true);

      const mouseUpHandler = (event: MouseEvent) => {
        event.preventDefault();
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
        document.body.style.cursor = "auto";
        setBottomSplitIsResizing(false);
        const actualBottomAsideHeight = bottomAsideRef.current?.offsetHeight;
        if (actualBottomAsideHeight) {
          setBottomAsideHeight(actualBottomAsideHeight);
        }
      };

      const mouseMoveHandler = (event: MouseEvent) => {
        event.preventDefault();
        setBottomAsideHeight((prevHeight) => {
          const newHeight = prevHeight - event.movementY;
          return newHeight;
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
      <nav className={`${styles.navAside} border-r border-neutral-800`}>
        <Navigation></Navigation>
      </nav>
      <header
        ref={leftAsideRef}
        className={`${styles.leftAside} border-r border-neutral-800 min-w-min max-w-full min-h-min max-h-full`}
        style={{
          width: leftAsideWidth,
          display: nav === "none" ? "none" : "block",
        }}
      >
        <LeftAside navigation={nav}></LeftAside>
      </header>
      <div
        className={`${styles.leftSplit} ${
          leftSplitIsResizing ? "bg-primary-500" : "bg-transparent"
        }  hover:bg-primary-500 transition-colors duration-200 delay-300`}
        style={{
          display: nav === "none" ? "none" : "block",
        }}
        onMouseDown={leftSplitMouseDownHandler}
      ></div>
      <main className={`${styles.main}`}>
        <Tabs></Tabs>
      </main>
      <div
        className={`${styles.rightSplit} ${
          rightSplitIsResizing ? "bg-primary-500" : "bg-transparent"
        }  hover:bg-primary-500 transition-colors duration-200 delay-300`}
        style={{
          display: aside === "none" ? "none" : "block",
        }}
        onMouseDown={rightSplitMouseDownHandler}
      ></div>
      <aside
        ref={rightAsideRef}
        className={`${styles.rightAside} border-l border-neutral-800 min-w-min max-w-full min-h-min max-h-full`}
        style={{
          width: rightAsideWidth,
          display: aside === "none" ? "none" : "block",
        }}
      >
        <RightAside></RightAside>
      </aside>
      <div
        className={`${styles.bottomSplit} ${
          bottomSplitIsResizing ? "bg-primary-500" : "bg-transparent"
        }  hover:bg-primary-500 transition-colors duration-200 delay-300`}
        style={{
          display: bottom === "none" ? "none" : "block",
        }}
        onMouseDown={bottomSplitMouseDownHandler}
      ></div>
      <aside
        ref={bottomAsideRef}
        className={`${styles.bottomAside} border-t border-neutral-800 min-h-min max-h-full min-w-full max-w-full`}
        style={{
          height: bottomAsideHeight,
          display: bottom === "none" ? "none" : "block",
        }}
      >
        <BottomAside></BottomAside>
      </aside>
      <footer
        className={`${styles.footer} border-t border-neutral-800`}
        style={{
          display: status === "none" ? "none" : "block",
        }}
      >
        <StatusBar></StatusBar>
      </footer>
    </div>
  );
}
