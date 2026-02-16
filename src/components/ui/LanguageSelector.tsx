import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem, Button } from '@mui/material';
import { Translate as TranslateIcon, CaretDown as CaretDownIcon } from '@phosphor-icons/react';

const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
];

export const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
        handleClose();
    };

    const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

    return (
        <div>
            <Button
                onClick={handleClick}
                endIcon={<CaretDownIcon size={14} weight="bold" />}
                sx={{
                    textTransform: "none",
                    px: 2,
                    py: 1,
                    borderRadius: "12px",
                    color: "#4b5563",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    minWidth: 75,
                    bgcolor: "rgba(255,255,255,0.6)",
                    border: "2px solid transparent",
                    transition: "all 0.2s ease",
                    "&:hover": {
                        bgcolor: "white",
                        borderColor: "#e5e7eb",
                        transform: "translateY(-1px)",
                    },
                }}
            >
                <TranslateIcon size={18} className="mr-1.5" weight="duotone" />
                {currentLang.code.toUpperCase()}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1,
                            borderRadius: "14px",
                            minWidth: 200,
                            boxShadow: "0 20px 40px -8px rgba(0,0,0,0.15)",
                            border: "1px solid rgba(0,0,0,0.05)",
                        }
                    }
                }}
            >
                {languages.map((lang) => (
                    <MenuItem
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        selected={i18n.language === lang.code}
                        sx={{
                            py: 1.5,
                            px: 2,
                            mx: 1,
                            my: 0.5,
                            borderRadius: "10px",
                            "&.Mui-selected": {
                                bgcolor: "rgba(99, 102, 241, 0.1)",
                            },
                            "&:hover": {
                                bgcolor: "rgba(99, 102, 241, 0.08)",
                            },
                        }}
                    >
                        <span className="mr-3 text-xl">{lang.flag}</span>
                        <span className="flex-grow font-medium">{lang.name}</span>
                        {i18n.language === lang.code && (
                            <span className="text-indigo-600 font-bold">✓</span>
                        )}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};
