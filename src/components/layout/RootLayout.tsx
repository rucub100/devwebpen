/*
 * Copyright 2025 Ruslan Curbanov
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { useCallback, useRef, useState } from "react";
import styles from "./RootLayout.module.css";
import Navigation from "../Navigation";
import Tabs from "../tabs/Tabs";
import NavAside from "./NavAside";
import Aside from "./Aside";
import BottomPanel from "./BottomPanel";
import StatusBar from "./StatusBar";
import { useViewState } from "../../hooks/useViewState";

export default function RootLayout() {
  const { nav, aside, bottom, status } = useViewState({
    listenNav: true,
    listenAside: true,
    listenBottom: true,
    listenStatus: true,
  });

  const navAsideRef = useRef<HTMLDivElement>(null);
  const [navSplitIsResizing, setNavSplitIsResizing] = useState(false);
  const [navAsideWidth, setNavAsideWidth] = useState(250);

  const ssideRef = useRef<HTMLDivElement>(null);
  const [asideSplitIsResizing, setAsideSplitIsResizing] = useState(false);
  const [asideWidth, setAsideWidth] = useState(200);

  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const [bottomSplitIsResizing, setBottomSplitIsResizing] = useState(false);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(200);

  const navSplitMouseDownHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      document.body.style.cursor = "e-resize";

      const actualNavAsideWidth = navAsideRef.current?.offsetWidth;
      if (actualNavAsideWidth) {
        setNavAsideWidth(actualNavAsideWidth);
      }
      setNavSplitIsResizing(true);

      const mouseUpHandler = (event: MouseEvent) => {
        event.preventDefault();
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
        document.body.style.cursor = "auto";
        setNavSplitIsResizing(false);
        const actualNavAsideWidth = navAsideRef.current?.offsetWidth;
        if (actualNavAsideWidth) {
          setNavAsideWidth(actualNavAsideWidth);
        }
      };

      const mouseMoveHandler = (event: MouseEvent) => {
        event.preventDefault();
        setNavAsideWidth((prevWidth) => {
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

  const asideSplitMouseDownHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      document.body.style.cursor = "e-resize";

      const actualAsideWidth = ssideRef.current?.offsetWidth;
      if (actualAsideWidth) {
        setAsideWidth(actualAsideWidth);
      }
      setAsideSplitIsResizing(true);

      const mouseUpHandler = (event: MouseEvent) => {
        event.preventDefault();
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
        document.body.style.cursor = "auto";
        setAsideSplitIsResizing(false);
        const actualAsideWidth = ssideRef.current?.offsetWidth;
        if (actualAsideWidth) {
          setAsideWidth(actualAsideWidth);
        }
      };

      const mouseMoveHandler = (event: MouseEvent) => {
        event.preventDefault();
        setAsideWidth((prevWidth) => {
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

      const actualBottomPanelHeight = bottomPanelRef.current?.offsetHeight;
      if (actualBottomPanelHeight) {
        setBottomPanelHeight(actualBottomPanelHeight);
      }
      setBottomSplitIsResizing(true);

      const mouseUpHandler = (event: MouseEvent) => {
        event.preventDefault();
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
        document.body.style.cursor = "auto";
        setBottomSplitIsResizing(false);
        const actualBottomPanelHeight = bottomPanelRef.current?.offsetHeight;
        if (actualBottomPanelHeight) {
          setBottomPanelHeight(actualBottomPanelHeight);
        }
      };

      const mouseMoveHandler = (event: MouseEvent) => {
        event.preventDefault();
        setBottomPanelHeight((prevHeight) => {
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
      <nav className={`${styles.nav} border-r border-neutral-800`}>
        <Navigation></Navigation>
      </nav>
      <header
        ref={navAsideRef}
        className={`${styles.navAside} border-r border-neutral-800 min-w-min max-w-full min-h-min max-h-full`}
        style={{
          width: navAsideWidth,
          display: nav === "none" ? "none" : "block",
        }}
      >
        <NavAside navigation={nav}></NavAside>
      </header>
      <div
        className={`${styles.navSplit} ${
          navSplitIsResizing ? "bg-primary-500" : "bg-transparent"
        }  hover:bg-primary-500 transition-colors duration-200 delay-300`}
        style={{
          display: nav === "none" ? "none" : "block",
        }}
        onMouseDown={navSplitMouseDownHandler}
      ></div>
      <main className={`${styles.main}`}>
        <Tabs></Tabs>
      </main>
      <div
        className={`${styles.asideSplit} ${
          asideSplitIsResizing ? "bg-primary-500" : "bg-transparent"
        }  hover:bg-primary-500 transition-colors duration-200 delay-300`}
        style={{
          display: aside === "none" ? "none" : "block",
        }}
        onMouseDown={asideSplitMouseDownHandler}
      ></div>
      <aside
        ref={ssideRef}
        className={`${styles.aside} border-l border-neutral-800 min-w-min max-w-full min-h-min max-h-full`}
        style={{
          width: asideWidth,
          display: aside === "none" ? "none" : "block",
        }}
      >
        <Aside></Aside>
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
        ref={bottomPanelRef}
        className={`${styles.bottomPanel} border-t border-neutral-800 min-h-min max-h-full min-w-full max-w-full`}
        style={{
          height: bottomPanelHeight,
          display: bottom === "none" ? "none" : "block",
        }}
      >
        <BottomPanel view={bottom}></BottomPanel>
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
