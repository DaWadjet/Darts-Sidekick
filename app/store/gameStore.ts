import { ThrowValue } from "@/app/lib/types";
import { getPointsScoredWithThrow } from "@/app/lib/utils";
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

export type Player = {
  name: string;
  history: [ThrowResult, ThrowResult | null, ThrowResult | null][];
  id: string;
  legsWon: number;
  setsWon: number;
};

type ThrowResult = {
  scoredByPlayer: string;
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
  hasGameStarted: boolean;
};

type TActions = {
  reset(): void;
  startGame(): void;
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
  hasGameStarted: false,
};

export const createGameStore = () =>
  create<TState & { actions: TActions }>()(
    devtools(
      persist(
        immer((set, get) => ({
          ...initialState,
          actions: {
            reset: () => {
              set(() => initialState, false, "reset");
              localStorage.removeItem("Game Store");
            },
            startGame: () => {
              set(
                (state) => {
                  state.hasGameStarted = true;
                },
                false,
                "startGame"
              );
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
                  state.players = state.players.filter(
                    (p) => p.id !== playerId
                  );
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
              get().actions.saveThrowToPlayerHistory(throwResult);
              return get().actions.checkLegWinCondition();
            },
            undoThrow: () => {
              const lastThrow = get().savedResultsStack.at(-1);
              if (!lastThrow) return;
              set(
                (state) => {
                  state.savedResultsStack.pop();
                  if (lastThrow) {
                    state.redoResultsStack.push(lastThrow);
                  }
                },
                false,
                "undoThrow"
              );
              get().actions.undoThrowFromPlayerHistory(lastThrow);
            },
            redoThrow: () => {
              const lastThrow = get().redoResultsStack.at(-1);
              if (!lastThrow) return;

              set(
                (state) => {
                  state.redoResultsStack.pop();
                  state.savedResultsStack.push(lastThrow);
                },
                false,
                "redoThrow"
              );
              get().actions.saveThrowToPlayerHistory(lastThrow);
            },
            checkLegWinCondition: () => {
              const lastThrow =
                get().savedResultsStack[get().savedResultsStack.length - 1];
              if (!lastThrow || lastThrow.throwValue === "MISS") return false;

              const player = get().players.find(
                (p) => p.id === lastThrow.scoredByPlayer
              )!;
              const scoredPoints = get().actions.getScoredPointsOfPlayer(
                player.id
              );
              if (get().startingPointAmount - scoredPoints > 0) {
                return false;
              }

              if (get().startingPointAmount - scoredPoints < 0) {
                //TODO mark throws as bust
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
                (p) => p.id === throwResult.scoredByPlayer
              )!;
              const lastHistoryBatch = player.history.at(-1);
              if (!lastHistoryBatch || lastHistoryBatch.every(Boolean)) {
                set(
                  (state) => {
                    state.players
                      .find((p) => p.id === throwResult.scoredByPlayer)!
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
                    .find((p) => p.id === throwResult.scoredByPlayer)!
                    .history.at(-1)![firstMissingThowIndex] = throwResult;
                },
                false,
                "saveThrowToPlayerHistory"
              );
            },

            undoThrowFromPlayerHistory: (lastThrow) => {
              const player = get().players.find(
                (p) => p.id === lastThrow.scoredByPlayer
              )!;
              const lastHistoryBatch = player.history.at(-1);
              if (!lastHistoryBatch) return;

              if (lastHistoryBatch[0].id === lastThrow.id) {
                set(
                  (state) => {
                    state.players
                      .find((p) => p.id === lastThrow.scoredByPlayer)!
                      .history.pop();
                  },
                  true,
                  "undoThrowFromPlayerHistory"
                );
                return;
              } else {
                set(
                  (state) => {
                    const history = state.players.find(
                      (p) => p.id === lastThrow.scoredByPlayer
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
                      return (
                        batchAcc + getPointsScoredWithThrow(item.throwValue)
                      );
                    }, 0),
                  0
                );
            },
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
