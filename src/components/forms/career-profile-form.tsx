import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";
import {
  Box,
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
  Chip,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import {
  MapPinIcon as MapPin,
  ArrowRightIcon as ArrowRight,
  TargetIcon as Target,
  UserIcon as User,
  GlobeIcon as Globe,
  TranslateIcon as Translate,
} from "@phosphor-icons/react";

// Zod validation schema
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

export const defaultCareerProfileValues: CareerProfileFormValues = {
  currentJobTitle: "",
  yearsOfExperience: "",
  managingTeamMembers: "",
  scope: "",
  industrySector: [],
  country: "",
  city: "",
  targetJobTitle: "",
  targetIndustrySector: [],
  languageToUse: "",
};

// Options
export const teamSizeOptions = [
  { value: "no", label: "No" },
  { value: "1-4", label: "1-4" },
  { value: "5-10", label: "5-10" },
  { value: "10+", label: "10+" },
];

export const scopeOptions = [
  { value: "national", label: "National" },
  { value: "regional", label: "Regional" },
  { value: "global", label: "Global" },
];

export const industryOptions = [
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
];

export const countryOptions = [
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
];

export const languageOptions = [
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
];

interface CareerProfileFormProps {
  onSubmit: (values: CareerProfileFormValues) => void | Promise<void>;
  defaultValues?: Partial<CareerProfileFormValues>;
  isPending?: boolean;
  submitButtonText?: string;
}

// Section Header Component
const SectionHeader = ({
  icon,
  title,
  subtitle,
  color = "#6366f1",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  color?: string;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
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
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          sx={{ color: "#6b7280", fontSize: "0.875rem" }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  </Box>
);

// Form Label Component
const StyledFormLabel = ({ children }: { children: React.ReactNode }) => (
  <FormLabel
    sx={{
      mb: 1,
      fontWeight: 600,
      fontSize: "0.875rem",
      color: "#374151",
      display: "block",
    }}
  >
    {children}
  </FormLabel>
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
        borderColor: "#6366f1",
        borderWidth: "2px",
      },
    },
  },
};

// Toggle Button Group Styles
const toggleButtonGroupSx = {
  display: "flex",
  flexWrap: "wrap",
  gap: 1,
  "& .MuiToggleButtonGroup-grouped": {
    border: "1px solid #e5e7eb",
    borderRadius: "20px !important",
    margin: 0,
  },
  "& .MuiToggleButton-root": {
    borderRadius: "20px",
    border: "1px solid #e5e7eb",
    padding: "6px 18px",
    textTransform: "none",
    color: "#4b5563",
    fontSize: "0.875rem",
    fontWeight: 500,
    backgroundColor: "#f9fafb",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f3f4f6",
      borderColor: "#d1d5db",
    },
    "&.Mui-selected": {
      backgroundColor: "#6366f1",
      color: "white",
      border: "1px solid #6366f1",
      "&:hover": {
        backgroundColor: "#4f46e5",
      },
    },
  },
};

