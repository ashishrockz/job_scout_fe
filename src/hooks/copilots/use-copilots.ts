import { useCallback, useEffect, useState } from "react";
import { Copilot } from "@/types/copilot";
import { getCopilots } from "@/lib/copilot.service";

interface UseCopilotListResult {
  copilots: Copilot[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCopilots = (): UseCopilotListResult => {
  const [copilots, setCopilots] = useState<Copilot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCopilots = useCallback(async () => {
    setLoading(true);
    setError(null);

    const response = await getCopilots();

    if (response.success) {
      setCopilots(response.data || []);
    } else {
      setError(response.message || "Failed to load copilots");
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCopilots();
  }, [fetchCopilots]);

  return {
    copilots,
    loading,
    error,
    refetch: fetchCopilots,
  };
};
