export type PlanTier = "FREE" | "STANDARD" | "PRO";

export interface PlanLimits {
  maxTraces: number;
  maxTools: number;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  FREE: { maxTraces: 5, maxTools: 10 },
  STANDARD: { maxTraces: 50, maxTools: 100 },
  PRO: { maxTraces: 200, maxTools: Infinity },
};
