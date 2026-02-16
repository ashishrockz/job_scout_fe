import { Adapter } from "./adapters";
import {
  Copilot,
  CopilotConfig,
  CopilotStatus,
  CurrentRun,
  LastRun,
  CopilotStatistics,
  MatchedJob,
  CopilotApplication,
  TriggerCopilotResult,
  CancelCopilotResult,
} from "@/types/copilot";

/**
 * Copilot Config Adapter
 */
export class CopilotConfigAdapter implements Adapter<CopilotConfig> {
  adapt(data: any): CopilotConfig {
    const config = {} as CopilotConfig;

    try {
      config.jobTitles = Array.isArray(data?.job_titles) ? data.job_titles : [];
      config.locations = Array.isArray(data?.locations) ? data.locations : [];

      // Handle both remote_only and remote_work_type
      config.remoteOnly = data?.remote_only ?? (data?.remote_work_type === "fully_remote");

      // Handle both salary_min/max and min_salary/max_salary
      config.salaryMin = data?.salary_min ?? data?.min_salary ?? null;
      config.salaryMax = data?.salary_max ?? data?.max_salary ?? null;

      // Handle both experience_level and seniority
      config.experienceLevel = Array.isArray(data?.experience_level)
        ? data.experience_level
        : Array.isArray(data?.seniority)
          ? data.seniority
          : [];

      // Handle both auto_apply and auto_apply_mode
      config.autoApply = data?.auto_apply ?? (data?.auto_apply_mode === "auto_apply");

      // Handle both daily_limit and max_applications_per_day
      config.dailyLimit = data?.daily_limit ?? data?.max_applications_per_day ?? 0;
    } catch (error) {
      console.error("[CopilotConfigAdapter] Adaptation failed:", error);
    }

    return config;
  }
}

/**
 * Copilot Adapter
 */
export class CopilotAdapter implements Adapter<Copilot> {
  private configAdapter = new CopilotConfigAdapter();

  adapt(data: any): Copilot {
    const copilot = {} as Copilot;

    try {
      copilot.id = data?.id;
      copilot.name = data?.name;
      copilot.email = data?.email;
      copilot.platform = data?.platform ?? "linkedin";
      copilot.last_run_status = data?.last_run_status; // Store last_run_status for status derivation
      copilot.is_active = data?.is_active ?? false;
      copilot.status = data?.status ?? "paused"; // Default status
      // Derive status from is_active and last_run_status
      // if (data?.last_run_status === "running") {
      //   copilot.status = "running";
      // } else if (data?.is_active) {
      //   copilot.status = "active";
      // } else {
      //   copilot.status = "paused";
      // }

      copilot.createdAt = data?.created_at
        ? new Date(data.created_at)
        : new Date();
      copilot.updatedAt = data?.updated_at
        ? new Date(data.updated_at)
        : new Date();
      copilot.lastRunAt = data?.last_run_at
        ? new Date(data.last_run_at)
        : null;

      // Pass the root-level data to configAdapter (handles both nested config and flat structure)
      copilot.config = this.configAdapter.adapt(data?.config || data);
    } catch (error) {
      console.error("[CopilotAdapter] Adaptation failed:", error);
    }

    return copilot;
  }
}

/**
 * Current Run Adapter
 */
export class CurrentRunAdapter implements Adapter<CurrentRun> {
  adapt(data: any): CurrentRun {
    const currentRun = {} as CurrentRun;

    try {
      currentRun.taskId = data?.task_id;
      currentRun.startedAt = data?.started_at
        ? new Date(data.started_at)
        : new Date();
      currentRun.jobsFound = data?.jobs_found ?? 0;
      currentRun.jobsApplied = data?.jobs_applied ?? 0;
      currentRun.jobsSkipped = data?.jobs_skipped ?? 0;
    } catch (error) {
      console.error("[CurrentRunAdapter] Adaptation failed:", error);
    }

    return currentRun;
  }
}

/**
 * Last Run Adapter
 */
export class LastRunAdapter implements Adapter<LastRun> {
  adapt(data: any): LastRun {
    const lastRun = {} as LastRun;

    try {
      lastRun.taskId = data?.task_id;
      lastRun.startedAt = data?.started_at
        ? new Date(data.started_at)
        : new Date();
      lastRun.completedAt = data?.completed_at
        ? new Date(data.completed_at)
        : new Date();
      lastRun.jobsFound = data?.jobs_found ?? 0;
      lastRun.jobsApplied = data?.jobs_applied ?? 0;
      lastRun.jobsSkipped = data?.jobs_skipped ?? 0;
      lastRun.status = data?.status;
    } catch (error) {
      console.error("[LastRunAdapter] Adaptation failed:", error);
    }

    return lastRun;
  }
}

