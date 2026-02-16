import * as React from "react";
import { useState } from "react";
import {
  Switch,
  IconButton,
  Button,
  Tooltip,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  BriefcaseIcon as Briefcase,
  MapPinIcon as MapPin,
  MagnifyingGlassIcon as MagnifyingGlass,
  SlidersIcon as Sliders,
  TrashIcon as Trash,
  PencilSimpleIcon as PencilSimple,
  PlusIcon as Plus,
  SparkleIcon as Sparkle,
  BookmarkSimpleIcon as BookmarkSimple,
  LightningIcon as Lightning,
  QuestionIcon as Question,
  RocketIcon as Rocket,
  TargetIcon as Target,
  GraduationCapIcon as GraduationCap,
  CaretRightIcon as CaretRight,
  PlayIcon as Play,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import { useCopilots, useCopilotMutations } from "@/hooks/copilots";
import { Copilot } from "@/types/copilot";

// Helper function to safely display data
const displayValue = (value: string | null | undefined): string => {
  return value && value.trim() !== "" ? value : "-";
};

// Get status display info
const getStatusInfo = (status: Copilot["status"]) => {
  switch (status) {
    case "active":
      return { label: "Active", isActive: true };
    case "running":
      return { label: "Running", isActive: true };
    case "paused":
      return { label: "Paused", isActive: false };
    case "stopped":
      return { label: "Stopped", isActive: false };
    default:
      return { label: status, isActive: false };
  }
};

// Individual Copilot Card Component
interface CopilotCardProps {
  copilot: Copilot;
  onToggle: (id: string) => void;
  onEdit: (copilot: Copilot) => void;
  onDelete: (id: string) => void;
  onTrigger: (id: string) => void;
  index: number;
  isUpdating: boolean;
  isDeleting: boolean;
  isTriggering: boolean;
}

function CopilotCard({
  copilot,
  onToggle,
  onEdit,
  onDelete,
  onTrigger,
  index,
  isUpdating,
  isDeleting,
  isTriggering,
}: CopilotCardProps) {
  const headerGradients = [
    "from-rose-500 to-pink-600",
    "from-sky-500 to-blue-600",
    "from-amber-500 to-orange-600",
  ];

  const gradient = headerGradients[index % 3];
  const statusInfo = getStatusInfo(copilot.status);

  // Compute display values
  const autoSaveLabel = copilot.config?.autoApply ? "Auto-Save Jobs" : "Manual Save Jobs";
  const searchMethod = copilot.config?.jobTitles?.length > 0 ? "Job Titles" : "Keywords";
  const locationsDisplay = copilot.config?.locations?.length > 0
    ? copilot.config.locations.slice(0, 3).join(", ") + (copilot.config.locations.length > 3 ? "..." : "")
    : "Remote Worldwide";
  const matchLevel = copilot.config?.experienceLevel?.length > 0 ? "Highest" : "Standard";
  const filtersDisplay = [
    copilot.config?.experienceLevel?.length > 0 ? "Seniority" : null,
    copilot.config?.remoteOnly ? "Remote" : null,
    copilot.config?.salaryMin || copilot.config?.salaryMax ? "Salary" : null,
  ].filter(Boolean).join(", ") || "No filters";

  return (
    <div className="flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
      {/* Header */}
      <div className={`bg-gradient-to-r ${gradient} px-6 py-5`}>
        <div className="flex items-start justify-between">
          <h3 className="text-white font-bold text-lg leading-snug line-clamp-2 pr-4 text-shadow-sm">
            {displayValue(copilot.name)}
          </h3>
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-1.5 text-white/90">
            <Target weight="duotone" size={20} />
          </div>
        </div>
        <p className="text-white/90 text-sm mt-1 line-clamp-2 text-shadow-sm">
          {displayValue(copilot?.config?.jobTitles?.join(", ")  )}
        </p>
      </div>

      <div className="flex-1 p-6 space-y-4">
        {/* Status Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-50">
          <span className="text-sm font-medium text-gray-500">Status</span>
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusInfo.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
              }`}>
              {statusInfo.label.toUpperCase()}
            </span>
            <Switch
              checked={statusInfo.isActive}
              onChange={() => onToggle(copilot.id)}
              size="small"
              disabled={isUpdating}
              className="scale-90"
            />
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
              <BookmarkSimple weight="duotone" size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Mode</p>
              <p className="text-sm font-semibold text-gray-700 truncate">{autoSaveLabel}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
              <MagnifyingGlass weight="duotone" size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Method</p>
              <p className="text-sm font-semibold text-gray-700 truncate">{searchMethod}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 flex-shrink-0">
              <MapPin weight="duotone" size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Location</p>
              <p className="text-sm font-semibold text-gray-700 truncate" title={copilot.config?.locations?.join(", ")}>
                {locationsDisplay}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
              <Sliders weight="duotone" size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Filters</p>
              <p className="text-sm font-semibold text-gray-700 truncate">
                {filtersDisplay}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-gray-50/50 p-4 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Tooltip title="Run Now" arrow>
            <IconButton
              size="small"
              onClick={() => onTrigger(copilot.id)}
              disabled={isTriggering || copilot.status === "running"}
              className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <Play weight="bold" size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" arrow>
            <IconButton
              size="small"
              onClick={() => onDelete(copilot.id)}
              disabled={isDeleting}
              className="hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Trash weight="bold" size={18} />
            </IconButton>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="small"
            onClick={() => onEdit(copilot)}
            startIcon={<PencilSimple size={16} />}
            className="text-gray-600 hover:text-gray-900 normal-case font-medium"
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={() => onEdit(copilot)}
            startIcon={<Sparkle weight="fill" size={16} />}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 normal-case rounded-xl font-semibold px-4"
          >
            Tune
          </Button>
        </div>
      </div>
    </div>
  );
}

// Add Card Placeholder
interface AddCardProps {
  onAdd: () => void;
  cardsCount: number;
}

function AddCard({ onAdd, cardsCount }: AddCardProps) {
  return (
    <div
      onClick={onAdd}
      className="group relative flex flex-col items-center justify-center min-h-[340px] bg-gradient-to-br from-indigo-50/50 to-white rounded-3xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="absolute inset-0 bg-white/40 group-hover:bg-transparent transition-colors duration-300" />

      {/* Decorative Blobs */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-indigo-200/30 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />

      <div className="relative z-10 flex flex-col items-center text-center p-8">
        <div className="w-20 h-20 rounded-2xl bg-white shadow-lg shadow-indigo-100 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
          <Plus weight="bold" size={40} className="text-indigo-600" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Create New Copilot</h3>
        <p className="text-gray-500 mb-6 max-w-[200px]">
          Add another automated assistant to your fleet. <br />
          <span className="font-semibold text-indigo-600">{3 - cardsCount} slots remaining</span>
        </p>

        {/* <Button
          variant="contained"
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 px-6 shadow-lg shadow-indigo-200 font-semibold normal-case group-hover:scale-105 transition-transform"
        >
          Start Setup
        </Button> */}
      </div>
    </div>
  );
}

// Loading Skeleton Card
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden h-full min-h-[480px]">
      <Skeleton variant="rectangular" height={80} className="bg-gray-100" />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton width={60} height={20} className="rounded-lg" />
          <Skeleton width={40} height={24} className="rounded-full" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton variant="circular" width={32} height={32} />
              <div className="flex-1">
                <Skeleton width="30%" height={12} className="mb-1" />
                <Skeleton width="60%" height={16} />
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 flex justify-between">
          <Skeleton width={80} height={32} className="rounded-lg" />
          <Skeleton width={100} height={36} className="rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// Guide Card Component
interface GuideCardProps {
  icon: React.ReactNode;
  title: string;
  gradient: string;
}

function GuideCard({ icon, title, gradient }: GuideCardProps) {
  return (
    <button className="group relative flex flex-col items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full">
      <div
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
      >
        {icon}
      </div>
      <div className="text-center">
        <span className="text-sm font-bold text-gray-700 block mb-1 group-hover:text-indigo-700 transition-colors">
          {title}
        </span>
        <div className="flex items-center justify-center gap-1 text-xs text-gray-400 font-medium group-hover:text-indigo-500 transition-colors">
          Read Guide <CaretRight weight="bold" />
        </div>
      </div>

    </button>
  );
}

export function Page(): React.JSX.Element {
  const { copilots, loading, error, refetch } = useCopilots();
  const {
    update,
    updateState,
    remove,
    deleteState,
    trigger,
    triggerState,
  } = useCopilotMutations();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "info" });

  const navigate = useNavigate();

  const handleToggle = async (id: string) => {
    const copilot = copilots.find((c) => c.id === id);
    if (!copilot) return;

    const newStatus = copilot.status === "active" || copilot.status === "running"
      ? "paused"
      : "active";

    const success = await update(id, { status: newStatus });

    if (success) {
      setSnackbar({
        open: true,
        message: "Copilot status updated",
        severity: "success",
      });
      refetch();
    } else {
      setSnackbar({
        open: true,
        message: updateState.error || "Failed to update copilot",
        severity: "error",
      });
    }
  };

  const handleEdit = (copilot: Copilot) => {
    navigate(`/copilot/edit/${copilot.id}`);
  };

  const handleDelete = async (id: string) => {
    const success = await remove(id);

    if (success) {
      setSnackbar({
        open: true,
        message: "Copilot deleted successfully",
        severity: "success",
      });
      refetch();
    } else {
      setSnackbar({
        open: true,
        message: deleteState.error || "Failed to delete copilot",
        severity: "error",
      });
    }
  };

  const handleTrigger = async (id: string) => {
    setSnackbar({
      open: true,
      message: "Triggering copilot...",
      severity: "info",
    });

    const success = await trigger(id);

    if (success) {
      setSnackbar({
        open: true,
        message: "Copilot triggered successfully",
        severity: "success",
      });
      refetch();
    } else {
      setSnackbar({
        open: true,
        message: triggerState.error || "Failed to trigger copilot",
        severity: "error",
      });
    }
  };

  const handleAddCopilot = () => {
    if (copilots.length >= 3) {
      setSnackbar({
        open: true,
        message: "Maximum of 3 copilots allowed",
        severity: "error",
      });
      return;
    }
    navigate("/copilot/create");
  };

  const guides = [
    {
      icon: <Rocket weight="fill" size={32} />,
      title: "How Copilot works",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: <GraduationCap weight="fill" size={32} />,
      title: "Training Basics",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Briefcase weight="fill" size={32} />,
      title: "Applying to Jobs",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: <Question weight="fill" size={32} />,
      title: "FAQ & Support",
      gradient: "from-rose-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 ">

      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 pt-4 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Lightning weight="fill" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">My Copilots</h1>
              <p className="text-gray-500">Manage your active job search assistants</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Error State */}
        {error && (
          <Alert severity="error" className="mb-6 rounded-xl shadow-sm border border-red-100">
            {error}
            <Button size="small" onClick={refetch} className="ml-4 font-semibold">
              Retry Connection
            </Button>
          </Alert>
        )}

        {/* Copilot Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {loading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              {copilots.map((copilot, index) => (
                <CopilotCard
                  key={copilot.id}
                  copilot={copilot}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onTrigger={handleTrigger}
                  index={index}
                  isUpdating={updateState.loading}
                  isDeleting={deleteState.loading}
                  isTriggering={triggerState.loading}
                />
              ))}
              {copilots.length < 3 && (
                <AddCard onAdd={handleAddCopilot} cardsCount={copilots.length} />
              )}
            </>
          )}
        </div>

        {/* Guides Section */}
        <div >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1 bg-indigo-500 rounded-full" />
            <h2 className="text-2xl font-bold text-gray-900">Knowledge Base</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide, index) => (
              <GuideCard
                key={index}
                icon={guide.icon}
                title={guide.title}
                gradient={guide.gradient}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          className="rounded-xl shadow-lg border border-gray-100"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
