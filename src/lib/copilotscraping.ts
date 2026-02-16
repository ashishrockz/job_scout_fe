import { CopilotScrapingResponseAdapter } from "@/models/copilots";
import { apiUrlPaths } from "./api.paths";
import { axiosInstances } from "./networkInstance";
import { ActiveScrapingTasksResponse } from "@/types/copilot";

export const getActiveScrapingTasks =
  async (): Promise<ActiveScrapingTasksResponse> => {
    try {
      const url = apiUrlPaths?.scraping?.tasks?.active();

      const response = await axiosInstances.get(url);

      return response?.status === 200
        ? {
            success: true,
            data: new CopilotScrapingResponseAdapter().adapt(response?.data),
          }
        : { success: false };
    } catch (error: any) {
      const code = error?.response?.data?.errors?.[0]?.code || error?.message;

      return {
        success: false,
        message: code,
      };
    }
  };
