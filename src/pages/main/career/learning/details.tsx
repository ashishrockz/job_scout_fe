import * as React from "react";
import { CareerProfileForm, CareerProfileFormValues } from "@/components/forms/career-profile-form";
import { Box, Container, Typography, Paper } from "@mui/material";

export function Page(): React.JSX.Element {
  const handleSubmit = async (values: CareerProfileFormValues) => {
    console.log("Form submitted:", values);
    // Add your form submission logic here
    // Example: call an API, generate report, etc.
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            mb: { xs: 4, sm: 5, md: 6 },
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#111827",
              mb: 2,
              fontSize: { xs: "1.875rem", sm: "2.25rem", md: "3rem" },
            }}
          >
            Learning & Upskilling
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6b7280",
              maxWidth: "600px",
              mx: "auto",
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            Enter your information to view in-demand skills and get personalized
            recommendations of courses and certifications to achieve your target
            job.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            p: { xs: 3, sm: 4, md: 6 },
            backgroundColor: "white",
          }}
        >
          <CareerProfileForm
            onSubmit={handleSubmit}
            submitButtonText="Generate Salary Benchmark Report"
          />
        </Paper>
      </Container>
    </Box>
  );
}
