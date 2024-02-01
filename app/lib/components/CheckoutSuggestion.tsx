"use client";

import { canPossiblyDoubleOut, suggestDoubleOutPath } from "@/app/lib/utils";
import { useCurrentPlayer, useRemainingThrows } from "@/store/GameProvider";
import { FC } from "react";

const CheckoutSuggestion: FC = () => {
  const currentPlayer = useCurrentPlayer();
  const remainingThrows = useRemainingThrows();
  return (
    <div className="leading-7 text-center text-slate-600 text-lg font-semibold italic">
      {canPossiblyDoubleOut(currentPlayer.remainingScore) &&
      remainingThrows !== 0
        ? suggestDoubleOutPath(currentPlayer.remainingScore, remainingThrows)
        : ""}
    </div>
  );
};

export default CheckoutSuggestion;
