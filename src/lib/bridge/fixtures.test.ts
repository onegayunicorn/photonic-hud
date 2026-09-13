/**
 * Deterministic fixture tests — fail CI if engine drift breaks the seal model.
 * Run via: node --experimental-strip-types --test src/lib/bridge/fixtures.test.ts
 * (or the project's existing test script once wired).
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CANONICAL_FIXTURES,
  FIXTURE_TAU_1,
  serializeFixture,
} from "./fixtures.ts";
import { metricsAt, verifyUnitarity, verifyWeightConservation } from "../photonic/engine.ts";

describe("canonical fixtures", () => {
  it("includes τ = 0, 0.33, 1.0", () => {
    const taus = CANONICAL_FIXTURES.map((p) => p.tau);
    assert.ok(taus.includes(0));
    assert.ok(taus.some((t) => Math.abs(t - 0.33) < 1e-9));
    assert.ok(taus.includes(1));
  });

  it("τ = 1 unitarity is ~1", () => {
    assert.ok(Math.abs(FIXTURE_TAU_1.unitarity - 1) < 1e-10);
  });

  it("τ = 1 phase is New Being", () => {
    assert.equal(FIXTURE_TAU_1.phase, "New Being");
  });

  it("serialization is stable", () => {
    const a = serializeFixture(FIXTURE_TAU_1);
    const b = serializeFixture(FIXTURE_TAU_1);
    assert.equal(a, b);
  });

  it("metricsAt matches fixture coherence/entropy at τ=1", () => {
    const m = metricsAt(1);
    assert.equal(m.coherence, FIXTURE_TAU_1.coherence);
    assert.equal(m.entropy, FIXTURE_TAU_1.entropy);
  });
});

describe("engine invariants", () => {
  it("unitarity conserved across cycle", () => {
    const r = verifyUnitarity(500);
    assert.ok(r.passed, `maxErr=${r.maxErr}`);
  });

  it("weights α+β+γ = 1", () => {
    const r = verifyWeightConservation(500);
    assert.ok(r.passed, `maxErr=${r.maxErr}`);
  });
});
