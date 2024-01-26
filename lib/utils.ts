import { ThrowValue } from "@/lib/types";

export const calculateThrowPoints = (throwResult: ThrowValue) => {
  if (throwResult === "MISS") {
    return 0;
  } else if (throwResult.segment === "OUTER_BULL") {
    return 25;
  } else if (throwResult.segment === "BULLSEYE") {
    return 50;
  } else {
    if ("multiplier" in throwResult)
      return throwResult.segment * throwResult.multiplier;
  }
  return 0;
};
