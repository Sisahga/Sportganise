export const getAuthToken = () => {
  return window.localStorage.getItem("auth_token");
}

export const setAuthToken = (token: string) => {
  window.localStorage.setItem("auth_token", token);
}

export const getBearerToken = () => {
  const token = getAuthToken();
  if (token) {
    return `Bearer ${token}`;
  } else {
    return "";
  }
}