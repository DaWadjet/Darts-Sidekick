import { clsxm } from "@/app/lib/clsxm";
import { Multiplier, SEGMENTS } from "@/app/lib/types";
import {
  useCanRedo,
  useCanUndo,
  useCurrentPlayer,
  useGameActions,
} from "@/app/store/GameProvider";
import { FC, useMemo, useState } from "react";

const Keyboard: FC = () => {
  const actions = useGameActions();
  const [multiplier, setMultiplier] = useState<Multiplier>(1);
  const canRedo = useCanRedo();
  const canUndo = useCanUndo();
  const possibleValues = useMemo(
    () => SEGMENTS.slice().sort((a, b) => a - b),
    [SEGMENTS]
  );
  const prefix = useMemo(
    () => (multiplier === 1 ? "" : multiplier === 2 ? "D" : "T"),
    [multiplier]
  );
  const currentPlayer = useCurrentPlayer();

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1">
        {possibleValues.map((segment) => (
          <button
            key={segment}
            className="bg-slate-800 rounded-sm aspect-square text-white font-semibold text-base leading-0"
            onClick={() => {
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
          className={clsxm(
            "rounded-sm transition-all aspect-square duration-200 text-white font-semibold text-base leading-0",
            multiplier === 2 ? "bg-purple-800" : "bg-yellow-600"
          )}
          onClick={() => {
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
          className={clsxm(
            "rounded-sm transition-all aspect-square  duration-200 text-white font-semibold text-base leading-0",
            multiplier === 3 ? "bg-purple-800" : "bg-amber-600"
          )}
          onClick={() => {
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
          onClick={actions.undoThrow}
        >
          Undo
        </button>
        {canRedo ? (
          <button
            className="bg-green-700 rounded-sm aspect-square text-white font-semibold transition-all duration-200 text-base leading-0"
            onClick={actions.redoThrow}
          >
            Redo
          </button>
        ) : (
          <div />
        )}
        <div />

        <button
          className="bg-red-800 rounded-sm aspect-square text-white font-semibold text-base leading-0"
          onClick={actions.reset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
