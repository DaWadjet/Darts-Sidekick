"use client";
import { selectPointerAbsorbAtom } from "@/app/lib/atoms";
import { LEGS_POSSIBILITIES } from "@/app/lib/types";
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

const LegsSelect: FC = () => {
  const store = useStore();
  const setAbsorbPointerEvents = useSetAtom(selectPointerAbsorbAtom, {
    store,
  });
  const legs = useGameStore()(useCallback((store) => store.legs, []));
  const actions = useGameActions();
  return (
    <div className="flex flex-col gap-2 w-full ">
      <Label htmlFor="legs">Best of ...</Label>
      <Select
        onOpenChange={setAbsorbPointerEvents}
        name="legs"
        value={legs.toString()}
        onValueChange={(newValue) =>
          //@ts-ignore
          actions.setLegs(parseInt(newValue))
        }
      >
        <SelectTrigger className="w-full ">
          <SelectValue placeholder="Legs" />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {LEGS_POSSIBILITIES.map((value) => (
            <SelectItem key={value} value={value.toString()}>
              {value === 1 ? "1 leg" : `${value} legs`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LegsSelect;
