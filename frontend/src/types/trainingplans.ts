// FormData
export interface UploadTrainingPlansDto {
  trainingPlans: string[];
}

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
