"use client";
import { selectPointerAbsorbAtom } from "@/app/lib/atoms";
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

const EndingSelect: FC = () => {
  const store = useStore();
  const setAbsorbPointerEvents = useSetAtom(selectPointerAbsorbAtom, {
    store,
  });
  const endingStrategy = useGameStore()(
    useCallback((store) => store.endingStrategy, [])
  );
  const actions = useGameActions();
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label htmlFor="endingStrategy">Ending strategy</Label>
      <Select
        onOpenChange={setAbsorbPointerEvents}
        name="endingStrategy"
        value={endingStrategy}
        onValueChange={actions.setEndingStrategy}
      >
        <SelectTrigger className="w-full text-base">
          <SelectValue placeholder="Ending Strategy" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="DOUBLE_OUT">Double out</SelectItem>
          <SelectItem value="WIN_ON_ANY">Any out</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EndingSelect;
