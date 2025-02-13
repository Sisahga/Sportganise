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
    type: string;
    occurenceDate: string;
    creationDate: string;
    likeCount: number;
    feedbackCount: number;
    feedbackList: Feedback[]; 
  }
  
  export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}