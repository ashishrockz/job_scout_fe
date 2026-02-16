export interface ApplicationApiResponse {
  id: number;
  job_id: number;
  job_title: string;
  company: string;
  job_url: string;
  platform: string;
  applicant_email: string;
  applicant_name: string;
  status: 'success' | 'failed' | 'pending';
  applied_at: string; // ISO string
  resume_path: string | null;
  screenshot_path: string | null;
  error_message: string | null;
}


export interface JobInfoApi {
  id: number;
  title: string;
  company: string;
  url: string;
  platform: string;
  location: string;
}

export interface ApplicationDetailApiResponse {
  id: number;
  job_id: number;
  job: JobInfoApi;
  applicant_email: string;
  applicant_name: string;
  status: string;
  applied_at: string;
  resume_path: string | null;
  screenshot_path: string | null;
  error_message: string | null;
  form_data: Record<string, any>;
}

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  jobUrl: string;
  platform: string;
  applicantEmail: string;
  applicantName: string;
  status: string;
  appliedAt: Date | undefined;
  resumePath?: string | null;
  screenshotPath?: string | null;
  errorMessage?: string | null;
}


export interface ApplicationDetail {
  id: number;
  jobId: number;
  job: {
    id: number;
    title: string;
    company: string;
    url: string;
    platform: string;
    location: string;
  };
  applicantEmail: string;
  applicantName: string;
  status: string;
  appliedAt: Date | undefined;
  resumePath?: string | null;
  screenshotPath?: string | null;
  errorMessage?: string | null;
  formData: Record<string, any>;
}

export interface CandidateApplicationApi {
  id: number;
  job_id: number;
  job_title: string;
  company: string;
  job_url: string;
  platform: string;
  applicant_email: string;
  applicant_name: string;
  status: string;
  applied_at: string;
  resume_path: string | null;
  screenshot_path: string | null;
  error_message: string | null;
}

export interface CandidateApplicationsApiResponse {
  applicant_email: string;
  applications: CandidateApplicationApi[];
  total: number;
}

export interface CandidateApplications {
  applicantEmail: string;
  applications: Application[];
  total: number;
}


export interface CandidateStatsApiResponse {
  applicant_email: string;
  total_applications: number;
  applied_applications: number;
  failed_applications: number;
  platforms: string[];
  last_applied_at: string | null;
}

export interface CandidateStats {
  applicantEmail: string;
  totalApplications: number;
  appliedApplications: number;
  failedApplications: number;
  platforms: string[];
  lastAppliedAt: Date | null;
}