/**
 * Copilot Statistics Adapter
 */
export class CopilotStatisticsAdapter implements Adapter<CopilotStatistics> {
  adapt(data: any): CopilotStatistics {
    const stats = {} as CopilotStatistics;

    try {
      stats.totalRuns = data?.total_runs ?? 0;
      stats.totalJobsFound = data?.total_jobs_found ?? 0;
      stats.totalApplications = data?.total_applications ?? 0;
      stats.successRate = data?.success_rate ?? 0;
    } catch (error) {
      console.error("[CopilotStatisticsAdapter] Adaptation failed:", error);
    }

    return stats;
  }
}

/**
 * Copilot Status Adapter
 */
export class CopilotStatusAdapter implements Adapter<CopilotStatus> {
  private currentRunAdapter = new CurrentRunAdapter();
  private lastRunAdapter = new LastRunAdapter();
  private statisticsAdapter = new CopilotStatisticsAdapter();

  adapt(data: any): CopilotStatus {
    const status = {} as CopilotStatus;

    try {
      status.copilotId = data?.copilot_id;
      status.status = data?.status;
      status.currentRun = data?.current_run
        ? this.currentRunAdapter.adapt(data.current_run)
        : null;
      status.statistics = this.statisticsAdapter.adapt(data?.statistics);
      status.lastRun = data?.last_run
        ? this.lastRunAdapter.adapt(data.last_run)
        : null;
    } catch (error) {
      console.error("[CopilotStatusAdapter] Adaptation failed:", error);
    }

    return status;
  }
}

/**
 * Matched Job Adapter
 */
export class MatchedJobAdapter implements Adapter<MatchedJob> {
  adapt(data: any): MatchedJob {
    const job = {} as MatchedJob;

    try {
      job.id = data?.id;
      job.title = data?.title;
      job.company = data?.company;
      job.location = data?.location;
      job.url = data?.url;
      job.platform = data?.platform;
      job.salary = data?.salary ?? null;
      job.matchedAt = data?.matched_at
        ? new Date(data.matched_at)
        : new Date();
      job.matchScore = data?.match_score ?? 0;
      job.status = data?.status;
    } catch (error) {
      console.error("[MatchedJobAdapter] Adaptation failed:", error);
    }

    return job;
  }
}

/**
 * Copilot Application Adapter
 */
export class CopilotApplicationAdapter implements Adapter<CopilotApplication> {
  adapt(data: any): CopilotApplication {
    const application = {} as CopilotApplication;

    try {
      application.id = data?.id;
      application.jobId = data?.job_id;
      application.jobTitle = data?.job_title;
      application.company = data?.company;
      application.jobUrl = data?.job_url;
      application.platform = data?.platform;
      application.status = data?.status;
      application.appliedAt = data?.applied_at
        ? new Date(data.applied_at)
        : new Date();
      application.errorMessage = data?.error_message ?? null;
    } catch (error) {
      console.error("[CopilotApplicationAdapter] Adaptation failed:", error);
    }

    return application;
  }
}

/**
 * Trigger Copilot Result Adapter
 */
export class TriggerCopilotResultAdapter
  implements Adapter<TriggerCopilotResult>
{
  adapt(data: any): TriggerCopilotResult {
    const result = {} as TriggerCopilotResult;

    try {
      result.success = data?.success ?? false;
      result.taskId = data?.task_id;
      result.message = data?.message;
    } catch (error) {
      console.error("[TriggerCopilotResultAdapter] Adaptation failed:", error);
    }

    return result;
  }
}

/**
 * Cancel Copilot Result Adapter
 */
export class CancelCopilotResultAdapter
  implements Adapter<CancelCopilotResult>
{
  adapt(data: any): CancelCopilotResult {
    const result = {} as CancelCopilotResult;

    try {
      result.success = data?.success ?? false;
      result.message = data?.message;
    } catch (error) {
      console.error("[CancelCopilotResultAdapter] Adaptation failed:", error);
    }

    return result;
  }
}
