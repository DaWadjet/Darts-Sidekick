"use client";
import Keyboard from "@/app/lib/components/Keyboard";
import PlayerDisplay from "@/app/lib/components/PlayerDisplay";
import {
  useCurrentPlayer,
  useGameActions,
  useGameStore,
  usePlayers,
} from "@/store/GameProvider";
import { FC, useCallback } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  LEGS_POSSIBILITIES,
  SETS_POSSIBILITIES,
  STARTING_POINT_POSSIBILITIES,
} from "@/app/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import AddPlayerDrawer from "@/app/lib/components/AddPlayerDrawer";
import AddPlayerSheet from "@/app/lib/components/AddPlayerSheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ScrollArea, Scrollbar } from "@radix-ui/react-scroll-area";
import { useDebounce, useToggle } from "react-use";

const Game: FC = () => {
  const [pointerEventsDebounced, togglePointerEventsDebounced] =
    useToggle(false);
  const [isSelectOpen, toggleSelectOpen] = useToggle(false);
  useDebounce(
    () => {
      togglePointerEventsDebounced(isSelectOpen);
    },
    50,
    [isSelectOpen]
  );

  const actions = useGameActions();
  const startingPointAmount = useGameStore()(
    useCallback((store) => store.startingPointAmount, [])
  );
  const legs = useGameStore()(useCallback((store) => store.legs, []));
  const endingStrategy = useGameStore()(
    useCallback((store) => store.endingStrategy, [])
  );
  const sets = useGameStore()(useCallback((store) => store.sets, []));
  const hasGameStarted = useGameStore()(
    useCallback((store) => store.hasGameStarted, [])
  );
  const currentPlayer = useCurrentPlayer();
  const players = usePlayers();

  return (
    <main className="flex h-[100svh] flex-col mx-auto items-center gap-6 justify-center container p-3">
      <h1 className="text-5xl font-extrabold text-white">Darts</h1>
      {hasGameStarted ? (
        <>
          <ScrollArea className="w-full">
            {players.map((player) => (
              <PlayerDisplay
                player={player}
                key={player.id}
                isCurrentPlayer={currentPlayer?.id === player.id}
              />
            ))}
            <Scrollbar orientation="vertical" />
          </ScrollArea>
          <Keyboard />
        </>
      ) : (
        <div className="flex flex-col gap-4 w-full px-4">
          <h2 className="text-xl font-bold">Game setup</h2>
          <div className="grid grid-cols-2 gap-4 place-items-center">
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="startingScore">Starting score</Label>
              <Select
                onOpenChange={toggleSelectOpen}
                name="startingScore"
                value={startingPointAmount.toString()}
                onValueChange={(newValue) =>
                  //@ts-ignore
                  actions.setStartingPointAmount(parseInt(newValue))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Starting Score" />
                </SelectTrigger>
                <SelectContent>
                  {STARTING_POINT_POSSIBILITIES.map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="endingStrategy">Ending strategy</Label>
              <Select
                onOpenChange={toggleSelectOpen}
                name="endingStrategy"
                value={endingStrategy}
                onValueChange={actions.setEndingStrategy}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ending Strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOUBLE_OUT">Double out</SelectItem>
                  <SelectItem value="WIN_ON_ANY">Any out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="sets">Best of ...</Label>
              <Select
                onOpenChange={toggleSelectOpen}
                name="sets"
                value={sets.toString()}
                onValueChange={(newValue) =>
                  //@ts-ignore
                  actions.setSets(parseInt(newValue))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sets" />
                </SelectTrigger>
                <SelectContent>
                  {SETS_POSSIBILITIES.map((value) => (
                    <SelectItem key={value} value={value.toString()}>
                      {value === 1 ? "Matchplay" : `${value} sets`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 w-full text-base">
              <Label htmlFor="legs">Best of ...</Label>
              <Select
                onOpenChange={toggleSelectOpen}
                name="legs"
                value={legs.toString()}
                onValueChange={(newValue) =>
                  //@ts-ignore
                  actions.setLegs(parseInt(newValue))
                }
              >
                <SelectTrigger className="w-full text-base">
                  <SelectValue placeholder="Legs" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {LEGS_POSSIBILITIES.map((value) => (
                    <SelectItem
                      key={value}
                      value={value.toString()}
                      className="text-base"
                    >
                      {value === 1 ? "1 leg" : `${value} legs`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {players.map((player) => (
            <div key={player.id} className="flex flex-col gap-2 w-full">
              <div className="gap-1 w-full items-center justify-between flex">
                <h3 className="text-lg font-semibold">{player.name}</h3>
                <Button
                  variant="destructive"
                  onClick={() => actions.removePlayer(player.id)}
                >
                  Remove
                </Button>
              </div>
              <Separator />
            </div>
          ))}
          <div
            className={cn(
              "flex flex-col gap-2 w-full ",
              pointerEventsDebounced
                ? "pointer-events-none"
                : "pointer-events-auto"
            )}
          >
            <AddPlayerSheet side="bottom" />
            <AddPlayerSheet side="top" />
            <AddPlayerDrawer />
          </div>

          {!players.length && <div>No players added yet</div>}

          {/* TODO: fix hover behavior */}
          <div className="flex items-center justify-between w-full">
            <Button variant="destructive" onClick={actions.reset}>
              Reset
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={!players.length}
                    onClick={actions.startGame}
                  >
                    Start
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add players first</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
    </main>
  );
};
export default Game;
