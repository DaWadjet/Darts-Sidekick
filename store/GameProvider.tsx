"use client";

import { BatchOfThrows } from "@/app/lib/types";
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

export const useCurrentBatch = () => {
  const throwCount = useThrowCount();
  const currentPlayer = useCurrentPlayer();
  const currentBatch = useMemo<BatchOfThrows>(
    () =>
      currentPlayer.history.length
        ? currentPlayer.history[currentPlayer.history.length - 1]
        : {
            throw1: null,
            throw2: null,
            throw3: null,
            id: "dummybatch",
            busted: false,
          },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPlayer.history, throwCount]
  );
  return currentBatch;
};

export const useRemainingThrows = () => {
  const currentBatch = useCurrentBatch();
  return useMemo(
    () =>
      (3 -
        (currentBatch.throw1 ? 1 : 0) -
        (currentBatch.throw2 ? 1 : 0) -
        (currentBatch.throw3 ? 1 : 0)) as 1 | 2 | 3 | 0,
    [currentBatch]
  );
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
