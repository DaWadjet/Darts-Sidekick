import { BatchOfThrows, SegmentValue, ThrowValue } from "@/app/lib/types";

export const throwValueToString = (throwValue: ThrowValue | null) => {
  if (!throwValue) return "";
  if (throwValue === "MISS") return "X";
  if (throwValue.segment === "OUTER_BULL") return "25";
  if (throwValue.segment === "BULLSEYE") return "50";
  if (!("multiplier" in throwValue)) throw new Error("Invalid throw value");
  return `${
    throwValue.multiplier === 2 ? "D" : throwValue.multiplier === 3 ? "T" : ""
  }${throwValue.segment}`;
};

export const vibrate = () => {
  if (typeof window !== "undefined" && "vibrate" in window.navigator) {
    window.navigator.vibrate(100);
  }
};

export const getPointsScoredWithThrow = (
  throwResult: ThrowValue | null | undefined
) => {
  if (!throwResult) return 0;
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

export type PossibleCheckout = keyof typeof cheatSheet;

export const getPointsScoredInBatch = (batch: BatchOfThrows) =>
  batch.busted
    ? 0
    : getPointsScoredWithThrow(batch.throw1?.throwValue) +
      getPointsScoredWithThrow(batch.throw2?.throwValue) +
      getPointsScoredWithThrow(batch.throw3?.throwValue);

export const suggestDoubleOutPath = (
  startingPoint: PossibleCheckout,
  remainingThrows: 1 | 2 | 3
) => {
  const path = cheatSheet[startingPoint];
  if (!path || path.length > remainingThrows)
    return `No ${remainingThrows}-dart finish available`;
  return path.map(throwValueToString).join(" -> ");
};

export function canPossiblyDoubleOut(
  number: number
): number is PossibleCheckout {
  return number >= 2 && number <= 170;
}

const cheatSheet = {
  2: [
    {
      segment: 1,
      multiplier: 2,
    },
  ],
  3: [
    {
      segment: 1,
      multiplier: 1,
    },
    {
      segment: 1,
      multiplier: 2,
    },
  ],
  4: [
    {
      segment: 2,
      multiplier: 2,
    },
  ],
  5: [
    {
      segment: 3,
      multiplier: 1,
    },
    {
      segment: 1,
      multiplier: 2,
    },
  ],
  6: [
    {
      segment: 3,
      multiplier: 2,
    },
  ],
  7: [
    {
      segment: 5,
      multiplier: 1,
    },
    {
      segment: 1,
      multiplier: 2,
    },
  ],
  8: [
    {
      segment: 4,
      multiplier: 2,
    },
  ],
  9: [
    {
      segment: 7,
      multiplier: 1,
    },
    {
      segment: 1,
      multiplier: 2,
    },
  ],
  10: [
    {
      segment: 5,
      multiplier: 2,
    },
  ],
  11: [
    {
      segment: 9,
      multiplier: 1,
    },
    {
      segment: 1,
      multiplier: 2,
    },
  ],
  12: [
    {
      segment: 6,
      multiplier: 2,
    },
  ],
  13: [
    {
      segment: 11,
      multiplier: 1,
    },
    {
      segment: 1,
      multiplier: 2,
    },
  ],
  14: [
    {
      segment: 7,
      multiplier: 2,
    },
  ],
  15: [
    {
      segment: 13,
      multiplier: 1,
    },
    {
      segment: 1,
      multiplier: 2,
    },
  ],
  16: [
    {
      segment: 8,
      multiplier: 2,
    },
  ],
  17: [
    {
      segment: 15,
      multiplier: 1,
    },
    {
      segment: 1,
      multiplier: 2,
    },
  ],
  18: [
    {
      segment: 9,
      multiplier: 2,
    },
  ],
  19: [
    {
      segment: 17,
      multiplier: 1,
    },
    {
      segment: 1,
      multiplier: 2,
    },
  ],
  20: [
    {
      segment: 10,
      multiplier: 2,
    },
  ],
  21: [
    {
      segment: 19,
      multiplier: 1,
    },
    {
      segment: 1,
      multiplier: 2,
    },
  ],
  22: [
    {
      segment: 11,
      multiplier: 2,
    },
  ],

  23: [
    {
      segment: 19,
      multiplier: 1,
    },
    {
      segment: 2,
      multiplier: 2,
    },
  ],
  24: [
    {
      segment: 12,
      multiplier: 2,
    },
  ],
  25: [
    {
      segment: 19,
      multiplier: 1,
    },
    {
      segment: 3,
      multiplier: 2,
    },
  ],
  26: [{ segment: 13, multiplier: 2 }],
  27: [
    {
      segment: 19,
      multiplier: 1,
    },
    {
      segment: 4,
      multiplier: 2,
    },
  ],
  28: [
    {
      segment: 14,
      multiplier: 2,
    },
  ],
  29: [
    {
      segment: 19,
      multiplier: 1,
    },
    {
      segment: 5,
      multiplier: 2,
    },
  ],
  30: [
    {
      segment: 15,
      multiplier: 2,
    },
  ],
  31: [
    {
      segment: 19,
      multiplier: 1,
    },
    {
      segment: 6,
      multiplier: 2,
    },
  ],
  32: [
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  33: [
    {
      segment: 19,
      multiplier: 1,
    },
    {
      segment: 7,
      multiplier: 2,
    },
  ],
  34: [
    {
      segment: 17,
      multiplier: 2,
    },
  ],
  35: [
    {
      segment: 19,
      multiplier: 1,
    },
    {
      segment: 8,
      multiplier: 2,
    },
  ],
  36: [
    {
      segment: 18,
      multiplier: 2,
    },
  ],
  37: [
    {
      segment: 19,
      multiplier: 1,
    },
    {
      segment: 9,
      multiplier: 2,
    },
  ],
  38: [
    {
      segment: 19,
      multiplier: 2,
    },
  ],
  39: [
    {
      segment: 19,
      multiplier: 1,
    },
    {
      segment: 10,
      multiplier: 2,
    },
  ],
  40: [
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  41: [
    {
      segment: 9,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  42: [
    {
      segment: 10,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  43: [
    {
      segment: 11,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  44: [
    {
      segment: 12,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  45: [
    {
      segment: 13,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  46: [
    {
      segment: 14,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  47: [
    {
      segment: 15,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  48: [
    {
      segment: 16,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  49: [
    {
      segment: 17,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  50: [
    {
      segment: 18,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  51: [
    {
      segment: 19,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  52: [
    {
      segment: 20,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  53: [
    {
      segment: 13,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  54: [
    {
      segment: 14,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  55: [
    {
      segment: 15,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  56: [
    {
      segment: 16,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  57: [
    {
      segment: 17,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  58: [
    {
      segment: 18,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  59: [
    {
      segment: 19,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  60: [
    {
      segment: 20,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  61: [
    {
      segment: 15,
      multiplier: 3,
    },
    {
      segment: 8,
      multiplier: 2,
    },
  ],
  62: [
    {
      segment: 10,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  63: [
    {
      segment: 13,
      multiplier: 3,
    },
    {
      segment: 12,
      multiplier: 2,
    },
  ],
  64: [
    {
      segment: 16,
      multiplier: 2,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  65: [
    {
      segment: 15,
      multiplier: 3,
    },
    {
      segment: 10,
      multiplier: 2,
    },
  ],
  66: [
    {
      segment: 10,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 2,
    },
  ],

  67: [
    {
      segment: 17,
      multiplier: 3,
    },
    {
      segment: 8,
      multiplier: 2,
    },
  ],
  68: [
    {
      segment: 16,
      multiplier: 3,
    },
    {
      segment: 10,
      multiplier: 2,
    },
  ],
  69: [
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 6,
      multiplier: 2,
    },
  ],
  70: [
    {
      segment: 18,
      multiplier: 3,
    },
    {
      segment: 8,
      multiplier: 2,
    },
  ],
  71: [
    {
      segment: 13,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  72: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 6,
      multiplier: 2,
    },
  ],
  73: [
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 8,
      multiplier: 2,
    },
  ],
  74: [
    {
      segment: 14,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  75: [
    {
      segment: 15,
      multiplier: 3,
    },
    {
      segment: 15,
      multiplier: 2,
    },
  ],
  76: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 8,
      multiplier: 2,
    },
  ],
  77: [
    {
      segment: 15,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  78: [
    {
      segment: 14,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 2,
    },
  ],
  79: [
    {
      segment: 13,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  80: [
    {
      segment: 16,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  81: [
    {
      segment: 15,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 2,
    },
  ],
  82: [
    {
      segment: 14,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  83: [
    {
      segment: 17,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  84: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 12,
      multiplier: 2,
    },
  ],
  85: [
    {
      segment: 15,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  86: [
    {
      segment: 18,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  87: [
    {
      segment: 17,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 2,
    },
  ],
  88: [
    {
      segment: 16,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  89: [
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  90: [
    {
      segment: 18,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 2,
    },
  ],
  91: [
    {
      segment: 17,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  92: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  93: [
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 2,
    },
  ],
  94: [
    {
      segment: 18,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  95: [
    {
      segment: 15,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  96: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 2,
    },
  ],
  97: [
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  98: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 19,
      multiplier: 2,
    },
  ],
  99: [
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 10,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  100: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  101: [
    {
      segment: 17,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  102: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 10,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  103: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 11,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  104: [
    {
      segment: 18,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  105: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 13,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  106: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 14,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  107: [
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  108: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  109: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 17,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  110: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  111: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 19,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  112: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 1,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  113: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 13,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  114: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 14,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  115: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 15,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  116: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  117: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 17,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  118: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  119: [
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 10,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  120: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 1,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  121: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 15,
      multiplier: 3,
    },
    {
      segment: 8,
      multiplier: 2,
    },
  ],
  122: [
    {
      segment: 18,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 4,
      multiplier: 2,
    },
  ],
  123: [
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 3,
    },
    {
      segment: 9,
      multiplier: 2,
    },
  ],
  124: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  125: [
    { segment: "OUTER_BULL" },
    {
      segment: 20,
      multiplier: 3,
    },

    {
      segment: 20,
      multiplier: 2,
    },
  ],

  126: [
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 6,
      multiplier: 2,
    },
  ],
  127: [
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 3,
    },
    {
      segment: 8,
      multiplier: 2,
    },
  ],
  128: [
    {
      segment: 18,
      multiplier: 3,
    },
    {
      segment: 14,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  129: [
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 6,
      multiplier: 2,
    },
  ],
  130: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 3,
    },
    {
      segment: 8,
      multiplier: 2,
    },
  ],
  131: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 13,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  132: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 6,
      multiplier: 2,
    },
  ],
  133: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 8,
      multiplier: 2,
    },
  ],
  134: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 14,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  135: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 15,
      multiplier: 3,
    },
    {
      segment: 15,
      multiplier: 2,
    },
  ],
  136: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 8,
      multiplier: 2,
    },
  ],
  137: [
    {
      segment: 17,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  138: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 14,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 2,
    },
  ],
  139: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 13,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  140: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  141: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 15,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 2,
    },
  ],
  142: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 14,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  143: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 17,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  144: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 12,
      multiplier: 2,
    },
  ],
  145: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 15,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  146: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  147: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 17,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 2,
    },
  ],
  148: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  149: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  150: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 2,
    },
  ],
  151: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 17,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  152: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 16,
      multiplier: 2,
    },
  ],
  153: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 2,
    },
  ],
  154: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  155: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 15,
      multiplier: 3,
    },
    {
      segment: "BULLSEYE",
    },
  ],
  156: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 2,
    },
  ],
  157: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  158: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 19,
      multiplier: 2,
    },
  ],
  159: null,
  160: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 2,
    },
  ],
  161: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 17,
      multiplier: 3,
    },
    {
      segment: "BULLSEYE",
    },
  ],
  162: null,
  163: null,
  164: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 18,
      multiplier: 3,
    },
    {
      segment: "BULLSEYE",
    },
  ],
  165: null,
  166: null,
  167: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 19,
      multiplier: 3,
    },
    {
      segment: "BULLSEYE",
    },
  ],
  168: null,
  169: null,
  170: [
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: 20,
      multiplier: 3,
    },
    {
      segment: "BULLSEYE",
    },
  ],
} satisfies Record<number, SegmentValue[] | null>;

const validateCheatSheet = () => {
  Object.entries(cheatSheet).forEach(([key, value]) => {
    if (!value) return;
    const sum = value.reduce(
      (acc, item) => acc + getPointsScoredWithThrow(item),
      0
    );
    if (sum !== Number(key)) {
      throw new Error(`Invalid cheat sheet for ${key}`);
    }
  });
};

// validateCheatSheet();
