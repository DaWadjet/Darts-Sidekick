import { ThrowValue } from "@/lib/types";

export const calculateThrowPoints = (throwResult: ThrowValue) => {
  if (throwResult === "MISS") {
    return 0;
  } else if (throwResult === "OUTER_BULL") {
    return 25;
  } else if (throwResult === "BULLSEYE") {
    return 50;
  } else {
    return throwResult.segment * throwResult.multiplier;
  }
};
