export type Axial = { q: number; r: number };

export const HEX_SIZE = 32;

const SQRT3 = Math.sqrt(3);

export function axialToPixel(q: number, r: number, size = HEX_SIZE): { x: number; y: number } {
  const x = size * (SQRT3 * q + (SQRT3 / 2) * r);
  const y = size * (1.5 * r);
  return { x, y };
}

export function pixelToAxial(x: number, y: number, size = HEX_SIZE): Axial {
  const q = ((SQRT3 / 3) * x - (1 / 3) * y) / size;
  const r = ((2 / 3) * y) / size;
  return axialRound(q, r);
}

export function axialRound(qf: number, rf: number): Axial {
  const sf = -qf - rf;
  let q = Math.round(qf);
  let r = Math.round(rf);
  const s = Math.round(sf);
  const dq = Math.abs(q - qf);
  const dr = Math.abs(r - rf);
  const ds = Math.abs(s - sf);
  if (dq > dr && dq > ds) q = -r - s;
  else if (dr > ds) r = -q - s;
  return { q, r };
}

export function hexCorners(cx: number, cy: number, size = HEX_SIZE): { x: number; y: number }[] {
  const corners: { x: number; y: number }[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = Math.PI / 180 * (60 * i - 30);
    corners.push({ x: cx + size * Math.cos(angle), y: cy + size * Math.sin(angle) });
  }
  return corners;
}

export function hexDistance(a: Axial, b: Axial): number {
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}

// Edge index -> axial-neighbor delta, ordered to match hexCorners: edge i
// runs from corners[i] to corners[(i+1)%6], so its outward-facing direction
// is angle 60*i (corners[i] sits at 60*i-30, corners[i+1] at 60*i+30).
export const EDGE_NEIGHBORS: readonly [number, number][] = [
  [1, 0],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [0, -1],
  [1, -1],
];

// Which of the 6 edges of the hex centered at (cx, cy) a point (px, py) is
// nearest to, using the same corner-angle convention as hexCorners (edge i's
// outward direction is angle 60*i) so it lines up with EDGE_NEIGHBORS.
export function nearestHexEdge(cx: number, cy: number, px: number, py: number): number {
  const angleDeg = (Math.atan2(py - cy, px - cx) * 180) / Math.PI;
  const normalized = ((angleDeg % 360) + 360) % 360;
  return Math.round(normalized / 60) % 6;
}
