import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp: number;
}

export const getAuthToken = () => {
  const token = window.localStorage.getItem("auth_token");
  if (token) {
    const decodedToken: JwtPayload = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      window.localStorage.removeItem("auth_token");
      return null;
    }
    return token;
  }
};

export const setAuthToken = (token: string) => {
  window.localStorage.setItem("auth_token", token);
};

export const removeAuthToken = () => {
  window.localStorage.removeItem("auth_token");
};

export const getBearerToken = () => {
  const token = getAuthToken();
  if (token) {
    return `Bearer ${token}`;
  } else {
    return "";
  }
};
