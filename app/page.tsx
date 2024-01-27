"use client";
import Keyboard from "@/app/lib/components/Keyboard";
import PlayerDisplay from "@/app/lib/components/PlayerDisplay";
import {
  useCurrentPlayer,
  useGameActions,
  useGameStore,
  usePlayers,
} from "@/store/GameProvider";
import { FC, useCallback, useRef } from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Game: FC = () => {
  const newPlayerInputRef = useRef<HTMLInputElement>(null);
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

  const setupDummyGame = useCallback(() => {
    actions.addPlayer("Player 1");
    actions.addPlayer("Player 2");
    actions.addPlayer("Player 3");
    actions.addPlayer("Player 4");
    actions.addPlayer("Player 5");
    actions.setStartingPointAmount(701);
    actions.startGame();
    //@react-hooks/exhaustive-deps
  }, [actions]);

  return (
    <main className="flex h-[100svh] flex-col mx-auto items-center gap-6 justify-center container p-3">
      <h1 className="text-5xl font-extrabold text-white">Darts</h1>
      {hasGameStarted ? (
        <>
          {/* TODO: change to scrollarea */}
          <div className="flex flex-col w-full gap-2 overflow-y-auto">
            {players.map((player) => (
              <PlayerDisplay
                player={player}
                key={player.id}
                isCurrentPlayer={currentPlayer?.id === player.id}
              />
            ))}
          </div>
          <Keyboard />
        </>
      ) : (
        <div className="flex flex-col gap-4 w-full px-4">
          <h2 className="text-xl font-bold">Game setup</h2>
          <div className="grid grid-cols-2 gap-4 place-items-center">
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="startingScore">Starting score</Label>
              <Select
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
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="legs">Best of ...</Label>
              <Select
                name="legs"
                value={legs.toString()}
                onValueChange={(newValue) =>
                  //@ts-ignore
                  actions.setLegs(parseInt(newValue))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Legs" />
                </SelectTrigger>
                <SelectContent>
                  {LEGS_POSSIBILITIES.map((value) => (
                    <SelectItem key={value} value={value.toString()}>
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
          <Sheet>
            <SheetTrigger asChild>
              <Button>Add player</Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="flex flex-col gap-5 border-slate-600 rounded-t-md shadow-md"
            >
              <SheetHeader>
                <SheetTitle>Add new player</SheetTitle>
              </SheetHeader>
              <Input placeholder="Player name" ref={newPlayerInputRef} />

              <SheetFooter>
                <SheetClose asChild>
                  <Button
                    type="button"
                    className="self-end"
                    onClick={() =>
                      // TODO: add validation
                      newPlayerInputRef.current &&
                      actions.addPlayer(newPlayerInputRef.current.value)
                    }
                  >
                    Add
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

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
