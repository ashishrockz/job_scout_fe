import { useCallback, useEffect, useState } from "react";
import { MatchedJob } from "@/types/copilot";
import { getCopilotMatchedJobs } from "@/lib/copilot.service";

interface UseCopilotMatchedJobsResult {
  matchedJobs: MatchedJob[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCopilotMatchedJobs = (
  copilotId?: number
): UseCopilotMatchedJobsResult => {
  const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatchedJobs = useCallback(async () => {
    if (!copilotId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const response = await getCopilotMatchedJobs(copilotId);

    if (response.success) {
      setMatchedJobs(response.data || []);
    } else {
      setError(response.message || "Failed to load matched jobs");
    }

    setLoading(false);
  }, [copilotId]);

  useEffect(() => {
    fetchMatchedJobs();
  }, [fetchMatchedJobs]);

  return {
    matchedJobs,
    loading,
    error,
    refetch: fetchMatchedJobs,
  };
};
