import { useCallback, useEffect, useState } from "react";
import { Copilot } from "@/types/copilot";
import { getCopilotById } from "@/lib/copilot.service";

interface UseCopilotByIdResult {
  copilot: Copilot | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCopilotById = (copilotId?: number): UseCopilotByIdResult => {
  const [copilot, setCopilot] = useState<Copilot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCopilot = useCallback(async () => {
    if (!copilotId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const response = await getCopilotById(copilotId);

    if (response.success) {
      setCopilot(response.data || null);
    } else {
      setError(response.message || "Failed to load copilot details");
    }

    setLoading(false);
  }, [copilotId]);

  useEffect(() => {
    fetchCopilot();
  }, [fetchCopilot]);

  return {
    copilot,
    loading,
    error,
    refetch: fetchCopilot,
  };
};
