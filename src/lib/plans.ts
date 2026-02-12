export type PlanTier = "FREE" | "STANDARD" | "PRO";

export interface PlanLimits {
  maxTools: number;
  maxBins: number;
}

export const PLAN_LIMITS: Record<PlanTier, PlanLimits> = {
  FREE: { maxTools: 5, maxBins: 2 },
  STANDARD: { maxTools: 50, maxBins: Infinity },
  PRO: { maxTools: 200, maxBins: Infinity },
};
