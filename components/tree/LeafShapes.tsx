// Foliage shape primitives. Each takes a deterministic position +
// size + colour pair and renders a single leaf-/petal-like glyph.
//
// Adding new shapes here is the lowest-friction extension point —
// drop in a function, register it in shapeForIndex, done.

import { r1 } from "./utils";

export interface LeafShapeProps {
  px: number;
  py: number;
  sz: number;
  rot: number;
  color: string;
  accent: string;
  opacity: number;
}

// ─── Existing shapes ────────────────────────────────────────────────

export function SparkleLeaf({ px, py, sz, rot, color, opacity }: LeafShapeProps) {
  const inner = r1(sz * 0.32);
  return (
    <g transform={`translate(${px} ${py}) rotate(${rot})`} opacity={opacity}>
      <path
        d={`M 0 ${-sz} L ${inner} 0 L 0 ${sz} L ${-inner} 0 Z`}
        fill={color}
      />
      <path
        d={`M ${-sz} 0 L 0 ${inner} L ${sz} 0 L 0 ${-inner} Z`}
        fill={color}
        opacity="0.7"
      />
    </g>
  );
}

export function BeadLeaf({ px, py, sz, color, opacity }: LeafShapeProps) {
  return (
    <circle
      cx={px}
      cy={py}
      r={r1(sz * 0.55)}
      fill={color}
      opacity={opacity}
    />
  );
}

export function HeartLeaf({ px, py, sz, rot, color, opacity }: LeafShapeProps) {
  const s = r1(sz * 0.85);
  return (
    <g transform={`translate(${px} ${py}) rotate(${rot})`} opacity={opacity}>
      <path
        d={`M 0 ${r1(s * 0.6)} C ${-s} ${r1(-s * 0.2)}, ${-s} ${-s}, 0 ${r1(-s * 0.4)} C ${s} ${-s}, ${s} ${r1(-s * 0.2)}, 0 ${r1(s * 0.6)} Z`}
        fill={color}
      />
    </g>
  );
}

export function FlowerLeaf({ px, py, sz, rot, color, accent, opacity }: LeafShapeProps) {
  const s = r1(sz * 0.65);
  return (
    <g transform={`translate(${px} ${py}) rotate(${rot})`} opacity={opacity}>
      {[0, 72, 144, 216, 288].map((angDeg) => (
        <ellipse
          key={angDeg}
          cx="0"
          cy={r1(-s * 0.7)}
          rx={r1(s * 0.45)}
          ry={s}
          fill={color}
          transform={`rotate(${angDeg})`}
        />
      ))}
      <circle r={r1(s * 0.35)} fill={accent} />
    </g>
  );
}

export function BudLeaf({ px, py, sz, rot, color, accent, opacity }: LeafShapeProps) {
  const s = r1(sz * 0.95);
  return (
    <g transform={`translate(${px} ${py}) rotate(${rot})`} opacity={opacity}>
      <path
        d={`M 0 ${-s} Q ${r1(-s * 0.55)} ${r1(-s * 0.3)}, ${r1(-s * 0.45)} ${r1(s * 0.4)} Q 0 ${s}, ${r1(s * 0.45)} ${r1(s * 0.4)} Q ${r1(s * 0.55)} ${r1(-s * 0.3)}, 0 ${-s} Z`}
        fill={color}
      />
      <path
        d={`M 0 ${r1(-s * 0.6)} Q ${r1(-s * 0.18)} ${r1(s * 0.1)}, 0 ${r1(s * 0.6)}`}
        stroke={accent}
        strokeWidth="0.5"
        fill="none"
        opacity="0.6"
      />
    </g>
  );
}

export function OvalLeaf({ px, py, sz, rot, color, accent, opacity }: LeafShapeProps) {
  const s = r1(sz * 1.05);
  return (
    <g transform={`translate(${px} ${py}) rotate(${rot})`} opacity={opacity}>
      <path
        d={`M 0 ${-s} C ${r1(s * 0.55)} ${r1(-s * 0.3)}, ${r1(s * 0.55)} ${r1(s * 0.3)}, 0 ${s} C ${r1(-s * 0.55)} ${r1(s * 0.3)}, ${r1(-s * 0.55)} ${r1(-s * 0.3)}, 0 ${-s} Z`}
        fill={color}
      />
      <line
        x1="0"
        y1={r1(-s * 0.85)}
        x2="0"
        y2={r1(s * 0.85)}
        stroke={accent}
        strokeWidth="0.5"
        opacity="0.55"
      />
    </g>
  );
}

