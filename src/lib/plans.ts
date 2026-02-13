export type PlanTier = "FREE" | "STANDARD" | "PRO";

export interface PlanLimits {
  maxTraces: number;
  maxTools: number;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  FREE: { maxTraces: 2, maxTools: 10 },
  STANDARD: { maxTraces: 25, maxTools: 100 },
  PRO: { maxTraces: 75, maxTools: Infinity },
};
