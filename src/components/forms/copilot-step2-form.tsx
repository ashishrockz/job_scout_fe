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
  FormControlLabel,
  Switch,
  Paper,
  Grid,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  ArrowRightIcon as ArrowRight,
  ArrowLeftIcon as ArrowLeft,
  SlidersHorizontalIcon as SlidersHorizontal,
  ClockIcon as Clock,
  BriefcaseIcon as Briefcase,
  BuildingsIcon as Buildings,
  GlobeIcon as Globe,
  MagnifyingGlassPlusIcon as MagnifyingGlassPlus,
  MagnifyingGlassMinusIcon as MagnifyingGlassMinus,
  ProhibitIcon as Prohibit,
} from "@phosphor-icons/react";
import { Step2Data } from "@/context/copilot-form-context";
import { getTimezones, getLanguages } from "@/lib/reference-data.service";
import { toast } from "sonner";

// Zod validation schema
const step2Schema = zod.object({
  jobMatchEnabled: zod.boolean(),
  jobMatchLevel: zod.enum(["high", "higher", "highest"]),
  seniority: zod.array(zod.string()),
  timeZones: zod.array(zod.string()),
  includeFlexibleTimeZone: zod.boolean(),
  industries: zod.array(zod.string()),
  jobDescriptionLanguages: zod.array(zod.string()),
  locationRadius: zod.string(),
  includeKeywords: zod.array(zod.string()),
  excludeKeywords: zod.array(zod.string()),
  excludeCompanies: zod.array(zod.string()),
});

type Step2FormValues = zod.infer<typeof step2Schema>;

interface CopilotStep2FormProps {
  defaultValues?: Partial<Step2Data>;
  onNext: (values: Step2FormValues) => void;
  onBack: () => void;
}

const seniorityOptions = [
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "executive", label: "Executive" },
];

const industryOptions = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
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

