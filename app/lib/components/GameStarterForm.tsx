"use client";

import EndingSelect from "@/app/lib/components/EndingSelect";
import LegsSelect from "@/app/lib/components/LegsSelect";
import PlayersList from "@/app/lib/components/PlayersList";
import SetsSelect from "@/app/lib/components/SetsSelect";
import StartingScoreSelect from "@/app/lib/components/StartingScoreSelect";
import { FC } from "react";

const GameStarterForm: FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full px-4 justify-between h-full items-stretch pt-8 pb-4">
      <h1 className="text-4xl font-extrabold text-white text-center">
        Darts Sidekick
      </h1>
      <div className="flex-col flex gap-5 w-full">
        <h2 className="text-xl font-bold">Game setup</h2>
        <div className="grid grid-cols-2 gap-5 place-items-center">
          <StartingScoreSelect />
          <EndingSelect />
          <SetsSelect />
          <LegsSelect />
        </div>
      </div>
      <PlayersList />
    </div>
  );
};

export default GameStarterForm;
