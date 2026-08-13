// The M/M/1 steady-state queue-only waiting-time model (see CLAUDE.md,
// "Assignment 1 — Almost Full Is Already Broken" > Model integrity).
// Wq = lambda / (mu * (mu - lambda)) — expected time waiting IN QUEUE before
// service starts. Not Little's Law, and not total time in system (which
// would add the service time itself).

export function expectedQueueWaitTime(arrivalRate: number, serviceRate: number): number {
  if (!Number.isFinite(arrivalRate) || arrivalRate < 0) {
    throw new RangeError("arrivalRate must be a finite number >= 0");
  }
  if (!Number.isFinite(serviceRate) || serviceRate <= 0) {
    throw new RangeError("serviceRate must be a finite number > 0");
  }

  if (arrivalRate === 0) return 0;
  if (arrivalRate >= serviceRate) return Infinity;

  return arrivalRate / (serviceRate * (serviceRate - arrivalRate));
}
