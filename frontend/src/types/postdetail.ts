export interface Author {
  accountId: number;
  name: string;
  type: string;
  pictureUrl: string;
}

export interface Feedback {
  feedbackId: number;
  description: string;
  author: Author;
  creationDate: string;
}

export interface Post {
  postId: number;
  title: string;
  description: string;
  type: "FUNDRAISER" | "SPECIAL" | "TRAINING" | "TOURNAMENT";
  occurenceDate: string;
  creationDate: string;
  likeCount: number;
  liked: boolean;
  feedbackCount: number;
  feedbackList: Feedback[];
}

export interface FeedbackResponseDto {
  feedbackId: number;
}