export function EllipsePetal({ px, py, sz, rot, color, opacity }: LeafShapeProps) {
  return (
    <ellipse
      cx={px}
      cy={py}
      rx={r1(sz * 0.55)}
      ry={sz}
      fill={color}
      opacity={opacity}
      transform={`rotate(${rot} ${px} ${py})`}
    />
  );
}

// ─── New shapes (Adım B additions) ──────────────────────────────────

/** Maple-style 5-lobed leaf. */
export function MapleLeaf({ px, py, sz, rot, color, accent, opacity }: LeafShapeProps) {
  const s = r1(sz * 1.1);
  // Five lobes pointing up-left, up, up-right, mid-left, mid-right
  const lobe = (angDeg: number, len: number) => {
    const rad = (angDeg * Math.PI) / 180;
    const ex = r1(Math.cos(rad) * len);
    const ey = r1(Math.sin(rad) * len);
    const cpL = r1(len * 0.35);
    return `M 0 0 Q ${r1(Math.cos(rad - 0.4) * cpL)} ${r1(Math.sin(rad - 0.4) * cpL)}, ${ex} ${ey} Q ${r1(Math.cos(rad + 0.4) * cpL)} ${r1(Math.sin(rad + 0.4) * cpL)}, 0 0 Z`;
  };
  return (
    <g transform={`translate(${px} ${py}) rotate(${rot})`} opacity={opacity}>
      <path d={lobe(-90, s)} fill={color} />
      <path d={lobe(-150, s * 0.85)} fill={color} />
      <path d={lobe(-30, s * 0.85)} fill={color} />
      <path d={lobe(-180, s * 0.7)} fill={color} opacity="0.92" />
      <path d={lobe(0, s * 0.7)} fill={color} opacity="0.92" />
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={r1(s * 0.5)}
        stroke={accent}
        strokeWidth="0.6"
        opacity="0.65"
      />
    </g>
  );
}

/** Fern frond — central rib with paired leaflets. */
export function FernFrond({ px, py, sz, rot, color, accent, opacity }: LeafShapeProps) {
  const s = r1(sz * 1.2);
  const leaflets = 5;
  return (
    <g transform={`translate(${px} ${py}) rotate(${rot})`} opacity={opacity}>
      {/* Central rib */}
      <line
        x1="0"
        y1={r1(-s)}
        x2="0"
        y2={r1(s * 0.2)}
        stroke={accent}
        strokeWidth="0.7"
      />
      {Array.from({ length: leaflets }).map((_, i) => {
        const t = i / leaflets;
        const cy = r1(-s + t * s * 1.1);
        const w = r1(s * (0.4 - t * 0.18));
        return (
          <g key={i}>
            <ellipse
              cx={r1(-w * 0.55)}
              cy={cy}
              rx={r1(w)}
              ry={r1(w * 0.45)}
              fill={color}
              transform={`rotate(-25 ${r1(-w * 0.55)} ${cy})`}
            />
            <ellipse
              cx={r1(w * 0.55)}
              cy={cy}
              rx={r1(w)}
              ry={r1(w * 0.45)}
              fill={color}
              transform={`rotate(25 ${r1(w * 0.55)} ${cy})`}
            />
          </g>
        );
      })}
    </g>
  );
}

/** Ginkgo fan — two-lobed fan-shaped leaf. */
export function GinkgoLeaf({ px, py, sz, rot, color, accent, opacity }: LeafShapeProps) {
  const s = r1(sz * 1.05);
  return (
    <g transform={`translate(${px} ${py}) rotate(${rot})`} opacity={opacity}>
      {/* Fan body */}
      <path
        d={`M 0 ${r1(s * 0.4)} L ${-s} ${r1(-s * 0.6)} Q 0 ${-s}, ${s} ${r1(-s * 0.6)} Z`}
        fill={color}
      />
      {/* Notch in center */}
      <path
        d={`M 0 ${r1(-s * 0.85)} Q ${r1(-s * 0.06)} ${r1(-s * 0.55)}, 0 ${r1(-s * 0.4)} Q ${r1(s * 0.06)} ${r1(-s * 0.55)}, 0 ${r1(-s * 0.85)} Z`}
        fill={accent}
        opacity="0.45"
      />
      {/* Stem */}
      <line
        x1="0"
        y1={r1(s * 0.4)}
        x2="0"
        y2={r1(s * 0.85)}
        stroke={accent}
        strokeWidth="0.6"
      />
    </g>
  );
}

