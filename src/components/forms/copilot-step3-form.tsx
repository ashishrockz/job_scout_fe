import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import {
  Box,
  TextField,
  Button,
  FormLabel,
  Typography,
  Chip,
  Autocomplete,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  ArrowRightIcon as ArrowRight,
  ArrowLeftIcon as ArrowLeft,
  UserIcon as User,
  FileTextIcon as FileText,
  PhoneIcon as Phone,
  MapPinIcon as MapPin,
  BriefcaseIcon as Briefcase,
  CurrencyDollarIcon as CurrencyDollar,
  LinkedinLogoIcon as LinkedinLogo,
  GlobeIcon as Globe,
  IdentificationCardIcon as IdentificationCard,
} from "@phosphor-icons/react";
import { Step3Data } from "@/context/copilot-form-context";
import { getLanguages, getCountries } from "@/lib/reference-data.service";
import { toast } from "sonner";

// Zod validation schema
const step3Schema = zod.object({
  cvLink: zod.string().optional(),
  phoneNumber: zod.string().optional(),
  coverLetter: zod.string().optional(),
  currentLocation: zod.string().optional(),
  currentJobTitle: zod.string().optional(),
  availability: zod.string().optional(),
  eligibleCountries: zod.array(zod.string()),
  futureLanguages: zod.array(zod.string()),
  nationality: zod.array(zod.string()),
  currentSalary: zod.string().optional(),
  expectedSalary: zod.string().optional(),
  expectedSalaryFullTime: zod.string().optional(),
  expectedSalaryPartTime: zod.string().optional(),
  linkedInProfile: zod.string().optional(),
  experienceSummary: zod.string().optional(),
  screeningQuestions: zod.string().optional(),
  stateRegion: zod.string().optional(),
  postCode: zod.string().optional(),
});

type Step3FormValues = zod.infer<typeof step3Schema>;

interface CopilotStep3FormProps {
  defaultValues?: Partial<Step3Data>;
  onNext: (values: Step3FormValues) => void;
  onBack: () => void;
}

// Section Header Component
const SectionHeader = ({
  icon,
  title,
  subtitle,
  color = "#7c3aed",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  color?: string;
}) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: "12px",
        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: color,
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "#1f2937",
          fontSize: { xs: "1rem", sm: "1.125rem" },
          lineHeight: 1.3,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          sx={{ color: "#6b7280", fontSize: "0.875rem", mt: 0.5 }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  </Box>
);

// Text Field Styles
const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#f9fafb",
    transition: "all 0.2s ease",
    "& fieldset": {
      borderColor: "#e5e7eb",
    },
    "&:hover fieldset": {
      borderColor: "#d1d5db",
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      "& fieldset": {
        borderColor: "#7c3aed",
        borderWidth: "2px",
      },
    },
  },
};

