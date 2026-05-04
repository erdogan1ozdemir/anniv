// Simple chunky trunk silhouette.
// Body fill + shade + 4 bark veins + 4 knots — no speckles, no extra
// passes. ~12 SVG elements total.

import { GROUND_Y } from "@/lib/tree-data";

export function OrganicTrunk() {
  const trunkColor = "#3A2E22";
  const trunkDark = "#1F1612";
  const leftEdge = `M 405 ${GROUND_Y - 10} C 395 2050, 425 1900, 432 1750 C 442 1600, 418 1450, 446 1300 C 458 1150, 438 1000, 462 850 C 476 700, 460 550, 478 400 C 484 280, 488 180, 490 110`;
  const rightEdge = `L 510 110 C 514 180, 516 280, 524 400 C 540 550, 528 700, 542 850 C 558 1000, 544 1150, 556 1300 C 568 1450, 590 1600, 580 1750 C 588 1900, 605 2050, 595 ${GROUND_Y - 10} Z`;
  return (
    <g pointerEvents="none">
      <path d={leftEdge + rightEdge} fill="url(#trunkGradV3)" />
      <path d={leftEdge + rightEdge} fill="url(#trunkShadeV3)" opacity="0.85" />
      {/* Bark veins */}
      <path
        d="M 470 2100 C 472 1500, 478 900, 484 200"
        stroke={trunkDark}
        strokeWidth="1.4"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M 530 2100 C 526 1500, 522 900, 516 200"
        stroke={trunkDark}
        strokeWidth="1.4"
        fill="none"
        opacity="0.55"
      />
      {/* Knots */}
      <ellipse cx="470" cy="1450" rx="8" ry="22" fill={trunkDark} opacity="0.7" />
      <ellipse cx="535" cy="950" rx="7" ry="16" fill={trunkDark} opacity="0.6" />
      <ellipse cx="488" cy="650" rx="6" ry="14" fill={trunkDark} opacity="0.55" />
      <ellipse cx="525" cy="1700" rx="7" ry="14" fill={trunkDark} opacity="0.5" />
      {/* Right-edge highlight */}
      <path
        d="M 540 2100 C 528 1400, 522 800, 514 140"
        stroke="rgba(255,235,200,0.24)"
        strokeWidth="3"
        fill="none"
      />
    </g>
  );
}
