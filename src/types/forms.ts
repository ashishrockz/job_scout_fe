import { z as zod } from "zod";

// Career Profile Form Schema and Types
export const careerProfileSchema = zod.object({
  currentJobTitle: zod.string().min(1, { message: "Current job title is required" }),
  yearsOfExperience: zod.string().min(1, { message: "Years of experience is required" }),
  managingTeamMembers: zod.string().min(1, { message: "Please select team size" }),
  scope: zod.string().min(1, { message: "Please select scope" }),
  industrySector: zod.array(zod.string()).min(1, { message: "At least one industry is required" }),
  country: zod.string().min(1, { message: "Country is required" }),
  city: zod.string().optional(),
  targetJobTitle: zod.string().min(1, { message: "Target job title is required" }),
  targetIndustrySector: zod.array(zod.string()).min(1, { message: "At least one target industry is required" }),
  languageToUse: zod.string().min(1, { message: "Language is required" }),
});

export type CareerProfileFormValues = zod.infer<typeof careerProfileSchema>;

// Constants for form options
export const TEAM_SIZE_OPTIONS = [
  { value: "no", label: "No" },
  { value: "1-4", label: "1-4" },
  { value: "5-10", label: "5-10" },
  { value: "10+", label: "10+" },
] as const;

export const SCOPE_OPTIONS = [
  { value: "national", label: "National" },
  { value: "regional", label: "Regional" },
  { value: "global", label: "Global" },
] as const;

export const INDUSTRY_OPTIONS = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Marketing",
  "Real Estate",
  "Telecommunications",
  "E-commerce",
  "Automotive",
  "Media & Entertainment",
  "Hospitality",
  "Energy",
] as const;

export const COUNTRY_OPTIONS = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Australia",
  "India",
  "Singapore",
  "Japan",
  "Netherlands",
  "Spain",
  "Italy",
  "Brazil",
  "Mexico",
  "South Korea",
] as const;

export const LANGUAGE_OPTIONS = [
  "English",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Japanese",
  "Hindi",
  "Portuguese",
  "Russian",
  "Arabic",
  "Italian",
  "Korean",
] as const;
