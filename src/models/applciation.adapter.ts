import {
  Application,
  ApplicationDetail,
  CandidateApplications,
  CandidateStats,
} from "@/types/application";
import { Adapter } from "./adapters";
import { ActiveTask } from "./copilots";

/**
 * Generic Adapter Interface
 */

/**
 * Application Adapter
 */
export class ApplicationAdapter implements Adapter<Application> {
  adapt(data: any): Application {
    const application = {} as Application;

    try {
      application.id = data?.id;
      application.jobId = data?.job_id;
      application.jobTitle = data?.job_title;
      application.company = data?.company;
      application.jobUrl = data?.job_url;
      application.platform = data?.platform;
      application.applicantEmail = data?.applicant_email;
      application.applicantName = data?.applicant_name;
      application.status = data?.status;
      application.appliedAt = data?.applied_at
        ? new Date(data.applied_at)
        : undefined;
      application.resumePath = data?.resume_path;
      application.screenshotPath = data?.screenshot_path;
      application.errorMessage = data?.error_message;
    } catch (error) {
      console.error("[ApplicationAdapter] Adaptation failed:", error);
    }

    return application;
  }
}

/**
 * Application Detail Adapter
 */
export class ApplicationDetailAdapter
  implements Adapter<ApplicationDetail>
{
  adapt(data: any): ApplicationDetail {
    const detail = {} as ApplicationDetail;

    try {
      detail.id = data?.id;
      detail.jobId = data?.job_id;
      detail.job = {
        id: data?.job?.id,
        title: data?.job?.title,
        company: data?.job?.company,
        url: data?.job?.url,
        platform: data?.job?.platform,
        location: data?.job?.location,
      };
      detail.applicantEmail = data?.applicant_email;
      detail.applicantName = data?.applicant_name;
      detail.status = data?.status;
      detail.appliedAt = data?.applied_at
        ? new Date(data.applied_at)
        : undefined;
      detail.resumePath = data?.resume_path;
      detail.screenshotPath = data?.screenshot_path;
      detail.errorMessage = data?.error_message;
      detail.formData = data?.form_data;
    } catch (error) {
      console.error("[ApplicationDetailAdapter] Adaptation failed:", error);
    }

    return detail;
  }
}

/**
 * Candidate Applications Adapter
 */
export class CandidateApplicationsAdapter
  implements Adapter<CandidateApplications>
{
  private applicationAdapter = new ApplicationAdapter();

  adapt(data: any): CandidateApplications {
    const result = {} as CandidateApplications;

    try {
      result.applicantEmail = data?.applicant_email;
      result.total = data?.total ?? 0;
      result.applications = Array.isArray(data?.applications)
        ? data.applications.map((app: any) =>
            this.applicationAdapter.adapt(app),
          )
        : [];
    } catch (error) {
      console.error(
        "[CandidateApplicationsAdapter] Adaptation failed:",
        error,
      );
    }

    return result;
  }
}

/**
 * Candidate Stats Adapter
 */
export class CandidateStatsAdapter implements Adapter<CandidateStats> {
  adapt(data: any): CandidateStats {
    const stats = {} as CandidateStats;

    try {
      stats.applicantEmail = data?.applicant_email;
      stats.totalApplications = data?.total_applications ?? 0;
      stats.appliedApplications = data?.applied_applications ?? 0;
      stats.failedApplications = data?.failed_applications ?? 0;
      stats.platforms = data?.platforms ?? [];
      stats.lastAppliedAt = data?.last_applied_at
        ? new Date(data.last_applied_at)
        : null;
    } catch (error) {
      console.error("[CandidateStatsAdapter] Adaptation failed:", error);
    }

    return stats;
  }
}

/**
 * Active Copilots Adapter
 */
export class ActiveCopilotsAdapter implements Adapter<ActiveTask> {
  adapt(data: any): ActiveTask {
    const task = new ActiveTask();

    try {
      task.id = data?.task_id;
      task.status = data?.status;
      task.platform = data?.platform;
      task.startedAt = data?.started_at
        ? new Date(data.started_at)
        : undefined;
      task.jobsScraped = data?.jobs_scraped ?? 0;
      task.jobsEnriched = data?.jobs_enriched ?? 0;
    } catch (error) {
      console.error("[ActiveTaskAdapter] Adaptation failed:", error);
    }

    return task;
  }
}