export function CopilotStep2Form({
  defaultValues,
  onNext,
  onBack,
}: CopilotStep2FormProps): React.JSX.Element {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Step2FormValues>({
    defaultValues: {
      jobMatchEnabled: defaultValues?.jobMatchEnabled ?? true,
      jobMatchLevel: defaultValues?.jobMatchLevel || "high",
      seniority: defaultValues?.seniority || [],
      timeZones: defaultValues?.timeZones || [],
      includeFlexibleTimeZone: defaultValues?.includeFlexibleTimeZone ?? true,
      industries: defaultValues?.industries || [],
      jobDescriptionLanguages: defaultValues?.jobDescriptionLanguages || [],
      locationRadius: defaultValues?.locationRadius || "",
      includeKeywords: defaultValues?.includeKeywords || [],
      excludeKeywords: defaultValues?.excludeKeywords || [],
      excludeCompanies: defaultValues?.excludeCompanies || [],
    },
    resolver: zodResolver(step2Schema),
  });

  const jobMatchEnabled = watch("jobMatchEnabled");

  // State for API data
  const [timezones, setTimezones] = React.useState<string[]>([]);
  const [languages, setLanguages] = React.useState<string[]>([]);
  const [loadingTimezones, setLoadingTimezones] = React.useState(false);
  const [loadingLanguages, setLoadingLanguages] = React.useState(false);

  // Fetch timezones and languages on mount
  React.useEffect(() => {
    const fetchData = async () => {
      setLoadingTimezones(true);
      setLoadingLanguages(true);

      try {
        const [timezonesRes, languagesRes] = await Promise.all([
          getTimezones(),
          getLanguages(),
        ]);

        if (timezonesRes.success && timezonesRes.data) {
          const timezoneNames = timezonesRes.data.map((tz) => tz.name);
          setTimezones(timezoneNames);
        } else {
          toast.error("Failed to load timezones");
        }

        if (languagesRes.success && languagesRes.data) {
          const languageNames = languagesRes.data.map((lang) => lang.name);
          setLanguages(languageNames);
        } else {
          toast.error("Failed to load languages");
        }
      } catch (error) {
        console.error("Error loading reference data:", error);
        toast.error("Failed to load reference data");
      } finally {
        setLoadingTimezones(false);
        setLoadingLanguages(false);
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
          Filters & Preferences
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#6b7280", fontSize: "0.9375rem" }}
        >
          Customize your job search criteria
        </Typography>
      </Box>

      {/* Job Match Section */}
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
          icon={<SlidersHorizontal size={22} weight="duotone" />}
          title="Job Match Settings"
          subtitle="Configure how closely jobs should match your criteria"
          color="#7c3aed"
        />

        <Box sx={{ mb: 3 }}>
          <Controller
            name="jobMatchEnabled"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#7c3aed",
                        "&:hover": {
                          backgroundColor: "rgba(124, 58, 237, 0.08)",
                        },
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#7c3aed",
                      },
                    }}
                  />
                }
                label="Enable Job Matching"
                sx={{ "& .MuiFormControlLabel-label": { fontWeight: 500 } }}
              />
            )}
          />
        </Box>

        {jobMatchEnabled && (
          <Box>
            <FormLabel
              sx={{
                mb: 1.5,
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#374151",
                display: "block",
              }}
            >
              Match Level
            </FormLabel>
            <Controller
              name="jobMatchLevel"
              control={control}
              render={({ field }) => (
                <ToggleButtonGroup
                  value={field.value}
                  exclusive
                  onChange={(_, value) => {
                    if (value) field.onChange(value);
                  }}
                  fullWidth
                  sx={{
                    "& .MuiToggleButton-root": {
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 500,
                      "&.Mui-selected": {
                        backgroundColor: "#7c3aed",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#6d28d9",
                        },
                      },
                    },
                  }}
                >
                  <ToggleButton value="high">High</ToggleButton>
                  <ToggleButton value="higher">Higher</ToggleButton>
                  <ToggleButton value="highest">Highest</ToggleButton>
                </ToggleButtonGroup>
              )}
            />
          </Box>
        )}
      </Paper>

      {/* Seniority & Experience Section */}
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
          title="Seniority Level"
          subtitle="Select your preferred experience levels"
          color="#10b981"
        />

        <Controller
          name="seniority"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              {seniorityOptions.map((option) => {
                const isSelected = value?.includes(option.value);
                return (
                  <Chip
                    key={option.value}
                    label={option.label}
                    onClick={() => {
                      const newValue = isSelected
                        ? value.filter((v) => v !== option.value)
                        : [...(value || []), option.value];
                      onChange(newValue);
                    }}
                    sx={{
                      padding: "8px 4px",
                      height: "auto",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      borderRadius: "20px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      ...(isSelected
                        ? {
                            backgroundColor: "#10b981",
                            color: "white",
                            "&:hover": { backgroundColor: "#059669" },
                          }
                        : {
                            backgroundColor: "#f9fafb",
                            color: "#374151",
                            border: "1px solid #e5e7eb",
                            "&:hover": { backgroundColor: "#f3f4f6", borderColor: "#d1d5db" },
                          }),
                    }}
                  />
                );
              })}
            </Box>
          )}
        />
      </Paper>

      {/* Time Zones Section */}
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
          icon={<Clock size={22} weight="duotone" />}
          title="Time Zones"
          subtitle="Specify your preferred working time zones"
          color="#3b82f6"
        />

        <Controller
          name="timeZones"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              multiple
              options={timezones}
              value={value || []}
              onChange={(_, newValue) => onChange(newValue)}
              loading={loadingTimezones}
              size="small"
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select time zones"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingTimezones ? <CircularProgress size={20} /> : null}
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

        <Box sx={{ mt: 2 }}>
          <Controller
            name="includeFlexibleTimeZone"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#3b82f6",
                        "&:hover": {
                          backgroundColor: "rgba(59, 130, 246, 0.08)",
                        },
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                        backgroundColor: "#3b82f6",
                      },
                    }}
                  />
                }
                label="Include flexible time zone jobs"
                sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
              />
            )}
          />
        </Box>
      </Paper>

      {/* Industries & Languages Section */}
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
          icon={<Buildings size={22} weight="duotone" />}
          title="Industries & Languages"
          subtitle="Preferred industries and job description languages"
          color="#f59e0b"
        />

        <Box sx={{ mb: 3 }}>
          <FormLabel
            sx={{
              mb: 1,
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#374151",
              display: "block",
            }}
          >
            Industries
          </FormLabel>
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
        </Box>

        <Box>
          <FormLabel
            sx={{
              mb: 1,
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "#374151",
              display: "block",
            }}
          >
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
                loading={loadingLanguages}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select languages"
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
        </Box>
      </Paper>

      {/* Location Radius Section */}
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
          title="Location Radius"
          subtitle="Maximum distance for on-site positions"
          color="#ec4899"
        />

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
              fullWidth
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                "& .MuiToggleButtonGroup-grouped": {
                  border: "1px solid #e5e7eb",
                  borderRadius: "10px !important",
                  margin: 0,
                  textTransform: "none",
                  fontWeight: 500,
                  flex: { xs: "1 1 calc(33.333% - 8px)", sm: "1 1 calc(20% - 8px)" },
                  "&.Mui-selected": {
                    backgroundColor: "#ec4899",
                    color: "white",
                    borderColor: "#ec4899",
                    "&:hover": {
                      backgroundColor: "#db2777",
                    },
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
      </Paper>

      {/* Keywords Section */}
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
          icon={<MagnifyingGlassPlus size={22} weight="duotone" />}
          title="Include Keywords"
          subtitle="Jobs must contain these keywords"
          color="#06b6d4"
        />

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
                        backgroundColor: "#cffafe",
                        color: "#0e7490",
                        fontWeight: 500,
                        "& .MuiChip-deleteIcon": {
                          color: "#0e7490",
                          "&:hover": { color: "#155e75" },
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

      {/* Exclude Keywords Section */}
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
          icon={<MagnifyingGlassMinus size={22} weight="duotone" />}
          title="Exclude Keywords"
          subtitle="Skip jobs containing these keywords"
          color="#ef4444"
        />

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
                        backgroundColor: "#fee2e2",
                        color: "#b91c1c",
                        fontWeight: 500,
                        "& .MuiChip-deleteIcon": {
                          color: "#b91c1c",
                          "&:hover": { color: "#991b1b" },
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

      {/* Exclude Companies Section */}
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
          icon={<Prohibit size={22} weight="duotone" />}
          title="Exclude Companies"
          subtitle="Companies you don't want to apply to"
          color="#64748b"
        />

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
                        backgroundColor: "#f1f5f9",
                        color: "#475569",
                        fontWeight: 500,
                        "& .MuiChip-deleteIcon": {
                          color: "#475569",
                          "&:hover": { color: "#334155" },
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
            Next: Profile
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
