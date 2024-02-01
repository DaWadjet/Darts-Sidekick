"use client";

import GameHeader from "@/app/lib/components/GameHeader";
import Keyboard from "@/app/lib/components/Keyboard";
import PlayerDisplay from "@/app/lib/components/PlayerDisplay";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useCurrentPlayer, usePlayers } from "@/store/GameProvider";
import { FC } from "react";

const Game: FC = () => {
  const currentPlayer = useCurrentPlayer();
  const players = usePlayers();
  return (
    <div className="flex flex-col w-full gap-4 min-h-0 h-full">
      <GameHeader />
      <ScrollArea className="w-full h-full min-h-0">
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
    </div>
  );
};

export default Game;