export function CareerProfileForm({
  onSubmit,
  defaultValues,
  isPending = false,
  submitButtonText = "Generate Salary Benchmark Report",
}: CareerProfileFormProps): React.JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CareerProfileFormValues>({
    defaultValues: { ...defaultCareerProfileValues, ...defaultValues },
    resolver: zodResolver(careerProfileSchema),
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ width: "100%", maxWidth: 800, mx: "auto" }}
    >
      {/* Current Profile Section */}
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
          title="Current Profile"
          subtitle="Tell us about your current role"
          color="#6366f1"
        />

        <Grid container spacing={3}>
          {/* Current Job Title */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <StyledFormLabel>Current Job Title</StyledFormLabel>
              <Controller
                name="currentJobTitle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="e.g. Digital Marketing Manager"
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={Boolean(errors.currentJobTitle)}
                    helperText={errors.currentJobTitle?.message}
                    sx={textFieldSx}
                  />
                )}
              />
            </FormControl>
          </Grid>

          {/* Years of Experience */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <StyledFormLabel>Years of Experience</StyledFormLabel>
              <Controller
                name="yearsOfExperience"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="e.g. 5"
                    type="text"
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={Boolean(errors.yearsOfExperience)}
                    helperText={errors.yearsOfExperience?.message}
                    sx={textFieldSx}
                  />
                )}
              />
            </FormControl>
          </Grid>

          {/* Managing Team Members */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <StyledFormLabel>Managing Team Members</StyledFormLabel>
              <Controller
                name="managingTeamMembers"
                control={control}
                render={({ field }) => (
                  <Box>
                    <ToggleButtonGroup
                      {...field}
                      exclusive
                      onChange={(_, value) => {
                        if (value !== null) {
                          field.onChange(value);
                        }
                      }}
                      sx={toggleButtonGroupSx}
                    >
                      {teamSizeOptions.map((option) => (
                        <ToggleButton key={option.value} value={option.value}>
                          {option.label}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                    {errors.managingTeamMembers && (
                      <FormHelperText error sx={{ mt: 0.5 }}>
                        {errors.managingTeamMembers.message}
                      </FormHelperText>
                    )}
                  </Box>
                )}
              />
            </FormControl>
          </Grid>

          {/* Scope */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <StyledFormLabel>Scope</StyledFormLabel>
              <Controller
                name="scope"
                control={control}
                render={({ field }) => (
                  <Box>
                    <ToggleButtonGroup
                      {...field}
                      exclusive
                      onChange={(_, value) => {
                        if (value !== null) {
                          field.onChange(value);
                        }
                      }}
                      sx={toggleButtonGroupSx}
                    >
                      {scopeOptions.map((option) => (
                        <ToggleButton key={option.value} value={option.value}>
                          {option.label}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                    {errors.scope && (
                      <FormHelperText error sx={{ mt: 0.5 }}>
                        {errors.scope.message}
                      </FormHelperText>
                    )}
                  </Box>
                )}
              />
            </FormControl>
          </Grid>

          {/* Industry / Sector */}
          <Grid size={12}>
            <FormControl fullWidth>
              <StyledFormLabel>Industry / Sector</StyledFormLabel>
              <Controller
                name="industrySector"
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
                        placeholder="Type or select industries"
                        error={Boolean(errors.industrySector)}
                        helperText={errors.industrySector?.message}
                        sx={textFieldSx}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
                          size="small"
                          sx={{
                            backgroundColor: "#ede9fe",
                            color: "#6366f1",
                            fontWeight: 500,
                            "& .MuiChip-deleteIcon": {
                              color: "#6366f1",
                              "&:hover": { color: "#4f46e5" },
                            },
                          }}
                        />
                      ))
                    }
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Location Section */}
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
          title="Location"
          subtitle="Where are you based?"
          color="#10b981"
        />

        <Grid container spacing={3}>
          {/* Country */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <StyledFormLabel>Country</StyledFormLabel>
              <Controller
                name="country"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={countryOptions}
                    value={value || null}
                    onChange={(_, newValue) => onChange(newValue || "")}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select country"
                        error={Boolean(errors.country)}
                        helperText={errors.country?.message}
                        sx={textFieldSx}
                      />
                    )}
                  />
                )}
              />
            </FormControl>
          </Grid>

          {/* City */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <StyledFormLabel>City (Optional)</StyledFormLabel>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="e.g. Los Angeles, California"
                    variant="outlined"
                    fullWidth
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <MapPin size={18} className="text-gray-400" />
                      ),
                    }}
                    sx={textFieldSx}
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Target Profile Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          background: "linear-gradient(135deg, #fef3c7 0%, #fff7ed 100%)",
          mb: 3,
        }}
      >
        <SectionHeader
          icon={<Target size={22} weight="duotone" />}
          title="Target Profile"
          subtitle="What role are you aiming for?"
          color="#f59e0b"
        />

        <Grid container spacing={3}>
          {/* Target Job Title */}
          <Grid size={12}>
            <FormControl fullWidth>
              <StyledFormLabel>Target Job Title</StyledFormLabel>
              <Controller
                name="targetJobTitle"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="e.g. Senior Digital Marketing Manager"
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={Boolean(errors.targetJobTitle)}
                    helperText={errors.targetJobTitle?.message}
                    sx={{
                      ...textFieldSx,
                      "& .MuiOutlinedInput-root": {
                        ...textFieldSx["& .MuiOutlinedInput-root"],
                        backgroundColor: "#fff",
                      },
                    }}
                  />
                )}
              />
            </FormControl>
          </Grid>

          {/* Target Industry / Sector */}
          <Grid size={12}>
            <FormControl fullWidth>
              <StyledFormLabel>Target Industry / Sector</StyledFormLabel>
              <Controller
                name="targetIndustrySector"
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
                        placeholder="Type or select target industries"
                        error={Boolean(errors.targetIndustrySector)}
                        helperText={errors.targetIndustrySector?.message}
                        sx={{
                          ...textFieldSx,
                          "& .MuiOutlinedInput-root": {
                            ...textFieldSx["& .MuiOutlinedInput-root"],
                            backgroundColor: "#fff",
                          },
                        }}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          key={option}
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
                      ))
                    }
                  />
                )}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Language Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          mb: 4,
        }}
      >
        <SectionHeader
          icon={<Translate size={22} weight="duotone" />}
          title="Preferences"
          subtitle="Language for reports"
          color="#8b5cf6"
        />

        <FormControl fullWidth>
          <StyledFormLabel>Language to Use</StyledFormLabel>
          <Controller
            name="languageToUse"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                options={languageOptions}
                value={value || null}
                onChange={(_, newValue) => onChange(newValue || "")}
                size="small"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select language"
                    error={Boolean(errors.languageToUse)}
                    helperText={errors.languageToUse?.message}
                    sx={textFieldSx}
                  />
                )}
              />
            )}
          />
        </FormControl>
      </Paper>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        size="large"
        fullWidth
        disabled={isPending}
        endIcon={<ArrowRight size={20} weight="bold" />}
        sx={{
          borderRadius: "12px",
          padding: "14px 32px",
          textTransform: "none",
          fontSize: "1rem",
          fontWeight: 600,
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
          "&:hover": {
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            boxShadow: "0 6px 20px rgba(99, 102, 241, 0.45)",
            transform: "translateY(-1px)",
          },
          "&:disabled": {
            background: "#e5e7eb",
            color: "#9ca3af",
            boxShadow: "none",
          },
          transition: "all 0.2s ease",
        }}
      >
        {isPending ? "Processing..." : submitButtonText}
      </Button>
    </Box>
  );
}
