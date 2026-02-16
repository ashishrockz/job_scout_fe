import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import {
  XIcon as X,
  CaretRightIcon as CaretRight,
} from "@phosphor-icons/react";

interface LocationData {
  [region: string]: string[];
}

interface LocationSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (selectedLocations: string[]) => void;
  initialSelections?: string[];
  title: string;
  allowWorldwide?: boolean;
}

// Mock location data - replace with API data
const LOCATION_DATA: LocationData = {
  "Central America": [
    "Belize",
    "Costa Rica",
    "El Salvador",
    "Guatemala",
    "Honduras",
    "Nicaragua",
    "Panama",
  ],
  "Central Asia": [
    "Kazakhstan",
    "Kyrgyzstan",
    "Tajikistan",
    "Turkmenistan",
    "Uzbekistan",
  ],
  "East Asia": [
    "China",
    "Hong Kong",
    "Japan",
    "Macau",
    "Mongolia",
    "North Korea",
    "South Korea",
    "Taiwan",
  ],
  Europe: [
    "Andorra",
    "Albania",
    "Austria",
    "Belarus",
    "Belgium",
    "Bosnia and Herzegovina",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Iceland",
    "Ireland",
    "Italy",
    "Kosovo",
    "Latvia",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Moldova",
    "Monaco",
    "Montenegro",
    "Netherlands",
    "North Macedonia",
    "Norway",
    "Poland",
    "Portugal",
    "Romania",
    "Russia",
    "San Marino",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "Switzerland",
    "Ukraine",
    "United Kingdom",
    "Vatican City",
  ],
  "Middle East": [
    "Bahrain",
    "Iran",
    "Iraq",
    "Israel",
    "Jordan",
    "Kuwait",
    "Lebanon",
    "Oman",
    "Palestine",
    "Qatar",
    "Saudi Arabia",
    "Syria",
    "Turkey",
    "United Arab Emirates",
    "Yemen",
  ],
  "North Africa": ["Algeria", "Egypt", "Libya", "Morocco", "Sudan", "Tunisia"],
  "North America": ["Canada", "Mexico", "United States"],
  Oceania: [
    "Australia",
    "Fiji",
    "Kiribati",
    "Marshall Islands",
    "Micronesia",
    "Nauru",
    "New Zealand",
    "Palau",
    "Papua New Guinea",
    "Samoa",
    "Solomon Islands",
    "Tonga",
    "Tuvalu",
    "Vanuatu",
  ],
  "South America": [
    "Argentina",
    "Bolivia",
    "Brazil",
    "Chile",
    "Colombia",
    "Ecuador",
    "Guyana",
    "Paraguay",
    "Peru",
    "Suriname",
    "Uruguay",
    "Venezuela",
  ],
  "South Asia": [
    "Afghanistan",
    "Bangladesh",
    "Bhutan",
    "India",
    "Maldives",
    "Nepal",
    "Pakistan",
    "Sri Lanka",
  ],
  "Southeast Asia": [
    "Brunei",
    "Cambodia",
    "Indonesia",
    "Laos",
    "Malaysia",
    "Myanmar",
    "Philippines",
    "Singapore",
    "Thailand",
    "Timor-Leste",
    "Vietnam",
  ],
  "Sub-Saharan Africa": [
    "Angola",
    "Benin",
    "Botswana",
    "Burkina Faso",
    "Burundi",
    "Cameroon",
    "Cape Verde",
    "Central African Republic",
    "Chad",
    "Comoros",
    "Congo",
    "DR Congo",
    "Djibouti",
    "Equatorial Guinea",
    "Eritrea",
    "Eswatini",
    "Ethiopia",
    "Gabon",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea-Bissau",
    "Ivory Coast",
    "Kenya",
    "Lesotho",
    "Liberia",
    "Madagascar",
    "Malawi",
    "Mali",
    "Mauritania",
    "Mauritius",
    "Mozambique",
    "Namibia",
    "Niger",
    "Nigeria",
    "Rwanda",
    "Sao Tome and Principe",
    "Senegal",
    "Seychelles",
    "Sierra Leone",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Tanzania",
    "Togo",
    "Uganda",
    "Zambia",
    "Zimbabwe",
  ],
};

