import {
  BatchOfThrows,
  Ending,
  GameState,
  LegsAmount,
  SetsAmount,
  StartingPointAmount,
  ThrowResult,
} from "@/app/lib/types";
import { getPointsScoredInBatch } from "@/app/lib/utils";
import { toast } from "sonner";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

function* idGenerator(brand: string) {
  let id = 1;
  while (true) {
    yield `${brand}-${id++}`;
  }
}

const playerIdGenerator = idGenerator("player");
const throwIdGenerator = idGenerator("throw");
const batchOfThrowsIdGenerator = idGenerator("batchOfThrows");

type GameActions = {
  reset(): void;
  startGame(): void;
  addPlayer(name: string): void;
  removePlayer(playerId: string): void;
  setEndingStrategy(strategy: Ending): void;
  setLegs(legs: LegsAmount): void;
  setSets(sets: SetsAmount): void;
  setStartingPointAmount(amount: StartingPointAmount): void;
  saveThrow(result: Omit<ThrowResult, "id" | "resultedInBust">): boolean;
  undoThrow(): void;
  redoThrow(): void;
  checkLegWinCondition(): boolean;
  saveThrowToPlayerHistory(throwResult: ThrowResult): void;
  undoThrowFromPlayerHistory(): void;
  getScoredPointsOfPlayer(playerId: string): number;
};

const initialState: GameState = {
  startingPointAmount: 501,
  players: [],
  savedResultsStack: [],
  redoResultsStack: [],
  legs: 3,
  sets: 1,
  endingStrategy: "DOUBLE_OUT",
  hasGameStarted: false,
  currentPlayerIndex: 0,
};

