export const setAccessToken = (token: string): void => {
  localStorage.setItem("accessToken", token);
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem("refreshToken", token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

export const setUser = (user: any): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = (): any | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const clearTokens = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};