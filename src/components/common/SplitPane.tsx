import { useCallback, useRef, useState } from "react";
import styles from "./SplitPane.module.css";

interface SplitPaneProps {
  orientation: "horizontal" | "vertical";
  firstPaneSize?: number;
  firstPaneChildren: React.ReactNode;
  secondPaneChildren: React.ReactNode;
}

export default function SplitPane({
  orientation,
  firstPaneSize = 200,
  firstPaneChildren,
  secondPaneChildren,
}: SplitPaneProps) {
  const firstPaneRef = useRef<HTMLDivElement>(null);
  const [splitIsResizing, setSplitIsResizing] = useState(false);
  const [firstPlaneSize, setFirstPlaneSize] = useState(firstPaneSize);

  const splitMouseDownHandler = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      document.body.style.cursor =
        orientation === "horizontal" ? "e-resize" : "n-resize";

      const actualFirstPaneSize =
        orientation === "horizontal"
          ? firstPaneRef.current?.offsetWidth
          : firstPaneRef.current?.offsetHeight;
      if (actualFirstPaneSize) {
        setFirstPlaneSize(actualFirstPaneSize);
      }
      setSplitIsResizing(true);

      const mouseUpHandler = (event: MouseEvent) => {
        event.preventDefault();
        document.removeEventListener("mousemove", mouseMoveHandler);
        document.removeEventListener("mouseup", mouseUpHandler);
        document.body.style.cursor = "auto";
        setSplitIsResizing(false);
        const actualFirstPaneSize =
          orientation === "horizontal"
            ? firstPaneRef.current?.offsetWidth
            : firstPaneRef.current?.offsetHeight;
        if (actualFirstPaneSize) {
          setFirstPlaneSize(actualFirstPaneSize);
        }
      };

      const mouseMoveHandler = (event: MouseEvent) => {
        event.preventDefault();
        setFirstPlaneSize((prevSize) => {
          const newSize =
            orientation === "horizontal"
              ? prevSize + event.movementX
              : prevSize + event.movementY;
          return newSize;
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
    <div className={`${styles.splitPane} ${styles[orientation]}`}>
      <div
        ref={firstPaneRef}
        className={`${styles.firstPane} border-${
          orientation === "horizontal" ? "r" : "b"
        } border-neutral-800 min-w-min max-w-full min-h-min max-h-full`}
        style={{
          ...(orientation === "horizontal" && { width: firstPlaneSize }),
          ...(orientation === "vertical" && { height: firstPlaneSize }),
        }}
      >
        {firstPaneChildren}
      </div>
      <div
        className={`${styles.split} ${styles[orientation]} ${
          splitIsResizing ? "bg-primary-500" : "bg-transparent"
        }  hover:bg-primary-500 transition-colors duration-200 delay-300`}
        onMouseDown={splitMouseDownHandler}
      ></div>
      <div className={`${styles.secondPane}`}>{secondPaneChildren}</div>
    </div>
  );
}