export function LocationSelectorModal({
  open,
  onClose,
  onSave,
  initialSelections = [],
  title,
  allowWorldwide = true,
}: LocationSelectorModalProps): React.JSX.Element {
  const [selectedLocations, setSelectedLocations] =
    React.useState<string[]>(initialSelections);
  const [expandedRegion, setExpandedRegion] = React.useState<string | null>(
    null,
  );
  const [worldwideSelected, setWorldwideSelected] = React.useState(
    initialSelections.includes("Worldwide"),
  );

  React.useEffect(() => {
    setSelectedLocations(initialSelections);
    setWorldwideSelected(initialSelections.includes("Worldwide"));
  }, [initialSelections]);

  const handleRegionClick = (region: string) => {
    setExpandedRegion(expandedRegion === region ? null : region);
  };

  const handleWorldwideToggle = () => {
    const newValue = !worldwideSelected;
    setWorldwideSelected(newValue);
    if (newValue) {
      // If worldwide is selected, clear all other selections
      setSelectedLocations(["Worldwide"]);
    } else {
      setSelectedLocations([]);
    }
  };

  const handleCountryToggle = (country: string) => {
    if (worldwideSelected) {
      // If worldwide is selected, unselect it and select only this country
      setWorldwideSelected(false);
      setSelectedLocations([country]);
    } else {
      setSelectedLocations((prev) =>
        prev.includes(country)
          ? prev.filter((c) => c !== country)
          : [...prev, country],
      );
    }
  };

  const handleSelectAllInRegion = (region: string) => {
    const countries = LOCATION_DATA[region];
    const allSelected = countries.every((country) =>
      selectedLocations.includes(country),
    );

    if (allSelected) {
      // Deselect all in region
      setSelectedLocations((prev) =>
        prev.filter((loc) => !countries.includes(loc)),
      );
    } else {
      // Select all in region
      setSelectedLocations((prev) => {
        const newSelections = [...prev];
        countries.forEach((country) => {
          if (!newSelections.includes(country)) {
            newSelections.push(country);
          }
        });
        return newSelections;
      });
      setWorldwideSelected(false);
    }
  };

  const handleSave = () => {
    onSave(selectedLocations);
    onClose();
  };

  const handleCancel = () => {
    // Reset to initial state
    setSelectedLocations(initialSelections);
    setWorldwideSelected(initialSelections.includes("Worldwide"));
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "12px",
            maxHeight: "80vh",
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#0f172a" }}>
            {title}
          </Typography>
          <IconButton onClick={handleCancel} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {allowWorldwide && (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap", // makes it responsive
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={worldwideSelected}
                    onChange={handleWorldwideToggle}
                    sx={{
                      color: "#7c3aed",
                      "&.Mui-checked": { color: "#7c3aed" },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 500, fontSize: "0.9375rem" }}>
                    Worldwide
                  </Typography>
                }
              />
              {/* Selected Count */}
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                }}
              >
                <Typography sx={{ fontSize: "0.875rem", color: "#475569" }}>
                  <strong>{selectedLocations.length}</strong> location
                  {selectedLocations.length !== 1 ? "s" : ""} selected
                  {selectedLocations.length > 0 && (
                    <span style={{ marginLeft: 8 }}>
                      ({selectedLocations.slice(0, 3).join(", ")}
                      {selectedLocations.length > 3 &&
                        ` +${selectedLocations.length - 3} more`}
                      )
                    </span>
                  )}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography
                sx={{ px: 2, color: "#64748b", fontSize: "0.875rem" }}
              >
                OR
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>
          </>
        )}

        <Typography
          sx={{
            fontWeight: 500,
            mb: 1,
            fontSize: "0.9375rem",
            color: "#0f172a",
          }}
        >
          Select specific regions or countries
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 2,
            minHeight: 290,
          }}
        >
          {/* Left Panel - Regions */}
          <Box
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              overflow: "auto",
              maxHeight: 290,
            }}
          >
            <List disablePadding>
              {Object.keys(LOCATION_DATA).map((region, index) => (
                <React.Fragment key={region}>
                  {index > 0 && <Divider />}
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleRegionClick(region)}
                      selected={expandedRegion === region}
                      sx={{
                        py: 1.5,
                        "&.Mui-selected": {
                          backgroundColor: "#f8f9fa",
                          borderLeft: "3px solid #7c3aed",
                        },
                      }}
                    >
                      <ListItemText
                        primary={region}
                        slotProps={{
                          primary: {
                            sx: {
                              fontSize: "0.875rem",
                              fontWeight: expandedRegion === region ? 600 : 500,
                            },
                          },
                        }}
                      />
                      <CaretRight
                        size={16}
                        style={{
                          transform:
                            expandedRegion === region
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </Box>

          {/* Right Panel - Countries */}
          <Box
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              overflow: "auto",
              maxHeight: 290,
              p: 2,
            }}
          >
            {expandedRegion ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      color: "#0f172a",
                    }}
                  >
                    {expandedRegion}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => handleSelectAllInRegion(expandedRegion)}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.8125rem",
                      color: "#7c3aed",
                      "&:hover": { backgroundColor: "#ede9fe" },
                    }}
                  >
                    {LOCATION_DATA[expandedRegion].every((c) =>
                      selectedLocations.includes(c),
                    )
                      ? "Deselect All"
                      : "Select all in " + expandedRegion}
                  </Button>
                </Box>

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}
                >
                  {LOCATION_DATA[expandedRegion].map((country) => (
                    <FormControlLabel
                      key={country}
                      control={
                        <Checkbox
                          checked={selectedLocations.includes(country)}
                          onChange={() => handleCountryToggle(country)}
                          size="small"
                          sx={{
                            color: "#cbd5e1",
                            "&.Mui-checked": { color: "#7c3aed" },
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: "0.875rem" }}>
                          {country}
                        </Typography>
                      }
                      sx={{ m: 0 }}
                    />
                  ))}
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#94a3b8",
                }}
              >
                <Typography sx={{ fontSize: "0.875rem" }}>
                  Select a region to view countries
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={handleCancel}
          sx={{
            textTransform: "none",
            color: "#64748b",
            "&:hover": { backgroundColor: "#f1f5f9" },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={selectedLocations.length === 0}
          sx={{
            textTransform: "none",
            backgroundColor: "#7c3aed",
            "&:hover": { backgroundColor: "#6d28d9" },
            "&:disabled": { backgroundColor: "#cbd5e1" },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
