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
  shared: boolean;
  creationDate: Date;
}

// API Response
export interface TrainingPlansDto {
  myPlans: TrainingPlan[];
  sharedWithMe: TrainingPlan[];
}

/**
 * Delete a Training Plan
 */
export interface DeleteTrainingPlanDto {
  trainingPlan: boolean;
}

/**
 * Share a Training Plan
 */
export interface ShareTrainingPlanDto {
  trainingPlan: boolean;
}
