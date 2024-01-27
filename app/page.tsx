"use client";
import { clsxm } from "@/app/lib/clsxm";
import { Multiplier, SEGMENTS, ThrowValue } from "@/app/lib/types";
import { throwValueToString } from "@/app/lib/utils";
import {
  useCurrentPlayer,
  useGameStore,
  usePlayers,
} from "@/app/store/GameProvider";
import { FC, useCallback, useMemo, useState } from "react";

const Game: FC = () => {
  const [multiplier, setMultiplier] = useState<Multiplier>(1);

  const possibleValues = useMemo(
    () => SEGMENTS.slice().sort((a, b) => a - b),
    [SEGMENTS]
  );

  const store = useGameStore()();
  const currentPlayer = useCurrentPlayer();
  const players = usePlayers();

  const setupDummyGame = useCallback(() => {
    store.addPlayer("Player 1");
    store.addPlayer("Player 2");
    store.addPlayer("Player 3");

    store.setStartingPointAmount(701);
    store.startGame();
    //@react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 justify-center p-24">
      <h1 className="text-5xl font-bold">Darts</h1>
      <div className="grow" />
      {store.hasGameStarted ? (
        <>
          <div className="flex gap-2 w-full">
            {players.map((player) => (
              <div
                key={player.id}
                className={clsxm(
                  "flex-1 w-full rounded-md shadow-md px-5",
                  player.id === currentPlayer.id ? "bg-gray-500" : "bg-gray-200"
                )}
              >
                <span className="line-clamp-1">{player.name}</span>
                <div className="flex flex-col gap-1 items-start">
                  {player.history.map((batch) => (
                    <div
                      key={`${player.id}-${batch[0].id}`}
                      className="flex gap-2"
                    >
                      {batch.map((throwResult, index) => (
                        <div key={`${throwResult?.id}-${index}`}>
                          {throwValueToString(throwResult?.throwValue ?? null)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 w-full flex-wrap">
            {store.savedResultsStack.map((result) => (
              <div key={`${result.id}`} className="flex gap-2">
                {throwValueToString(result?.throwValue ?? null)}
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
            }}
          >
            Reset
          </button>
          <button
            key="start"
            className="h-10 px-3 bg-gray-500 rounded-md shadow-md"
            onClick={() => {
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
