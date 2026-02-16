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
  Paper,
  Grid,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  CheckIcon as Check,
  ArrowLeftIcon as ArrowLeft,
  RocketLaunchIcon as RocketLaunch,
  GearIcon as Gear,
  PencilIcon as Pencil,
  FloppyDiskIcon as FloppyDisk,
  SparkleIcon as Sparkle,
} from "@phosphor-icons/react";
import { Step4Data } from "@/context/copilot-form-context";

// Zod validation schema
const step4Schema = zod.object({
  applicationMode: zod.enum(["auto-save", "full-auto"]),
  writingStyle: zod.string().optional(),
});

type Step4FormValues = zod.infer<typeof step4Schema>;

interface CopilotStep4FormProps {
  defaultValues?: Partial<Step4Data>;
  onSubmit: (values: Step4FormValues) => void;
  onBack: () => void;
  isPending?: boolean;
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

export function CopilotStep4Form({
  defaultValues,
  onSubmit,
  onBack,
  isPending = false,
}: CopilotStep4FormProps): React.JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step4FormValues>({
    defaultValues: {
      applicationMode: defaultValues?.applicationMode || "auto-save",
      writingStyle: defaultValues?.writingStyle || "",
    },
    resolver: zodResolver(step4Schema),
  });

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
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
          Copilot Configuration
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#6b7280", fontSize: "0.9375rem" }}
        >
          Final settings for your job search assistant
        </Typography>
      </Box>

      {/* Application Mode Section */}
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
          icon={<Gear size={22} weight="duotone" />}
          title="Application Mode"
          subtitle="Choose how the copilot handles applications"
          color="#7c3aed"
        />

        <Controller
          name="applicationMode"
          control={control}
          render={({ field }) => (
            <Box>
              <Grid container spacing={2}>
                {[
                  {
                    value: "auto-save",
                    label: "Auto-Save",
                    description: "Save applications for review before submitting",
                    icon: <FloppyDisk size={24} weight="duotone" />,
                    color: "#3b82f6",
                  },
                  {
                    value: "full-auto",
                    label: "Full Auto",
                    description: "Automatically submit applications",
                    icon: <RocketLaunch size={24} weight="duotone" />,
                    color: "#10b981",
                  },
                ].map((option) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={option.value}>
                    <Box
                      onClick={() => field.onChange(option.value)}
                      sx={{
                        p: 3,
                        borderRadius: "12px",
                        border: "2px solid",
                        borderColor: field.value === option.value ? option.color : "#e5e7eb",
                        backgroundColor:
                          field.value === option.value
                            ? `${option.color}10`
                            : "#fff",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        gap: 2,
                        "&:hover": {
                          borderColor:
                            field.value === option.value ? option.color : "#d1d5db",
                          backgroundColor:
                            field.value === option.value
                              ? `${option.color}10`
                              : "#f9fafb",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "16px",
                          backgroundColor:
                            field.value === option.value ? option.color : "#f3f4f6",
                          color: field.value === option.value ? "#fff" : "#6b7280",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s ease",
                        }}
                      >
                        {option.icon}
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "1rem",
                            color:
                              field.value === option.value ? option.color : "#374151",
                            mb: 0.5,
                          }}
                        >
                          {option.label}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.8125rem",
                            color: "#6b7280",
                          }}
                        >
                          {option.description}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          border: "2px solid",
                          borderColor:
                            field.value === option.value ? option.color : "#d1d5db",
                          backgroundColor:
                            field.value === option.value ? option.color : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {field.value === option.value && (
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: "50%",
                              backgroundColor: "#fff",
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        />
      </Paper>

      {/* Writing Style Section */}
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
          icon={<Pencil size={22} weight="duotone" />}
          title="Writing Style"
          subtitle="Customize how your applications are written"
          color="#f59e0b"
        />

        <FormLabel
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#374151",
            display: "block",
          }}
        >
          Describe your preferred writing style
        </FormLabel>

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
              rows={4}
              slotProps={{
                input: {
                  startAdornment: (
                    <Sparkle
                      size={18}
                      style={{
                        marginRight: 8,
                        color: "#f59e0b",
                        marginTop: 8,
                        alignSelf: "flex-start",
                      }}
                    />
                  ),
                },
              }}
              sx={textFieldSx}
            />
          )}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            mt: 2,
            p: 2,
            backgroundColor: "#fef3c7",
            borderRadius: "10px",
            border: "1px solid #fde68a",
          }}
        >
          <Sparkle
            size={20}
            weight="duotone"
            style={{ color: "#b45309", flexShrink: 0, marginTop: 2 }}
          />
          <Typography sx={{ fontSize: "0.8125rem", color: "#92400e" }}>
            <strong>Tip:</strong> Your writing style helps the AI tailor cover letters
            and responses to match your personality. Be specific about tone, formality
            level, and any preferences you have.
          </Typography>
        </Box>
      </Paper>

      {/* Summary Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: "16px",
          border: "2px solid #7c3aed",
          background: "linear-gradient(135deg, #f5f3ff 0%, #faf5ff 100%)",
          mb: 3,
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "16px",
              background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              boxShadow: "0 4px 14px rgba(124, 58, 237, 0.35)",
            }}
          >
            <Check size={32} weight="bold" color="white" />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#7c3aed",
              fontSize: "1.125rem",
              mb: 1,
            }}
          >
            Ready to Launch Your Copilot!
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: "#6b7280" }}>
            Review your settings and click Submit to create your job search assistant.
          </Typography>
        </Box>
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
            disabled={isPending}
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
              "&:disabled": {
                borderColor: "#e5e7eb",
                color: "#9ca3af",
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
            disabled={isPending}
            startIcon={
              isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <RocketLaunch size={20} weight="bold" />
              )
            }
            sx={{
              borderRadius: "12px",
              padding: "14px 32px",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                boxShadow: "0 6px 20px rgba(16, 185, 129, 0.45)",
                transform: "translateY(-1px)",
              },
              "&:disabled": {
                background: "#d1d5db",
                color: "#9ca3af",
                boxShadow: "none",
              },
              transition: "all 0.2s ease",
            }}
          >
            {isPending ? "Creating Copilot..." : "Create Copilot"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
