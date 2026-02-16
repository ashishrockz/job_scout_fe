import * as React from "react";

// Step 1: Work Location and Job Types
export interface Step1Data {
  enableRemote: boolean;
  enableOnsite: boolean;
  remoteLocations: string[];
  onsiteLocations: string[];
  jobTypes: string[];
  searchMethod: "keywords" | "favorite" | "applied";
  jobTitles: string[];
}

// Step 2: Job Match and Filters
export interface Step2Data {
  jobMatchEnabled: boolean;
  jobMatchLevel: "high" | "higher" | "highest";
  seniority: string[];
  timeZones: string[];
  includeFlexibleTimeZone: boolean;
  industries: string[];
  jobDescriptionLanguages: string[];
  locationRadius: string;
  includeKeywords: string[];
  excludeKeywords: string[];
  excludeCompanies: string[];
}

// Step 3: Profile Information
export interface Step3Data {
  cvLink: string;
  phoneNumber: string;
  coverLetter: string;
  currentLocation: string;
  currentJobTitle: string;
  availability: string;
  eligibleCountries: string[];
  futureLanguages: string[];
  nationality: string[];
  currentSalary: string;
  expectedSalary: string;
  expectedSalaryFullTime: string;
  expectedSalaryPartTime: string;
  linkedInProfile: string;
  experienceSummary: string;
  screeningQuestions: string;
  stateRegion: string;
  postCode:string;
}

// Step 4: Copilot Configuration
export interface Step4Data {
  applicationMode: "auto-save" | "full-auto";
  writingStyle: string;
}

export interface CopilotFormData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
}

interface CopilotFormContextType {
  formData: CopilotFormData;
  currentStep: number;
  updateStep1: (data: Partial<Step1Data>) => void;
  updateStep2: (data: Partial<Step2Data>) => void;
  updateStep3: (data: Partial<Step3Data>) => void;
  updateStep4: (data: Partial<Step4Data>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetForm: () => void;
}

const defaultFormData: CopilotFormData = {
  step1: {
    enableRemote: false,
    enableOnsite: false,
    remoteLocations: [],
    onsiteLocations: [],
    jobTypes: [],
    searchMethod: "keywords",
    jobTitles: [],
  },
  step2: {
    jobMatchEnabled: true,
    jobMatchLevel: "high",
    seniority: [],
    timeZones: [],
    includeFlexibleTimeZone: true,
    industries: [],
    jobDescriptionLanguages: [],
    locationRadius: "",
    includeKeywords: [],
    excludeKeywords: [],
    excludeCompanies: [],
  },
  step3: {
    cvLink: "",
    phoneNumber: "",
    coverLetter: "",
    currentLocation: "",
    currentJobTitle: "",
    availability: "",
    eligibleCountries: [],
    futureLanguages: [],
    nationality: [],
    currentSalary: "",
    expectedSalary: "",
    expectedSalaryFullTime: "",
    expectedSalaryPartTime: "",
    linkedInProfile: "",
    experienceSummary: "",
    screeningQuestions: "",
    stateRegion:"",
    postCode:""
  },
  step4: {
    applicationMode: "auto-save",
    writingStyle: "",
  },
};

const CopilotFormContext = React.createContext<CopilotFormContextType | undefined>(undefined);

export function CopilotFormProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [formData, setFormData] = React.useState<CopilotFormData>(defaultFormData);
  const [currentStep, setCurrentStep] = React.useState(1);

  const updateStep1 = React.useCallback((data: Partial<Step1Data>) => {
    setFormData((prev) => ({
      ...prev,
      step1: { ...prev.step1, ...data },
    }));
  }, []);

  const updateStep2 = React.useCallback((data: Partial<Step2Data>) => {
    setFormData((prev) => ({
      ...prev,
      step2: { ...prev.step2, ...data },
    }));
  }, []);

  const updateStep3 = React.useCallback((data: Partial<Step3Data>) => {
    setFormData((prev) => ({
      ...prev,
      step3: { ...prev.step3, ...data },
    }));
  }, []);

  const updateStep4 = React.useCallback((data: Partial<Step4Data>) => {
    setFormData((prev) => ({
      ...prev,
      step4: { ...prev.step4, ...data },
    }));
  }, []);

  const nextStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }, []);

  const prevStep = React.useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = React.useCallback((step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, 4)));
  }, []);

  const resetForm = React.useCallback(() => {
    setFormData(defaultFormData);
    setCurrentStep(1);
  }, []);

  const value = React.useMemo(
    () => ({
      formData,
      currentStep,
      updateStep1,
      updateStep2,
      updateStep3,
      updateStep4,
      nextStep,
      prevStep,
      goToStep,
      resetForm,
    }),
    [formData, currentStep, updateStep1, updateStep2, updateStep3, updateStep4, nextStep, prevStep, goToStep, resetForm]
  );

  return <CopilotFormContext.Provider value={value}>{children}</CopilotFormContext.Provider>;
}

export function useCopilotForm(): CopilotFormContextType {
  const context = React.useContext(CopilotFormContext);
  if (!context) {
    throw new Error("useCopilotForm must be used within CopilotFormProvider");
  }
  return context;
}
