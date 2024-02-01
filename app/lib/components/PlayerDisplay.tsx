"use client";

import { BatchOfThrows, Player } from "@/app/lib/types";
import { getPointsScoredInBatch, throwValueToString } from "@/app/lib/utils";
import { cn } from "@/lib/utils";
import { useThrowCount } from "@/store/GameProvider";
import { FC, useEffect, useMemo, useRef } from "react";

const PlayerDisplay: FC<{
  player: Player & { remainingScore: number };
  isCurrentPlayer: boolean;
}> = ({ player, isCurrentPlayer }) => {
  const throwCount = useThrowCount();
  const divRef = useRef<HTMLDivElement>(null);
  const currentBatch = useMemo<BatchOfThrows>(
    () =>
      player.history.length
        ? player.history[player.history.length - 1]
        : {
            throw1: null,
            throw2: null,
            throw3: null,
            id: "dummybatch",
            busted: false,
          },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [player.history, throwCount]
  );
  useEffect(() => {
    if (isCurrentPlayer) {
      divRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  }, [isCurrentPlayer]);

  const pointsScoredInBatch = useMemo(
    () => getPointsScoredInBatch(currentBatch),
    [currentBatch]
  );

  return (
    <div
      className="p-2 my-2 pl-4 overflow-clip relative flex flex-row items-start h-24 w-full shrink-0 bg-slate-800 gap-1 rounded-sm shadow-sm"
      ref={divRef}
    >
      <div
        className={cn(
          "absolute top-0 bottom-0 left-0 transition-all duration-100 w-2.5",
          isCurrentPlayer ? "bg-green-500" : "bg-slate-800"
        )}
      />
      <div className="flex flex-col justify-between items-center flex-1 h-full">
        <h2
          className={cn(
            "text-white h-9 transition-all duration-150 font-extrabold leading-none",
            player.remainingScore > 999 ? "text-3xl" : "text-4xl"
          )}
        >
          {player.remainingScore}
        </h2>

        <h3 className="px-1 text-slate-500 min-w-0 break-words whitespace-pre-wrap break-all flex items-center justify-center h-10 leading-5 line-clamp-2 text-center text-ellipsis">
          {player.name}
        </h3>
      </div>
      <div className="flex flex-col gap-3 flex-1 justify-start items-center">
        <div className="flex gap-1 items-center justify-center">
          <div className="rounded-md text-base bg-slate-900 shadow-inner size-9 grow-0 flex items-center justify-center text-white font-semibold leading-none">
            {throwValueToString(currentBatch.throw1?.throwValue ?? null)}
          </div>
          <div className="rounded-md text-base bg-slate-900 shadow-inner size-9 grow-0 flex items-center justify-center text-white font-semibold leading-none">
            {throwValueToString(currentBatch.throw2?.throwValue ?? null)}
          </div>
          <div className="rounded-md text-base bg-slate-900 shadow-inner size-9 grow-0 flex items-center justify-center text-white font-semibold leading-none">
            {throwValueToString(currentBatch.throw3?.throwValue ?? null)}
          </div>
        </div>
        <p className="text-slate-500 text-xl font-extrabold">
          {pointsScoredInBatch}
        </p>
      </div>
      <div className="flex flex-col justify-between items-center gap-2 flex-1 text-slate-500 text-base font-normal">
        <p>sets legs</p>
        <p>darts used</p>
        <p>average</p>
      </div>
    </div>
  );
};

export default PlayerDisplay;
