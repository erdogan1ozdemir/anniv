// Chunky trunk silhouette + epic flared root base.
// Trunk narrows toward the canopy, widens steadily downward, then
// flares dramatically at the ground line where roots emerge.

import { GROUND_Y } from "@/lib/tree-data";

export function OrganicTrunk() {
  const trunkColor = "#3A2E22";
  const trunkDark = "#1F1612";
  // Path order, top → bottom on the LEFT, bottom → top on the RIGHT,
  // closed with Z. Each `C` consumes exactly 6 numbers (cp1, cp2, end).
  const flareLeftBase = `M 350 ${GROUND_Y + 18}`;
  const flareLeftToTrunk = `C 380 ${GROUND_Y + 6}, 398 ${GROUND_Y - 14}, 405 ${GROUND_Y - 10}`;
  const leftBody = `C 395 2050, 425 1900, 432 1750 C 442 1600, 418 1450, 446 1300 C 458 1150, 438 1000, 462 850 C 476 700, 460 550, 478 400 C 484 280, 488 180, 490 110`;
  const top = `L 510 110`;
  const rightBody = `C 514 180, 516 280, 524 400 C 540 550, 528 700, 542 850 C 558 1000, 544 1150, 556 1300 C 568 1450, 590 1600, 580 1750 C 588 1900, 605 2050, 595 ${GROUND_Y - 10}`;
  const flareRightFromTrunk = `C 602 ${GROUND_Y - 14}, 620 ${GROUND_Y + 6}, 650 ${GROUND_Y + 18}`;
  const close = `Z`;
  const d =
    `${flareLeftBase} ${flareLeftToTrunk} ${leftBody} ${top} ${rightBody} ${flareRightFromTrunk} ${close}`;
  return (
    <g pointerEvents="none">
      <path d={d} fill="url(#trunkGradV3)" />
      <path d={d} fill="url(#trunkShadeV3)" opacity="0.85" />
      {/* Bark veins */}
      <path
        d={`M 460 ${GROUND_Y + 10} C 470 2100, 472 1500, 478 900, 484 200`}
        stroke={trunkDark}
        strokeWidth="1.4"
        fill="none"
        opacity="0.55"
      />
      <path
        d={`M 540 ${GROUND_Y + 10} C 530 2100, 526 1500, 522 900, 516 200`}
        stroke={trunkDark}
        strokeWidth="1.4"
        fill="none"
        opacity="0.55"
      />
      {/* Bottom flare V-veins diverging into roots */}
      <path
        d={`M 482 2100 C 462 ${GROUND_Y - 30}, 410 ${GROUND_Y}, 380 ${GROUND_Y + 14}`}
        stroke={trunkDark}
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      <path
        d={`M 518 2100 C 538 ${GROUND_Y - 30}, 590 ${GROUND_Y}, 620 ${GROUND_Y + 14}`}
        stroke={trunkDark}
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      />
      {/* Knots */}
      <ellipse cx="470" cy="1450" rx="8" ry="22" fill={trunkDark} opacity="0.7" />
      <ellipse cx="535" cy="950" rx="7" ry="16" fill={trunkDark} opacity="0.6" />
      <ellipse cx="488" cy="650" rx="6" ry="14" fill={trunkDark} opacity="0.55" />
      <ellipse cx="525" cy="1700" rx="7" ry="14" fill={trunkDark} opacity="0.5" />
      {/* Lower flare knots */}
      <ellipse cx="425" cy={GROUND_Y - 20} rx="9" ry="13" fill={trunkDark} opacity="0.6" />
      <ellipse cx="580" cy={GROUND_Y - 28} rx="8" ry="12" fill={trunkDark} opacity="0.55" />
      {/* Right-edge highlight */}
      <path
        d={`M 540 ${GROUND_Y - 10} C 528 1400, 522 800, 514 140`}
        stroke="rgba(255,235,200,0.24)"
        strokeWidth="3"
        fill="none"
      />
    </g>
  );
}
