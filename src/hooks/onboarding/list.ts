import { getCandidateProfileList } from "@/lib/onboarding.service";
import { CandidateProfile } from "@/models/candidatePreferences";
import { useState, useEffect } from "react";
interface UseCandidateProfileResult {
  profiles: CandidateProfile[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
export const useCandidateProfileList = (email: string): UseCandidateProfileResult => {
  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfilesList = async () => {
    setLoading(true);
    const res = await getCandidateProfileList(email);

    if (res.success) {
      setProfiles(res.data?.profiles || []);
    } else {
      setError(res.message || "Failed to load profiles");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfilesList();
  }, [email]);

  return { profiles, loading, error, refetch: fetchProfilesList };
};
