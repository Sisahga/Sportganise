/**
 * Upload Training Plans
 */
// API Response
export interface UploadTrainingPlansDto {
  trainingPlans: string[];
}

/**
 * View Training Plans
 */
// Individual Training Plan
export interface TrainingPlan {
  planId: number;
  userId: number;
  docUrl: string; // AWS Bucket
  creationDate: Date;
}

// API Response
export interface TrainingPlansDto {
  myPlans: TrainingPlan[];
  sharedWithMe: TrainingPlan[];
}
