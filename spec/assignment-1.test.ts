import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { expectedQueueWaitTime } from "../src/lib/queueModel";

// This week's spec (comp.anu.edu.au/courses/.../assessments/assignment-1/):
// "the visitor does something that changes what they see — state the core
// interaction plainly enough to write a test for it." For "Almost Full Is
// Already Broken" that interaction is: move the arrival-rate slider, watch
// the queue/wait-time readout respond. Two contracts fall out of that:
//
// 1. the queueing model itself must be a real, grounded formula (not
//    invented "average cafe" numbers) — testable as pure math, no DOM needed.
// 2. the built page must expose a control and a live readout for it — testable
//    as a structural contract against the built HTML, same pattern as
//    invariants.test.ts. Wire your slider's input handler up to update the
//    readout; that behaviour itself is confirmed by hand in a browser (see
//    "works at both marking viewpoints" — a person, not this suite, judges
//    that), because jsdom here never executes the built page's script.
//
// This is a simplified M/M/1 explanatory model, not measured cafe data — the
// numbers illustrate a queueing effect, not a claim about any real cafe's
// average arrival or service rate.

describe("queueing model (M/M/1, queue-only wait)", () => {
  // lambda = arrival rate, mu = service rate, both rates expressed in the
  // same unit (the UI presents demand relative to service capacity, not
  // measured cafe customers-per-minute figures).
  // expectedQueueWaitTime returns Wq, the expected time spent WAITING IN
  // QUEUE before service starts (not total time in the system, which would
  // add the service time itself): the M/M/1 steady-state queue-wait formula
  // Wq = lambda / (mu * (mu - lambda)). That's distinct from Little's Law,
  // which separately relates the average number of customers in a system to
  // the arrival rate and the average time each spends in it — this function
  // doesn't use Little's Law, it's the queue-wait formula directly. Wq is
  // only finite while the queue is stable (lambda < mu).

  it("is small when arrivals are well under capacity", () => {
    expect(expectedQueueWaitTime(1, 10)).toBeLessThan(0.1);
  });

  it("increases as arrivals approach capacity", () => {
    const waits = [1, 4, 6, 8, 9].map((arrivalRate) => expectedQueueWaitTime(arrivalRate, 10));
    for (let i = 1; i < waits.length; i++) {
      expect(waits[i]).toBeGreaterThan(waits[i - 1]);
    }
  });

  it("at 95% utilisation, queue wait is exactly 19x its value at 50% — 'almost full' is already an order of magnitude worse", () => {
    // Wq(9.5, 10) = 9.5 / (10 * 0.5) = 1.9; Wq(5, 10) = 5 / (10 * 5) = 0.1 —
    // a clean 19x under this model, not merely "greater than" it. That
    // exactness is a property of the lambda / (mu * (mu - lambda)) curve,
    // not a hand-picked example.
    expect(expectedQueueWaitTime(9.5, 10)).toBeCloseTo(19 * expectedQueueWaitTime(5, 10));
  });

  it("returns Infinity for an unstable queue (arrivals at or above capacity)", () => {
    expect(expectedQueueWaitTime(10, 10)).toBe(Infinity);
    expect(expectedQueueWaitTime(11, 10)).toBe(Infinity);
  });
});

describe("the core interaction: a control and a live readout for it", () => {
  const doc = new JSDOM(readFileSync(resolve("dist/index.html"), "utf8")).window.document;

  it("has a slider for the arrival rate", () => {
    const slider = doc.querySelector('[data-testid="arrival-rate"]');
    expect(slider, 'add an input type="range" data-testid="arrival-rate"').toBeTruthy();
    expect(slider?.getAttribute("type")).toBe("range");
  });

  it("has a live readout the slider is meant to update", () => {
    const readout = doc.querySelector('[data-testid="queue-status"]');
    expect(readout, 'add an element with data-testid="queue-status"').toBeTruthy();
    expect(
      readout?.getAttribute("aria-live"),
      "mark it aria-live so assistive tech announces updates, not just sighted users",
    ).toBeTruthy();
  });
});
