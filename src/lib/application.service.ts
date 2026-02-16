import { ApplicationAdapter, ApplicationDetailAdapter, CandidateApplicationsAdapter, CandidateStatsAdapter } from "@/models/applciation.adapter";
import { ActiveCopilotsAdapter, CopilotScrapingResponseAdapter } from "@/models/copilots";
import { ActiveScrapingTasksResponse } from "@/types/copilot";
import { apiUrlPaths } from "./api.paths";
import { axiosInstances } from "./networkInstance";

/**
 * Adapter instances (reuse – best practice)
 */
const applicationAdapter = new ApplicationAdapter();
const applicationDetailAdapter = new ApplicationDetailAdapter();
const candidateApplicationsAdapter = new CandidateApplicationsAdapter();
const candidateStatsAdapter = new CandidateStatsAdapter();

/**
 * Get all applications
 */
export const getApplications = async (limit = 100) => {
  try {
    const response = await axiosInstances.get("/applications", {
      params: { limit },
    });

    console.log("API RESPONSE:", response.data);

    const data = Array.isArray(response?.data?.applications)
      ? response.data.applications.map((item: any) =>
        applicationAdapter.adapt(item),
      )
      : [];

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching applications:", error);

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

/**
 * Get application by ID
 */
export const getApplicationById = async (applicationId: number) => {
  try {
    const response = await axiosInstances.get(
      `/applications/${applicationId}`,
    );

    const data = applicationDetailAdapter.adapt(
      response?.data?.data,
    );

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching application details:", error);

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

/**
 * Get applications by candidate email
 */
export const getApplicationsByCandidateEmail = async (
  email: string,
  limit = 100,
) => {
  try {
    const response = await axiosInstances.get(
      "/candidates/applications",
      {
        params: { email, limit },
      },
    );

    const data = candidateApplicationsAdapter.adapt(
      response?.data?.data,
    );

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching candidate applications:", error);

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

/**
 * Get candidate statistics
 */
export const getCandidateStats = async (email: string) => {
  try {
    const response = await axiosInstances.get(
      "/candidates/stats",
      {
        params: { email },
      },
    );

    const data = candidateStatsAdapter.adapt(
      response?.data?.data,
    );

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching candidate stats:", error);

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

/**
 * Get active scraping tasks
 */
export const getActiveScrapingTasks =
  async (): Promise<ActiveScrapingTasksResponse> => {
    try {
      const url = apiUrlPaths?.scraping?.tasks?.active();

      const response = await axiosInstances.get(url);

      return response?.status === 200
        ? {
          success: true,
          data: new CopilotScrapingResponseAdapter().adapt(
            response?.data,
          ),
        }
        : { success: false };
    } catch (error: any) {
      console.error("Error fetching active scraping tasks:", error);

      const message =
        error?.response?.data?.errors?.[0]?.code ||
        error?.message ||
        "Something went wrong";

      return {
        success: false,
        message,
      };
    }
  };
