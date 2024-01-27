export const SEGMENTS = [
  20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
] as const;

export const STARTING_POINT_POSSIBILITIES = [101, 301, 501, 701, 1001] as const;
export const LEGS_POSSIBILITIES = [
  1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 25,
] as const;
export const SETS_POSSIBILITIES = [1, 3, 5, 7] as const;
export const ENDING_POSSIBILITIES = ["DOUBLE_OUT", "WIN_ON_ANY"] as const;

export type StartingPointAmount = (typeof STARTING_POINT_POSSIBILITIES)[number];
export type LegsAmount = (typeof LEGS_POSSIBILITIES)[number];
export type SetsAmount = (typeof SETS_POSSIBILITIES)[number];
export type Ending = (typeof ENDING_POSSIBILITIES)[number];
export type Segment = (typeof SEGMENTS)[number];

export type Multiplier = 1 | 2 | 3;

export type SegmentValue =
  | {
      segment: Segment;
      multiplier: Multiplier;
    }
  | {
      segment: "BULLSEYE" | "OUTER_BULL";
    };

export type ThrowValue = SegmentValue | "MISS";
