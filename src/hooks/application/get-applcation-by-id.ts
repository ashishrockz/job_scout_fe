import { getApplicationById } from '@/lib/application.service';
import { ApplicationDetail } from '@/types/application';
import { useEffect, useState } from 'react';


export const useApplicationById = (applicationId?: number) => {
  const [data, setData] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!applicationId) return;

    const fetchApplication = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getApplicationById(applicationId);
        if(response?.data){
           setData(response?.data);
        }
      } catch (err: any) {
        console.error('Failed to fetch application by id', err);
        setError(err?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [applicationId]);

  return { data, loading, error };
};
