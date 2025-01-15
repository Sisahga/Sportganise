export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: null | { token: string }; // If the server returns a token or any other data
}
