"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGameActions } from "@/store/GameProvider";
import { FC, useRef } from "react";

const AddPlayerSheet: FC<{ side: "top" | "bottom" }> = ({ side }) => {
  const newPlayerInputRef = useRef<HTMLInputElement>(null);
  const addPlayer = useGameActions().addPlayer;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Add player sheet |{side}|</Button>
      </SheetTrigger>
      <SheetContent
        side={side}
        className="flex flex-col gap-5 border-slate-600 rounded-t-md shadow-md"
      >
        <SheetHeader>
          <SheetTitle>Add new player</SheetTitle>
        </SheetHeader>
        <Input
          placeholder="Player name"
          ref={newPlayerInputRef}
          className="text-base"
        />

        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="button"
              className="self-end"
              onClick={() =>
                // TODO: add validation
                newPlayerInputRef.current &&
                addPlayer(newPlayerInputRef.current.value)
              }
            >
              Add
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default AddPlayerSheet;
