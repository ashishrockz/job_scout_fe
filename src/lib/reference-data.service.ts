import {
  JobTitlesResponse,
  JobTitleSearchParams,
  CountriesResponse,
  StatesResponse,
  LocationHierarchyResponse,
  LocationHierarchyApiResponse,
  TimezonesResponse,
  LanguagesResponse,
} from "@/types/reference-data";
import { apiUrlPaths } from "./api.paths";
import { axiosInstances } from "./networkInstance";

/**
 * Get all job titles
 */
export const getJobTitles = async (): Promise<JobTitlesResponse> => {
  try {
    const url = apiUrlPaths.jobTitles.list();
    const response = await axiosInstances.get(url);

    const data = Array.isArray(response?.data?.job_titles)
      ? response.data.job_titles
      : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching job titles:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch job titles",
    };
  }
};

/**
 * Search job titles by query
 */
export const searchJobTitles = async (
  params: JobTitleSearchParams
): Promise<JobTitlesResponse> => {
  try {
    const url = apiUrlPaths.jobTitles.search(params.query);
    const response = await axiosInstances.get(url, {
      params: { limit: params.limit || 10 },
    });

    const data = Array.isArray(response?.data.job_titles)
      ? response.data.job_titles
      : Array.isArray(response?.data)
        ? response.data
        : [];

    return { success: true, data };
  } catch (error: any) {
    console.error("Error searching job titles:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to search job titles",
    };
  }
};

/**
 * Get all countries
 */
export const getCountries = async (): Promise<CountriesResponse> => {
  try {
    const url = apiUrlPaths.location.countries();
    const response = await axiosInstances.get(url);

    const data = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching countries:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch countries",
    };
  }
};

/**
 * Get states for a specific country
 */
export const getStates = async (
  countryCode: string
): Promise<StatesResponse> => {
  try {
    const url = apiUrlPaths.location.states(countryCode);
    const response = await axiosInstances.get(url);

    const data = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching states:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch states",
    };
  }
};

/**
 * Get location hierarchy (countries with their states/cities)
 */
export const getLocationHierarchy =
  async (): Promise<LocationHierarchyResponse> => {
    try {
      const url = apiUrlPaths.location.hierarchy();
      const response = await axiosInstances.get<LocationHierarchyApiResponse>(url);

      // Parse the locations array from the API response
      const data = Array.isArray(response?.data?.locations)
        ? response.data.locations
        : [];

      return { success: true, data };
    } catch (error: any) {
      console.error("Error fetching location hierarchy:", error);

      return {
        success: false,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch location hierarchy",
      };
    }
  };

/**
 * Get all timezones
 */
export const getTimezones = async (): Promise<TimezonesResponse> => {
  try {
    const url = apiUrlPaths.timezones.list();
    const response = await axiosInstances.get(url);

    const data = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching timezones:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch timezones",
    };
  }
};

/**
 * Get all languages
 */
export const getLanguages = async (): Promise<LanguagesResponse> => {
  try {
    const url = apiUrlPaths.languages.list();
    const response = await axiosInstances.get(url);

    const data = Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching languages:", error);

    return {
      success: false,
      message:
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch languages",
    };
  }
};