export function CopilotStep3Form({
  defaultValues,
  onNext,
  onBack,
}: CopilotStep3FormProps): React.JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3FormValues>({
    defaultValues: {
      cvLink: defaultValues?.cvLink || "",
      phoneNumber: defaultValues?.phoneNumber || "",
      coverLetter: defaultValues?.coverLetter || "",
      currentLocation: defaultValues?.currentLocation || "",
      currentJobTitle: defaultValues?.currentJobTitle || "",
      availability: defaultValues?.availability || "",
      eligibleCountries: defaultValues?.eligibleCountries || [],
      futureLanguages: defaultValues?.futureLanguages || [],
      nationality: defaultValues?.nationality || [],
      currentSalary: defaultValues?.currentSalary || "",
      expectedSalary: defaultValues?.expectedSalary || "",
      expectedSalaryFullTime: defaultValues?.expectedSalaryFullTime || "",
      expectedSalaryPartTime: defaultValues?.expectedSalaryPartTime || "",
      linkedInProfile: defaultValues?.linkedInProfile || "",
      experienceSummary: defaultValues?.experienceSummary || "",
      screeningQuestions: defaultValues?.screeningQuestions || "",
      stateRegion: defaultValues?.stateRegion || "",
      postCode: defaultValues?.postCode || "",
    },
    resolver: zodResolver(step3Schema),
  });

  // State for API data
  const [languages, setLanguages] = React.useState<string[]>([]);
  const [countries, setCountries] = React.useState<string[]>([]);
  const [loadingLanguages, setLoadingLanguages] = React.useState(false);
  const [loadingCountries, setLoadingCountries] = React.useState(false);

  // Fetch languages and countries on mount
  React.useEffect(() => {
    const fetchData = async () => {
      setLoadingLanguages(true);
      setLoadingCountries(true);

      try {
        const [languagesRes, countriesRes] = await Promise.all([
          getLanguages(),
          getCountries(),
        ]);

        if (languagesRes.success && languagesRes.data) {
          const languageNames = languagesRes.data.map((lang) => lang.name);
          setLanguages(languageNames);
        } else {
          toast.error("Failed to load languages");
        }

        if (countriesRes.success && countriesRes.data) {
          const countryNames = countriesRes.data.map((c) => c.name);
          setCountries(countryNames);
        } else {
          toast.error("Failed to load countries");
        }
      } catch (error) {
        console.error("Error loading reference data:", error);
        toast.error("Failed to load reference data");
      } finally {
        setLoadingLanguages(false);
        setLoadingCountries(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onNext)}
      sx={{ width: "100%", maxWidth: 700, mx: "auto" }}
    >
      {/* Page Title - Hidden on mobile */}
      <Box sx={{ display: { xs: "none", sm: "block" }, mb: 4, textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: { sm: "1.25rem", md: "1.5rem" },
            color: "#111827",
            mb: 1,
          }}
        >
          Profile Information
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#6b7280", fontSize: "0.9375rem" }}
        >
          Help us personalize your applications
        </Typography>
      </Box>

      {/* Basic Information Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 3,
        }}
      >
        <SectionHeader
          icon={<User size={22} weight="duotone" />}
          title="Basic Information"
          subtitle="Your current professional details"
          color="#7c3aed"
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Current Job Title
            </FormLabel>
            <Controller
              name="currentJobTitle"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g., Senior Software Engineer"
                  size="small"
                  fullWidth
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Phone Number
            </FormLabel>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="+1 234 567 8900"
                  size="small"
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Phone
                          size={18}
                          style={{ marginRight: 8, color: "#9ca3af" }}
                        />
                      ),
                    },
                  }}
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Availability
            </FormLabel>
            <Controller
              name="availability"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g., Immediate, 2 weeks"
                  size="small"
                  fullWidth
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Location & Documents Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 3,
        }}
      >
        <SectionHeader
          icon={<MapPin size={22} weight="duotone" />}
          title="Location & Documents"
          subtitle="Where you are and your CV details"
          color="#10b981"
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Current Location
            </FormLabel>
            <Controller
              name="currentLocation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g., San Francisco, CA"
                  size="small"
                  fullWidth
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              State/Region
            </FormLabel>
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
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Post Code
            </FormLabel>
            <Controller
              name="postCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g., 94102"
                  size="small"
                  fullWidth
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              CV Link
            </FormLabel>
            <Controller
              name="cvLink"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="https://..."
                  size="small"
                  fullWidth
                  slotProps={{
                    input: {
                      startAdornment: (
                        <FileText
                          size={18}
                          style={{ marginRight: 8, color: "#9ca3af" }}
                        />
                      ),
                    },
                  }}
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Nationality & Eligibility Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 3,
        }}
      >
        <SectionHeader
          icon={<IdentificationCard size={22} weight="duotone" />}
          title="Nationality & Work Eligibility"
          subtitle="Countries where you can legally work"
          color="#3b82f6"
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Nationality
            </FormLabel>
            <Controller
              name="nationality"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={countries}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue)}
                  loading={loadingCountries}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select your nationalities"
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingCountries ? <CircularProgress size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        },
                      }}
                      sx={textFieldSx}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          label={option}
                          {...tagProps}
                          key={key}
                          size="small"
                          sx={{
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                            fontWeight: 500,
                            "& .MuiChip-deleteIcon": {
                              color: "#1e40af",
                              "&:hover": { color: "#1e3a8a" },
                            },
                          }}
                        />
                      );
                    })
                  }
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Eligible Countries
            </FormLabel>
            <Controller
              name="eligibleCountries"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={countries}
                  value={value || []}
                  onChange={(_, newValue) => onChange(newValue)}
                  loading={loadingCountries}
                  size="small"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Countries where you can work"
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loadingCountries ? <CircularProgress size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        },
                      }}
                      sx={textFieldSx}
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => {
                      const { key, ...tagProps } = getTagProps({ index });
                      return (
                        <Chip
                          label={option}
                          {...tagProps}
                          key={key}
                          size="small"
                          sx={{
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                            fontWeight: 500,
                            "& .MuiChip-deleteIcon": {
                              color: "#1e40af",
                              "&:hover": { color: "#1e3a8a" },
                            },
                          }}
                        />
                      );
                    })
                  }
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Languages Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 3,
        }}
      >
        <SectionHeader
          icon={<Globe size={22} weight="duotone" />}
          title="Languages"
          subtitle="Languages you speak or want to learn"
          color="#f59e0b"
        />

        <FormLabel
          sx={{
            mb: 1,
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#374151",
            display: "block",
          }}
        >
          Future Languages
        </FormLabel>
        <Controller
          name="futureLanguages"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              multiple
              options={languages}
              value={value || []}
              onChange={(_, newValue) => onChange(newValue)}
              loading={loadingLanguages}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Languages you want to work with"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingLanguages ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                  sx={textFieldSx}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      label={option}
                      {...tagProps}
                      key={key}
                      size="small"
                      sx={{
                        backgroundColor: "#fef3c7",
                        color: "#b45309",
                        fontWeight: 500,
                        "& .MuiChip-deleteIcon": {
                          color: "#b45309",
                          "&:hover": { color: "#92400e" },
                        },
                      }}
                    />
                  );
                })
              }
            />
          )}
        />
      </Paper>

      {/* Salary Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 3,
        }}
      >
        <SectionHeader
          icon={<CurrencyDollar size={22} weight="duotone" />}
          title="Salary Expectations"
          subtitle="Your current and expected salary"
          color="#10b981"
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Current Salary
            </FormLabel>
            <Controller
              name="currentSalary"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g., $120,000"
                  size="small"
                  fullWidth
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Expected Salary
            </FormLabel>
            <Controller
              name="expectedSalary"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g., $140,000"
                  size="small"
                  fullWidth
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Expected Salary (Full-Time)
            </FormLabel>
            <Controller
              name="expectedSalaryFullTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g., $140,000/year"
                  size="small"
                  fullWidth
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Expected Salary (Part-Time)
            </FormLabel>
            <Controller
              name="expectedSalaryPartTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="e.g., $70/hour"
                  size="small"
                  fullWidth
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Professional Links Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 3,
        }}
      >
        <SectionHeader
          icon={<LinkedinLogo size={22} weight="duotone" />}
          title="Professional Links"
          subtitle="Your LinkedIn and other profiles"
          color="#0a66c2"
        />

        <FormLabel
          sx={{
            mb: 1,
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#374151",
            display: "block",
          }}
        >
          LinkedIn Profile
        </FormLabel>
        <Controller
          name="linkedInProfile"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              placeholder="https://linkedin.com/in/..."
              size="small"
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <LinkedinLogo
                      size={18}
                      style={{ marginRight: 8, color: "#0a66c2" }}
                    />
                  ),
                },
              }}
              sx={textFieldSx}
            />
          )}
        />
      </Paper>

      {/* Additional Information Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 3,
        }}
      >
        <SectionHeader
          icon={<Briefcase size={22} weight="duotone" />}
          title="Additional Information"
          subtitle="Cover letter, experience, and screening questions"
          color="#ec4899"
        />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Cover Letter
            </FormLabel>
            <Controller
              name="coverLetter"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Write your cover letter template..."
                  size="small"
                  fullWidth
                  multiline
                  rows={4}
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Experience Summary
            </FormLabel>
            <Controller
              name="experienceSummary"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="Brief summary of your professional experience..."
                  size="small"
                  fullWidth
                  multiline
                  rows={4}
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <FormLabel
              sx={{
                mb: 1,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Screening Questions Template
            </FormLabel>
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
                  rows={3}
                  sx={textFieldSx}
                />
              )}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Navigation Buttons */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            type="button"
            onClick={onBack}
            variant="outlined"
            size="large"
            fullWidth
            startIcon={<ArrowLeft size={20} weight="bold" />}
            sx={{
              borderRadius: "12px",
              padding: "14px 32px",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              borderColor: "#e5e7eb",
              color: "#374151",
              "&:hover": {
                borderColor: "#d1d5db",
                backgroundColor: "#f9fafb",
              },
            }}
          >
            Back
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            endIcon={<ArrowRight size={20} weight="bold" />}
            sx={{
              borderRadius: "12px",
              padding: "14px 32px",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              boxShadow: "0 4px 14px rgba(124, 58, 237, 0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #6d28d9 0%, #9333ea 100%)",
                boxShadow: "0 6px 20px rgba(124, 58, 237, 0.45)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Next: Configuration
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
