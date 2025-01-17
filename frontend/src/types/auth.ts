export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: null | { token: string } | CookiesDto; // If the server returns a token or any other data
}

export interface CookiesDto {
  accountId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  pictureUrl: string | null;
  type: string | null;
  phone: string | null;
  organisationIds: number[];
}
