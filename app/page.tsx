"use client";
import Keyboard from "@/app/lib/components/Keyboard";
import PlayerDisplay from "@/app/lib/components/PlayerDisplay";
import {
  useCurrentPlayer,
  useGameActions,
  useGameStore,
  usePlayers,
} from "@/app/store/GameProvider";
import { FC, useCallback } from "react";

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
    actions.addPlayer("Player 4");
    actions.addPlayer("Player 5");
    actions.setStartingPointAmount(701);
    actions.startGame();
    //@react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex h-[100svh] flex-col mx-auto items-center gap-6 justify-center container p-3">
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
          <h1 className="text-white font-bold text-3xl">Disclaimer</h1>
          <h2 className="text-center text-2xl font-bold text-slate-600">
            This project is still actively under development. I use it to learn
            Next.js-related patterns and in the meantime create something
            useful.
          </h2>
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
