import { getApplications } from '@/lib/application.service';
import { Application } from '@/types/application';
import { useEffect, useState } from 'react';


export const useApplicationsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const data = await getApplications(100);
        if(data?.success){
            setApplications(data?.data);
        }
      } catch (error) {
        console.error('Failed to fetch applications', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return {loading,applications};
};
