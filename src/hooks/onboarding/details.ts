import { getCandidateProfile } from "@/lib/onboarding.service";
import { CandidateProfile } from "@/models/candidatePreferences";
import { useCallback, useEffect, useState } from "react";

interface UseCandidateProfileResult {
  profile: CandidateProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCandidateProfile = (
  email: string
): UseCandidateProfileResult => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!email) return;

    setLoading(true);
    setError(null);

    const response = await getCandidateProfile(email);

    if (response.success) {
      setProfile(response.data || null);
    } else {
      setError(response.message || "Failed to load profile details");
    }

    setLoading(false);
  }, [email]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
};
