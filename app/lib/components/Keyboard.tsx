"use client";

import { Multiplier, SEGMENTS } from "@/app/lib/types";
import { cn } from "@/lib/utils";
import {
  useCanRedo,
  useCanUndo,
  useCurrentPlayer,
  useGameActions,
} from "@/store/GameProvider";
import { FC, useCallback, useMemo, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Keyboard: FC = () => {
  const actions = useGameActions();
  const [multiplier, setMultiplier] = useState<Multiplier>(1);
  const canRedo = useCanRedo();
  const canUndo = useCanUndo();
  const possibleValues = useMemo(
    () => SEGMENTS.slice().sort((a, b) => a - b),
    []
  );
  const prefix = useMemo(
    () => (multiplier === 1 ? "" : multiplier === 2 ? "D" : "T"),
    [multiplier]
  );
  const currentPlayer = useCurrentPlayer();

  const vibrate = useCallback(() => {
    if (typeof window !== "undefined" && "vibrate" in window.navigator) {
      window.navigator.vibrate(100);
    }
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1">
        {possibleValues.map((segment) => (
          <button
            key={segment}
            className="bg-slate-800 rounded-sm aspect-square text-white font-semibold text-base leading-0"
            onClick={() => {
              vibrate();
              actions.saveThrow({
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
              actions.saveThrow({
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
              actions.saveThrow({
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
            actions.saveThrow({
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
        <button
          disabled={!canUndo}
          className="bg-orange-700 rounded-sm aspect-square text-white font-semibold transition-all duration-200 text-base leading-0 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            vibrate();
            actions.undoThrow();
          }}
        >
          Undo
        </button>
        {canRedo ? (
          <button
            className="bg-green-700 rounded-sm aspect-square text-white font-semibold transition-all duration-200 text-base leading-0"
            onClick={() => {
              vibrate();
              actions.redoThrow();
            }}
          >
            Redo
          </button>
        ) : (
          <div />
        )}
        <div />
        <AlertDialog>
          <AlertDialogTrigger
            className="bg-red-800 rounded-sm aspect-square text-white font-semibold text-base leading-0"
            onClick={vibrate}
          >
            Reset
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will remove all players and all throws. Do you want
                to continue?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  vibrate();
                  actions.reset();
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Keyboard;
