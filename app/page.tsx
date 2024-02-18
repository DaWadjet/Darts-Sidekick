"use client";

import { useGameStore } from "@/store/GameProvider";
import { FC, useCallback } from "react";

import DisclaimerModal from "@/app/lib/components/DisclaimerModal";
import Game from "@/app/lib/components/Game";
import GameStarterForm from "@/app/lib/components/GameStarterForm";
import ReportIssueBanner from "@/app/lib/components/ReportIssueBanner";

const Home: FC = () => {
  const hasGameStarted = useGameStore()(
    useCallback((store) => store.hasGameStarted, [])
  );
  return (
    <main className="flex h-[100svh] flex-col mx-auto items-center gap-10 container p-5">
      {hasGameStarted ? <Game /> : <GameStarterForm />}
      <DisclaimerModal />
      <ReportIssueBanner />
    </main>
  );
};
export default Home;
