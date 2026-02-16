/**
 * Reference Data Types for API responses
 * Endpoints: /api/job-titles, /api/location/*, /api/timezones, /api/languages
 */

// ==========================================
// Job Titles
// ==========================================

export interface JobTitle {
  id: number;
  title: string;
  category?: string;
  count?: number;
}

export interface JobTitlesResponse {
  success: boolean;
  data?: string[]; // API returns array of job title strings
  message?: string;
}

export interface JobTitleSearchParams {
  query: string;
  limit?: number;
}

// ==========================================
// Location
// ==========================================

export interface Country {
  code: string;
  name: string;
  flag?: string;
}

export interface State {
  code: string;
  name: string;
  country_code: string;
}

export interface LocationHierarchy {
  country: string;
  country_code: string;
  states?: State[];
  cities?: string[];
}

// Location Hierarchy API Types (from /api/location/hierarchy)
export interface LocationState {
  id: number;
  name: string;
  location_type: string;
  country: string | null;
  state: string | null;
  city: string | null;
  post_code: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface LocationHierarchyItem {
  id: number;
  name: string;
  location_type: string;
  is_active: boolean;
  states: LocationState[];
}

export interface LocationHierarchyApiResponse {
  locations: LocationHierarchyItem[];
}

export interface CountriesResponse {
  success: boolean;
  data?: Country[];
  message?: string;
}

export interface StatesResponse {
  success: boolean;
  data?: State[];
  message?: string;
}

export interface LocationHierarchyResponse {
  success: boolean;
  data?: LocationHierarchyItem[];
  message?: string;
}

// ==========================================
// Timezone
// ==========================================

export interface Timezone {
  id: number;
  name: string;
  offset: string;
  display_name: string;
  abbreviation?: string;
}

export interface TimezonesResponse {
  success: boolean;
  data?: Timezone[];
  message?: string;
}

// ==========================================
// Language
// ==========================================

export interface Language {
  code: string;
  name: string;
  native_name?: string;
}

export interface LanguagesResponse {
  success: boolean;
  data?: Language[];
  message?: string;
}
