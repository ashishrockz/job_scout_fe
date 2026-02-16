import { getCandidateStats } from '@/lib/application.service';
import { CandidateStats } from '@/types/application';
import { useEffect, useState } from 'react';


export const useCandidateStats = (email?: string) => {
  const [data, setData] = useState<CandidateStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getCandidateStats(email);
        if(response.data){
             setData(response?.data);
        }
      } catch (err: any) {
        console.error(err);
        setError(err?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [email]);

  return { data, loading, error };
};
