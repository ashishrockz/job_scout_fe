import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Switch,
  FormControlLabel,
  Chip,
  Autocomplete,
  FormLabel,
  CircularProgress,
  FormHelperText,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  Collapse,
  Radio,
  Slider,
  Divider,
  Grid,
  MenuItem,
} from "@mui/material";
import {
  ArrowLeftIcon as ArrowLeft,
  CheckCircleIcon as CheckCircle,
  BriefcaseIcon as Briefcase,
  MagnifyingGlassIcon as MagnifyingGlass,
  GlobeIcon as Globe,
  UserIcon as User,
  TranslateIcon as Translate,
  CaretDownIcon as CaretDown,
  HeartIcon as Heart,
  CheckSquareIcon as CheckSquare,
  CrosshairIcon as Crosshair,
  ChartBarIcon as ChartBar,
  MapPinIcon as MapPin,
  CurrencyDollarIcon as CurrencyDollar,
  LinkedinLogoIcon as LinkedinLogo,
  UploadSimpleIcon as UploadSimple,
  SparkleIcon as Sparkle,
  GearIcon as Gear,
  CaretUpIcon as CaretUp,
  WarningCircleIcon as WarningCircle,
  CheckIcon as Check,
  RocketLaunchIcon as RocketLaunch,
  QuestionIcon as Question,
  EyeIcon as Eye,
  TrashIcon as Trash,
  ArrowSquareOutIcon as ArrowSquareOut,
  MagnifyingGlassPlusIcon as MagnifyingGlassPlus,
  MagnifyingGlassMinusIcon as MagnifyingGlassMinus,
  ProhibitIcon as Prohibit,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { createCopilot } from "@/lib/copilot.service";
import {
  getCountries,
  getJobTitles,
  searchJobTitles,
  getTimezones,
  getLanguages,
} from "@/lib/reference-data.service";
import { LocationSelectorModal } from "@/components/modals/location-selector-modal";
import { OnsiteLocationSelectorModal } from "@/components/modals/onsite-location-selector-modal";

// ─── Schema ──────────────────────────────────────────────────────────────────
const createCopilotSchema = zod
  .object({
    // Step 1: Work Location
    enableRemote: zod.boolean(),
    enableOnsite: zod.boolean(),
    remoteLocations: zod.array(zod.string()).optional(),
    onsiteLocations: zod.array(zod.string()).optional(),

    // Step 1: Job Types & Search
    jobTypes: zod
      .array(zod.string())
      .min(1, { message: "Select at least one job type" }),
    searchMethod: zod.enum(["keywords", "favorite", "applied"]),
    jobTitles: zod.array(zod.string()).optional(),

    // Step 2: Filters
    jobMatchEnabled: zod.boolean().optional(),
    jobMatchLevel: zod.enum(["high", "higher", "highest"]).optional(),
    seniority: zod.array(zod.string()).optional(),
    timeZones: zod.array(zod.string()).optional(),
    includeFlexibleTimeZone: zod.boolean().optional(),
    industries: zod.array(zod.string()).optional(),
    jobDescriptionLanguages: zod.array(zod.string()).optional(),
    locationRadius: zod.string().optional(),
    includeKeywords: zod.array(zod.string()).optional(),
    excludeKeywords: zod.array(zod.string()).optional(),
    excludeCompanies: zod.array(zod.string()).optional(),

    // Step 3: Profile
    cvLink: zod.string().optional(),
    coverLetterOption: zod.enum(["auto", "upload"]).optional(),
    coverLetter: zod.string().optional(),
    phoneNumber: zod.string().optional(),
    currentLocation: zod.string().optional(),
    city: zod.string().optional(),
    stateRegion: zod.string().optional(),
    postCode: zod.string().optional(),
    currentJobTitle: zod.string().optional(),
    availability: zod.string().optional(),
    eligibleCountries: zod.array(zod.string()).optional(),
    requireVisa: zod.boolean().optional(),
    nationality: zod.array(zod.string()).optional(),
    currentSalary: zod.string().optional(),
    expectedSalary: zod.string().optional(),
    expectedSalaryFullTime: zod.string().optional(),
    expectedSalaryPartTime: zod.string().optional(),
    linkedInProfile: zod.string().optional(),
    noLinkedIn: zod.boolean().optional(),
    experienceSummary: zod
      .string()
      .max(500, { message: "Experience summary must be 500 characters or less" })
      .optional(),
    screeningQuestions: zod.string().optional(),
    futureLanguages: zod.array(zod.string()).optional(),

    // Step 4: Configuration
    applicationMode: zod.enum(["auto-save", "full-auto"]),
    writingStyle: zod.string().optional(),
  })
  .refine((data) => data.enableRemote || data.enableOnsite, {
    message: "Please enable at least one work location type",
    path: ["enableRemote"],
  })
  .refine(
    (data) => {
      if (data.searchMethod === "keywords") {
        return data.jobTitles && data.jobTitles.length > 0;
      }
      return true;
    },
    {
      message: "Add at least one job title when using keyword search",
      path: ["jobTitles"],
    }
  );

type CreateCopilotFormValues = zod.infer<typeof createCopilotSchema>;

// ─── Styles ──────────────────────────────────────────────────────────────────
const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#fff",
    borderRadius: "8px",
    "& fieldset": { borderColor: "#e2e8f0" },
    "&:hover fieldset": { borderColor: "#cbd5e1" },
    "&.Mui-focused fieldset": { borderColor: "#7c3aed", borderWidth: "1.5px" },
  },
  "& .MuiInputLabel-root": {
    color: "#64748b",
    fontSize: "0.875rem",
    "&.Mui-focused": { color: "#7c3aed" },
  },
};

const sectionPaperSx = {
  p: { xs: 2.5, sm: 3 },
  mb: 3,
  backgroundColor: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
};

const sectionTitleSx = {
  fontWeight: 700,
  color: "#0f172a",
  fontSize: "1.1rem",
  mb: 0.5,
};

const sectionSubtitleSx = {
  color: "#64748b",
  fontSize: "0.8125rem",
  mb: 2.5,
};

const fieldLabelSx = {
  display: "block",
  mb: 1,
  fontSize: "0.875rem",
  fontWeight: 600,
  color: "#374151",
};

const purpleSwitchSx = {
  "& .MuiSwitch-switchBase.Mui-checked": { color: "#7c3aed" },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#7c3aed",
  },
};

// ─── Options ─────────────────────────────────────────────────────────────────
const jobTypeOptions = [
  { value: "fulltime", label: "Fulltime" },
  { value: "parttime", label: "Part-Time" },
  { value: "contractor", label: "Contractor / Temp" },
  { value: "internship", label: "Internship" },
];

const seniorityOptions = [
  { value: "entry", label: "Entry Level" },
  { value: "associate", label: "Associate Level" },
  { value: "mid-senior", label: "Mid-to-Senior Level" },
  { value: "director", label: "Director Level and above" },
];

const availabilityOptions = [
  { value: "immediately", label: "Immediately" },
  { value: "1-week", label: "in 1 Week" },
  { value: "2-weeks", label: "in 2 Weeks" },
  { value: "1-month", label: "in 1 Month" },
  { value: "2-months", label: "in 2 Months" },
];

const industryOptions = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Marketing",
  "Media",
  "Real Estate",
];

const locationRadiusOptions = [
  { value: "5", label: "5 km" },
  { value: "10", label: "10 km" },
  { value: "25", label: "25 km" },
  { value: "50", label: "50 km" },
  { value: "100", label: "100 km" },
];

