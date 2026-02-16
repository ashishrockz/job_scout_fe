import { useCallback, useEffect, useState } from "react";
import { CopilotApplication } from "@/types/copilot";
import { getCopilotApplications } from "@/lib/copilot.service";

interface UseCopilotApplicationsResult {
  applications: CopilotApplication[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCopilotApplications = (
  copilotId?: number
): UseCopilotApplicationsResult => {
  const [applications, setApplications] = useState<CopilotApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!copilotId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const response = await getCopilotApplications(copilotId);

    if (response.success) {
      setApplications(response.data || []);
    } else {
      setError(response.message || "Failed to load copilot applications");
    }

    setLoading(false);
  }, [copilotId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
  };
};
