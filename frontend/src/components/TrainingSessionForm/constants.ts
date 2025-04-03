import {
  CENTRE_DE_LOISIRS_ST_DENIS,
  COLLEGE_DE_MAISONNEUVE,
  DAILY,
  FUNDRAISER,
  MONTHLY,
  ONCE,
  SPECIALTRAINING,
  TOURNAMENT,
  TRAINING,
  WEEKLY,
} from "@/constants/programconstants";

export const programTypes = [
  {
    label: "Training Session",
    value: TRAINING,
  },
  {
    label: "Fundraiser",
    value: FUNDRAISER,
  },
  {
    label: "Tournament",
    value: TOURNAMENT,
  },
  {
    label: "Special Training",
    value: SPECIALTRAINING,
  },
] as const;

export const frequencies = [
  {
    label: "Daily",
    value: DAILY,
  },
  {
    label: "Weekly",
    value: WEEKLY,
  },
  {
    label: "Monthly",
    value: MONTHLY,
  },
  {
    label: "One time",
    value: ONCE,
  },
] as const;

export const locations = [
  {
    label: "Centre de loisirs St-Denis",
    value: CENTRE_DE_LOISIRS_ST_DENIS,
  },
  {
    label: "Collège de Maisonnneuve",
    value: COLLEGE_DE_MAISONNEUVE,
  },
] as const;
