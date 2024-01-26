"use client";

import { SEGMENTS, Segment, SegmentValue } from "@/lib/types";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

const SEGMENT_ANGLE = Math.PI / SEGMENTS.length;

const DOUBLE_ROW_RADIUS = 170;
const DOUBLE_ROW_WIDTH = 8;
const TRIPLE_ROW_WIDTH = 8;
const TRIPLE_ROW_RADIUS = 107;
const DOUBLE_ROW_INNER_RADIUS = DOUBLE_ROW_RADIUS - DOUBLE_ROW_WIDTH;
const TRIPLE_ROW_INNER_RADIUS = TRIPLE_ROW_RADIUS - TRIPLE_ROW_WIDTH;
const BULL_RADIUS = 6.35;
const OUTER_BULL_RADIUS = 15;

const BLACK_SECTION_COLOR = "#080808";
const RED_SECTION_COLOR = "#e20004";

const WHITE_SECTION_COLOR = "#f1edd0";
const GREEN_SECTION_COLOR = "#02a305";

const RIM_COLOR = "#e8eff5";

const HIGHLIGHTED_COLOR = "#fa8e01";

const Dartboard: FC = () => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const context = useMemo(() => {
    const ctx = canvas?.getContext("2d");
    if (!ctx) return null;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    return ctx;
  }, [canvas]);

  const canDraw = useMemo(() => !!context && !!canvas, [context, canvas]);
  const relativeSize = useMemo(
    () => ((canvas?.width ?? 1) - 1) / (2 * DOUBLE_ROW_RADIUS),
    [canvas]
  );

  const highlightedSection = useMemo<SegmentValue>(() => {
    return {
      segment: 7,
      multiplier: 3,
    };
  }, []);

  const drawFullSegment = useCallback(
    (segment: Segment, index: number) => {
      if (!context || !canvas) return;
      const isHighlighted =
        highlightedSection.segment === segment &&
        highlightedSection.multiplier === 1;
      const startAngle =
        index * 2 * SEGMENT_ANGLE - SEGMENT_ANGLE - Math.PI / 2;
      const endAngle = startAngle + 2 * SEGMENT_ANGLE;
      const relativeSize = canvas.width / (2 * DOUBLE_ROW_RADIUS);
      context.beginPath();
      context.arc(
        canvas.width / 2,
        canvas.height / 2,
        DOUBLE_ROW_INNER_RADIUS * relativeSize,
        startAngle,
        endAngle
      );
      context.arc(
        canvas.width / 2,
        canvas.height / 2,
        OUTER_BULL_RADIUS * relativeSize,
        endAngle,
        startAngle,
        true
      );
      context.fillStyle = isHighlighted
        ? HIGHLIGHTED_COLOR
        : index % 2 == 0
        ? BLACK_SECTION_COLOR
        : WHITE_SECTION_COLOR;
      context.strokeStyle = RIM_COLOR;
      context.closePath();

      context.fill();
      context.stroke();
    },
    [context, canvas, highlightedSection, relativeSize]
  );

  const drawTripleSegment = useCallback(
    (segment: Segment, index: number) => {
      if (!context || !canvas) return;
      const isHighlighted =
        highlightedSection.segment === segment &&
        highlightedSection.multiplier === 3;
      const startAngle =
        index * 2 * SEGMENT_ANGLE - SEGMENT_ANGLE - Math.PI / 2;
      const endAngle = startAngle + 2 * SEGMENT_ANGLE;

      context.beginPath();
      context.arc(
        canvas.width / 2,
        canvas.height / 2,
        TRIPLE_ROW_RADIUS * relativeSize,
        startAngle,
        endAngle
      );
      context.arc(
        canvas.width / 2,
        canvas.height / 2,
        TRIPLE_ROW_INNER_RADIUS * relativeSize,
        endAngle,
        startAngle,
        true
      );
      context.shadowBlur = 10;
      context.fillStyle = isHighlighted
        ? HIGHLIGHTED_COLOR
        : index % 2 == 0
        ? RED_SECTION_COLOR
        : GREEN_SECTION_COLOR;
      context.strokeStyle = RIM_COLOR;
      context.closePath();

      context.fill();
      context.stroke();
    },
    [context, canvas, relativeSize, highlightedSection]
  );

  const drawDoubleSegment = useCallback(
    (segment: Segment, index: number) => {
      if (!context || !canvas) return;
      const isHighlighted =
        highlightedSection.segment === segment &&
        highlightedSection.multiplier === 2;
      const startAngle =
        index * 2 * SEGMENT_ANGLE - SEGMENT_ANGLE - Math.PI / 2;
      const endAngle = startAngle + 2 * SEGMENT_ANGLE;
      context.beginPath();
      context.arc(
        canvas.width / 2,
        canvas.height / 2,
        DOUBLE_ROW_RADIUS * relativeSize,
        startAngle,
        endAngle
      );
      context.arc(
        canvas.width / 2,
        canvas.height / 2,
        DOUBLE_ROW_INNER_RADIUS * relativeSize,
        endAngle,
        startAngle,
        true
      );
      context.fillStyle = isHighlighted
        ? HIGHLIGHTED_COLOR
        : index % 2 == 0
        ? RED_SECTION_COLOR
        : GREEN_SECTION_COLOR;

      context.strokeStyle = "ffffff";
      context.closePath();

      context.fill();
      context.stroke();
    },
    [context, canvas, relativeSize, highlightedSection]
  );

  const drawBull = useCallback(() => {
    if (!context || !canvas) return;
    const isBullseyeHighlighted = highlightedSection.segment === "BULLSEYE";
    const isOuterBullHighlighted = highlightedSection.segment === "OUTER_BULL";
    context.beginPath();
    context.arc(
      canvas.width / 2,
      canvas.height / 2,
      OUTER_BULL_RADIUS * relativeSize,
      0,
      2 * Math.PI
    );
    context.fillStyle = isOuterBullHighlighted
      ? HIGHLIGHTED_COLOR
      : GREEN_SECTION_COLOR;
    context.strokeStyle = RIM_COLOR;
    context.closePath();

    context.fill();
    context.stroke();

    context.beginPath();
    context.arc(
      canvas.width / 2,
      canvas.height / 2,
      BULL_RADIUS * relativeSize,
      0,
      2 * Math.PI
    );
    context.fillStyle = isBullseyeHighlighted
      ? HIGHLIGHTED_COLOR
      : RED_SECTION_COLOR;
    context.strokeStyle = RIM_COLOR;
    context.closePath();

    context.fill();
    context.stroke();
  }, [context, canvas, relativeSize, highlightedSection]);

  const drawDartboard = useCallback(() => {
    if (!context || !canvas) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context!.imageSmoothingQuality = "high";
    context!.imageSmoothingEnabled = true;
    for (let i = 0; i < SEGMENTS.length; i++) {
      const segment = SEGMENTS[i];
      drawFullSegment(segment, i);
    }
    for (let i = 0; i < SEGMENTS.length; i++) {
      const segment = SEGMENTS[i];
      drawDoubleSegment(segment, i);
    }
    for (let i = 0; i < SEGMENTS.length; i++) {
      const segment = SEGMENTS[i];
      drawTripleSegment(segment, i);
    }
    drawBull();
  }, [drawBull, drawDoubleSegment, context, canvas]);

  useEffect(() => {
    if (canDraw) {
      drawDartboard();
    }
  }, [canDraw, drawDartboard]);

  return (
    <div>
      <canvas
        width="600"
        height="600"
        ref={(canvas) => {
          if (!canvas) return;
          const devicePixelRatio = window.devicePixelRatio || 1;
          canvas!.width = 600 * devicePixelRatio;
          canvas!.height = 600 * devicePixelRatio;
          setCanvas(canvas);
        }}
      ></canvas>
    </div>
  );
};

export default Dartboard;
