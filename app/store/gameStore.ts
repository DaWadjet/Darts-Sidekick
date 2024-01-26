"use client";

import { ThrowValue } from "@/app/lib/types";
import { useGameStore } from "@/app/store/GameProvider";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

function* idGenerator(brand: string) {
  let id = 1;
  while (true) {
    yield `${brand}-${id++}`;
  }
}

const playerIdGenerator = idGenerator("player");
const throwIdGenerator = idGenerator("throw");

type Player = {
  name: string;
  history: [ThrowResult, ThrowResult | null, ThrowResult | null][];
  id: string;
  legsWon: number;
  setsWon: number;
};

type ThrowResult = {
  scoredBy: Player;
  throwValue: ThrowValue;
  resultedInBust: boolean;
  id: string;
};

type TState = {
  startingPointAmount: 101 | 301 | 501 | 701 | 1001;
  endingStrategy: "DOUBLE_OUT" | "WIN_ON_ANY";
  players: Player[];
  savedResultsStack: ThrowResult[];
  redoResultsStack: ThrowResult[];
  legs: number;
  sets: number;
};

type TActions = {
  reset(): void;
  addPlayer(name: string): void;
  removePlayer(playerId: string): void;
  setStartingPointAmount(amount: TState["startingPointAmount"]): void;
  saveThrow(result: Omit<ThrowResult, "id" | "resultedInBust">): boolean;
  undoThrow(): void;
  redoThrow(): void;
  checkLegWinCondition(): boolean;
  persistGameStatistics(): void;
  saveThrowToPlayerHistory(throwResult: ThrowResult): void;
  undoThrowFromPlayerHistory(lastThrow: ThrowResult): void;
  getScoredPointsOfPlayer(playerId: string): number;
};

const initialState: TState = {
  startingPointAmount: 501,
  players: [],
  savedResultsStack: [],
  redoResultsStack: [],
  legs: 3,
  sets: 0,
  endingStrategy: "DOUBLE_OUT",
};

