import { getApplicationsByCandidateEmail } from '@/lib/application.service';
import { CandidateApplications } from '@/types/application';
import { useEffect, useState } from 'react';


export const useCandidateApplications = (
  email?: string,
  limit = 100
) => {
  const [data, setData] = useState<CandidateApplications | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;

    const fetchApplications = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getApplicationsByCandidateEmail(email, limit);
        if(response?.data){
          setData(response?.data);
        }
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [email, limit]);

  return { data, loading, error };
};
