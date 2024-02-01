"use client";

import { vibrate } from "@/app/lib/utils";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCanRedo, useCanUndo, useGameActions } from "@/store/GameProvider";
import { FC, useCallback } from "react";
const GameHeader: FC = () => {
  const actions = useGameActions();
  const canRedo = useCanRedo();
  const canUndo = useCanUndo();

  const onReset = useCallback(() => {
    vibrate();
    actions.reset();
  }, [actions]);

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-1 justify-start">
        <button
          disabled={!canUndo}
          className="bg-orange-700 rounded-sm aspect-square text-white font-semibold transition-all duration-200 text-base leading-0 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => {
            vibrate();
            actions.undoThrow();
          }}
        >
          Undo
        </button>
        {canRedo && (
          <button
            className="bg-green-700 rounded-sm aspect-square text-white font-semibold transition-all duration-200 text-base leading-0"
            onClick={() => {
              vibrate();
              actions.redoThrow();
            }}
          >
            Redo
          </button>
        )}
      </div>
      <AlertDialog>
        <AlertDialogTrigger
          className="bg-red-800 rounded-sm aspect-square text-white font-semibold text-base leading-0"
          onClick={vibrate}
        >
          Reset
        </AlertDialogTrigger>
        <AlertDialogContent className="w-4/5">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will remove all players and all throws. Do you want to
              continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={onReset}>
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GameHeader;