/** Cherry blossom — 5 round petals with golden center. */
export function CherryBlossom({ px, py, sz, rot, color, accent, opacity }: LeafShapeProps) {
  const s = r1(sz * 0.7);
  return (
    <g transform={`translate(${px} ${py}) rotate(${rot})`} opacity={opacity}>
      {[0, 72, 144, 216, 288].map((angDeg) => (
        <g key={angDeg} transform={`rotate(${angDeg})`}>
          <ellipse
            cx="0"
            cy={r1(-s * 0.6)}
            rx={r1(s * 0.55)}
            ry={r1(s * 0.7)}
            fill={color}
          />
          {/* Notch at petal tip */}
          <path
            d={`M ${r1(-s * 0.18)} ${r1(-s * 1.1)} Q 0 ${r1(-s * 0.95)}, ${r1(s * 0.18)} ${r1(-s * 1.1)}`}
            stroke={accent}
            strokeWidth="0.4"
            fill="none"
            opacity="0.5"
          />
        </g>
      ))}
      <circle r={r1(s * 0.25)} fill="#F4D060" />
      {/* Tiny stamens */}
      {[0, 60, 120, 180, 240, 300].map((angDeg) => (
        <line
          key={angDeg}
          x1="0"
          y1="0"
          x2="0"
          y2={r1(-s * 0.45)}
          stroke="#F4D060"
          strokeWidth="0.3"
          transform={`rotate(${angDeg})`}
          opacity="0.7"
        />
      ))}
    </g>
  );
}

/** Acorn / berry bead with stem. */
export function AcornBerry({ px, py, sz, rot, color, accent, opacity }: LeafShapeProps) {
  const s = r1(sz * 0.7);
  return (
    <g transform={`translate(${px} ${py}) rotate(${rot})`} opacity={opacity}>
      {/* Body */}
      <ellipse
        cx="0"
        cy={r1(s * 0.15)}
        rx={r1(s * 0.7)}
        ry={r1(s * 0.85)}
        fill={color}
      />
      {/* Cap */}
      <path
        d={`M ${r1(-s * 0.7)} ${r1(-s * 0.4)} Q 0 ${r1(-s * 0.85)}, ${r1(s * 0.7)} ${r1(-s * 0.4)} Q 0 ${r1(-s * 0.55)}, ${r1(-s * 0.7)} ${r1(-s * 0.4)} Z`}
        fill={accent}
      />
      {/* Stem */}
      <line
        x1="0"
        y1={r1(-s * 0.85)}
        x2="0"
        y2={r1(-s * 1.15)}
        stroke={accent}
        strokeWidth="0.7"
      />
    </g>
  );
}

// ─── More variants (densification pass) ─────────────────────────────

/** Pine needle cluster — radial spikes from a central point. */
export function PineNeedles({ px, py, sz, rot, color, opacity }: LeafShapeProps) {
  const s = r1(sz * 1.1);
  return (
    <g transform={`translate(${px} ${py}) rotate(${rot})`} opacity={opacity}>
      {[-60, -30, 0, 30, 60, 90, 120, 150, 180, 210, 240, 270].map((angDeg) => (
        <line
          key={angDeg}
          x1="0"
          y1="0"
          x2="0"
          y2={r1(-s)}
          stroke={color}
          strokeWidth="0.7"
          strokeLinecap="round"
          transform={`rotate(${angDeg})`}
        />
      ))}
    </g>
  );
}

/** Simple twig with three small leaflets. */
export function SimpleTwig({ px, py, sz, rot, color, accent, opacity }: LeafShapeProps) {
  const s = r1(sz);
  return (
    <g transform={`translate(${px} ${py}) rotate(${rot})`} opacity={opacity}>
      <line
        x1="0"
        y1={r1(s * 0.8)}
        x2="0"
        y2={r1(-s * 0.8)}
        stroke={accent}
        strokeWidth="0.6"
      />
      <ellipse cx={r1(-s * 0.4)} cy={r1(-s * 0.3)} rx={r1(s * 0.35)} ry={r1(s * 0.18)} fill={color} transform={`rotate(-30 ${r1(-s * 0.4)} ${r1(-s * 0.3)})`} />
      <ellipse cx={r1(s * 0.4)} cy={r1(-s * 0.3)} rx={r1(s * 0.35)} ry={r1(s * 0.18)} fill={color} transform={`rotate(30 ${r1(s * 0.4)} ${r1(-s * 0.3)})`} />
      <ellipse cx="0" cy={r1(-s * 0.6)} rx={r1(s * 0.3)} ry={r1(s * 0.5)} fill={color} />
    </g>
  );
}

