import * as React from "react";
import { Box, Typography } from "@mui/material";
import { CheckIcon as Check } from "@phosphor-icons/react";

interface Step {
  label: string;
  shortLabel?: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

export function Stepper({
  steps,
  currentStep,
}: StepperProps): React.JSX.Element {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Tablet Stepper (sm to md) */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex", md: "none" },
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      isCompleted || isCurrent ? "#7c3aed" : "#e5e7eb",
                    color: isCompleted || isCurrent ? "white" : "#9ca3af",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    transition: "all 0.3s ease",
                    flexShrink: 0,
                  }}
                >
                  {isCompleted ? <Check size={16} weight="bold" /> : stepNumber}
                </Box>
                <Typography
                  sx={{
                    fontSize: "0.8125rem",
                    fontWeight: isCurrent ? 600 : 500,
                    color: isCompleted
                      ? "#7c3aed"
                      : isCurrent
                        ? "#111827"
                        : "#9ca3af",
                    whiteSpace: "nowrap",
                  }}
                >
                  {step.shortLabel || step.label}
                </Typography>
              </Box>
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    width: 24,
                    height: 2,
                    backgroundColor:
                      stepNumber < currentStep ? "#7c3aed" : "#e5e7eb",
                    transition: "all 0.3s ease",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>

      {/* Desktop Stepper (md and up) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "flex-start",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={index}>
              {/* Step Item */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                  flex: 1,
                  zIndex: 1,
                }}
              >
                {/* Step Circle */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      isCompleted || isCurrent ? "#7c3aed" : "#e5e7eb",
                    color: isCompleted || isCurrent ? "white" : "#9ca3af",
                    fontWeight: 600,
                    fontSize: "1.125rem",
                    transition: "all 0.3s ease",
                    boxShadow: isCurrent
                      ? "0 4px 12px rgba(124, 58, 237, 0.3)"
                      : "none",
                  }}
                >
                  {isCompleted ? <Check size={24} weight="bold" /> : stepNumber}
                </Box>

                {/* Step Label */}
                <Typography
                  sx={{
                    mt: 1.5,
                    fontSize: "0.875rem",
                    fontWeight: isCurrent ? 600 : 500,
                    color: isCompleted
                      ? "#7c3aed"
                      : isCurrent
                        ? "#111827"
                        : "#9ca3af",
                    textAlign: "center",
                    maxWidth: 120,
                    transition: "all 0.3s ease",
                  }}
                >
                  {step.label}
                </Typography>

                {step.description && (
                  <Typography
                    sx={{
                      mt: 0.5,
                      fontSize: "0.75rem",
                      color: "#9ca3af",
                      textAlign: "center",
                      maxWidth: 120,
                    }}
                  >
                    {step.description}
                  </Typography>
                )}
              </Box>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    flex: 1,
                    height: 2,
                    backgroundColor:
                      stepNumber < currentStep ? "#7c3aed" : "#e5e7eb",
                    maxWidth: 100,
                    mx: 1,
                    mt: 3,
                    transition: "all 0.3s ease",
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </Box>
    </Box>
  );
}
