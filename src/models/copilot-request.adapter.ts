import { CopilotFormData } from "@/context/copilot-form-context";

/**
 * Interface for the API request payload (snake_case for backend)
 */
export interface CreateCopilotApiRequest {
  // Step 1: Location & Jobs
  enable_remote: boolean;
  enable_onsite: boolean;
  remote_locations: string[];
  onsite_locations: string[];
  job_types: string[];
  search_method: "keywords" | "favorite" | "applied";
  job_titles: string[];

  // Step 2: Filters
  job_match_enabled: boolean;
  job_match_level: "high" | "higher" | "highest";
  seniority: string[];
  time_zones: string[];
  include_flexible_time_zone: boolean;
  industries: string[];
  job_description_languages: string[];
  location_radius: string;
  include_keywords: string[];
  exclude_keywords: string[];
  exclude_companies: string[];

  // Step 3: Profile
  cv_link: string;
  phone_number: string;
  cover_letter: string;
  current_location: string;
  current_job_title: string;
  availability: string;
  eligible_countries: string[];
  future_languages: string[];
  nationality: string[];
  current_salary: string;
  expected_salary: string;
  expected_salary_full_time: string;
  expected_salary_part_time: string;
  linked_in_profile: string;
  experience_summary: string;
  screening_questions: string;
  state_region: string;
  post_code: string;

  // Step 4: Config
  application_mode: "auto-save" | "full-auto";
  writing_style: string;
}

/**
 * Adapter to transform frontend form data (camelCase) to backend API format (snake_case)
 */
export class CreateCopilotRequestAdapter {
  /**
   * Transform CopilotFormData to CreateCopilotApiRequest
   */
  toApiRequest(formData: CopilotFormData): CreateCopilotApiRequest {
    return {
      // Step 1: Location & Jobs
      enable_remote: formData.step1.enableRemote ?? false,
      enable_onsite: formData.step1.enableOnsite ?? false,
      remote_locations: formData.step1.remoteLocations || [],
      onsite_locations: formData.step1.onsiteLocations || [],
      job_types: formData.step1.jobTypes || [],
      search_method: formData.step1.searchMethod || "keywords",
      job_titles: formData.step1.jobTitles || [],

      // Step 2: Filters
      job_match_enabled: formData.step2.jobMatchEnabled ?? true,
      job_match_level: formData.step2.jobMatchLevel || "high",
      seniority: formData.step2.seniority || [],
      time_zones: formData.step2.timeZones || [],
      include_flexible_time_zone: formData.step2.includeFlexibleTimeZone ?? true,
      industries: formData.step2.industries || [],
      job_description_languages: formData.step2.jobDescriptionLanguages || [],
      location_radius: formData.step2.locationRadius || "",
      include_keywords: formData.step2.includeKeywords || [],
      exclude_keywords: formData.step2.excludeKeywords || [],
      exclude_companies: formData.step2.excludeCompanies || [],

      // Step 3: Profile
      cv_link: formData.step3.cvLink || "",
      phone_number: formData.step3.phoneNumber || "",
      cover_letter: formData.step3.coverLetter || "",
      current_location: formData.step3.currentLocation || "",
      current_job_title: formData.step3.currentJobTitle || "",
      availability: formData.step3.availability || "",
      eligible_countries: formData.step3.eligibleCountries || [],
      future_languages: formData.step3.futureLanguages || [],
      nationality: formData.step3.nationality || [],
      current_salary: formData.step3.currentSalary || "",
      expected_salary: formData.step3.expectedSalary || "",
      expected_salary_full_time: formData.step3.expectedSalaryFullTime || "",
      expected_salary_part_time: formData.step3.expectedSalaryPartTime || "",
      linked_in_profile: formData.step3.linkedInProfile || "",
      experience_summary: formData.step3.experienceSummary || "",
      screening_questions: formData.step3.screeningQuestions || "",
      state_region: formData.step3.stateRegion || "",
      post_code: formData.step3.postCode || "",

      // Step 4: Config
      application_mode: formData.step4.applicationMode || "auto-save",
      writing_style: formData.step4.writingStyle || "",
    };
  }

  /**
   * Validate required fields before submission
   * Returns an array of error messages, empty if valid
   */
  validate(formData: CopilotFormData): string[] {
    const errors: string[] = [];

    // Validate Step 1
    if (!formData.step1.enableRemote && !formData.step1.enableOnsite) {
      errors.push("Please select at least one work location type (Remote or On-site)");
    }
    if (!formData.step1.jobTypes || formData.step1.jobTypes.length === 0) {
      errors.push("At least one job type is required");
    }
    if (formData.step1.searchMethod === "keywords" &&
        (!formData.step1.jobTitles || formData.step1.jobTitles.length === 0)) {
      errors.push("At least one job title is required when using keyword search");
    }

    // Add more validation as needed based on API requirements

    return errors;
  }
}
