"use client";

import { selectPointerAbsorbAtom } from "@/app/lib/atoms";
import AddPlayerSheet from "@/app/lib/components/AddPlayerSheet";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  useCanStartGame,
  useGameActions,
  usePlayers,
} from "@/store/GameProvider";
import { useAtomValue, useStore } from "jotai";
import { FC, useEffect, useRef } from "react";
import { useDebounce, usePrevious, useToggle } from "react-use";

const PlayersList: FC = () => {
  const store = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const players = usePlayers();
  const actions = useGameActions();
  const canStartGame = useCanStartGame();
  const [pointerEventsDebounced, togglePointerEventsDebounced] =
    useToggle(false);
  const isSelectOpen = useAtomValue(selectPointerAbsorbAtom, { store });
  useDebounce(
    () => {
      togglePointerEventsDebounced(isSelectOpen);
    },
    50,
    [isSelectOpen]
  );

  const previousPlayersLength = usePrevious(players.length);
  useEffect(() => {
    if (players.length > (previousPlayersLength ?? 0))
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [players.length, previousPlayersLength]);

  return (
    <div
      className={cn(
        "h-full min-h-0 flex flex-col justify-end gap-2",
        pointerEventsDebounced ? "pointer-events-none" : "pointer-events-auto"
      )}
    >
      <h2 className="font-semibold text-xl">Players</h2>
      {!players.length ? (
        <div className="flex flex-grow items-center justify-center h-full">
          No players added yet
        </div>
      ) : (
        <ScrollArea className="flex flex-col w-full gap-4 h-full overflow-y-aut0">
          {players.map((player, idx, list) => (
            <div key={player.id} className="flex flex-col gap-1.5 w-full px-2">
              <div className="gap-1 w-full items-center justify-between flex pt-1.5">
                <h3 className="font-semibold">{player.name}</h3>
                <Button
                  variant="ghost"
                  className="text-red-500 pr-2 hover:text-red-300 hover:dark:text-red-300 text-xs hover:bg-transparent hover:dark:bg-transparent"
                  onClick={() => actions.removePlayer(player.id)}
                >
                  Remove
                </Button>
              </div>
              {idx !== list.length - 1 && <Separator />}
            </div>
          ))}
          <ScrollBar />
          <div ref={scrollRef} />
        </ScrollArea>
      )}
      <AddPlayerSheet />
      <div className="flex items-center justify-between w-full pt-2">
        <Button variant="destructive" onClick={actions.reset}>
          Reset
        </Button>
        <Button disabled={!canStartGame} onClick={actions.startGame}>
          Start
        </Button>
      </div>
    </div>
  );
};

export default PlayersList;
