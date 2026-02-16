// ==========================================
// API Response Types (snake_case from backend)
// ==========================================

export interface CopilotApiResponse {
  id: string;
  name: string;
  email: string;
  platform: string;
  status: 'active' | 'paused' | 'stopped' | 'running';
  created_at: string;
  updated_at: string;
  last_run_at: string | null;
  config: CopilotConfigApi;
}

export interface CopilotConfigApi {
  job_titles: string[];
  locations: string[];
  remote_only: boolean;
  salary_min: number | null;
  salary_max: number | null;
  experience_level: string[];
  auto_apply: boolean;
  daily_limit: number;
}

export interface CopilotStatusApiResponse {
  copilot_id: number;
  status: string;
  current_run: CurrentRunApi | null;
  statistics: CopilotStatisticsApi;
  last_run: LastRunApi | null;
}

export interface CurrentRunApi {
  task_id: string;
  started_at: string;
  jobs_found: number;
  jobs_applied: number;
  jobs_skipped: number;
}

export interface LastRunApi {
  task_id: string;
  started_at: string;
  completed_at: string;
  jobs_found: number;
  jobs_applied: number;
  jobs_skipped: number;
  status: string;
}

export interface CopilotStatisticsApi {
  total_runs: number;
  total_jobs_found: number;
  total_applications: number;
  success_rate: number;
}

export interface MatchedJobApiResponse {
  id: number;
  title: string;
  company: string;
  location: string;
  url: string;
  platform: string;
  salary: string | null;
  matched_at: string;
  match_score: number;
  status: 'pending' | 'applied' | 'skipped' | 'rejected';
}

export interface CopilotApplicationApiResponse {
  id: number;
  job_id: number;
  job_title: string;
  company: string;
  job_url: string;
  platform: string;
  status: 'success' | 'failed' | 'pending';
  applied_at: string;
  error_message: string | null;
}

export interface TriggerCopilotApiResponse {
  success: boolean;
  task_id: string;
  message: string;
}

export interface CancelCopilotApiResponse {
  success: boolean;
  message: string;
}

// ==========================================
// Domain Model Types (camelCase for frontend)
// ==========================================

export interface Copilot {
  id: string;
  name: string;
  email: string;
  platform: string;
  status: 'active' | 'paused' | 'stopped' | 'running';
  createdAt: Date;
  updatedAt: Date;
  lastRunAt: Date | null;
  config: CopilotConfig;
  is_active: boolean;
  last_run_status: string | null;
}

export interface CopilotConfig {
  jobTitles: string[];
  locations: string[];
  remoteOnly: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  experienceLevel: string[];
  autoApply: boolean;
  dailyLimit: number;
}

export interface CopilotStatus {
  copilotId: number;
  status: string;
  currentRun: CurrentRun | null;
  statistics: CopilotStatistics;
  lastRun: LastRun | null;
}

export interface CurrentRun {
  taskId: string;
  startedAt: Date;
  jobsFound: number;
  jobsApplied: number;
  jobsSkipped: number;
}

export interface LastRun {
  taskId: string;
  startedAt: Date;
  completedAt: Date;
  jobsFound: number;
  jobsApplied: number;
  jobsSkipped: number;
  status: string;
}

export interface CopilotStatistics {
  totalRuns: number;
  totalJobsFound: number;
  totalApplications: number;
  successRate: number;
}

export interface MatchedJob {
  id: number;
  title: string;
  company: string;
  location: string;
  url: string;
  platform: string;
  salary: string | null;
  matchedAt: Date;
  matchScore: number;
  status: 'pending' | 'applied' | 'skipped' | 'rejected';
}

export interface CopilotApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  jobUrl: string;
  platform: string;
  status: 'success' | 'failed' | 'pending';
  appliedAt: Date;
  errorMessage: string | null;
}

export interface TriggerCopilotResult {
  success: boolean;
  taskId: string;
  message: string;
}

export interface CancelCopilotResult {
  success: boolean;
  message: string;
}

// ==========================================
// Update Copilot Request Types
// ==========================================

export interface UpdateCopilotRequest {
  name?: string;
  status?: 'active' | 'paused' | 'stopped';
  config?: Partial<CopilotConfigApi>;
}

// ==========================================
// Service Response Types
// ==========================================

export interface CopilotsResponse {
  success: boolean;
  data?: Copilot[];
  message?: string;
}

export interface CopilotResponse {
  success: boolean;
  data?: Copilot;
  message?: string;
}

export interface CopilotStatusResponse {
  success: boolean;
  data?: CopilotStatus;
  message?: string;
}

export interface MatchedJobsResponse {
  success: boolean;
  data?: MatchedJob[];
  message?: string;
}

export interface CopilotApplicationsResponse {
  success: boolean;
  data?: CopilotApplication[];
  message?: string;
}

export interface TriggerCopilotResponse {
  success: boolean;
  data?: TriggerCopilotResult;
  message?: string;
}

export interface CancelCopilotResponse {
  success: boolean;
  data?: CancelCopilotResult;
  message?: string;
}

export interface DeleteCopilotResponse {
  success: boolean;
  message?: string;
}

// Re-export existing types from copilot.d.ts for backwards compatibility
export interface ActiveScrapingTasksResponse {
  success: boolean;
  data?: CopilotScrapingResponse;
  message?: string;
}

export interface CopilotScrapingResponse {
  total?: number;
  tasks?: ActiveTask[];
}

export interface ActiveTask {
  id?: string;
  status?: string;
  platform?: string;
  startedAt?: Date;
  jobsScraped?: number;
  jobsEnriched?: number;
}

export interface CandidateProfileResponse {
  success: boolean;
  data?: any; // Using any for now to avoid circular dependency or import issues, or define properly if possible
  message?: string;
}

export interface CandidateProfileListResponseType {
  success: boolean;
  data?: any;
  message?: string;
}
