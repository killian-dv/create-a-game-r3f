import { useKeyboardControls } from "@react-three/drei";
import { addEffect } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useGame } from "../stores/use-game";

export const Interface = () => {
  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const left = useKeyboardControls((state) => state.left);
  const right = useKeyboardControls((state) => state.right);
  const jump = useKeyboardControls((state) => state.jump);

  const phase = useGame((state) => state.phase);
  const startTime = useGame((state) => state.startTime);
  const endTime = useGame((state) => state.endTime);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (phase !== "playing") return;

    const unsubscribe = addEffect(() => {
      setNow(Date.now());
    });

    return unsubscribe;
  }, [phase]);

  const time =
    phase === "ended"
      ? endTime - startTime
      : phase === "playing"
        ? now - startTime
        : 0;
  const minutes = Math.floor(time / 1000 / 60);
  const seconds = Math.floor((time / 1000) % 60);
  const milliseconds = Math.floor((time % 1000) / 10);
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`;

  const restart = useGame((state) => state.restart);
  const isEnded = phase === "ended";
  return (
    <div className="interface">
      {/* time */}
      <div className="time">{formattedTime}</div>
      {/* restart */}
      {isEnded && (
        <button className="restart" onClick={restart}>
          Restart
        </button>
      )}
      {/* Controls */}
      <div className="controls">
        <div className="raw">
          <div className={`key ${forward ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key ${left ? "active" : ""}`}></div>
          <div className={`key ${backward ? "active" : ""}`}></div>
          <div className={`key ${right ? "active" : ""}`}></div>
        </div>
        <div className="raw">
          <div className={`key large ${jump ? "active" : ""}`}></div>
        </div>
      </div>
    </div>
  );
};