export const createGameStore = () =>
  create<GameState & { actions: GameActions }>()(
    immer(
      // persist( //TODO re-enable middleware after the store's development is finished
      devtools(
        (set, get) => ({
          ...initialState,
          actions: {
            reset: () => {
              set(() => initialState, false, "reset");
              localStorage.removeItem("Game Store");
            },
            startGame: () => {
              if (!get().players.length) return;
              toast("Game Started", {
                duration: 5000,
                position: "bottom-right",
                dismissible: true,
              });
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
                    name,
                    history: [],
                    id: newId.value!,
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
              };
              set(
                (state) => {
                  state.savedResultsStack.push(throwResult);
                  state.redoResultsStack = [];
                },
                false,
                "saveThrow"
              );

              get().actions.saveThrowToPlayerHistory(throwResult);
              return get().actions.checkLegWinCondition();
            },
            undoThrow: () => {
              const lastThrow = get().savedResultsStack.at(-1);
              if (!lastThrow) return;
              get().actions.undoThrowFromPlayerHistory();
              set(
                (state) => {
                  state.savedResultsStack.pop();
                  state.redoResultsStack.push(lastThrow);
                },
                false,
                "undoThrow"
              );
            },
            redoThrow: () => {
              const lastThrow = get().redoResultsStack.at(-1);
              if (!lastThrow) return;
              get().actions.saveThrowToPlayerHistory(lastThrow);

              set(
                (state) => {
                  state.redoResultsStack.pop();
                  state.savedResultsStack.push(lastThrow);
                },
                false,
                "redoThrow"
              );
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
            saveThrowToPlayerHistory: (throwResult) => {
              const player = get().players.find(
                (p) => p.id === throwResult.scoredByPlayer
              )!;
              const lastHistoryBatch = player.history.at(-1);
              if (!lastHistoryBatch) {
                set(
                  (state) => {
                    state.players
                      .find((p) => p.id === throwResult.scoredByPlayer)!
                      .history.push({
                        busted: false,
                        id: batchOfThrowsIdGenerator.next().value!,
                        throw1: throwResult,
                        throw2: null,
                        throw3: null,
                      });
                  },
                  false,
                  "saveThrowToPlayerHistory"
                );
                return;
              }
              const firstMissingKey = getFirstNullBatchKey(lastHistoryBatch)!;
              set(
                (state) => {
                  state.players
                    .find((p) => p.id === throwResult.scoredByPlayer)!
                    .history.at(-1)![firstMissingKey] = throwResult;
                },
                false,
                "saveThrowToPlayerHistory"
              );
              if (
                getIsBatchFull(
                  get().players[get().currentPlayerIndex]!.history.at(-1)!
                )
              ) {
                const nextPlayerIndex =
                  (get().currentPlayerIndex + 1) % get().players.length;
                set(
                  (state) => {
                    state.currentPlayerIndex = nextPlayerIndex;
                    state.players[nextPlayerIndex].history.push({
                      busted: false,
                      id: batchOfThrowsIdGenerator.next().value!,
                      throw1: null,
                      throw2: null,
                      throw3: null,
                    });
                  },
                  false,
                  "nextPlayer"
                );
              }
            },

            undoThrowFromPlayerHistory: () => {
              const lastHistoryBatch =
                get().players[get().currentPlayerIndex]!.history.at(-1);

              if (!lastHistoryBatch) return;
              if (getIsBatchEmpty(lastHistoryBatch)) {
                set(
                  (state) => {
                    state.players[state.currentPlayerIndex]!.history.pop();
                  },
                  false,
                  "undoThrowFromPlayerHistory"
                );
                const previousPlayerIndex =
                  (get().currentPlayerIndex - 1 + get().players.length) %
                  get().players.length;
                set(
                  (state) => {
                    state.currentPlayerIndex = previousPlayerIndex;
                    const previousPlayer = state.players[previousPlayerIndex];
                    const previousPlayerLastHistoryBatch =
                      previousPlayer.history.at(-1);
                    if (previousPlayerLastHistoryBatch) {
                      previousPlayerLastHistoryBatch.throw3 = null;
                    }
                  },
                  false,
                  "previousPlayer + undoThrowFromPlayerHistory"
                );
              } else {
                const lastFilledKey = getLastFilledBatchKey(lastHistoryBatch)!;
                set(
                  (state) => {
                    state.players[get().currentPlayerIndex]!.history.at(-1)![
                      lastFilledKey
                    ] = null;
                  },
                  true,
                  "undoThrowFromPlayerHistory"
                );
              }
            },
            getScoredPointsOfPlayer: (playerId) => {
              return get()
                .players.find((p) => p.id === playerId)!
                .history.reduce(
                  (acc, batch) => acc + getPointsScoredInBatch(batch),
                  0
                );
            },
            setEndingStrategy: (strategy) =>
              set(
                (state) => {
                  state.endingStrategy = strategy;
                },
                false,
                "setEndingStrategy"
              ),
            setLegs: (legs) =>
              set(
                (state) => {
                  state.legs = legs;
                },
                false,
                "setLegs"
              ),
            setSets: (sets) =>
              set(
                (state) => {
                  state.sets = sets;
                },
                false,
                "setSets"
              ),
          },
        }),
        {
          name: "Game Store",
          trace: true,
          log: true,
        }
      )

      // { name: "Game Store" }
      // ),
    )
  );

const getFirstNullBatchKey = (batchOfThrows: BatchOfThrows) => {
  if (!batchOfThrows.throw1) return "throw1";
  if (!batchOfThrows.throw2) return "throw2";
  if (!batchOfThrows.throw3) return "throw3";
};

const getLastFilledBatchKey = (batchOfThrows: BatchOfThrows) => {
  if (batchOfThrows.throw3) return "throw3";
  if (batchOfThrows.throw2) return "throw2";
  if (batchOfThrows.throw1) return "throw1";
};

const getIsBatchEmpty = (batchOfThrows: BatchOfThrows) =>
  getFirstNullBatchKey(batchOfThrows) === "throw1";

const getIsBatchFull = (batchOfThrows: BatchOfThrows) =>
  getLastFilledBatchKey(batchOfThrows) === "throw3";
