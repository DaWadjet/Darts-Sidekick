"use client";

import { selectPointerAbsorbAtom } from "@/app/lib/atoms";
import { SETS_POSSIBILITIES } from "@/app/lib/types";
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

const SetsSelect: FC = () => {
  const store = useStore();
  const setAbsorbPointerEvents = useSetAtom(selectPointerAbsorbAtom, {
    store,
  });
  const sets = useGameStore()(useCallback((store) => store.sets, []));
  const actions = useGameActions();
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="sets">Best of ...</Label>
      <Select
        onOpenChange={setAbsorbPointerEvents}
        name="sets"
        value={sets.toString()}
        onValueChange={(newValue) =>
          //@ts-ignore
          actions.setSets(parseInt(newValue))
        }
      >
        <SelectTrigger className="w-full text-base">
          <SelectValue placeholder="Sets" />
        </SelectTrigger>
        <SelectContent>
          {SETS_POSSIBILITIES.map((value) => (
            <SelectItem key={value} value={value.toString()}>
              {value === 1 ? "Matchplay" : `${value} sets`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SetsSelect;
