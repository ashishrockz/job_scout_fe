export interface ActiveScrapingTasksResponse {
  success: boolean;
  data?: CopilotScrapingResponse;
  message?: string;
};

export interface CandidateProfileResponse {
  success: boolean;
  data?: CandidateProfile;
  message?: string;
}
export interface CandidateProfileListResponseType {
  success: boolean;
  data?: CandidateProfileListResponse;
  message?: string;
}
