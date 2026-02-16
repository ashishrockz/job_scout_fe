import axios from "axios";
import { getRefreshToken, setAccessToken, setRefreshToken, clearTokens } from "./local-storage";

// Create a separate axios instance for refresh token (to avoid interceptor loop)
const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (body: any) => {
  try {
    const response = await authAxios.post("/auth/login", body);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
      error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
    };
  }
};

export const signUpUser = async(body:any) =>{
   try {
    const response = await authAxios.post("/auth/register", body);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
      error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
    };
  }
}

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (): Promise<{
  success: boolean;
  data?: { access_token: string; refresh_token: string };
  message?: string;
}> => {
  try {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return {
        success: false,
        message: "No refresh token available",
      };
    }

    const response = await authAxios.post("/auth/refresh", {
      refresh_token: refreshToken,
    });

    // Store new tokens
    if (response.data.access_token) {
      setAccessToken(response.data.access_token);
    }
    if (response.data.refresh_token) {
      setRefreshToken(response.data.refresh_token);
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    // If refresh fails, clear tokens and redirect to login
    clearTokens();

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to refresh token",
    };
  }
};