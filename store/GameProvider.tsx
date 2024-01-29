"use client";

import { createGameStore } from "@/store/gameStore";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const GameContext = createContext<ReturnType<typeof createGameStore> | null>(
  null
);

export const useGameStore = () => {
  if (!GameContext)
    throw new Error("the store must be used within a GameProvider");
  return useContext(GameContext)!;
};

export const useThrowCount = () =>
  useGameStore()(useCallback((store) => store.savedResultsStack.length, []));

export const useCanStartGame = () =>
  useGameStore()(useCallback((store) => Boolean(store.players.length), []));

export const useGameActions = () =>
  useGameStore()(useCallback((store) => store.actions, []));

export const usePlayers = () => {
  const players = useGameStore()(useCallback((store) => store.players, []));
  const startingPointAmount = useGameStore()(
    useCallback((store) => store.startingPointAmount, [])
  );
  const amountOfThrows = useThrowCount();

  const getPlayerScore = useGameActions().getScoredPointsOfPlayer;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [players, getPlayerScore, startingPointAmount, amountOfThrows]
  );
};

export const useCurrentPlayer = () => {
  const players = usePlayers();
  const playerIndex = useGameStore()(
    useCallback((store) => store.currentPlayerIndex, [])
  );

  return players[playerIndex];
};

export const useCanRedo = () =>
  useGameStore()(
    useCallback((store) => Boolean(store.redoResultsStack.length), [])
  );
export const useCanUndo = () =>
  useGameStore()(
    useCallback((store) => Boolean(store.savedResultsStack.length), [])
  );

const GameProvider: FC<PropsWithChildren> = ({ children }) => {
  const [store] = useState(() => createGameStore());
  return <GameContext.Provider value={store}>{children}</GameContext.Provider>;
};

export default GameProvider;
