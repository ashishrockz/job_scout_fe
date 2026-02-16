import { Adapter } from "./adapters";

export class ActiveTask {
  id?: string;
  status?: string;
  platform?: string;
  startedAt?: Date;
  jobsScraped?: number;
  jobsEnriched?: number;
}
export class CopilotScrapingResponse {
  total?: number;
  tasks?: ActiveTask[];
}

export class ActiveCopilotsAdapter implements Adapter<ActiveTask> {
  adapt(data: any): ActiveTask {
    const task = new ActiveTask();
    try {
      task.id = data?.task_id;
      task.status = data?.status;
      task.platform = data?.platform;
      task.startedAt = data?.started_at ? new Date(data.started_at) : undefined;
      task.jobsScraped = data?.jobs_scraped ?? 0;
      task.jobsEnriched = data?.jobs_enriched ?? 0;
    } catch (error) {
      console.error("[ActiveTaskAdapter] Adaptation failed:", error);
    }
    return task;
  }
}

export class CopilotScrapingResponseAdapter
  implements Adapter<CopilotScrapingResponse>
{
  adapt(data: any): CopilotScrapingResponse {
    const response = new CopilotScrapingResponse();
    try {
      response.total = data?.total ?? 0;
      response.tasks = Array?.isArray(data?.active_tasks)
        ? data?.active_tasks?.map((t: any) =>
            new ActiveCopilotsAdapter()?.adapt(t)
          )
        : [];
    } catch (error) {
      console.error(
        "[CopilotScrapingResponseAdapter] Adaptation failed:",
        error
      );
    }
    return response;
  }
}
