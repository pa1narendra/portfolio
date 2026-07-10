"use client";

import { useState } from "react";

// A real, playable 3D knight. Legal moves highlight; click one to hop.
const OFFSETS = [
  [1, 2], [2, 1], [2, -1], [1, -2],
  [-1, -2], [-2, -1], [-2, 1], [-1, 2],
];

export default function ChessBoard() {
  const [pos, setPos] = useState({ r: 4, c: 3 });
  const [moves, setMoves] = useState(0);
  const [hopping, setHopping] = useState(false);

  const legal = OFFSETS.map(([dr, dc]) => ({ r: pos.r + dr, c: pos.c + dc })).filter(
    (p) => p.r >= 0 && p.r < 8 && p.c >= 0 && p.c < 8,
  );

  const go = (r: number, c: number) => {
    if (hopping) return;
    if (!legal.some((p) => p.r === r && p.c === c)) return;
    setHopping(true);
    setPos({ r, c });
    setMoves((m) => m + 1);
    setTimeout(() => setHopping(false), 520);
  };

  return (
    <div className="chess-wrap">
      <div className="chess-scene" aria-label="playable chess board — move the knight">
        <div className="chess-board">
          {Array.from({ length: 64 }, (_, i) => {
            const r = Math.floor(i / 8);
            const c = i % 8;
            const isLegal = legal.some((p) => p.r === r && p.c === c);
            return (
              <button
                key={i}
                type="button"
                tabIndex={isLegal ? 0 : -1}
                aria-label={isLegal ? `move knight to ${String.fromCharCode(97 + c)}${8 - r}` : undefined}
                className={`sq ${(r + c) % 2 ? "dark" : "light"}${isLegal ? " legal" : ""}`}
                onClick={() => go(r, c)}
              />
            );
          })}
          <div
            className={`knight${hopping ? " hop" : ""}`}
            style={{ left: `${pos.c * 12.5}%`, top: `${pos.r * 12.5}%` }}
            aria-hidden="true"
          >
            ♞
          </div>
        </div>
      </div>
      <p className="artifact-caption mono">
        a real knight · {moves} move{moves === 1 ? "" : "s"} · click a lit square
      </p>
    </div>
  );
}
