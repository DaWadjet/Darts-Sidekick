export const SEGMENTS = [
  20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
] as const;

export type Segment = (typeof SEGMENTS)[number];

type Multiplier = 1 | 2 | 3;

type SegmentValue =
  | {
      segment: Segment;
      multiplier: Multiplier;
    }
  | {
      segment: "BULLSEYE" | "OUTER_BULL";
    };

export type ThrowValue = SegmentValue | "MISS";
