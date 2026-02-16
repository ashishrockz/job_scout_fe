import * as React from "react";
import {
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  Pagination,
  Button,
} from "@mui/material";
import {
  MagnifyingGlassIcon as MagnifyingGlass,
  BriefcaseIcon as Briefcase,
  BuildingsIcon as Buildings,
  CalendarIcon as Calendar,
  CheckCircleIcon as CheckCircle,
  XCircleIcon as XCircle,
  ClockIcon as Clock,
  ArrowSquareOutIcon as ArrowSquareOut,
  FunnelIcon as Funnel,
  SquaresFourIcon as SquaresFour,
  ListBulletsIcon as ListBullets,
  CaretDownIcon as CaretDown,
} from "@phosphor-icons/react";
import { useApplicationsPage } from "@/hooks/application/get-application";
import { Application } from "@/types/application";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// Status Config with simpler colors
const statusConfig: Record<
  string,
  { color: string; bg: string; border: string; icon: React.ReactNode; label: string }
> = {
  applied: {
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    icon: <CheckCircle weight="fill" size={14} className="text-emerald-500" />,
    label: "Applied",
  },
  failed: {
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-100",
    icon: <XCircle weight="fill" size={14} className="text-red-500" />,
    label: "Failed",
  },
  pending: {
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-100",
    icon: <Clock weight="fill" size={14} className="text-amber-500" />,
    label: "Pending",
  },
  interview: {
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-100",
    icon: <Calendar weight="fill" size={14} className="text-purple-500" />,
    label: "Interview",
  },
};

// Platform Config
const platformColors: Record<string, { bg: string; text: string }> = {
  linkedin: { bg: "bg-[#0A66C2]/10", text: "text-[#0A66C2]" },
  indeed: { bg: "bg-[#2164f3]/10", text: "text-[#2164f3]" },
  glassdoor: { bg: "bg-[#0CAA41]/10", text: "text-[#0CAA41]" },
  default: { bg: "bg-gray-100", text: "text-gray-600" },
};

const getPlatformColor = (platform: string) => {
  const key = platform.toLowerCase();
  return platformColors[key] || platformColors.default;
};

// --- Sub-components ---

function StatCard({
  label,
  value,
  icon,
  colorClass,
  onClick,
  isActive
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  onClick: () => void;
  isActive: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 bg-white p-4 rounded-2xl border transition-all duration-200 text-left flex items-center justify-between group
        ${isActive
          ? `border-indigo-600 ring-1 ring-indigo-600 shadow-sm`
          : "border-gray-100 hover:border-indigo-200 hover:shadow-md"
        }`}
    >
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {value}
        </p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass} bg-opacity-10`}>
        {icon}
      </div>
    </button>
  );
}

function ApplicationCard({ application }: { application: Application }) {
  const status = statusConfig[application.status] || statusConfig.pending;
  const platform = getPlatformColor(application.platform);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all">
          <Buildings weight="duotone" size={20} />
        </div>
        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${platform.bg} ${platform.text}`}>
          {application.platform}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4 flex-1">
        <h3 className="font-bold text-gray-900 leading-snug mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {application.jobTitle}
        </h3>
        <p className="text-sm text-gray-500 font-medium truncate">{application.company}</p>
      </div>

      {/* Meta */}
      <div className="space-y-3 mt-auto">
        <div className="flex items-center justify-between text-xs">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${status.bg} ${status.color} ${status.border}`}>
            {status.icon}
            <span className="font-semibold">{status.label}</span>
          </div>
          <div className="text-gray-400 flex items-center gap-1">
            <Clock size={12} />
            <span>{dayjs(application.appliedAt).fromNow(true)}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-50 flex items-center gap-2">
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => window.open(application.jobUrl, "_blank")}
            className="rounded-lg normal-case border-gray-200 text-gray-600 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 py-1.5 text-xs font-semibold"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
}

