import { useState } from "react";
import {
  Menu,
  MenuItem,
  Drawer,
  IconButton,
  Avatar,
  Badge,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  User as UserIcon,
  SignOut as SignOutIcon,
  List as ListIcon,
  Briefcase as BriefcaseIcon,
  BookmarkSimple as BookmarkSimpleIcon,
  X as XIcon,
  Gear as GearIcon,
  Bell as BellIcon,
  CaretDown as CaretDownIcon,
  RocketLaunch as RocketLaunchIcon,
  Article as ArticleIcon
} from "@phosphor-icons/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();

  const currentPath = location.pathname;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleMenuClose();
    setMobileMenuOpen(false);
    logout();
  };

  const navItems = [
    { label: t('nav.copilots'), path: "/copilot", icon: <RocketLaunchIcon size={18} weight="duotone" /> },
    { label: t('nav.applications'), path: "/applications", icon: <BriefcaseIcon size={18} weight="duotone" /> },
    { label: t('nav.support'), path: "/support", icon: <ArticleIcon size={18} weight="duotone" /> },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80">
        <div className="container-custom mx-auto flex h-16 items-center justify-between">
          {/* Logo */}
          <div
            className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-80"
            onClick={() => { isAuthenticated ? navigate("/copilot") : navigate("/") }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-md shadow-indigo-600/20">
              <span className="text-lg font-bold text-white">J</span>
            </div>
            <span className="hidden text-xl font-bold tracking-tight text-gray-900 sm:inline-block">
              Job<span className="text-indigo-600">Scout</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex items-center gap-6">
              {isAuthenticated && (
                <nav className="flex items-center gap-1 rounded-full border border-gray-200/80 bg-gray-50/50 p-1">
                  {navItems.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`
                          flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
                          ${isActive
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
                          }
                        `}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              )}
            </div>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {!isMobile && <LanguageSelector />}

            {isAuthenticated ? (
              <>
                <div className="hidden md:block">
                  <IconButton size="small" className="border border-gray-200 bg-white shadow-sm hover:bg-gray-50">
                    <Badge variant="dot" color="error">
                      <BellIcon size={20} className="text-gray-600" />
                    </Badge>
                  </IconButton>
                </div>

                <button
                  onClick={handleMenuOpen}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 shadow-sm transition-all hover:border-gray-300 hover:shadow"
                >
                  <Avatar
                    sx={{ width: 32, height: 32, fontSize: "0.875rem", bgcolor: "#4f46e5" }}
                  >
                    {user?.first_name?.[0]}
                  </Avatar>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold leading-none text-gray-700">
                      {user?.first_name}
                    </p>
                  </div>
                  <CaretDownIcon size={14} className="text-gray-400" weight="bold" />
                </button>
              </>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <button
                  onClick={() => navigate("/auth/signin")}
                  className="text-sm font-semibold text-gray-700 transition-colors hover:text-gray-900"
                >
                  {t('nav.login')}
                </button>
                <button
                  onClick={() => navigate("/auth/signup")}
                  className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 active:scale-[0.98]"
                >
                  {t('nav.signup')}
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <IconButton onClick={() => setMobileMenuOpen(true)} size="small" className="ml-1">
                <ListIcon size={24} className="text-gray-700" />
              </IconButton>
            )}
          </div>
        </div>
      </header>

      {/* User Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1.5,
            overflow: 'visible',
            filter: 'drop-shadow(0px 4px 12px rgba(0,0,0,0.08))',
            borderRadius: 3,
            minWidth: 220,
            border: '1px solid #f3f4f6'
          }
        }}
      >
        <div className="border-b border-gray-100 bg-gray-50/50 px-4 py-3">
          <p className="font-semibold text-gray-900">{user?.first_name} {user?.last_name}</p>
          <p className="truncate text-xs text-gray-500">{user?.email}</p>
        </div>
        <div className="p-1">
          <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }} className="rounded-lg hover:bg-gray-50">
            <UserIcon size={18} className="mr-3 text-gray-400" />
            {t('nav.profile')}
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate("/saved"); }} className="rounded-lg hover:bg-gray-50">
            <BookmarkSimpleIcon size={18} className="mr-3 text-gray-400" />
            {t('nav.saved_jobs')}
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate("/settings"); }} className="rounded-lg hover:bg-gray-50">
            <GearIcon size={18} className="mr-3 text-gray-400" />
            {t('nav.settings')}
          </MenuItem>
          <div className="my-1 h-px bg-gray-100"></div>
          <MenuItem onClick={handleSignOut} className="rounded-lg text-red-600 hover:bg-red-50">
            <SignOutIcon size={18} className="mr-3" />
            {t('nav.logout')}
          </MenuItem>
        </div>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{ sx: { width: '100%', maxWidth: 320, borderRadius: '20px 0 0 20px' } }}
      >
        <div className="flex h-full flex-col p-6">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">Menu</span>
            <IconButton onClick={() => setMobileMenuOpen(false)} size="small" className="bg-gray-100 hover:bg-gray-200">
              <XIcon weight="bold" size={18} />
            </IconButton>
          </div>

          {isAuthenticated ? (
            <>
              <div className="mb-6 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
                <Avatar sx={{ bgcolor: '#4f46e5', width: 40, height: 40 }}>{user?.first_name?.[0]}</Avatar>
                <div>
                  <p className="font-bold text-gray-900">{user?.first_name}</p>
                  <p className="text-xs font-medium text-indigo-600">Pro Member</p>
                </div>
              </div>

              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                    className={`
                      flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium transition-colors
                      ${currentPath === item.path ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => navigate("/auth/signin")}
                className="w-full rounded-xl border border-gray-200 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                {t('nav.login')}
              </button>
              <button
                onClick={() => navigate("/auth/signup")}
                className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-md transition-all hover:bg-indigo-500 active:scale-[0.98]"
              >
                {t('nav.signup')}
              </button>
            </div>
          )}

          <div className="mt-auto border-t border-gray-100 pt-6">
            <div className="mb-6 flex justify-center">
              <LanguageSelector />
            </div>
            {isAuthenticated && (
              <button
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 py-3 font-semibold text-red-600 transition-colors hover:bg-red-100"
              >
                <SignOutIcon weight="bold" />
                {t('nav.logout')}
              </button>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
}
