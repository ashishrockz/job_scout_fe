import { Adapter } from "./adapters";

export class CandidatePreferences {
  workLocation?: string[];
  jobTypes?: string[] | null;
  jobTitles?: string[];
  seniority?: string[] | null;
}
export class CandidateProfileListResponse {
  total?: number;
  profiles?: CandidateProfile[];
}

export class CandidateProfile {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  linkedinUrl?: string | null;
  resumeId?: number | null;
  preferences?: CandidatePreferences;
  createdAt?: Date;
  updatedAt?: Date;
}

export class CandidatePreferencesAdapter
  implements Adapter<CandidatePreferences>
{
  adapt(data: any): CandidatePreferences {
    const prefs = new CandidatePreferences();
    try {
      prefs.workLocation = data?.work_location ?? [];
      prefs.jobTypes = data?.job_types ?? null;
      prefs.jobTitles = data?.job_titles ?? [];
      prefs.seniority = data?.seniority ?? null;
    } catch (error) {
      console.error("[CandidatePreferencesAdapter] Adaptation failed:", error);
    }
    return prefs;
  }
}

export class CandidateProfileAdapter implements Adapter<CandidateProfile> {
  adapt(data: any): CandidateProfile {
    const profile = new CandidateProfile();
    try {
      profile.id = data?.id;
      profile.email = data?.email;
      profile.firstName = data?.first_name;
      profile.lastName = data?.last_name;
      profile.phone = data?.phone ?? null;
      profile.linkedinUrl = data?.linkedin_url ?? null;
      profile.resumeId = data?.resume_id ?? null;

      profile.preferences = data?.preferences
        ? new CandidatePreferencesAdapter().adapt(data.preferences)
        : undefined;

      profile.createdAt = data?.created_at
        ? new Date(data.created_at)
        : undefined;
      profile.updatedAt = data?.updated_at
        ? new Date(data.updated_at)
        : undefined;
    } catch (error) {
      console.error("[CandidateProfileAdapter] Adaptation failed:", error);
    }
    return profile;
  }
}

export class CandidateProfileListAdapter
  implements Adapter<CandidateProfileListResponse>
{
  adapt(data: any): CandidateProfileListResponse {
    const response = new CandidateProfileListResponse();
    try {
      response.total = Array.isArray(data) ? data.length : 0;
      response.profiles = Array.isArray(data)
        ? data.map((item: any) => new CandidateProfileAdapter().adapt(item))
        : [];
    } catch (error) {
      console.error("[CandidateProfileListAdapter] Adaptation failed:", error);
    }
    return response;
  };
};
