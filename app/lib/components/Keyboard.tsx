"use client";

import { Multiplier, SEGMENTS } from "@/app/lib/types";
import { cn } from "@/lib/utils";
import {
  useCurrentPlayer,
  useGameActions,
  useGameStore,
} from "@/store/GameProvider";
import { FC, useCallback, useMemo, useState } from "react";

import CheckoutSuggestion from "@/app/lib/components/CheckoutSuggestion";
import { vibrate } from "@/app/lib/utils";

const Keyboard: FC = () => {
  const isDoubleOut = useGameStore()(
    useCallback((state) => state.endingStrategy === "DOUBLE_OUT", [])
  );
  const saveThrow = useGameActions().saveThrow;
  const currentPlayer = useCurrentPlayer();
  const [multiplier, setMultiplier] = useState<Multiplier>(1);
  const possibleValues = useMemo(
    () => SEGMENTS.slice().sort((a, b) => a - b),
    []
  );
  const prefix = useMemo(
    () => (multiplier === 1 ? "" : multiplier === 2 ? "D" : "T"),
    [multiplier]
  );

  return (
    <>
      {isDoubleOut && <CheckoutSuggestion />}
      <div className="grid grid-cols-6 gap-1 w-full">
        {possibleValues.map((segment) => (
          <button
            key={segment}
            className="bg-slate-800 rounded-sm aspect-square text-white font-semibold text-base leading-0"
            onClick={() => {
              vibrate();
              saveThrow({
                scoredByPlayer: currentPlayer.id,
                throwValue: {
                  segment,
                  multiplier,
                },
              });
              setMultiplier(1);
            }}
          >
            {prefix}
            {segment}
          </button>
        ))}
        {multiplier === 1 ? (
          <button
            className="bg-slate-800 rounded-sm aspect-square text-white font-semibold text-base leading-0"
            onClick={() => {
              vibrate();
              saveThrow({
                scoredByPlayer: currentPlayer.id,
                throwValue: {
                  segment: "OUTER_BULL",
                },
              });
              setMultiplier(1);
            }}
          >
            25
          </button>
        ) : multiplier === 2 ? (
          <button
            key="bullseye"
            className="bg-slate-800 rounded-sm aspect-square text-white font-semibold text-base leading-0"
            onClick={() => {
              vibrate();
              saveThrow({
                scoredByPlayer: currentPlayer.id,
                throwValue: {
                  segment: "BULLSEYE",
                },
              });
              setMultiplier(1);
            }}
          >
            50
          </button>
        ) : (
          <div />
        )}
        <button
          className="bg-slate-800 rounded-sm aspect-square text-white font-semibold text-base leading-0"
          onClick={() => {
            vibrate();
            saveThrow({
              scoredByPlayer: currentPlayer.id,
              throwValue: "MISS",
            });
            setMultiplier(1);
          }}
        >
          0
        </button>
        <button
          className={cn(
            "rounded-sm transition-all aspect-square duration-200 text-white font-semibold text-base leading-0",
            multiplier === 2 ? "bg-purple-800" : "bg-yellow-600"
          )}
          onClick={() => {
            vibrate();
            if (multiplier === 2) {
              setMultiplier(1);
            } else {
              setMultiplier(2);
            }
          }}
        >
          x2
        </button>
        <button
          className={cn(
            "rounded-sm transition-all aspect-square  duration-200 text-white font-semibold text-base leading-0",
            multiplier === 3 ? "bg-purple-800" : "bg-amber-600"
          )}
          onClick={() => {
            vibrate();
            if (multiplier === 3) {
              setMultiplier(1);
            } else {
              setMultiplier(3);
            }
          }}
        >
          x3
        </button>
      </div>
    </>
  );
};

export default Keyboard;
