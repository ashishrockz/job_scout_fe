import { useCallback, useEffect, useState } from "react";
import { CopilotStatus } from "@/types/copilot";
import { getCopilotStatus } from "@/lib/copilot.service";

interface UseCopilotStatusResult {
  status: CopilotStatus | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCopilotStatus = (
  copilotId?: number
): UseCopilotStatusResult => {
  const [status, setStatus] = useState<CopilotStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!copilotId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const response = await getCopilotStatus(copilotId);

    if (response.success) {
      setStatus(response.data || null);
    } else {
      setError(response.message || "Failed to load copilot status");
    }

    setLoading(false);
  }, [copilotId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    loading,
    error,
    refetch: fetchStatus,
  };
};
