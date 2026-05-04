// OrganicTrunk — the central trunk silhouette with bark detail.
// Layered painterly effect: gradient body + side shade + bark veins
// + knots + speckle dots + a soft right-edge highlight.

import { GROUND_Y, seedRand } from "@/lib/tree-data";

export function OrganicTrunk() {
  const trunkColor = "#2C2620";
  const trunkDark = "#15110D";
  const leftEdge = `M 405 ${GROUND_Y - 10} C 395 2050, 425 1900, 432 1750 C 442 1600, 418 1450, 446 1300 C 458 1150, 438 1000, 462 850 C 476 700, 460 550, 478 400 C 484 280, 488 180, 490 110`;
  const rightEdge = `L 510 110 C 514 180, 516 280, 524 400 C 540 550, 528 700, 542 850 C 558 1000, 544 1150, 556 1300 C 568 1450, 590 1600, 580 1750 C 588 1900, 605 2050, 595 ${GROUND_Y - 10} Z`;
  return (
    <g>
      <path d={leftEdge + rightEdge} fill="url(#trunkGradV3)" />
      <path d={leftEdge + rightEdge} fill="url(#trunkShadeV3)" opacity="0.85" />
      <g opacity="0.55" pointerEvents="none">
        <path
          d="M 460 2200 C 458 1800, 478 1400, 482 800 C 484 500, 486 250, 490 130"
          stroke={trunkDark}
          strokeWidth="1.4"
          fill="none"
        />
        <path
          d="M 540 2180 C 542 1800, 524 1400, 520 800 C 516 500, 514 260, 510 140"
          stroke={trunkDark}
          strokeWidth="1.4"
          fill="none"
        />
        <ellipse cx="466" cy="1450" rx="9" ry="24" fill={trunkDark} opacity="0.7" />
        <ellipse cx="466" cy="1450" rx="3" ry="14" fill="#0a0a0a" opacity="0.6" />
        <ellipse cx="540" cy="950" rx="7" ry="16" fill={trunkDark} opacity="0.65" />
        <ellipse cx="488" cy="650" rx="6" ry="14" fill={trunkDark} opacity="0.55" />
        <ellipse cx="525" cy="1250" rx="8" ry="18" fill={trunkDark} opacity="0.55" />
        {Array.from({ length: 60 }).map((_, i) => {
          const rng = seedRand(i * 17 + 3);
          const cy = 200 + rng() * 2000;
          const cx = 470 + rng() * 60;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={0.5 + rng() * 0.9}
              fill={trunkDark}
              opacity={0.3 + rng() * 0.4}
            />
          );
        })}
      </g>
      <path
        d="M 540 2150 C 542 1800, 528 1400, 522 800 C 518 500, 516 260, 514 140"
        stroke="rgba(255,235,200,0.22)"
        strokeWidth="3.5"
        fill="none"
      />
    </g>
  );
}
