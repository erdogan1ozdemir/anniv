// Slim vertical stem connecting all year branches.
// Replaces the previous carved-Nordic chunky trunk to match the
// L-system wax-flower aesthetic — delicate green stalk, barely
// visible, lets the year plants take centre stage.

import { GROUND_Y } from "@/lib/tree-data";

const STEM_COLOR = "#6B8054"; // sage olive (matches plant stems)

export function OrganicTrunk() {
  // Slight organic curve from ground to canopy
  const trunkPath = `M 500 ${GROUND_Y - 10} C 502 2050, 498 1500, 502 1000 C 504 600, 498 300, 500 110`;
  return (
    <g pointerEvents="none">
      {/* Soft outer halo for depth */}
      <path
        d={trunkPath}
        stroke={STEM_COLOR}
        strokeWidth="11"
        fill="none"
        strokeLinecap="round"
        opacity="0.12"
      />
      {/* Main stem */}
      <path
        d={trunkPath}
        stroke={STEM_COLOR}
        strokeWidth="3.4"
        fill="none"
        strokeLinecap="round"
        opacity="0.95"
      />
      {/* Subtle highlight on right edge */}
      <path
        d={trunkPath}
        stroke="rgba(255,235,200,0.32)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        transform="translate(1.2, 0)"
      />
    </g>
  );
}
