/**
 * Pipelines Page — full pipeline list with stage visualization
 * Design: Slate Precision — pipeline stages as horizontal chain
 */
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { usePipelines, useRetryPipeline } from "@/hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  CheckCircle2, XCircle, Clock, Loader2, RefreshCw,
  GitBranch, GitCommit, User, Timer, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pipeline, PipelineStatus, PipelineStage } from "@/lib/mockData";

function StageIcon({ status }: { status: PipelineStatus }) {
  if (status === "success") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
  if (status === "failed") return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
  if (status === "running") return <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />;
  if (status === "pending") return <Clock className="w-3.5 h-3.5 text-slate-600" />;
  return <XCircle className="w-3.5 h-3.5 text-slate-600" />;
}

function PipelineStages({ stages }: { stages: PipelineStage[] }) {
  return (
    <div className="flex items-center gap-0">
      {stages.map((stage, i) => (
        <div key={stage.name} className="flex items-center">
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all",
            stage.status === "success" && "bg-emerald-500/10 text-emerald-400",
            stage.status === "running" && "bg-indigo-500/15 text-indigo-400",
            stage.status === "failed" && "bg-rose-500/10 text-rose-400",
            stage.status === "pending" && "bg-white/5 text-slate-600",
            stage.status === "cancelled" && "bg-white/5 text-slate-600",
          )}>
            <StageIcon status={stage.status} />
            <span className="hidden sm:block">{stage.name}</span>
            {stage.duration && stage.status === "success" && (
              <span className="hidden lg:block text-xs opacity-60 font-mono">{stage.duration}</span>
            )}
          </div>
          {i < stages.length - 1 && (
            <div className={cn(
              "w-4 h-px",
              stages[i + 1].status === "pending" || stages[i + 1].status === "cancelled"
                ? "bg-white/10"
                : "bg-indigo-500/30"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

function PipelineRow({ pipeline }: { pipeline: Pipeline }) {
  const [expanded, setExpanded] = useState(false);
  const retryMutation = useRetryPipeline();

  const handleRetry = async () => {
    await retryMutation.mutateAsync(pipeline.id);
    toast.success("Pipeline queued", { description: `Retrying ${pipeline.name} on ${pipeline.branch}` });
  };

  const statusColors: Record<PipelineStatus, string> = {
    success: "border-l-emerald-500",
    running: "border-l-indigo-500",
    failed: "border-l-rose-500",
    pending: "border-l-amber-500",
    cancelled: "border-l-slate-600",
  };

  return (
    <div className={cn("border-l-2 bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-r-xl mb-2", statusColors[pipeline.status])}>
      <div className="px-4 py-3">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <img
            src={pipeline.authorAvatar}
            alt={pipeline.author}
            className="w-7 h-7 rounded-full flex-shrink-0 mt-0.5"
          />

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-white">{pipeline.name}</span>
              <span className="text-xs font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">
                #{pipeline.commit}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{pipeline.commitMessage}</p>

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                <span className="font-mono">{pipeline.branch}</span>
              </span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {pipeline.author}
              </span>
              <span className="flex items-center gap-1">
                <Timer className="w-3 h-3" />
                <span className="font-mono">{pipeline.duration}</span>
              </span>
              <span className="text-slate-600">{pipeline.triggeredAt}</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden md:block">
              <PipelineStages stages={pipeline.stages} />
            </div>

            {pipeline.status === "failed" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRetry}
                disabled={retryMutation.isPending}
                className="h-7 text-xs border-white/10 hover:border-indigo-500/40 hover:text-indigo-300 bg-transparent"
              >
                {retryMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <><RefreshCw className="w-3 h-3 mr-1" />Retry</>
                )}
              </Button>
            )}

            <button
              onClick={() => setExpanded(v => !v)}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile stages */}
        <div className="md:hidden mt-3">
          <PipelineStages stages={pipeline.stages} />
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-3 border-t border-white/[0.04] mt-1 pt-3 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {pipeline.stages.map(stage => (
              <div key={stage.name} className={cn(
                "rounded-lg p-3 text-center",
                stage.status === "success" && "bg-emerald-500/8",
                stage.status === "running" && "bg-indigo-500/10",
                stage.status === "failed" && "bg-rose-500/8",
                (stage.status === "pending" || stage.status === "cancelled") && "bg-white/3",
              )}>
                <div className="flex justify-center mb-1.5">
                  <StageIcon status={stage.status} />
                </div>
                <p className="text-xs font-medium text-slate-300">{stage.name}</p>
                {stage.duration && (
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{stage.duration}</p>
                )}
                {!stage.duration && stage.status === "pending" && (
                  <p className="text-xs text-slate-600 mt-0.5">Queued</p>
                )}
                {!stage.duration && stage.status === "running" && (
                  <p className="text-xs text-indigo-400 mt-0.5">Running...</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Pipelines() {
  const { data: pipelines, isLoading, refetch, isFetching } = usePipelines();
  const [filter, setFilter] = useState<PipelineStatus | "all">("all");

  const filtered = pipelines?.filter(p => filter === "all" || p.status === filter) ?? [];

  const counts = pipelines?.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) ?? {};

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Pipelines</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {pipelines?.length ?? 0} total runs · auto-refreshes every 15s
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-white/10 bg-transparent hover:bg-white/5 text-slate-300 h-8"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", isFetching && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 flex-wrap">
          {(["all", "success", "running", "failed", "pending"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150",
                filter === f
                  ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" && counts[f] && (
                <span className="ml-1.5 text-xs opacity-70">({counts[f]})</span>
              )}
              {f === "all" && pipelines && (
                <span className="ml-1.5 text-xs opacity-70">({pipelines.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Pipeline list */}
        <div>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl bg-white/5 mb-2" />
              ))
            : filtered.length === 0
            ? (
              <div className="text-center py-16 text-slate-500">
                <GitCommit className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No pipelines match this filter</p>
              </div>
            )
            : filtered.map((pipeline, i) => (
              <div key={pipeline.id} className={cn("animate-fade-in", `stagger-${Math.min(i + 1, 5)}`)}>
                <PipelineRow pipeline={pipeline} />
              </div>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
