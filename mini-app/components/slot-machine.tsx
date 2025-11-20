"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"] as const;
type Fruit = typeof fruits[number];

function randomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, randomFruit))
  );
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(false);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWin(false);
    const interval = setInterval(() => {
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]);
        // shift each column down
        for (let col = 0; col < 3; col++) {
          const newCol = [randomFruit(), ...prev.slice(0, 2).map(r => r[col])];
          for (let row = 0; row < 3; row++) {
            newGrid[row][col] = newCol[row];
          }
        }
        return newGrid;
      });
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
      // win condition check via conditional render
      const hasWin =
        // rows
        grid.some(row => row.every(f => f === row[0])) ||
        // columns
        [0, 1, 2].some(col => grid.every(row => row[col] === grid[0][col]));
      setWin(hasWin);
    }, 2000);
  };

  const winMessage = win ? (
    <div className="mt-4 p-4 bg-green-100 rounded">
      <p className="text-green-800 font-semibold">You win!</p>
      <Share text={`I just won a slot machine! ${url}`} />
    </div>
  ) : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img
            key={idx}
            src={`/${fruit}.png`}
            alt={fruit}
            className="w-16 h-16 object-contain"
          />
        ))}
      </div>
      <Button onClick={spin} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </Button>
      {winMessage}
    </div>
  );
}
