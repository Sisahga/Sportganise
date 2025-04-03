import log from "loglevel";
import {
  CookiesDto,
  LoginRequest,
  ModifyPasswordRequest,
  ModifyPasswordResponse,
  SendCodeRequest,
  SendCodeResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ResetPasswordResponse,
  ResetPasswordRequest,
} from "@/types/auth";
import { isCookiesDto, setCookies } from "@/services/cookiesService";
import { ApiService, setAuthToken } from "@/services/apiHelper.ts";
import ResponseDto from "@/types/response.ts";

const EXTENDED_BASE_URL = "/api/auth";

export const login = async (
  data: LoginRequest,
): Promise<ResponseDto<CookiesDto>> => {
  const response = await ApiService.post<ResponseDto<CookiesDto>>(
    `${EXTENDED_BASE_URL}/login`,
    data,
    { requiresAuth: false },
  );
  console.log("Login response: ", response);
  if (response.statusCode === 200) {
    console.log("Data: ", response.data);
    if (response.data && isCookiesDto(response.data)) {
      await setCookies(response.data);
      await setAuthToken(response.data.jwtToken || "");
      return response;
    } else {
      log.warn("No cookies data found in login response.");
      throw new Error("No cookies data found in login response.");
    }
  } else {
    const errorMessage =
      response.message || `HTTP error! status: ${response.statusCode}`;
    throw new Error(errorMessage);
  }
};

export const signUp = async (
  data: SignUpRequest,
): Promise<ResponseDto<SignUpResponse>> => {
  const response = await ApiService.post<ResponseDto<SignUpResponse>>(
    `${EXTENDED_BASE_URL}/signup`,
    data,
    { requiresAuth: false },
  );

  log.debug("SignUp response: ", response);

  if (response.statusCode === 201) {
    return response;
  } else {
    const errorMessage =
      response.message || `HTTP error! status: ${response.statusCode}`;
    throw new Error(errorMessage);
  }
};

export const sendCode = async (
  data: SendCodeRequest,
): Promise<ResponseDto<SendCodeResponse>> => {
  const response = await ApiService.post<ResponseDto<SendCodeResponse>>(
    `${EXTENDED_BASE_URL}/send-code`,
    data,
    { requiresAuth: false },
  );

  if (response.statusCode === 201) {
    return response;
  } else {
    const errorMessage =
      response.message || `HTTP error! status: ${response.statusCode}`;
    throw new Error(errorMessage);
  }
};

export const verifyCode = async (
  data: VerifyCodeRequest,
): Promise<ResponseDto<VerifyCodeResponse>> => {
  const response = await ApiService.post<ResponseDto<VerifyCodeResponse>>(
    `${EXTENDED_BASE_URL}/verify-code`,
    data,
    { requiresAuth: false },
  );

  if (response.statusCode === 200) {
    const cookies: CookiesDto = {
      accountId: response.data?.cookies?.accountId || null,
      firstName: response.data?.cookies?.firstName || "",
      lastName: response.data?.cookies?.lastName || "",
      email: response.data?.cookies?.email || "",
      pictureUrl: response.data?.cookies?.pictureUrl || null,
      type: response.data?.cookies?.type || null,
      phone: response.data?.cookies?.phone || null,
      organisationIds: response.data?.cookies?.organisationIds || [],
      jwtToken: null,
    };

    await setCookies(cookies);
    await setAuthToken(response.data?.cookies?.jwtToken || "");

    return response;
  } else {
    const errorMessage =
      response.message || `HTTP error! status: ${response.statusCode}`;
    throw new Error(errorMessage);
  }
};

export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ResponseDto<ResetPasswordResponse>> => {
  const response = await ApiService.patch<ResponseDto<ResetPasswordResponse>>(
    `${EXTENDED_BASE_URL}/reset-password`,
    data,
    { requiresAuth: false },
  );

  if (response.statusCode === 200) {
    return response;
  } else {
    const errorMessage =
      response.message || `HTTP error! status: ${response.statusCode}`;
    throw new Error(errorMessage);
  }
};

export const modifyPassword = async (
  data: ModifyPasswordRequest,
): Promise<ResponseDto<ModifyPasswordResponse>> => {
  const response = await ApiService.patch<ResponseDto<ModifyPasswordResponse>>(
    `${EXTENDED_BASE_URL}/modify-password`,
    data,
    { requiresAuth: false },
  );

  if (response.statusCode === 200) {
    return response;
  } else {
    const errorMessage =
      response.message || `HTTP error! status: ${response.statusCode}`;
    throw new Error(errorMessage);
  }
};