export const createGameStore = () =>
  create<TState & TActions>()(
    devtools(
      persist(
        immer((set, get) => ({
          ...initialState,
          reset: () => {
            set(
              (state) => {
                state = {
                  ...state,
                  ...initialState,
                  players: [],
                  savedResultsStack: [],
                  redoResultsStack: [],
                };
              },
              true,
              "reset"
            );
            localStorage.removeItem("Game Store");
          },

          addPlayer: (name) =>
            set(
              (state) => {
                const newId = playerIdGenerator.next();
                state.players.push({
                  id: newId.value!,
                  history: [],
                  name,
                  legsWon: 0,
                  setsWon: 0,
                });
              },
              false,
              "addPlayer"
            ),
          removePlayer: (playerId) =>
            set(
              (state) => {
                state.players = state.players.filter((p) => p.id !== playerId);
              },
              false,
              "removePlayer"
            ),
          setStartingPointAmount: (amount) => {
            set(
              (state) => {
                state.startingPointAmount = amount;
              },
              false,
              "setStartingPointAmount"
            );
          },
          saveThrow: (result) => {
            const newId = throwIdGenerator.next();
            const throwResult = {
              ...result,
              id: newId.value!,
              resultedInBust: false,
            };
            set((state) => {
              state.savedResultsStack.push(throwResult);
            });
            get().saveThrowToPlayerHistory(throwResult);
            return get().checkLegWinCondition();
          },
          undoThrow: () => {
            set(
              (state) => {
                const lastThrow = state.savedResultsStack.pop();
                if (lastThrow) {
                  state.redoResultsStack.push(lastThrow);
                  state.players
                    .find((p) => p.id === lastThrow.scoredBy.id)!
                    .history.pop();
                }
              },
              false,
              "undoThrow"
            );
          },
          redoThrow: () => {
            const lastThrow = get().redoResultsStack.pop();
            if (!lastThrow) return;
            set(
              (state) => {
                state.savedResultsStack.push(lastThrow);
              },
              false,
              "redoThrow"
            );
            get().saveThrowToPlayerHistory(lastThrow);
          },
          checkLegWinCondition: () => {
            const lastThrow =
              get().savedResultsStack[get().savedResultsStack.length - 1];
            if (!lastThrow || lastThrow.throwValue === "MISS") return false;

            const player = get().players.find(
              (p) => p.id === lastThrow.scoredBy.id
            )!;
            const scoredPoints = get().getScoredPointsOfPlayer(player.id);
            if (get().startingPointAmount - scoredPoints > 0) {
              return false;
            }

            if (get().startingPointAmount - scoredPoints < 0) {
              return false;
            }
            switch (get().endingStrategy) {
              case "DOUBLE_OUT":
                return (
                  lastThrow.throwValue.segment === "BULLSEYE" ||
                  ("multiplier" in lastThrow.throwValue &&
                    lastThrow.throwValue.multiplier === 2)
                );
              case "WIN_ON_ANY":
                return true;
            }
          },
          persistGameStatistics: () => {},

          saveThrowToPlayerHistory: (throwResult) => {
            const player = get().players.find(
              (p) => p.id === throwResult.scoredBy.id
            )!;
            const lastHistoryBatch = player.history.at(-1);
            if (!lastHistoryBatch || lastHistoryBatch.every(Boolean)) {
              set(
                (state) => {
                  state.players
                    .find((p) => p.id === throwResult.scoredBy.id)!
                    .history.push([throwResult, null, null]);
                },
                false,
                "saveThrowToPlayerHistory"
              );
              return;
            }
            const firstMissingThowIndex = lastHistoryBatch.indexOf(null);
            set(
              (state) => {
                state.players
                  .find((p) => p.id === throwResult.scoredBy.id)!
                  .history.at(-1)![firstMissingThowIndex] = throwResult;
              },
              false,
              "saveThrowToPlayerHistory"
            );
          },

          undoThrowFromPlayerHistory: (lastThrow) => {
            const player = get().players.find(
              (p) => p.id === lastThrow.scoredBy.id
            )!;
            const lastHistoryBatch = player.history.at(-1);
            if (!lastHistoryBatch) return;

            if (lastHistoryBatch[0].id === lastThrow.id) {
              set(
                (state) => {
                  const history = state.players.find(
                    (p) => p.id === lastThrow.scoredBy.id
                  )!.history;
                  history.pop();
                },
                false,
                "undoThrowFromPlayerHistory"
              );
              return;
            } else {
              set(
                (state) => {
                  const history = state.players.find(
                    (p) => p.id === lastThrow.scoredBy.id
                  )!.history;
                  const lastItemInHistory = history.at(-1)!;
                  const index = lastItemInHistory.findIndex(
                    (t) => t?.id === lastThrow.id
                  );
                  lastItemInHistory[index] = null;
                },
                false,
                "undoThrowFromPlayerHistory"
              );
              return;
            }
          },
          getScoredPointsOfPlayer: (playerId) => {
            return get()
              .players.find((p) => p.id === playerId)!
              .history.reduce(
                (acc, batch) =>
                  acc +
                  batch.reduce((batchAcc, item) => {
                    if (!item || item.resultedInBust) return batchAcc;
                    return batchAcc + getPointsScoredWithThrow(item.throwValue);
                  }, 0),
                0
              );
          },
        })),
        { name: "Game Store" }
      ),
      {
        name: "Game Store",
        trace: true,
        log: true,
      }
    )
  );

const getPointsScoredWithThrow = (throwResult: ThrowValue) => {
  if (throwResult === "MISS") {
    return 0;
  } else if (throwResult.segment === "OUTER_BULL") {
    return 25;
  } else if (throwResult.segment === "BULLSEYE") {
    return 50;
  } else {
    if ("multiplier" in throwResult)
      return throwResult.segment * throwResult.multiplier;
  }
  return 0;
};