const jobMatchMarks = [
  { value: 0, label: "High" },
  { value: 50, label: "Higher" },
  { value: 100, label: "Highest" },
];

function sliderToLevel(val: number): "high" | "higher" | "highest" {
  if (val <= 25) return "high";
  if (val <= 75) return "higher";
  return "highest";
}

function levelToSlider(level: string): number {
  if (level === "higher") return 50;
  if (level === "highest") return 100;
  return 0;
}

// ─── Common Phone Country Codes ──────────────────────────────────────────────
const phoneCountryCodes = [
  { code: "+1", label: "US +1" },
  { code: "+44", label: "UK +44" },
  { code: "+91", label: "IN +91" },
  { code: "+49", label: "DE +49" },
  { code: "+33", label: "FR +33" },
  { code: "+61", label: "AU +61" },
  { code: "+81", label: "JP +81" },
  { code: "+86", label: "CN +86" },
  { code: "+55", label: "BR +55" },
  { code: "+971", label: "AE +971" },
  { code: "+65", label: "SG +65" },
  { code: "+82", label: "KR +82" },
  { code: "+34", label: "ES +34" },
  { code: "+39", label: "IT +39" },
  { code: "+31", label: "NL +31" },
  { code: "+46", label: "SE +46" },
  { code: "+41", label: "CH +41" },
  { code: "+48", label: "PL +48" },
  { code: "+52", label: "MX +52" },
  { code: "+27", label: "ZA +27" },
  { code: "+234", label: "NG +234" },
  { code: "+254", label: "KE +254" },
  { code: "+63", label: "PH +63" },
  { code: "+60", label: "MY +60" },
  { code: "+62", label: "ID +62" },
  { code: "+66", label: "TH +66" },
  { code: "+84", label: "VN +84" },
  { code: "+90", label: "TR +90" },
  { code: "+20", label: "EG +20" },
  { code: "+92", label: "PK +92" },
  { code: "+880", label: "BD +880" },
  { code: "+94", label: "LK +94" },
];

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: subtitle ? 0.5 : 0 }}>
        <Box sx={{ color: "#7c3aed", display: "flex", flexShrink: 0 }}>{icon}</Box>
        <Typography sx={sectionTitleSx}>{title}</Typography>
      </Box>
      {subtitle && (
        <Typography sx={{ ...sectionSubtitleSx, ml: 4.5 }}>{subtitle}</Typography>
      )}
    </Box>
  );
}

