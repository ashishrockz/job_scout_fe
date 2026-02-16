import { useCallback, useEffect, useState } from "react";
import { CopilotScrapingResponse } from "@/models/copilots";
import { getActiveScrapingTasks } from "@/lib/copilotscraping";

interface UseActiveScrapingTasksResult {
  tasks: CopilotScrapingResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useActiveScrapingTasks = (): UseActiveScrapingTasksResult => {
  const [tasks, setTasks] = useState<CopilotScrapingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await getActiveScrapingTasks();

    if (response.success) {
      setTasks(response.data || null);
    } else {
      setError(response.message || "Failed to load active scraping tasks");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  };
};
