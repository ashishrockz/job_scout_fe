import { CopilotFormData } from "@/context/copilot-form-context";
import { CreateCopilotRequestAdapter } from "@/models/copilot-request.adapter";
import {
  CopilotAdapter,
  CopilotStatusAdapter,
  MatchedJobAdapter,
  CopilotApplicationAdapter,
  TriggerCopilotResultAdapter,
  CancelCopilotResultAdapter,
} from "@/models/copilot.adapter";
import {
  Copilot,
  CopilotStatus,
  MatchedJob,
  CopilotApplication,
  TriggerCopilotResult,
  CancelCopilotResult,
  UpdateCopilotRequest,
} from "@/types/copilot";
import { apiUrlPaths } from "./api.paths";
import { axiosInstances } from "./networkInstance";

/**
 * Adapter instances
 */
const requestAdapter = new CreateCopilotRequestAdapter();
const copilotAdapter = new CopilotAdapter();
const copilotStatusAdapter = new CopilotStatusAdapter();
const matchedJobAdapter = new MatchedJobAdapter();
const copilotApplicationAdapter = new CopilotApplicationAdapter();
const triggerCopilotResultAdapter = new TriggerCopilotResultAdapter();
const cancelCopilotResultAdapter = new CancelCopilotResultAdapter();

/**
 * Create a new copilot
 */
export const createCopilot = async (
  formData: CopilotFormData
): Promise<{ success: boolean; data?: Copilot; message?: string }> => {
  try {
    // Validate form data
    const validationErrors = requestAdapter.validate(formData);
    if (validationErrors.length > 0) {
      return {
        success: false,
        message: validationErrors.join(", "),
      };
    }

    // Transform to API request format
    const apiRequest = requestAdapter.toApiRequest(formData);

    // Make API call
    const url = apiUrlPaths.copilot.create();
    const response = await axiosInstances.post(url, apiRequest);

    // Adapt response
    const copilot = copilotAdapter.adapt(response.data);

    return {
      success: true,
      data: copilot,
    };
  } catch (error: any) {
    console.error("Error creating copilot:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create copilot",
    };
  }
};

/**
 * Get all copilots
 */
export const getCopilots = async (): Promise<{
  success: boolean;
  data?: Copilot[];
  message?: string;
}> => {
  try {
    const url = apiUrlPaths.copilot.list();
    const response = await axiosInstances.get(url);

    const data = Array.isArray(response?.data)
      ? response.data.map((item: any) => copilotAdapter.adapt(item))
      : Array.isArray(response?.data?.data)
        ? response.data.data.map((item: any) => copilotAdapter.adapt(item))
        : Array.isArray(response?.data?.copilots)
          ? response.data.copilots.map((item: any) => copilotAdapter.adapt(item))
          : [];

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching copilots:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch copilots",
    };
  }
};

/**
 * Get copilot by ID
 */
export const getCopilotById = async (
  copilotId: string
): Promise<{ success: boolean; data?: Copilot; message?: string }> => {
  try {
    const url = apiUrlPaths.copilot.getById(copilotId);
    const response = await axiosInstances.get(url);

    const copilot = copilotAdapter.adapt(response.data);

    return { success: true, data: copilot };
  } catch (error: any) {
    console.error("Error fetching copilot:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch copilot",
    };
  }
};

/**
 * Update copilot
 */
export const updateCopilot = async (
  copilotId: string,
  formData: CopilotFormData | UpdateCopilotRequest
): Promise<{ success: boolean; data?: Copilot; message?: string }> => {
  try {
    let apiRequest: any;

    // Check if formData is CopilotFormData (needs validation) or UpdateCopilotRequest (direct update)
    if ('status' in formData && Object.keys(formData).length <= 2) {
      // Simple update request (like status change)
      apiRequest = formData;
    } else {
      // Validate form data
      const validationErrors = requestAdapter.validate(formData as CopilotFormData);
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: validationErrors.join(", "),
        };
      }

      // Transform to API request format
      apiRequest = requestAdapter.toApiRequest(formData as CopilotFormData);
    }

    // Make API call
    const url = apiUrlPaths.copilot.update(copilotId);
    const response = await axiosInstances.put(url, apiRequest);

    // Adapt response
    const copilot = copilotAdapter.adapt(response.data);

    return {
      success: true,
      data: copilot,
    };
  } catch (error: any) {
    console.error("Error updating copilot:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update copilot",
    };
  }
};

/**
 * Delete copilot
 */
export const deleteCopilot = async (
  copilotId: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const url = apiUrlPaths.copilot.delete(copilotId);
    await axiosInstances.delete(url);

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting copilot:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete copilot",
    };
  }
};

/**
 * Trigger copilot to run
 */
export const triggerCopilot = async (
  copilotId: string
): Promise<{ success: boolean; data?: TriggerCopilotResult; message?: string }> => {
  try {
    const url = apiUrlPaths.copilot.trigger(copilotId);
    const response = await axiosInstances.post(url);

    const data = triggerCopilotResultAdapter.adapt(
      response?.data?.data || response?.data
    );

    return { success: true, data };
  } catch (error: any) {
    console.error("Error triggering copilot:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to trigger copilot",
    };
  }
};

/**
 * Get copilot status
 */
export const getCopilotStatus = async (
  copilotId: string
): Promise<{ success: boolean; data?: CopilotStatus; message?: string }> => {
  try {
    const url = apiUrlPaths.copilot.status(copilotId);
    const response = await axiosInstances.get(url);

    const data = copilotStatusAdapter.adapt(
      response?.data?.data || response?.data
    );

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching copilot status:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch copilot status",
    };
  }
};

/**
 * Get matched jobs for copilot
 */
export const getCopilotMatchedJobs = async (
  copilotId: string
): Promise<{ success: boolean; data?: MatchedJob[]; message?: string }> => {
  try {
    const url = apiUrlPaths.copilot.matchedJobs(copilotId);
    const response = await axiosInstances.get(url);

    const rawData = response?.data?.jobs || response?.data?.data || response?.data;
    const data = Array.isArray(rawData)
      ? rawData.map((item: any) => matchedJobAdapter.adapt(item))
      : [];

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching matched jobs:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch matched jobs",
    };
  }
};

/**
 * Get copilot applications
 */
export const getCopilotApplications = async (
  copilotId: string
): Promise<{ success: boolean; data?: CopilotApplication[]; message?: string }> => {
  try {
    const url = apiUrlPaths.copilot.applications(copilotId);
    const response = await axiosInstances.get(url);

    const rawData =
      response?.data?.applications || response?.data?.data || response?.data;
    const data = Array.isArray(rawData)
      ? rawData.map((item: any) => copilotApplicationAdapter.adapt(item))
      : [];

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching copilot applications:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch copilot applications",
    };
  }
};

/**
 * Cancel copilot
 */
export const cancelCopilot = async (
  copilotId: string
): Promise<{ success: boolean; data?: CancelCopilotResult; message?: string }> => {
  try {
    const url = apiUrlPaths.copilot.cancel(copilotId);
    const response = await axiosInstances.delete(url);

    const data = cancelCopilotResultAdapter.adapt(
      response?.data?.data || response?.data
    );

    return { success: true, data };
  } catch (error: any) {
    console.error("Error cancelling copilot:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to cancel copilot",
    };
  }
};
