import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { MdCenterFocusWeak } from "react-icons/md";
import { useBoundStore } from "../../stores/store";
import BoardCell from "../PlayingCard/BoardCell";
import styles from "./Board.module.scss";

interface Coords {
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
}

export const Board = () => {
  const [cellWidth, setCellWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const isClicked = useRef<boolean>(false);

  const board = useBoundStore((state) => state.board);
  const column = useBoundStore((state) => state.column);

  const coords = useRef<Coords>({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });

  // UseEffect to add event listeners to handle the board moving
  useEffect(() => {
    // Check if boxRef is defined
    if (!boxRef.current || !containerRef.current) return;

    // Setting the size of each cell of the board
    setCellWidth(parseInt((containerRef.current.clientHeight / 9).toFixed()));

    let animationFrameId: number;
    const box = boxRef.current;
    const container = containerRef.current;
    handleReset();

    const onMouseDown = (e: MouseEvent) => {
      isClicked.current = true;
      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;
    };

    const onMouseUp = (e: MouseEvent) => {
      isClicked.current = false;
      coords.current.lastX = box.offsetLeft;
      coords.current.lastY = box.offsetTop;
      window.cancelAnimationFrame(animationFrameId);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isClicked.current) return;

      const nextX = e.clientX - coords.current.startX + coords.current.lastX;
      const nextY = e.clientY - coords.current.startY + coords.current.lastY;

      animationFrameId = window.requestAnimationFrame(() => {
        box.style.left = `${nextX}px`;
        box.style.top = `${nextY}px`;
      });
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const deltaY = event.deltaY;

      if (deltaY < 0) {
        zoomHandler(5);
      } else if (deltaY > 0) {
        zoomHandler(-5);
      }
    };

    box.addEventListener("mousedown", onMouseDown);
    box.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseUp);
    container.addEventListener("wheel", handleWheel);

    const cleanup = () => {
      box.removeEventListener("mousedown", onMouseDown);
      box.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseUp);
      container.removeEventListener("wheel", handleWheel);
    };

    return cleanup;
  }, []);

  // zoomHandler
  const zoomHandler = (by: number) => {
    if (by > 0 && boxRef.current?.clientWidth! < containerRef.current?.clientWidth! * 2) {
      setCellWidth((prevWidth) => prevWidth + by);
      return;
    }
    if (by < 0 && boxRef.current?.clientWidth! > containerRef.current?.clientWidth! / 2) {
      setCellWidth((prevWidth) => prevWidth + by);
      return;
    }
  };

  // Resets the position of the board in the middle of the container
  const handleReset = () => {
    const box = boxRef.current;
    if (!box || !containerRef.current) return;

    const resetHeight =
      containerRef.current.clientHeight - containerRef.current.clientHeight / 2;
    const resetWidth =
      containerRef.current.clientWidth - containerRef.current.clientWidth / 2;
    box.style.top = `50%`;
    box.style.left = `50%`;
    coords.current.startX = resetWidth;
    coords.current.startY = resetHeight;
    coords.current.lastX = resetWidth;
    coords.current.lastY = resetHeight;
  };

  // Cell generation -----------------------------------------------------

  // Customize this to set the size of each cell

  return (
    <main>
      <div className={styles.wrapper}>
        <div ref={containerRef} className={styles.container} onDoubleClick={handleReset}>
          <div
            ref={boxRef}
            className={styles.box}
            style={{
              gridTemplateColumns: `repeat(${column}, ${cellWidth}px)`,
            }}
          >
            <AnimatePresence mode="popLayout">
              {board.map((row, rowIndex) =>
                row.map((card, colIndex) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    key={`${rowIndex}-${colIndex}-${card.cardId}`}
                  >
                    <BoardCell
                      type={card.cardType.toString()}
                      id={card.cardId}
                      key={`${rowIndex}-${colIndex}-${card.cardId}`}
                      coordX={rowIndex}
                      coordY={colIndex}
                      categorie={card.categorie}
                      isFlipped={card.isFlipped!}
                      isReachable={card.isReachable}
                      isRevealed={card.isRevealed}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
          <div className={styles.zoomOptions}>
            <button onClick={() => zoomHandler(5)}>
              <AiOutlineZoomIn />
            </button>
            <button onClick={() => zoomHandler(-5)}>
              <AiOutlineZoomOut />
            </button>
            <button onClick={() => handleReset()}>
              <MdCenterFocusWeak />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
