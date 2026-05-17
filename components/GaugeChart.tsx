"use client";

import { useEffect, useRef } from "react";

import { pct } from "@/utils/helpers";

export default function GaugeChart({ used, max }: { used: number; max: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const percentage = pct(used, max);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H - 14;
    const radius = Math.min(W, H * 2) / 2 - 18;

    ctx.clearRect(0, 0, W, H);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, 2 * Math.PI);
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineCap = "round";
    ctx.stroke();

    const fillEnd = Math.PI + (percentage / 100) * Math.PI;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI, fillEnd);
    ctx.lineWidth = 14;
    ctx.strokeStyle = "#185FA5";
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "#185FA5";
    ctx.fill();
  }, [used, max, percentage]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={180}
        height={100}
        role="img"
        aria-label={`Daily send limit gauge: ${used} of ${max} sends used (${percentage}%)`}
      >
        {used} of {max} sends used ({percentage}%).
      </canvas>
      <p className="text-3xl font-semibold text-gray-900 -mt-2">{percentage}%</p>
      <p className="text-xs text-gray-400 mt-1">
        Limit: <span className="font-medium text-gray-600">{used}</span> / {max}
      </p>
    </div>
  );
}
