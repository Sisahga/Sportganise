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
  jwtToken: string | null;
}

export interface SignUpRequest {
  type: "PLAYER" | "COACH" | "ADMIN"; //ENUM type
  email: string;
  password: string;
  phone: string;
  address: {
    line: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
  };
  firstName: string;
  lastName: string;
}

export interface SignUpResponse {
  statusCode: number;
  message: string;
  data: null | {email: string};
}

export interface SendCodeRequest {
  email: string;
}

export interface SendCodeResponse {
  statusCode: number;
  message: string;
  data: string; // Email to which the code was sent
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  statusCode: number;
  message: string;
  data: null | CookiesDto;
}

export interface ChangePasswordFormValues {
  email: string;
  oldPassword: string;
  password: string;
  passwordAgain: string;
}

export interface ModifyPasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface ModifyPasswordResponse {
  statusCode: number;
  message: string;
}
