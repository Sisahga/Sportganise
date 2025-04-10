export interface LoginRequest {
  email: string;
  password: string;
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
  email: string;
}

export interface SendCodeRequest {
  email: string;
}

export interface SendCodeResponse {
  email: string; // Email to which the code was sent
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
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
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  email: string;
}

export interface ResetPasswordFormValues {
  email: string;
  password: string;
  passwordAgain: string;
}
