"use client";

import Keyboard from "@/app/lib/components/Keyboard";
import PlayerDisplay from "@/app/lib/components/PlayerDisplay";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useCurrentPlayer, usePlayers } from "@/store/GameProvider";
import { FC } from "react";

const Game: FC = () => {
  const currentPlayer = useCurrentPlayer();
  const players = usePlayers();
  return (
    <>
      <ScrollArea className="w-full">
        {players.map((player) => (
          <PlayerDisplay
            player={player}
            key={player.id}
            isCurrentPlayer={currentPlayer?.id === player.id}
          />
        ))}
        <ScrollBar />
      </ScrollArea>
      <Keyboard />
    </>
  );
};

export default Game;
