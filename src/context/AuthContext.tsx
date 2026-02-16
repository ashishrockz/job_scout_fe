import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearTokens,
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  getUser,
  setUser as setUserStorage,
} from "@/lib/local-storage";
import { axiosInstances } from "@/lib/networkInstance";

export interface User {
  id: number;
  email: string;

  first_name: string;
  last_name: string;

  phone?: string | null;
  linkedin_url?: string | null;

  role: "admin" | "user" | "manager";
  plan_type: "free" | "pro" | "enterprise";

  is_active: boolean;
  resume_id?:string | null;
  created_at?: string;
  updated_at?: string;
}

interface LoginResponse {
  success: boolean;
  data?: {
    access_token: string;
    refresh_token: string;
    user: User;
  };
  message?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAccessToken();
    const storedUser = getUser();

    if (token && storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      clearTokens();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []); // ✅ runs only once on app start



  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await axiosInstances.post("/auth/login", {
        email,
        password,
      });

      // Store tokens and user data
      if (response.data.access_token) {
        setAccessToken(response.data.access_token);
      }
      if (response.data.refresh_token) {
        setRefreshToken(response.data.refresh_token);
      }
      if (response.data.user) {
        setUser(response.data.user);
        setUserStorage(response.data.user);
        setIsAuthenticated(true);
      }

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
  const logout = async () => {
    clearTokens();
    setUser(null);
    setIsAuthenticated(false);
    navigate("/auth/signin", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
