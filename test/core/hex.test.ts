import { test } from "node:test";
import assert from "node:assert/strict";
import { axialToPixel, EDGE_NEIGHBORS, hexCorners, nearestHexEdge } from "../../src/core/hex";

test("nearestHexEdge: agrees with EDGE_NEIGHBORS's axial-neighbor directions", () => {
  for (let edge = 0; edge < 6; edge++) {
    const [dq, dr] = EDGE_NEIGHBORS[edge];
    const { x, y } = axialToPixel(dq, dr);
    assert.equal(nearestHexEdge(0, 0, x, y), edge, `neighbor delta for edge ${edge} should resolve back to edge ${edge}`);
  }
});

test("nearestHexEdge: hexCorners edge midpoints resolve to their own edge index", () => {
  const cx = 10;
  const cy = -5;
  const corners = hexCorners(cx, cy, 32);
  for (let edge = 0; edge < 6; edge++) {
    const c1 = corners[edge];
    const c2 = corners[(edge + 1) % 6];
    const midX = (c1.x + c2.x) / 2;
    const midY = (c1.y + c2.y) / 2;
    assert.equal(nearestHexEdge(cx, cy, midX, midY), edge, `midpoint of corners[${edge}]/[${(edge + 1) % 6}] should resolve to edge ${edge}`);
  }
});

test("nearestHexEdge: a click near a corner resolves to whichever adjacent edge is angularly closer", () => {
  // Corner 0 sits at -30deg, exactly between edge 5 (angle -60/300) and edge
  // 0 (angle 0) — nudge a couple degrees either side of it and confirm the
  // resolved edge follows.
  const cx = 0;
  const cy = 0;
  const r = 32;
  const towardEdge0 = (-30 + 5) * (Math.PI / 180);
  const towardEdge5 = (-30 - 5) * (Math.PI / 180);
  assert.equal(nearestHexEdge(cx, cy, cx + r * Math.cos(towardEdge0), cy + r * Math.sin(towardEdge0)), 0);
  assert.equal(nearestHexEdge(cx, cy, cx + r * Math.cos(towardEdge5), cy + r * Math.sin(towardEdge5)), 5);
});
