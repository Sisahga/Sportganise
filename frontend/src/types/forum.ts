export interface PostDto {
  postId: number;
  title: string;
  description: string;
  type: "FUNDRAISER" | "SPECIAL" | "TRAINING" | "TOURNAMENT";
  occurrenceDate: string; // Format: "YYYY-MM-DDTHH:MM:SSZ"
  creationDate: string; // Format: "YYYY-MM-DDTHH:MM:SSZ"
  likeCount: number;
  liked: boolean;
  feedbackCount: number;
}

export interface PostResponse {
  statusCode: number;
  message: string;
  data: PostDto[];
}
