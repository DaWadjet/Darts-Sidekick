"use client";

import { selectPointerAbsorbAtom } from "@/app/lib/atoms";
import { STARTING_POINT_POSSIBILITIES } from "@/app/lib/types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGameActions, useGameStore } from "@/store/GameProvider";
import { useSetAtom, useStore } from "jotai";
import { FC, useCallback } from "react";

const StartingScoreSelect: FC = () => {
  const store = useStore();
  const setAbsorbPointerEvents = useSetAtom(selectPointerAbsorbAtom, {
    store,
  });
  const startingPointAmount = useGameStore()(
    useCallback((store) => store.startingPointAmount, [])
  );
  const actions = useGameActions();
  return (
    <div className="flex flex-col gap-2 w-full text-base">
      <Label htmlFor="startingScore">Starting score</Label>
      <Select
        onOpenChange={setAbsorbPointerEvents}
        name="startingScore"
        value={startingPointAmount.toString()}
        onValueChange={(newValue) =>
          //@ts-ignore
          actions.setStartingPointAmount(parseInt(newValue))
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Starting Score" />
        </SelectTrigger>
        <SelectContent>
          {STARTING_POINT_POSSIBILITIES.map((value) => (
            <SelectItem key={value} value={value.toString()}>
              {value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StartingScoreSelect;
