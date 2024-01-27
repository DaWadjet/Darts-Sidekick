import { clsxm } from "@/app/lib/clsxm";
import { getPointsScoredWithThrow, throwValueToString } from "@/app/lib/utils";
import { Player } from "@/app/store/gameStore";
import { FC, useMemo } from "react";

const PlayerDisplay: FC<{
  player: Player & { remainingScore: number };
  isCurrentPlayer: boolean;
}> = ({ player, isCurrentPlayer }) => {
  const currentBatch = useMemo(
    () =>
      player.history.length
        ? player.history[player.history.length - 1]
        : [null, null, null],
    [
      player.history.flatMap(
        (batch) => batch.map((throwResult) => throwResult).length
      ),
    ]
  );

  const pointsScoredInBatch = useMemo(
    () =>
      currentBatch.reduce(
        (acc, curr) =>
          acc +
          (curr?.throwValue ? getPointsScoredWithThrow(curr.throwValue) : 0),
        0
      ),
    [currentBatch]
  );

  return (
    <div className="p-2 pl-4 overflow-clip relative flex flex-row items-start h-24 w-full bg-slate-800 gap-1 rounded-sm shadow-sm">
      <div
        className={clsxm(
          "absolute top-0 bottom-0 left-0 transition-all duration-200 w-3",
          isCurrentPlayer ? "bg-green-500" : "bg-slate-800"
        )}
      />
      <div className="flex flex-col justify-around items-center flex-1 h-full">
        <h2 className="text-white text-4xl font-extrabold leading-none">
          {player.remainingScore}
        </h2>
        <h3 className="text-slate-500 text-sm leading-4 min-w-0 line-clamp-2 text-center text-ellipsis">
          {player.name}
        </h3>
      </div>
      <div className="flex flex-col gap-3 flex-1 justify-start items-center">
        <div className="flex gap-0.5 items-center justify-center">
          {currentBatch.map((throwResult, index) => (
            <div
              className="rounded-md text-sm bg-slate-900 shadow-inner size-9 grow-0 flex items-center justify-center text-white font-semibold leading-none"
              key={`${index}-${player.id}`}
            >
              {throwValueToString(throwResult?.throwValue ?? null)}
            </div>
          ))}
        </div>
        <p className="text-slate-500 text-xl font-extrabold">
          {pointsScoredInBatch}
        </p>
      </div>
      <div className="flex flex-col justify-between items-center gap-2 flex-1 text-slate-500 text-sm font-normal">
        <p>sets legs</p>
        <p>darts used</p>
        <p>average</p>
      </div>
    </div>
  );
};

export default PlayerDisplay;
