export const apiUrlPaths = {
  onboarding: {
    profile: (email: string) => `/onboarding/profile/${email}`,
    list: (email: string) => `/onboarding/profile/${email}/resumes`,
  },
  scraping: {
    tasks: {
      active: (): string => `/scraping/tasks/active`,
    },
  },
  copilot: {
    list: (): string => `/copilots`,
    create: (): string => `/copilot`,
    getById: (copilotId: string): string => `/copilot/${copilotId}`,
    update: (copilotId: string): string => `/copilot/${copilotId}`,
    delete: (copilotId: string): string => `/copilot/${copilotId}`,
    trigger: (copilotId: string): string => `/copilot/${copilotId}/trigger`,
    status: (copilotId: string): string => `/copilot/${copilotId}/status`,
    matchedJobs: (copilotId: string): string => `/copilot/${copilotId}/matched-jobs`,
    applications: (copilotId: string): string => `/copilot/${copilotId}/applications`,
    cancel: (copilotId: string): string => `/copilot/${copilotId}/cancel`,
  },
  jobTitles: {
    list: (): string => `/job-titles`,
    search: (query: string): string => `/job-titles/search?query=${encodeURIComponent(query)}`,
  },
  location: {
    countries: (): string => `/location/countries`,
    states: (countryCode: string): string => `/location/states/${countryCode}`,
    hierarchy: (): string => `/location/hierarchy`,
  },
  timezones: {
    list: (): string => `/timezones`,
  },
  languages: {
    list: (): string => `/languages`,
  },
};
