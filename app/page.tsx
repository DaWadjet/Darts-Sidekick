"use client";
import Keyboard from "@/app/lib/components/Keyboard";
import PlayerDisplay from "@/app/lib/components/PlayerDisplay";
import { Multiplier, SEGMENTS } from "@/app/lib/types";
import {
  useCurrentPlayer,
  useGameActions,
  useGameStore,
  usePlayers,
} from "@/app/store/GameProvider";
import { FC, useCallback, useMemo, useState } from "react";

const Game: FC = () => {
  const actions = useGameActions();
  const hasGameStarted = useGameStore()(
    useCallback((store) => store.hasGameStarted, [])
  );
  const currentPlayer = useCurrentPlayer();
  const players = usePlayers();

  const setupDummyGame = useCallback(() => {
    actions.addPlayer("Player 1");
    actions.addPlayer("Player 2");
    actions.addPlayer("Player 3");

    actions.setStartingPointAmount(701);
    actions.startGame();
    //@react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-black items-center gap-6 justify-center container p-3">
      <h1 className="text-5xl font-extrabold text-white">Darts</h1>
      {hasGameStarted ? (
        <>
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
        <>
          <button
            key="reset"
            className="h-10 px-3 bg-gray-500 rounded-md shadow-md"
            onClick={actions.reset}
          >
            Reset
          </button>
          <button
            key="start"
            className="h-10 px-3 bg-gray-500 rounded-md shadow-md"
            onClick={setupDummyGame}
          >
            Start
          </button>
        </>
      )}
    </main>
  );
};
export default Game;
