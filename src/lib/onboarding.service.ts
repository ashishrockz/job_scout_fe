import {
  CandidateProfileAdapter,
  CandidateProfileListAdapter,
} from "@/models/candidatePreferences";
import {
  CandidateProfileListResponseType,
  CandidateProfileResponse,
} from "@/types/copilot";
import { apiUrlPaths } from "./api.paths";
import { axiosInstances } from "./networkInstance";

export const getCandidateProfile = async (
  email: string
): Promise<CandidateProfileResponse> => {
  try {
    const url = apiUrlPaths.onboarding.profile(encodeURIComponent(email));

    const response = await axiosInstances.get(url);

    return response?.status === 200
      ? {
          success: true,
          data: new CandidateProfileAdapter().adapt(response?.data),
        }
      : { success: false };
  } catch (error: any) {
    const code =
      error?.response?.data?.detail ||
      error?.response?.data?.errors?.[0]?.code ||
      error?.message;

    return {
      success: false,
      message: code,
    };
  }
};
export const getCandidateProfileList = async (
  email: string
): Promise<CandidateProfileListResponseType> => {
  try {
    const url = apiUrlPaths.onboarding.list(encodeURIComponent(email));
    const response = await axiosInstances.get(url);

    return response?.status === 200
      ? {
          success: true,
          data: new CandidateProfileListAdapter().adapt(response?.data),
        }
      : { success: false };
  } catch (error: any) {
    const code =
      error?.response?.data?.detail ||
      error?.response?.data?.errors?.[0]?.code ||
      error?.message;

    return {
      success: false,
      message: code,
    };
  }
};