// ─── Selectable Chip ─────────────────────────────────────────────────────────
function SelectableChip({
  label,
  selected,
  onClick,
  icon,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <Chip
      label={label}
      icon={
        selected ? (
          <CheckCircle size={16} weight="fill" />
        ) : icon ? (
          <>{icon}</>
        ) : undefined
      }
      onClick={onClick}
      sx={{
        cursor: "pointer",
        fontWeight: 500,
        fontSize: "0.8125rem",
        height: 36,
        borderRadius: "18px",
        transition: "all 0.15s ease",
        ...(selected
          ? {
              backgroundColor: "#7c3aed",
              color: "white",
              "&:hover": { backgroundColor: "#6d28d9" },
              "& .MuiChip-icon": { color: "white" },
            }
          : {
              backgroundColor: "#fff",
              color: "#475569",
              border: "1px solid #e2e8f0",
              "&:hover": { backgroundColor: "#f8fafc", borderColor: "#cbd5e1" },
              "& .MuiChip-icon": { color: "#94a3b8" },
            }),
      }}
    />
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export function Page(): React.JSX.Element {
  const navigate = useNavigate();
  const [isPending, setIsPending] = React.useState(false);

  // UI state
  const [locationModalOpen, setLocationModalOpen] = React.useState<
    "remote" | "onsite" | null
  >(null);
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = React.useState(false);
  const [screeningOpen, setScreeningOpen] = React.useState(false);
  const [writingStyleOpen, setWritingStyleOpen] = React.useState(false);

  // CV file upload state
  const [cvFile, setCvFile] = React.useState<File | null>(null);
  const [cvAnalysis, setCvAnalysis] = React.useState<{
    length: "good" | "needs_improvement" | null;
    content: "good" | "needs_improvement" | null;
    atsFriendly: "good" | "needs_improvement" | null;
  } | null>(null);
  const cvInputRef = React.useRef<HTMLInputElement>(null);

  // Phone country code
  const [phoneCountryCode, setPhoneCountryCode] = React.useState("+1");

  // API data
  const [countries, setCountries] = React.useState<string[]>([]);
  const [timezones, setTimezones] = React.useState<string[]>([]);
  const [languages, setLanguages] = React.useState<string[]>([]);
  const [jobTitleOptions, setJobTitleOptions] = React.useState<string[]>([]);
  const [jobTitleInputValue, setJobTitleInputValue] = React.useState("");
  const [loadingData, setLoadingData] = React.useState({
    countries: false,
    timezones: false,
    languages: false,
    jobTitles: false,
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateCopilotFormValues>({
    defaultValues: {
      enableRemote: false,
      enableOnsite: false,
      remoteLocations: [],
      onsiteLocations: [],
      jobTypes: [],
      searchMethod: "keywords",
      jobTitles: [],
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
      cvLink: "",
      coverLetterOption: "auto",
      coverLetter: "",
      phoneNumber: "",
      currentLocation: "",
      city: "",
      stateRegion: "",
      postCode: "",
      currentJobTitle: "",
      availability: "",
      eligibleCountries: [],
      requireVisa: false,
      nationality: [],
      currentSalary: "",
      expectedSalary: "",
      expectedSalaryFullTime: "",
      expectedSalaryPartTime: "",
      linkedInProfile: "",
      noLinkedIn: false,
      experienceSummary: "",
      screeningQuestions: "",
      futureLanguages: [],
      applicationMode: "auto-save",
      writingStyle: "",
    },
    resolver: zodResolver(createCopilotSchema),
  });

  const enableRemote = watch("enableRemote");
  const enableOnsite = watch("enableOnsite");
  const searchMethod = watch("searchMethod");
  const remoteLocations = watch("remoteLocations");
  const onsiteLocations = watch("onsiteLocations");
  const jobMatchEnabled = watch("jobMatchEnabled");
  const noLinkedIn = watch("noLinkedIn");
  const coverLetterOption = watch("coverLetterOption");
  const experienceSummary = watch("experienceSummary");

  // Auto-add "Worldwide" when remote is enabled
  React.useEffect(() => {
    if (enableRemote && (!remoteLocations || remoteLocations.length === 0)) {
      setValue("remoteLocations", ["Worldwide"]);
    }
  }, [enableRemote, remoteLocations, setValue]);

  // Load reference data on mount
  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData((prev) => ({ ...prev, countries: true }));
        const countriesRes = await getCountries();
        if (countriesRes.success && countriesRes.data) {
          setCountries(["Worldwide", ...countriesRes.data.map((c) => c.name)]);
        }
      } catch (error) {
        console.error("Error loading countries:", error);
      } finally {
        setLoadingData((prev) => ({ ...prev, countries: false }));
      }

      try {
        setLoadingData((prev) => ({ ...prev, timezones: true }));
        const timezonesRes = await getTimezones();
        if (timezonesRes.success && timezonesRes.data) {
          setTimezones(
            timezonesRes.data.map((tz) => tz.display_name || tz.name)
          );
        }
      } catch (error) {
        console.error("Error loading timezones:", error);
      } finally {
        setLoadingData((prev) => ({ ...prev, timezones: false }));
      }

      try {
        setLoadingData((prev) => ({ ...prev, languages: true }));
        const languagesRes = await getLanguages();
        if (languagesRes.success && languagesRes.data) {
          setLanguages(languagesRes.data.map((lang) => lang.name));
        }
      } catch (error) {
        console.error("Error loading languages:", error);
      } finally {
        setLoadingData((prev) => ({ ...prev, languages: false }));
      }

      try {
        setLoadingData((prev) => ({ ...prev, jobTitles: true }));
        const jobTitlesRes = await getJobTitles();
        if (jobTitlesRes.success && jobTitlesRes.data) {
          setJobTitleOptions(jobTitlesRes.data);
        }
      } catch (error) {
        console.error("Error loading job titles:", error);
      } finally {
        setLoadingData((prev) => ({ ...prev, jobTitles: false }));
      }
    };

    loadData();
  }, []);

  // Debounced job title search
  React.useEffect(() => {
    if (!jobTitleInputValue || jobTitleInputValue.length < 2) return;

    const timeoutId = setTimeout(async () => {
      try {
        setLoadingData((prev) => ({ ...prev, jobTitles: true }));
        const searchRes = await searchJobTitles({
          query: jobTitleInputValue,
          limit: 20,
        });
        if (searchRes.success && searchRes.data) {
          setJobTitleOptions(searchRes.data);
        }
      } catch (error) {
        console.error("Error searching job titles:", error);
      } finally {
        setLoadingData((prev) => ({ ...prev, jobTitles: false }));
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [jobTitleInputValue]);

  const handleLocationModalSave = (locations: string[]) => {
    if (locationModalOpen === "remote") {
      setValue("remoteLocations", locations);
    } else if (locationModalOpen === "onsite") {
      setValue("onsiteLocations", locations);
    }
    setLocationModalOpen(null);
  };

  const handleCvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setCvFile(file);
    setValue("cvLink", file.name);
    // Simulate analysis after upload
    setCvAnalysis({
      length: Math.random() > 0.5 ? "good" : "needs_improvement",
      content: Math.random() > 0.5 ? "good" : "needs_improvement",
      atsFriendly: "good",
    });
  };

  const handleRemoveCvFile = () => {
    setCvFile(null);
    setCvAnalysis(null);
    setValue("cvLink", "");
    if (cvInputRef.current) {
      cvInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: CreateCopilotFormValues) => {
    setIsPending(true);
    try {
      const formData = {
        step1: {
          enableRemote: data.enableRemote,
          enableOnsite: data.enableOnsite,
          remoteLocations: data.remoteLocations || [],
          onsiteLocations: data.onsiteLocations || [],
          jobTypes: data.jobTypes,
          searchMethod: data.searchMethod,
          jobTitles: data.jobTitles || [],
        },
        step2: {
          jobMatchEnabled: data.jobMatchEnabled ?? true,
          jobMatchLevel: data.jobMatchLevel || "high",
          seniority: data.seniority || [],
          timeZones: data.timeZones || [],
          includeFlexibleTimeZone: data.includeFlexibleTimeZone ?? true,
          industries: data.industries || [],
          jobDescriptionLanguages: data.jobDescriptionLanguages || [],
          locationRadius: data.locationRadius || "",
          includeKeywords: data.includeKeywords || [],
          excludeKeywords: data.excludeKeywords || [],
          excludeCompanies: data.excludeCompanies || [],
        },
        step3: {
          cvLink: data.cvLink || "",
          phoneNumber: data.phoneNumber || "",
          coverLetter: data.coverLetter || "",
          currentLocation: data.currentLocation || "",
          currentJobTitle: data.currentJobTitle || "",
          availability: data.availability || "",
          eligibleCountries: data.eligibleCountries || [],
          futureLanguages: data.futureLanguages || [],
          nationality: data.nationality || [],
          currentSalary: data.currentSalary || "",
          expectedSalary: data.expectedSalary || "",
          expectedSalaryFullTime: data.expectedSalaryFullTime || "",
          expectedSalaryPartTime: data.expectedSalaryPartTime || "",
          linkedInProfile: data.noLinkedIn ? "" : data.linkedInProfile || "",
          experienceSummary: data.experienceSummary || "",
          screeningQuestions: data.screeningQuestions || "",
          stateRegion: data.stateRegion || "",
          postCode: data.postCode || "",
        },
        step4: {
          applicationMode: data.applicationMode,
          writingStyle: data.writingStyle || "",
        },
      };

      const result = await createCopilot(formData);
      if (result.success) {
        toast.success("Copilot created successfully!");
        navigate("/copilot");
      } else {
        toast.error(result.message || "Failed to create copilot");
      }
    } catch (error: any) {
      console.error("Error creating copilot:", error);
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa", py: 3 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            onClick={() => navigate("/copilot")}
            startIcon={<ArrowLeft size={18} />}
            sx={{
              color: "#64748b",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              mb: 2,
              "&:hover": {
                backgroundColor: "transparent",
                color: "#475569",
              },
            }}
          >
            Back to Copilots
          </Button>

          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}
          >
            Add a new copilot
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Configure your AI-powered job search assistant in one go
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* ════════════════════════════════════════════════════════════════
              SECTION 1: WORK LOCATION
          ════════════════════════════════════════════════════════════════ */}
          <Paper elevation={0} sx={sectionPaperSx}>
            <SectionHeader
              icon={<Globe size={22} weight="duotone" />}
              title="Work Location"
              subtitle="Are you looking for jobs that are remote, have a physical location, or both?"
            />

            {/* Remote Toggle */}
            <Box sx={{ mb: 3 }}>
              <Controller
                name="enableRemote"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        sx={purpleSwitchSx}
                      />
                    }
                    label={
                      <Typography sx={{ fontWeight: 600, fontSize: "0.9375rem" }}>
                        Remote Jobs
                      </Typography>
                    }
                  />
                )}
              />

              {enableRemote && (
                <Box sx={{ mt: 1.5, ml: 6 }}>
                  <FormLabel sx={{ ...fieldLabelSx, fontSize: "0.8125rem" }}>
                    Preferred Regions
                  </FormLabel>
                  <Controller
                    name="remoteLocations"
                    control={control}
                    render={({ field: { value } }) => (
                      <Box
                        onClick={() => setLocationModalOpen("remote")}
                        sx={{
                          minHeight: 40,
                          p: 1,
                          pr: 1.5,
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "#fff",
                          "&:hover": {
                            borderColor: "#cbd5e1",
                            backgroundColor: "#f8f9fa",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                            flex: 1,
                          }}
                        >
                          {value && value.length > 0 ? (
                            value.map((loc: string) => (
                              <Chip
                                key={loc}
                                label={loc}
                                size="small"
                                sx={{
                                  backgroundColor: "#ede9fe",
                                  color: "#7c3aed",
                                  fontWeight: 500,
                                }}
                              />
                            ))
                          ) : (
                            <Typography
                              sx={{ color: "#94a3b8", fontSize: "0.875rem" }}
                            >
                              Click to select locations
                            </Typography>
                          )}
                        </Box>
                        <CaretDown
                          size={16}
                          style={{ color: "#94a3b8", flexShrink: 0 }}
                        />
                      </Box>
                    )}
                  />
                </Box>
              )}
            </Box>

            {/* On-site Toggle */}
            <Box sx={{ mb: 2 }}>
              <Controller
                name="enableOnsite"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={field.onChange}
                        sx={purpleSwitchSx}
                      />
                    }
                    label={
                      <Typography sx={{ fontWeight: 600, fontSize: "0.9375rem" }}>
                        On-site Jobs / Hybrid
                      </Typography>
                    }
                  />
                )}
              />

              {enableOnsite && (
                <Box sx={{ mt: 1.5, ml: 6 }}>
                  <FormLabel sx={{ ...fieldLabelSx, fontSize: "0.8125rem" }}>
                    Preferred Locations *
                  </FormLabel>
                  <Controller
                    name="onsiteLocations"
                    control={control}
                    render={({ field: { value } }) => (
                      <Box
                        onClick={() => setLocationModalOpen("onsite")}
                        sx={{
                          minHeight: 40,
                          p: 1,
                          pr: 1.5,
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "#fff",
                          "&:hover": {
                            borderColor: "#cbd5e1",
                            backgroundColor: "#f8f9fa",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                            flex: 1,
                          }}
                        >
                          {value && value.length > 0 ? (
                            value.map((loc: string) => (
                              <Chip
                                key={loc}
                                label={loc}
                                size="small"
                                sx={{
                                  backgroundColor: "#ede9fe",
                                  color: "#7c3aed",
                                  fontWeight: 500,
                                }}
                              />
                            ))
                          ) : (
                            <Typography
                              sx={{ color: "#94a3b8", fontSize: "0.875rem" }}
                            >
                              Click to select locations
                            </Typography>
                          )}
                        </Box>
                        <CaretDown
                          size={16}
                          style={{ color: "#94a3b8", flexShrink: 0 }}
                        />
                      </Box>
                    )}
                  />
                </Box>
              )}
            </Box>

            {errors.enableRemote && (
              <FormHelperText error sx={{ ml: 1 }}>
                {errors.enableRemote.message}
              </FormHelperText>
            )}
          </Paper>

          {/* ════════════════════════════════════════════════════════════════
              SECTION 2: JOB TYPES
          ════════════════════════════════════════════════════════════════ */}
          <Paper elevation={0} sx={sectionPaperSx}>
            <SectionHeader
              icon={<Briefcase size={22} weight="duotone" />}
              title="Job Types"
              subtitle="What job types are you looking for? Select at least one."
            />

            <Controller
              name="jobTypes"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 1 }}>
                    {jobTypeOptions.map((option) => (
                      <SelectableChip
                        key={option.value}
                        label={option.label}
                        selected={value?.includes(option.value)}
                        onClick={() => {
                          const isSelected = value?.includes(option.value);
                          const newValue = isSelected
                            ? value.filter((v) => v !== option.value)
                            : [...(value || []), option.value];
                          onChange(newValue);
                        }}
                      />
                    ))}
                  </Box>
                  {errors.jobTypes && (
                    <FormHelperText error>
                      {errors.jobTypes.message}
                    </FormHelperText>
                  )}
                </Box>
              )}
            />
          </Paper>

          {/* ════════════════════════════════════════════════════════════════
              SECTION 3: SEARCH METHOD
          ════════════════════════════════════════════════════════════════ */}
          <Paper elevation={0} sx={sectionPaperSx}>
            <SectionHeader
              icon={<MagnifyingGlass size={22} weight="duotone" />}
              title="Search Method"
            />

            <Controller
              name="searchMethod"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  value={field.value}
                  exclusive
                  onChange={(_, value) => value && field.onChange(value)}
                  fullWidth
                  size="small"
                  sx={{
                    mb: 3,
                    "& .MuiToggleButton-root": {
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      py: 1.2,
                      gap: 1,
                      "&.Mui-selected": {
                        backgroundColor: "#7c3aed",
                        color: "white",
                        "&:hover": { backgroundColor: "#6d28d9" },
                      },
                    },
                  }}
                >
                  <ToggleButton value="keywords">
                    <MagnifyingGlass size={18} /> Job Title Keywords
                  </ToggleButton>
                  <ToggleButton value="favorite">
                    <Heart size={18} /> Favorite Jobs
                  </ToggleButton>
                  <ToggleButton value="applied">
                    <CheckSquare size={18} /> Applied Jobs
                  </ToggleButton>
                </ToggleButtonGroup>
              )}
            />

            {/* Job Titles */}
            {searchMethod === "keywords" && (
              <Box>
                <Typography
                  sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}
                >
                  Job Titles
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: "0.8125rem", mb: 1.5 }}>
                  What job titles are you looking for? Type in and select up to 5
                </Typography>
                <Controller
                  name="jobTitles"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    const currentCount = value?.length || 0;
                    const isMaxReached = currentCount >= 5;
                    return (
                      <Autocomplete
                        multiple
                        freeSolo
                        options={jobTitleOptions}
                        value={value || []}
                        inputValue={jobTitleInputValue}
                        onInputChange={(_, newInputValue) =>
                          setJobTitleInputValue(newInputValue)
                        }
                        onChange={(_, newValue) => {
                          if (newValue.length <= 5) onChange(newValue);
                        }}
                        loading={loadingData.jobTitles}
                        size="small"
                        filterOptions={(options) => options}
                        noOptionsText={
                          jobTitleInputValue.length < 2
                            ? "Type at least 2 characters to search"
                            : loadingData.jobTitles
                            ? "Searching..."
                            : "No job titles found"
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={
                              isMaxReached
                                ? "Maximum 5 titles reached"
                                : "Job titles / keywords"
                            }
                            error={Boolean(errors.jobTitles)}
                            helperText={
                              errors.jobTitles?.message ||
                              `${currentCount}/5 selected`
                            }
                            sx={textFieldSx}
                            slotProps={{
                              input: {
                                ...params.InputProps,
                                startAdornment: (
                                  <>
                                    <InputAdornment position="start">
                                      <MagnifyingGlass
                                        size={18}
                                        style={{ color: "#94a3b8" }}
                                      />
                                    </InputAdornment>
                                    {params.InputProps.startAdornment}
                                  </>
                                ),
                                endAdornment: (
                                  <>
                                    {loadingData.jobTitles ? (
                                      <CircularProgress size={20} />
                                    ) : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              },
                            }}
                          />
                        )}
                        slotProps={{
                          chip: {
                            size: "small",
                            sx: {
                              backgroundColor: "#fef3c7",
                              color: "#92400e",
                              fontWeight: 500,
                            },
                          },
                        }}
                      />
                    );
                  }}
                />
              </Box>
            )}
          </Paper>

          {/* ════════════════════════════════════════════════════════════════
              SECTION 4: OPTIONAL FILTERS
          ════════════════════════════════════════════════════════════════ */}
          <Paper elevation={0} sx={sectionPaperSx}>
            <SectionHeader
              icon={<Crosshair size={22} weight="duotone" />}
              title="Job Match"
              subtitle="Your copilot will only apply to jobs where you meet more than half of the key requirements."
            />

            {/* Job Match Toggle */}
            <Box sx={{ mb: 3 }}>
              <Controller
                name="jobMatchEnabled"
                control={control}
                render={({ field }) => (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      sx={purpleSwitchSx}
                    />
                    <Typography sx={{ fontWeight: 600 }}>Job Match</Typography>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: "1px solid #cbd5e1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "help",
                      }}
                    >
                      <Question size={12} style={{ color: "#94a3b8" }} />
                    </Box>
                  </Box>
                )}
              />

              {jobMatchEnabled && (
                <Controller
                  name="jobMatchLevel"
                  control={control}
                  render={({ field }) => (
                    <Box sx={{ px: 2 }}>
                      <Slider
                        value={levelToSlider(field.value || "high")}
                        onChange={(_, val) =>
                          field.onChange(sliderToLevel(val as number))
                        }
                        step={null}
                        marks={jobMatchMarks}
                        min={0}
                        max={100}
                        sx={{
                          color: "#7c3aed",
                          "& .MuiSlider-markLabel": {
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            color: "#475569",
                          },
                          "& .MuiSlider-thumb": {
                            width: 20,
                            height: 20,
                            backgroundColor: "#7c3aed",
                            border: "3px solid #fff",
                            boxShadow: "0 2px 6px rgba(124,58,237,0.3)",
                          },
                          "& .MuiSlider-track": {
                            height: 6,
                          },
                          "& .MuiSlider-rail": {
                            height: 6,
                            backgroundColor: "#e2e8f0",
                          },
                        }}
                      />
                    </Box>
                  )}
                />
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Seniority */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <ChartBar size={20} style={{ color: "#475569" }} />
                <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                  Seniority
                </Typography>
                <Typography
                  sx={{ color: "#94a3b8", fontSize: "0.8125rem", ml: 0.5 }}
                >
                  (optional)
                </Typography>
              </Box>
              <Typography sx={{ color: "#64748b", fontSize: "0.8125rem", mb: 1.5 }}>
                Filter jobs by seniority.
              </Typography>

              <Controller
                name="seniority"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                    {seniorityOptions.map((option) => (
                      <SelectableChip
                        key={option.value}
                        label={option.label}
                        selected={value?.includes(option.value) || false}
                        onClick={() => {
                          const isSelected = value?.includes(option.value);
                          const newValue = isSelected
                            ? (value || []).filter((v) => v !== option.value)
                            : [...(value || []), option.value];
                          onChange(newValue);
                        }}
                      />
                    ))}
                  </Box>
                )}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Time Zones */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Globe size={20} style={{ color: "#475569" }} />
                <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                  Time Zones
                </Typography>
                <Typography
                  sx={{ color: "#94a3b8", fontSize: "0.8125rem", ml: 0.5 }}
                >
                  (optional)
                </Typography>
              </Box>
              <Typography sx={{ color: "#64748b", fontSize: "0.8125rem", mb: 1.5 }}>
                Filter remote jobs by time zone.
              </Typography>

              <Controller
                name="timeZones"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    options={timezones}
                    value={value || []}
                    onChange={(_, newValue) => onChange(newValue)}
                    loading={loadingData.timezones}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select your preferred work time zones"
                        sx={textFieldSx}
                        slotProps={{
                          input: {
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loadingData.timezones ? (
                                  <CircularProgress size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          },
                        }}
                      />
                    )}
                    slotProps={{
                      chip: {
                        size: "small",
                        sx: {
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          fontWeight: 500,
                        },
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Advanced Filters (Collapsible) */}
            <Box>
              <Button
                onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
                endIcon={
                  advancedFiltersOpen ? (
                    <CaretUp size={18} />
                  ) : (
                    <CaretDown size={18} />
                  )
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#0f172a",
                  p: 0,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                Advanced Filters
              </Button>

              <Collapse in={advancedFiltersOpen}>
                <Box sx={{ mt: 2.5 }}>
                  {/* Industries */}
                  <Box sx={{ mb: 3 }}>
                    <FormLabel sx={fieldLabelSx}>Industries</FormLabel>
                    <Controller
                      name="industries"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          multiple
                          options={industryOptions}
                          value={value || []}
                          onChange={(_, newValue) => onChange(newValue)}
                          size="small"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select industries"
                              sx={textFieldSx}
                            />
                          )}
                          slotProps={{
                            chip: {
                              size: "small",
                              sx: {
                                backgroundColor: "#fef3c7",
                                color: "#b45309",
                                fontWeight: 500,
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Job Description Languages */}
                  <Box sx={{ mb: 3 }}>
                    <FormLabel sx={fieldLabelSx}>
                      Job Description Languages
                    </FormLabel>
                    <Controller
                      name="jobDescriptionLanguages"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          multiple
                          options={languages}
                          value={value || []}
                          onChange={(_, newValue) => onChange(newValue)}
                          loading={loadingData.languages}
                          size="small"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select languages"
                              sx={textFieldSx}
                              slotProps={{
                                input: {
                                  ...params.InputProps,
                                  startAdornment: (
                                    <>
                                      <InputAdornment position="start">
                                        <Translate
                                          size={18}
                                          style={{ color: "#94a3b8" }}
                                        />
                                      </InputAdornment>
                                      {params.InputProps.startAdornment}
                                    </>
                                  ),
                                  endAdornment: (
                                    <>
                                      {loadingData.languages ? (
                                        <CircularProgress size={20} />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                },
                              }}
                            />
                          )}
                          slotProps={{
                            chip: {
                              size: "small",
                              sx: {
                                backgroundColor: "#fef3c7",
                                color: "#b45309",
                                fontWeight: 500,
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Location Radius */}
                  <Box sx={{ mb: 3 }}>
                    <FormLabel sx={fieldLabelSx}>
                      Location Radius (for on-site)
                    </FormLabel>
                    <Controller
                      name="locationRadius"
                      control={control}
                      render={({ field }) => (
                        <ToggleButtonGroup
                          value={field.value}
                          exclusive
                          onChange={(_, value) => {
                            if (value !== null) field.onChange(value);
                          }}
                          size="small"
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            "& .MuiToggleButtonGroup-grouped": {
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px !important",
                              margin: 0,
                              textTransform: "none",
                              fontWeight: 500,
                              "&.Mui-selected": {
                                backgroundColor: "#7c3aed",
                                color: "white",
                                borderColor: "#7c3aed",
                                "&:hover": { backgroundColor: "#6d28d9" },
                              },
                            },
                          }}
                        >
                          {locationRadiusOptions.map((option) => (
                            <ToggleButton key={option.value} value={option.value}>
                              {option.label}
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                      )}
                    />
                  </Box>

                  {/* Include Keywords */}
                  <Box sx={{ mb: 3 }}>
                    <FormLabel sx={fieldLabelSx}>Include Keywords</FormLabel>
                    <Controller
                      name="includeKeywords"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          multiple
                          freeSolo
                          options={[]}
                          value={value || []}
                          onChange={(_, newValue) => onChange(newValue)}
                          size="small"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Type and press enter to add keywords"
                              sx={textFieldSx}
                              slotProps={{
                                input: {
                                  ...params.InputProps,
                                  startAdornment: (
                                    <>
                                      <InputAdornment position="start">
                                        <MagnifyingGlassPlus
                                          size={18}
                                          style={{ color: "#94a3b8" }}
                                        />
                                      </InputAdornment>
                                      {params.InputProps.startAdornment}
                                    </>
                                  ),
                                },
                              }}
                            />
                          )}
                          slotProps={{
                            chip: {
                              size: "small",
                              sx: {
                                backgroundColor: "#cffafe",
                                color: "#0e7490",
                                fontWeight: 500,
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Exclude Keywords */}
                  <Box sx={{ mb: 3 }}>
                    <FormLabel sx={fieldLabelSx}>Exclude Keywords</FormLabel>
                    <Controller
                      name="excludeKeywords"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          multiple
                          freeSolo
                          options={[]}
                          value={value || []}
                          onChange={(_, newValue) => onChange(newValue)}
                          size="small"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Type and press enter to add keywords"
                              sx={textFieldSx}
                              slotProps={{
                                input: {
                                  ...params.InputProps,
                                  startAdornment: (
                                    <>
                                      <InputAdornment position="start">
                                        <MagnifyingGlassMinus
                                          size={18}
                                          style={{ color: "#94a3b8" }}
                                        />
                                      </InputAdornment>
                                      {params.InputProps.startAdornment}
                                    </>
                                  ),
                                },
                              }}
                            />
                          )}
                          slotProps={{
                            chip: {
                              size: "small",
                              sx: {
                                backgroundColor: "#fee2e2",
                                color: "#b91c1c",
                                fontWeight: 500,
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>

                  {/* Exclude Companies */}
                  <Box>
                    <FormLabel sx={fieldLabelSx}>Exclude Companies</FormLabel>
                    <Controller
                      name="excludeCompanies"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <Autocomplete
                          multiple
                          freeSolo
                          options={[]}
                          value={value || []}
                          onChange={(_, newValue) => onChange(newValue)}
                          size="small"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Type company names and press enter"
                              sx={textFieldSx}
                              slotProps={{
                                input: {
                                  ...params.InputProps,
                                  startAdornment: (
                                    <>
                                      <InputAdornment position="start">
                                        <Prohibit
                                          size={18}
                                          style={{ color: "#94a3b8" }}
                                        />
                                      </InputAdornment>
                                      {params.InputProps.startAdornment}
                                    </>
                                  ),
                                },
                              }}
                            />
                          )}
                          slotProps={{
                            chip: {
                              size: "small",
                              sx: {
                                backgroundColor: "#f1f5f9",
                                color: "#475569",
                                fontWeight: 500,
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>
              </Collapse>
            </Box>
          </Paper>

          {/* ════════════════════════════════════════════════════════════════
              SECTION 5: PROFILE INFORMATION
          ════════════════════════════════════════════════════════════════ */}
          <Paper elevation={0} sx={sectionPaperSx}>
            <SectionHeader
              icon={<User size={22} weight="duotone" />}
              title="Profile Information"
              subtitle="In order for your copilot to answer job application questions on your behalf, it needs your resume as well as your answers to commonly asked screening questions."
            />

            {/* CV / Resume */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                  Confirm the CV/Resume you would like to use
                </Typography>
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "1px solid #cbd5e1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "help",
                  }}
                >
                  <Question size={12} style={{ color: "#94a3b8" }} />
                </Box>
              </Box>

              {/* Hidden file input */}
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={handleCvFileChange}
              />

              {!cvFile ? (
                <Box>
                  <Button
                    variant="outlined"
                    onClick={() => cvInputRef.current?.click()}
                    startIcon={<UploadSimple size={18} />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      borderColor: "#e2e8f0",
                      color: "#374151",
                      borderRadius: "8px",
                      px: 2.5,
                      py: 1,
                      "&:hover": {
                        borderColor: "#cbd5e1",
                        backgroundColor: "#f8fafc",
                      },
                    }}
                  >
                    Upload CV in PDF or Word
                  </Button>
                  <Box sx={{ mt: 1.5 }}>
                    <Button
                      href="/tools"
                      target="_blank"
                      endIcon={<ArrowSquareOut size={14} />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        fontSize: "0.8125rem",
                        color: "#7c3aed",
                        p: 0,
                        minWidth: "auto",
                        "&:hover": {
                          backgroundColor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Create CV with CV Builder
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  {/* File display */}
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        mb: 2,
                      }}
                    >
                      <Typography
                        sx={{ fontSize: "0.875rem", color: "#64748b" }}
                      >
                        Selected CV:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Eye
                          size={16}
                          style={{ color: "#7c3aed", cursor: "pointer" }}
                        />
                        <Typography
                          sx={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            color: "#7c3aed",
                          }}
                        >
                          {cvFile.name}
                        </Typography>
                        <Trash
                          size={16}
                          style={{ color: "#94a3b8", cursor: "pointer" }}
                          onClick={handleRemoveCvFile}
                        />
                      </Box>
                    </Box>

                    {/* Quality indicators */}
                    {cvAnalysis && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {[
                          { label: "Length", status: cvAnalysis.length },
                          { label: "Content", status: cvAnalysis.content },
                          {
                            label: "ATS-friendly",
                            status: cvAnalysis.atsFriendly,
                          },
                        ].map((item) => (
                          <Box
                            key={item.label}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.8125rem",
                                fontWeight: 500,
                                color: "#374151",
                                minWidth: 100,
                              }}
                            >
                              {item.label}
                            </Typography>
                            <Chip
                              size="small"
                              icon={
                                item.status === "good" ? (
                                  <CheckCircle
                                    size={14}
                                    weight="fill"
                                  />
                                ) : (
                                  <WarningCircle
                                    size={14}
                                    weight="fill"
                                  />
                                )
                              }
                              label={
                                item.status === "good"
                                  ? "Good"
                                  : "Needs improvement"
                              }
                              sx={{
                                fontWeight: 500,
                                fontSize: "0.75rem",
                                height: 26,
                                ...(item.status === "good"
                                  ? {
                                      backgroundColor: "#dcfce7",
                                      color: "#15803d",
                                      "& .MuiChip-icon": {
                                        color: "#15803d",
                                      },
                                    }
                                  : {
                                      backgroundColor: "#fff7ed",
                                      color: "#c2410c",
                                      "& .MuiChip-icon": {
                                        color: "#c2410c",
                                      },
                                    }),
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Cover Letter */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 1.5 }}>
                Cover Letter
              </Typography>
              <Controller
                name="coverLetterOption"
                control={control}
                render={({ field }) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
                    <Chip
                      icon={<Sparkle size={16} />}
                      label="Automatically generate a tailored cover letter for each job (recommended)"
                      onClick={() => field.onChange("auto")}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 500,
                        height: "auto",
                        py: 1,
                        "& .MuiChip-label": { whiteSpace: "normal" },
                        ...(field.value === "auto"
                          ? {
                              backgroundColor: "#7c3aed",
                              color: "white",
                              "& .MuiChip-icon": { color: "white" },
                              "&:hover": { backgroundColor: "#6d28d9" },
                            }
                          : {
                              backgroundColor: "#fff",
                              color: "#475569",
                              border: "1px solid #e2e8f0",
                              "&:hover": { backgroundColor: "#f8fafc" },
                            }),
                      }}
                    />
                    <Chip
                      label="Upload my own generic Cover Letter"
                      onClick={() => field.onChange("upload")}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 500,
                        height: "auto",
                        py: 1,
                        "& .MuiChip-label": { whiteSpace: "normal" },
                        ...(field.value === "upload"
                          ? {
                              backgroundColor: "#7c3aed",
                              color: "white",
                              "&:hover": { backgroundColor: "#6d28d9" },
                            }
                          : {
                              backgroundColor: "#fff",
                              color: "#475569",
                              border: "1px solid #e2e8f0",
                              "&:hover": { backgroundColor: "#f8fafc" },
                            }),
                      }}
                    />
                  </Box>
                )}
              />

              {coverLetterOption === "upload" && (
                <Controller
                  name="coverLetter"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="Paste your cover letter here..."
                      size="small"
                      fullWidth
                      multiline
                      rows={4}
                      sx={textFieldSx}
                    />
                  )}
                />
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Phone Number */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 1.5 }}>
                Please enter your mobile number for employers to contact you
              </Typography>
              <Box sx={{ display: "flex", gap: 1, maxWidth: 400 }}>
                <TextField
                  select
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  size="small"
                  sx={{
                    ...textFieldSx,
                    minWidth: 95,
                    "& .MuiOutlinedInput-root": {
                      ...textFieldSx["& .MuiOutlinedInput-root"],
                      borderRadius: "8px",
                    },
                  }}
                >
                  {phoneCountryCodes.map((cc) => (
                    <MenuItem key={cc.code} value={cc.code}>
                      {cc.code}
                    </MenuItem>
                  ))}
                </TextField>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="234 567 8900"
                      size="small"
                      fullWidth
                      sx={textFieldSx}
                    />
                  )}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Current Location */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 1.5 }}>
                Where are you currently based?
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormLabel sx={fieldLabelSx}>Country</FormLabel>
                  <Controller
                    name="currentLocation"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Autocomplete
                        options={countries.filter((c) => c !== "Worldwide")}
                        value={value || null}
                        onChange={(_, newValue) => onChange(newValue || "")}
                        loading={loadingData.countries}
                        size="small"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Select country"
                            sx={textFieldSx}
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormLabel sx={fieldLabelSx}>City</FormLabel>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="e.g., New York"
                        size="small"
                        fullWidth
                        sx={textFieldSx}
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <MapPin size={18} style={{ color: "#94a3b8" }} />
                              </InputAdornment>
                            ),
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormLabel sx={fieldLabelSx}>State or Region</FormLabel>
                  <Controller
                    name="stateRegion"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="e.g., California"
                        size="small"
                        fullWidth
                        sx={textFieldSx}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormLabel sx={fieldLabelSx}>Post code</FormLabel>
                  <Controller
                    name="postCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="e.g., 10001"
                        size="small"
                        fullWidth
                        sx={textFieldSx}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Current Job Title */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 1.5 }}>
                What is your current (or previous) job title?
              </Typography>
              <Controller
                name="currentJobTitle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="e.g., Software Engineer"
                    size="small"
                    fullWidth
                    sx={{ ...textFieldSx, maxWidth: 450 }}
                  />
                )}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Availability */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 1.5 }}>
                What is your availability / notice period?
              </Typography>
              <Controller
                name="availability"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
                    {availabilityOptions.map((option) => (
                      <SelectableChip
                        key={option.value}
                        label={option.label}
                        selected={value === option.value}
                        onClick={() => onChange(option.value)}
                      />
                    ))}
                  </Box>
                )}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Eligible Countries */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                In which countries are you currently legally authorized to work in?
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.8125rem", mb: 1.5 }}>
                Note: your copilot will only apply to jobs in countries where you
                have the legal right to work in.
              </Typography>
              <Controller
                name="eligibleCountries"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    options={countries.filter((c) => c !== "Worldwide")}
                    value={value || []}
                    onChange={(_, newValue) => onChange(newValue)}
                    loading={loadingData.countries}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select countries"
                        sx={textFieldSx}
                        slotProps={{
                          input: {
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loadingData.countries ? (
                                  <CircularProgress size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          },
                        }}
                      />
                    )}
                    slotProps={{
                      chip: {
                        size: "small",
                        sx: {
                          backgroundColor: "#ede9fe",
                          color: "#7c3aed",
                          fontWeight: 500,
                        },
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Visa Sponsorship */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                Will you now or in the future require sponsorship for an
                employment visa?
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1.5,
                  p: 1,
                  backgroundColor: "#fef3c7",
                  borderRadius: "8px",
                  border: "1px solid #fde68a",
                }}
              >
                <WarningCircle
                  size={16}
                  weight="fill"
                  style={{ color: "#b45309" }}
                />
                <Typography sx={{ fontSize: "0.8125rem", color: "#92400e" }}>
                  This is a common ATS question, make sure you answer correctly
                </Typography>
              </Box>
              <Controller
                name="requireVisa"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Chip
                      label="Yes"
                      onClick={() => onChange(true)}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 600,
                        px: 2,
                        ...(value === true
                          ? {
                              backgroundColor: "#7c3aed",
                              color: "white",
                              "&:hover": { backgroundColor: "#6d28d9" },
                            }
                          : {
                              backgroundColor: "#fff",
                              color: "#475569",
                              border: "1px solid #e2e8f0",
                              "&:hover": { backgroundColor: "#f8fafc" },
                            }),
                      }}
                    />
                    <Chip
                      label="No"
                      onClick={() => onChange(false)}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 600,
                        px: 2,
                        ...(value === false
                          ? {
                              backgroundColor: "#7c3aed",
                              color: "white",
                              "&:hover": { backgroundColor: "#6d28d9" },
                            }
                          : {
                              backgroundColor: "#fff",
                              color: "#475569",
                              border: "1px solid #e2e8f0",
                              "&:hover": { backgroundColor: "#f8fafc" },
                            }),
                      }}
                    />
                  </Box>
                )}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Nationality */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                What is your nationality?
              </Typography>
              <Typography sx={{ color: "#64748b", fontSize: "0.8125rem", mb: 1.5 }}>
                You can select up to 3
              </Typography>
              <Controller
                name="nationality"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    options={countries.filter((c) => c !== "Worldwide")}
                    value={value || []}
                    onChange={(_, newValue) => {
                      if (newValue.length <= 3) onChange(newValue);
                    }}
                    loading={loadingData.countries}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={
                          (value?.length || 0) >= 3
                            ? "Maximum 3 selected"
                            : "Select nationality"
                        }
                        sx={textFieldSx}
                        slotProps={{
                          input: {
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {loadingData.countries ? (
                                  <CircularProgress size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          },
                        }}
                      />
                    )}
                    slotProps={{
                      chip: {
                        size: "small",
                        sx: {
                          backgroundColor: "#ede9fe",
                          color: "#7c3aed",
                          fontWeight: 500,
                        },
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Salary */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 1.5 }}>
                  What is your current (or previous) yearly salary?
                </Typography>
                <Controller
                  name="currentSalary"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="0"
                      size="small"
                      fullWidth
                      sx={textFieldSx}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CurrencyDollar
                                size={18}
                                style={{ color: "#94a3b8" }}
                              />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 1.5 }}>
                  What is your expected yearly salary for a fulltime position?
                </Typography>
                <Controller
                  name="expectedSalaryFullTime"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="0"
                      size="small"
                      fullWidth
                      sx={textFieldSx}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <CurrencyDollar
                                size={18}
                                style={{ color: "#94a3b8" }}
                              />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* LinkedIn */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 1.5 }}>
                Enter your Linkedin profile link
              </Typography>
              <Controller
                name="linkedInProfile"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder={
                      noLinkedIn
                        ? "I don't use linkedin"
                        : "https://linkedin.com/in/..."
                    }
                    size="small"
                    fullWidth
                    disabled={noLinkedIn}
                    sx={{ ...textFieldSx, maxWidth: 500 }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <LinkedinLogo
                              size={18}
                              style={{ color: "#0a66c2" }}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="noLinkedIn"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Radio
                        checked={field.value || false}
                        onChange={() => field.onChange(!field.value)}
                        size="small"
                        sx={{
                          color: "#94a3b8",
                          "&.Mui-checked": { color: "#0f172a" },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "0.875rem", color: "#475569" }}>
                        I <strong>don't</strong> use linkedin
                      </Typography>
                    }
                    sx={{ mt: 0.5 }}
                  />
                )}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Experience Summary */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 1.5 }}>
                Experience Summary
              </Typography>
              <Controller
                name="experienceSummary"
                control={control}
                render={({ field }) => (
                  <Box>
                    <TextField
                      {...field}
                      placeholder="Brief summary of your professional experience..."
                      size="small"
                      fullWidth
                      multiline
                      rows={5}
                      sx={textFieldSx}
                      error={Boolean(errors.experienceSummary)}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color:
                            (experienceSummary?.length || 0) > 500
                              ? "#ef4444"
                              : "#94a3b8",
                        }}
                      >
                        {experienceSummary?.length || 0}/500
                      </Typography>
                    </Box>
                    {errors.experienceSummary && (
                      <FormHelperText error>
                        {errors.experienceSummary.message}
                      </FormHelperText>
                    )}
                  </Box>
                )}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Additional Screening Questions (Collapsible) */}
            <Box>
              <Button
                onClick={() => setScreeningOpen(!screeningOpen)}
                endIcon={
                  screeningOpen ? (
                    <CaretUp size={18} />
                  ) : (
                    <CaretDown size={18} />
                  )
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#0f172a",
                  p: 0,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                Additional Screening Questions
              </Button>
              <Typography sx={{ color: "#64748b", fontSize: "0.8125rem", mt: 0.5 }}>
                These questions are less often asked on job applications or
                sometimes optional. We still recommend you answer them to make
                your applications more complete.
              </Typography>

              <Collapse in={screeningOpen}>
                <Box sx={{ mt: 2 }}>
                  <Controller
                    name="screeningQuestions"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="Default answers for common screening questions..."
                        size="small"
                        fullWidth
                        multiline
                        rows={4}
                        sx={textFieldSx}
                      />
                    )}
                  />
                </Box>
              </Collapse>
            </Box>
          </Paper>

          {/* ════════════════════════════════════════════════════════════════
              SECTION 6: FINAL CONFIGURATION
          ════════════════════════════════════════════════════════════════ */}
          <Paper elevation={0} sx={sectionPaperSx}>
            <SectionHeader
              icon={<Gear size={22} weight="duotone" />}
              title="Final Configuration"
              subtitle="Choose how JobCopilot works for you"
            />

            {/* Application Mode */}
            <Box sx={{ mb: 3 }}>
              <Controller
                name="applicationMode"
                control={control}
                render={({ field }) => (
                  <Box>
                    {/* Auto-Save Option */}
                    <Box
                      onClick={() => field.onChange("auto-save")}
                      sx={{
                        p: 2.5,
                        mb: 2,
                        borderRadius: "10px",
                        border: "2px solid",
                        borderColor:
                          field.value === "auto-save" ? "#7c3aed" : "#e2e8f0",
                        backgroundColor:
                          field.value === "auto-save" ? "#faf5ff" : "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        transition: "all 0.15s ease",
                        "&:hover": {
                          borderColor:
                            field.value === "auto-save" ? "#7c3aed" : "#cbd5e1",
                        },
                      }}
                    >
                      <Radio
                        checked={field.value === "auto-save"}
                        sx={{
                          p: 0,
                          color: "#cbd5e1",
                          "&.Mui-checked": { color: "#7c3aed" },
                        }}
                      />
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: "#0f172a", mb: 0.5 }}>
                          Auto-Save & Manual Review:
                          <Typography
                            component="span"
                            sx={{ fontWeight: 400, color: "#475569" }}
                          >
                            {" "}
                            your copilot auto-fills application forms but does not
                            submit them. You can review jobs and answers before
                            submitting, this allows you to{" "}
                            <strong>train your copilot</strong>
                          </Typography>
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.8125rem",
                            color: "#7c3aed",
                            fontStyle: "italic",
                          }}
                        >
                          Recommended for new users
                        </Typography>
                      </Box>
                    </Box>

                    {/* Full Auto Option */}
                    <Box
                      onClick={() => field.onChange("full-auto")}
                      sx={{
                        p: 2.5,
                        borderRadius: "10px",
                        border: "2px solid",
                        borderColor:
                          field.value === "full-auto" ? "#7c3aed" : "#e2e8f0",
                        backgroundColor:
                          field.value === "full-auto" ? "#faf5ff" : "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                        transition: "all 0.15s ease",
                        "&:hover": {
                          borderColor:
                            field.value === "full-auto" ? "#7c3aed" : "#cbd5e1",
                        },
                      }}
                    >
                      <Radio
                        checked={field.value === "full-auto"}
                        sx={{
                          p: 0,
                          color: "#cbd5e1",
                          "&.Mui-checked": { color: "#7c3aed" },
                        }}
                      />
                      <Box>
                        <Typography sx={{ fontWeight: 700, color: "#0f172a" }}>
                          Full Auto-Apply:
                          <Typography
                            component="span"
                            sx={{ fontWeight: 400, color: "#475569" }}
                          >
                            {" "}
                            your copilot auto-fills and automatically submits
                            applications.
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Writing Style (Collapsible) */}
            <Box sx={{ mb: 3 }}>
              <Button
                onClick={() => setWritingStyleOpen(!writingStyleOpen)}
                endIcon={
                  writingStyleOpen ? (
                    <CaretUp size={18} />
                  ) : (
                    <CaretDown size={18} />
                  )
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.9375rem",
                  color: "#0f172a",
                  p: 0,
                  "&:hover": { backgroundColor: "transparent" },
                }}
              >
                Writing Style
              </Button>
              <Typography sx={{ color: "#64748b", fontSize: "0.8125rem", mt: 0.5 }}>
                Personalize how your copilot answers application questions.
              </Typography>

              <Collapse in={writingStyleOpen}>
                <Box sx={{ mt: 2 }}>
                  <Controller
                    name="writingStyle"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        placeholder="e.g., Professional and concise, Friendly and enthusiastic, Technical and detailed..."
                        size="small"
                        fullWidth
                        multiline
                        rows={3}
                        sx={textFieldSx}
                      />
                    )}
                  />
                </Box>
              </Collapse>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Info bullets */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                "Your copilot will filter live jobs that match your search criteria, then will search for new jobs every 4 hours.",
                "Based on the information you gave in the previous step, your copilot will answer screening questions on your behalf, powered by AI.",
                "Your copilot will not reapply to jobs that it previously applied to.",
              ].map((text, idx) => (
                <Box
                  key={idx}
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <Check
                    size={18}
                    weight="bold"
                    style={{ color: "#7c3aed", flexShrink: 0, marginTop: 2 }}
                  />
                  <Typography sx={{ fontSize: "0.875rem", color: "#475569" }}>
                    {text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* ════════════════════════════════════════════════════════════════
              SUBMIT BUTTON
          ════════════════════════════════════════════════════════════════ */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: 2,
              mb: 4,
            }}
          >
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isPending}
              startIcon={
                isPending ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <RocketLaunch size={20} weight="bold" />
                )
              }
              sx={{
                px: 6,
                py: 1.5,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 700,
                borderRadius: "10px",
                background:
                  "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.35)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
                  boxShadow: "0 6px 20px rgba(124, 58, 237, 0.45)",
                  transform: "translateY(-1px)",
                },
                "&:disabled": {
                  background: "#cbd5e1",
                  boxShadow: "none",
                },
                transition: "all 0.2s ease",
              }}
            >
              {isPending ? "Creating Copilot..." : "Save Configuration"}
            </Button>
          </Box>
        </Box>

        {/* Location Selector Modals */}
        <LocationSelectorModal
          open={locationModalOpen === "remote"}
          onClose={() => setLocationModalOpen(null)}
          onSave={handleLocationModalSave}
          initialSelections={remoteLocations || []}
          title="Filter the countries in which the remote jobs are posted"
          allowWorldwide={true}
        />

        <OnsiteLocationSelectorModal
          open={locationModalOpen === "onsite"}
          onClose={() => setLocationModalOpen(null)}
          onSave={handleLocationModalSave}
          initialSelections={onsiteLocations || []}
          title="Filter locations where you want to apply for jobs"
          availableCountries={countries.filter((c) => c !== "Worldwide")}
        />
      </Container>
    </Box>
  );
}
