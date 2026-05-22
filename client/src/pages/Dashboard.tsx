/**
 * Dashboard Page — main overview
 * Design: Slate Precision — metric cards, bar chart, recent pipelines
 * Data: TanStack Query hooks with mock FastAPI responses
 */
import DashboardLayout from "@/components/DashboardLayout";
import { useMetrics, usePipelines, useChartData } from "@/hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, TrendingDown, Minus, CheckCircle2, XCircle, Clock, Loader2, GitCommit, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PipelineStatus } from "@/lib/mockData";
import { Link } from "wouter";

function StatusBadge({ status }: { status: PipelineStatus }) {
  const config = {
    success: { label: "Success", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
    running: { label: "Running", className: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20" },
    failed: { label: "Failed", className: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
    pending: { label: "Pending", className: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
    cancelled: { label: "Cancelled", className: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  }[status];

  return (
    <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium", config.className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", {
        "status-dot-success": status === "success",
        "status-dot-running": status === "running",
        "status-dot-failed": status === "failed",
        "status-dot-pending": status === "pending",
        "bg-slate-400": status === "cancelled",
      })} />
      {config.label}
    </span>
  );
}

function StatusIcon({ status }: { status: PipelineStatus }) {
  if (status === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (status === "failed") return <XCircle className="w-4 h-4 text-rose-400" />;
  if (status === "running") return <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />;
  if (status === "pending") return <Clock className="w-4 h-4 text-amber-400" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-lg p-3 text-xs shadow-xl">
        <p className="text-slate-300 font-medium mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-mono">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useMetrics();
  const { data: pipelines, isLoading: pipelinesLoading, dataUpdatedAt } = usePipelines();
  const { data: chartData, isLoading: chartLoading } = useChartData();

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : "—";

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Overview</h1>
            <p className="text-sm text-slate-400 mt-0.5">CI/CD pipeline activity across all projects</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <RefreshCw className="w-3 h-3" />
            <span>Updated {lastUpdated}</span>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {metricsLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl bg-white/5" />
              ))
            : metrics?.map((m, i) => (
                <div
                  key={m.label}
                  className={cn("glass-card rounded-xl p-4 animate-fade-in", `stagger-${i + 1}`)}
                >
                  <p className="text-xs text-slate-400 font-medium mb-1">{m.label}</p>
                  <p className="text-2xl font-bold text-white font-mono tracking-tight">{m.value}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    {m.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                    ) : m.trend === "down" ? (
                      <TrendingDown className="w-3 h-3 text-rose-400" />
                    ) : (
                      <Minus className="w-3 h-3 text-slate-400" />
                    )}
                    <span className={cn("text-xs", m.trend === "up" ? "text-emerald-400" : m.trend === "down" ? "text-rose-400" : "text-slate-400")}>
                      {m.change}
                    </span>
                  </div>
                </div>
              ))}
        </div>

        {/* Chart + Recent pipelines */}
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Bar chart */}
          <div className="lg:col-span-3 glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">Pipeline Runs</h2>
                <p className="text-xs text-slate-400">Last 7 days</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-indigo-500 inline-block" /> Success</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-rose-500 inline-block" /> Failed</span>
              </div>
            </div>
            {chartLoading ? (
              <Skeleton className="h-48 bg-white/5 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} barGap={3}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="success" fill="oklch(0.60 0.20 264)" radius={[3, 3, 0, 0]} name="success" />
                  <Bar dataKey="failed" fill="oklch(0.60 0.22 25)" radius={[3, 3, 0, 0]} name="failed" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Stack info */}
          <div className="lg:col-span-2 glass-card rounded-xl p-4 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-white">Tech Stack</h2>
            {[
              { label: "Frontend", value: "React + TypeScript + TanStack Query", color: "text-indigo-400" },
              { label: "Backend", value: "FastAPI + PostgreSQL", color: "text-violet-400" },
              { label: "Auth", value: "JWT + OAuth2", color: "text-emerald-400" },
              { label: "Infra", value: "Docker Compose + GitHub Actions", color: "text-amber-400" },
              { label: "Deploy", value: "Railway / Cloudflare Pages", color: "text-sky-400" },
            ].map(item => (
              <div key={item.label} className="flex flex-col gap-0.5">
                <span className="text-xs text-slate-500">{item.label}</span>
                <span className={cn("text-xs font-medium font-mono", item.color)}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent pipelines */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-white">Recent Pipelines</h2>
            <Link href="/pipelines">
              <span className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">View all →</span>
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {pipelinesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-4 py-3 flex items-center gap-3">
                    <Skeleton className="w-4 h-4 rounded-full bg-white/5" />
                    <Skeleton className="flex-1 h-4 bg-white/5 rounded" />
                    <Skeleton className="w-16 h-5 bg-white/5 rounded-full" />
                  </div>
                ))
              : pipelines?.slice(0, 5).map((pipeline, i) => (
                  <div
                    key={pipeline.id}
                    className={cn("px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors animate-fade-in", `stagger-${i + 1}`)}
                  >
                    <StatusIcon status={pipeline.status} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-200 truncate">{pipeline.name}</span>
                        <span className="text-xs text-slate-500 font-mono hidden sm:block">#{pipeline.commit}</span>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{pipeline.commitMessage}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
                      <GitCommit className="w-3 h-3" />
                      <span className="font-mono">{pipeline.branch}</span>
                    </div>
                    <StatusBadge status={pipeline.status} />
                    <span className="hidden md:block text-xs text-slate-500 font-mono w-16 text-right">{pipeline.duration}</span>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