/** Dandelion puff — tiny radiating fluff strokes. */
export function DandelionPuff({ px, py, sz, color, opacity }: LeafShapeProps) {
  const s = r1(sz * 0.9);
  return (
    <g transform={`translate(${px} ${py})`} opacity={opacity}>
      <circle r={r1(s * 0.18)} fill={color} />
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i * 360) / 14;
        return (
          <line
            key={i}
            x1="0"
            y1="0"
            x2="0"
            y2={r1(-s)}
            stroke={color}
            strokeWidth="0.5"
            strokeLinecap="round"
            transform={`rotate(${a})`}
            opacity="0.85"
          />
        );
      })}
    </g>
  );
}

/** Floral spray — three small flowers on a stem. */
export function FloralSpray({ px, py, sz, rot, color, accent, opacity }: LeafShapeProps) {
  const s = r1(sz * 0.95);
  const tinyFlower = (cx: number, cy: number, fillColor: string) => (
    <g transform={`translate(${cx} ${cy})`}>
      {[0, 90, 180, 270].map((angDeg) => (
        <ellipse key={angDeg} cx="0" cy={r1(-s * 0.2)} rx={r1(s * 0.13)} ry={r1(s * 0.22)} fill={fillColor} transform={`rotate(${angDeg})`} />
      ))}
      <circle r={r1(s * 0.1)} fill={accent} />
    </g>
  );
  return (
    <g transform={`translate(${px} ${py}) rotate(${rot})`} opacity={opacity}>
      <line x1="0" y1={r1(s * 0.5)} x2="0" y2={r1(-s * 0.85)} stroke={accent} strokeWidth="0.5" />
      {tinyFlower(0, r1(-s * 0.85), color)}
      {tinyFlower(r1(-s * 0.5), r1(-s * 0.3), color)}
      {tinyFlower(r1(s * 0.5), r1(-s * 0.3), color)}
    </g>
  );
}

/** Druplet berry cluster — three berries on a stem. */
export function DrupletBerry({ px, py, sz, rot, color, accent, opacity }: LeafShapeProps) {
  const s = r1(sz * 0.85);
  return (
    <g transform={`translate(${px} ${py}) rotate(${rot})`} opacity={opacity}>
      <line x1="0" y1={r1(s * 0.5)} x2="0" y2={r1(-s * 0.4)} stroke={accent} strokeWidth="0.6" />
      <circle cx={0} cy={r1(-s * 0.55)} r={r1(s * 0.35)} fill={color} />
      <circle cx={r1(-s * 0.45)} cy={r1(-s * 0.15)} r={r1(s * 0.32)} fill={color} />
      <circle cx={r1(s * 0.45)} cy={r1(-s * 0.15)} r={r1(s * 0.32)} fill={color} />
      {/* Highlights */}
      <circle cx={r1(-s * 0.1)} cy={r1(-s * 0.65)} r={r1(s * 0.1)} fill="#FFF8E7" opacity="0.6" />
    </g>
  );
}

// ─── Dispatcher ─────────────────────────────────────────────────────

const SHAPES = [
  SparkleLeaf,
  BeadLeaf,
  HeartLeaf,
  FlowerLeaf,
  BudLeaf,
  OvalLeaf,
  EllipsePetal,
  MapleLeaf,
  FernFrond,
  GinkgoLeaf,
  CherryBlossom,
  AcornBerry,
  PineNeedles,
  SimpleTwig,
  DandelionPuff,
  FloralSpray,
  DrupletBerry,
] as const;

/** Pick a shape deterministically by index (cycles through all 12). */
export function ShapeForIndex({ index, ...props }: { index: number } & LeafShapeProps) {
  const Component = SHAPES[index % SHAPES.length];
  return <Component {...props} />;
}
