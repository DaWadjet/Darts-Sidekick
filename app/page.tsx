"use client";
import { Multiplier, SEGMENTS } from "@/app/lib/types";
import {
  useCurrentPlayer,
  useGameStore,
  usePlayers,
} from "@/app/store/GameProvider";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

const Game: FC = () => {
  const [multiplier, setMultiplier] = useState<Multiplier>(1);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const possibleValues = useMemo(() => SEGMENTS.toSorted(), []);

  const store = useGameStore()();
  const currentPlayer = useCurrentPlayer();
  const players = usePlayers();

  const setupDummyGame = useCallback(() => {
    store.addPlayer("Player 1");
    store.addPlayer("Player 2");
    store.addPlayer("Player 3");

    store.setStartingPointAmount(701);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 justify-center p-24">
      <h1 className="text-5xl font-bold">Darts</h1>
      <div className="grow" />
      {isGameStarted ? (
        <>
          <div className="flex gap-2">
            {players.map((player) => (
              <div
                key={player.id}
                className={`h-10 w-10 bg-gray-500 rounded-md shadow-md ${
                  player.id === currentPlayer.id ? "bg-red-500" : ""
                }`}
              >
                {player.name}
              </div>
            ))}
          </div>

          <div className="grow" />

          <div className="flex flex-wrap gap-4">
            {possibleValues.map((segment) => (
              <button
                key={segment}
                className="h-10 w-10 bg-gray-500 rounded-md shadow-md"
                onClick={() => {
                  store.saveThrow({
                    scoredBy: currentPlayer,
                    throwValue: {
                      segment,
                      multiplier,
                    },
                  });
                  setMultiplier(1);
                }}
              >
                {segment}
              </button>
            ))}
            <button
              key="outerbull"
              className="h-10 px-3 bg-gray-500 rounded-md shadow-md"
              onClick={() => {
                store.saveThrow({
                  scoredBy: currentPlayer,
                  throwValue: {
                    segment: "OUTER_BULL",
                  },
                });
                setMultiplier(1);
              }}
            >
              Outer Bull
            </button>
            <button
              key="bullseye"
              className="h-10 px-3 bg-gray-500 rounded-md shadow-md"
              onClick={() => {
                store.saveThrow({
                  scoredBy: currentPlayer,
                  throwValue: {
                    segment: "BULLSEYE",
                  },
                });
                setMultiplier(1);
              }}
            >
              Bullseye
            </button>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              key="double"
              className="h-10 px-3 bg-gray-500 rounded-md shadow-md"
              onClick={() => {
                if (multiplier === 2) {
                  setMultiplier(1);
                } else {
                  setMultiplier(2);
                }
              }}
            >
              Double
            </button>
            <button
              key="triple"
              className="h-10 px-3 bg-gray-500 rounded-md shadow-md"
              onClick={() => {
                if (multiplier === 3) {
                  setMultiplier(1);
                } else {
                  setMultiplier(3);
                }
              }}
            >
              Triple
            </button>
            <button
              key="undo"
              className="h-10 px-3 bg-gray-500 rounded-md shadow-md"
              onClick={store.undoThrow}
            >
              Undo
            </button>
            <button
              key="redo"
              className="h-10 px-3 bg-gray-500 rounded-md shadow-md"
              onClick={store.redoThrow}
            >
              Redo
            </button>
            <button
              key="reset"
              className="h-10 px-3 bg-gray-500 rounded-md shadow-md"
              onClick={() => {
                store.reset();
                setIsGameStarted(false);
              }}
            >
              Reset
            </button>
          </div>
        </>
      ) : (
        <>
          <button
            key="reset"
            className="h-10 px-3 bg-gray-500 rounded-md shadow-md"
            onClick={() => {
              store.reset();
              setIsGameStarted(false);
            }}
          >
            Reset
          </button>
          <button
            key="start"
            className="h-10 px-3 bg-gray-500 rounded-md shadow-md"
            onClick={() => {
              setIsGameStarted(true);
              setupDummyGame();
            }}
          >
            Start
          </button>
        </>
      )}
    </main>
  );
};
export default Game;