function ApplicationRow({ application }: { application: Application }) {
  const status = statusConfig[application.status] || statusConfig.pending;
  const platform = getPlatformColor(application.platform);

  return (
    <div className="group flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200">
      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
        <Buildings weight="duotone" size={20} />
      </div>

      <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-1">
          <h3 className="font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">{application.jobTitle}</h3>
          <p className="text-sm text-gray-500 truncate">{application.company}</p>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${platform.bg} ${platform.text}`}>
            {application.platform}
          </span>
        </div>

        <div className="hidden md:block">
          <span className="text-xs text-gray-500">{dayjs(application.appliedAt).format("MMM D, YYYY")}</span>
        </div>

        <div className="flex justify-end">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${status.bg} ${status.color} ${status.border}`}>
            {status.icon}
            {status.label}
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconButton size="small" onClick={() => window.open(application.jobUrl, "_blank")}>
          <ArrowSquareOut size={18} />
        </IconButton>
      </div>
    </div>
  );
}

// --- Main Page ---

export function Page(): React.JSX.Element {
  const { loading, applications } = useApplicationsPage();
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [platformFilter, setPlatformFilter] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 12;

  // Stats
  const stats = React.useMemo(() => ({
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    failed: applications.filter((a) => a.status === "failed").length,
    pending: applications.filter((a) => a.status === "pending").length,
  }), [applications]);

  // Unique Platforms
  const platforms = React.useMemo(() =>
    [...new Set(applications.map((a) => a.platform))],
    [applications]);

  // Filtering
  const filteredApps = React.useMemo(() => {
    return applications.filter((app) => {
      const matchSearch = !searchQuery ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "all" || app.status === statusFilter;
      const matchPlatform = platformFilter === "all" || app.platform.toLowerCase() === platformFilter.toLowerCase(); // Case insensitive

      return matchSearch && matchStatus && matchPlatform;
    });
  }, [applications, searchQuery, statusFilter, platformFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const currentApps = filteredApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">My Applications</h1>
          <p className="text-gray-500">Track and manage your automated job applications.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Applications"
            value={stats.total}
            icon={<Briefcase weight="duotone" size={20} className="text-indigo-600" />}
            colorClass="bg-indigo-100"
            isActive={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
          />
          <StatCard
            label="Applied"
            value={stats.applied}
            icon={<CheckCircle weight="duotone" size={20} className="text-emerald-600" />}
            colorClass="bg-emerald-100"
            isActive={statusFilter === 'applied'}
            onClick={() => setStatusFilter(statusFilter === 'applied' ? 'all' : 'applied')}
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            icon={<Clock weight="duotone" size={20} className="text-amber-600" />}
            colorClass="bg-amber-100"
            isActive={statusFilter === 'pending'}
            onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
          />
          <StatCard
            label="Failed/Rejected"
            value={stats.failed}
            icon={<XCircle weight="duotone" size={20} className="text-red-600" />}
            colorClass="bg-red-100"
            isActive={statusFilter === 'failed'}
            onClick={() => setStatusFilter(statusFilter === 'failed' ? 'all' : 'failed')}
          />
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-2 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center sticky top-20 z-10">
          {/* Search */}
          <div className="relative flex-1 w-full md:w-auto">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search job titles or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
            />
          </div>

          {/* Platform Filters (Horizontal Scroll) */}
          <div className="flex-1 w-full md:w-auto overflow-x-auto flex items-center gap-2 no-scrollbar px-2">
            <span className="text-xs font-semibold text-gray-400 uppercase mr-1">Platform:</span>
            <button
              onClick={() => setPlatformFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border
                  ${platformFilter === "all" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
            >
              All
            </button>
            {platforms.map(p => (
              <button
                key={p}
                onClick={() => setPlatformFilter(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border capitalize
                    ${platformFilter === p ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"}`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <SquaresFour weight="fill" size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ListBullets weight="fill" size={18} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={200} className="rounded-2xl" />
            ))}
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MagnifyingGlass size={30} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No applications found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
            <Button onClick={() => { setSearchQuery(""); setStatusFilter("all"); setPlatformFilter("all"); }} variant="outlined">
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                {currentApps.map((app, i) => (
                  <ApplicationCard key={i} application={app} />
                ))}
              </div>
            ) : (
              <div className="space-y-3 mb-10">
                {currentApps.map((app, i) => (
                  <ApplicationRow key={i} application={app} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, p) => setCurrentPage(p)}
                  color="primary"
                  shape="rounded"
                  size="large"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
