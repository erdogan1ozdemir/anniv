// Chunky trunk silhouette + epic flared root base.
// The trunk body starts narrow at the canopy and gradually widens
// downward, then FLARES dramatically at the ground line where roots
// emerge — like an old oak tree settling into the earth.

import { GROUND_Y } from "@/lib/tree-data";

export function OrganicTrunk() {
  const trunkColor = "#3A2E22";
  const trunkDark = "#1F1612";
  // Trunk body: narrow at top (405-510), steady mid, FLARING wide at
  // the ground line (350-650) before dropping into root system.
  const leftEdge = `M 350 ${GROUND_Y + 18} C 360 ${GROUND_Y - 20}, 400 ${GROUND_Y - 80}, 405 2050 C 425 1900, 432 1750 C 442 1600, 418 1450, 446 1300 C 458 1150, 438 1000, 462 850 C 476 700, 460 550, 478 400 C 484 280, 488 180, 490 110`;
  const rightEdge = `L 510 110 C 514 180, 516 280, 524 400 C 540 550, 528 700, 542 850 C 558 1000, 544 1150, 556 1300 C 568 1450, 590 1600, 580 1750 C 588 1900, 605 2050, 600 ${GROUND_Y - 80} C 620 ${GROUND_Y - 20}, 650 ${GROUND_Y + 18}, 650 ${GROUND_Y + 18} Z`;
  return (
    <g pointerEvents="none">
      <path d={leftEdge + rightEdge} fill="url(#trunkGradV3)" />
      <path d={leftEdge + rightEdge} fill="url(#trunkShadeV3)" opacity="0.85" />
      {/* Bark veins — extend down into the flared base */}
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
      {/* Bottom flare bark vein — V-shaped lines diverging into roots */}
      <path
        d={`M 480 2100 C 440 ${GROUND_Y - 30}, 380 ${GROUND_Y}, 360 ${GROUND_Y + 14}`}
        stroke={trunkDark}
        strokeWidth="1.6"
        fill="none"
        opacity="0.5"
      />
      <path
        d={`M 520 2100 C 560 ${GROUND_Y - 30}, 620 ${GROUND_Y}, 640 ${GROUND_Y + 14}`}
        stroke={trunkDark}
        strokeWidth="1.6"
        fill="none"
        opacity="0.5"
      />
      {/* Knots */}
      <ellipse cx="470" cy="1450" rx="8" ry="22" fill={trunkDark} opacity="0.7" />
      <ellipse cx="535" cy="950" rx="7" ry="16" fill={trunkDark} opacity="0.6" />
      <ellipse cx="488" cy="650" rx="6" ry="14" fill={trunkDark} opacity="0.55" />
      <ellipse cx="525" cy="1700" rx="7" ry="14" fill={trunkDark} opacity="0.5" />
      {/* Lower flare knots — gnarly roots-area knots */}
      <ellipse cx="425" cy={GROUND_Y - 20} rx="10" ry="14" fill={trunkDark} opacity="0.6" />
      <ellipse cx="580" cy={GROUND_Y - 30} rx="9" ry="13" fill={trunkDark} opacity="0.55" />
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
