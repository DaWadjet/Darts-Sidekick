"use client";

import { createGameStore } from "@/app/store/gameStore";
import {
  useState,
  createContext,
  useContext,
  PropsWithChildren,
  FC,
  useCallback,
  useMemo,
} from "react";

const GameContext = createContext<ReturnType<typeof createGameStore> | null>(
  null
);

export const useGameStore = () => {
  if (!GameContext)
    throw new Error("the store must be used within a GameProvider");
  return useContext(GameContext)!;
};

export const usePlayers = () => {
  const players = useGameStore()(useCallback((store) => store.players, []));
  const startingPointAmount = useGameStore()(
    useCallback((store) => store.startingPointAmount, [])
  );
  const getPlayerScore = useGameStore()(
    useCallback((store) => store.getScoredPointsOfPlayer, [])
  );
  return useMemo(
    () =>
      players.map((player) => {
        const score = getPlayerScore(player.id);
        const remainingScore = startingPointAmount - score;
        return {
          ...player,
          score,
          remainingScore,
        };
      }),
    [players, getPlayerScore]
  );
};

export const useCurrentPlayer = () => {
  const players = usePlayers();
  const throwHistory = useGameStore()(
    useCallback((store) => store.savedResultsStack, [])
  );
  const playerToThrow = useMemo(() => {
    if (throwHistory.length < 3) return players[0];
    const lastThrowPlayer = throwHistory[throwHistory.length - 1].scoredBy.id;
    const thirdLastThrow = throwHistory[throwHistory.length - 3].scoredBy.id;
    if (lastThrowPlayer === thirdLastThrow) {
      const lastPlayer = players.find(
        (player) => player.id === lastThrowPlayer
      )!;
      const playerIndex = players.indexOf(lastPlayer);
      return players[(playerIndex + 1) % players.length];
    }
    return players.find((player) => player.id === lastThrowPlayer)!;
  }, [throwHistory.length, players.length]);

  return playerToThrow;
};

const GameProvider: FC<PropsWithChildren> = ({ children }) => {
  const [store] = useState(() => createGameStore());
  return <GameContext.Provider value={store}>{children}</GameContext.Provider>;
};

export default GameProvider;
