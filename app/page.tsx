"use client";

import { useGameStore } from "@/store/GameProvider";
import { FC, useCallback } from "react";

import GameStarterForm from "@/app/lib/components/GameStarterForm";

const Game: FC = () => {
  const hasGameStarted = useGameStore()(
    useCallback((store) => store.hasGameStarted, [])
  );
  return (
    <main className="flex h-[100svh] flex-col mx-auto items-center gap-10 container p-3">
      {hasGameStarted ? <Game /> : <GameStarterForm />}
    </main>
  );
};
export default Game;
