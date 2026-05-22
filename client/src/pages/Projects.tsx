/**
 * Projects Page — project cards with health metrics
 * Design: Slate Precision — glassmorphism cards, success rate progress bars
 */
import DashboardLayout from "@/components/DashboardLayout";
import { useProjects } from "@/hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FolderGit2, CheckCircle2, Loader2, XCircle, Code2, Rocket } from "lucide-react";
import type { PipelineStatus } from "@/lib/mockData";

const LANG_COLORS: Record<string, string> = {
  Python: "text-amber-400 bg-amber-500/10",
  TypeScript: "text-sky-400 bg-sky-500/10",
  YAML: "text-violet-400 bg-violet-500/10",
};

const CI_GRAPHIC = "https://d2xsxph8kpxj0f.cloudfront.net/310519663687681945/MhmaVsPXwYDcapbnxEwuLj/ci-pipeline-graphic-jhfPGLYbqcztSUDanGo7a6.webp";

function StatusIcon({ status }: { status: PipelineStatus }) {
  if (status === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
  if (status === "running") return <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />;
  if (status === "failed") return <XCircle className="w-4 h-4 text-rose-400" />;
  return null;
}

export default function Projects() {
  const { data: projects, isLoading } = useProjects();

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-6 space-y-6 animate-fade-in">
        {/* Header with hero image */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ backgroundImage: `url(${CI_GRAPHIC})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.12_0.015_264/0.92)] to-[oklch(0.12_0.015_264/0.60)]" />
          <div className="relative z-10 px-6 py-8">
            <div className="flex items-center gap-2 mb-2">
              <Rocket className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-medium text-indigo-300 uppercase tracking-wider">Projects</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Your Repositories</h1>
            <p className="text-sm text-slate-300 max-w-lg">
              Monitor CI/CD health, success rates, and deployment status across all projects in your stack.
            </p>
          </div>
        </div>

        {/* Project cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-xl bg-white/5" />
              ))
            : projects?.map((project, i) => (
                <div
                  key={project.id}
                  className={cn("glass-card rounded-xl p-5 flex flex-col gap-4 hover:-translate-y-0.5 transition-transform duration-200 animate-fade-in", `stagger-${i + 1}`)}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center">
                        <FolderGit2 className="w-4.5 h-4.5 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{project.name}</p>
                        <span className={cn("text-xs px-1.5 py-0.5 rounded font-mono font-medium", LANG_COLORS[project.language] ?? "text-slate-400 bg-white/5")}>
                          {project.language}
                        </span>
                      </div>
                    </div>
                    <StatusIcon status={project.status} />
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed">{project.description}</p>

                  {/* Success rate */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-400">Success rate</span>
                      <span className="text-xs font-mono font-semibold text-white">{project.successRate}%</span>
                    </div>
                    <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          project.successRate >= 95 ? "bg-emerald-500" :
                          project.successRate >= 80 ? "bg-amber-500" : "bg-rose-500"
                        )}
                        style={{ width: `${project.successRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-white/[0.05]">
                    <span className="flex items-center gap-1">
                      <Code2 className="w-3 h-3" />
                      {project.totalRuns} runs
                    </span>
                    <span>Last deploy: {project.lastDeploy}</span>
                  </div>
                </div>
              ))}
        </div>

        {/* Architecture note */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Architecture Overview</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "Frontend",
                items: ["React 19 + TypeScript", "TanStack Query v5", "Tailwind CSS 4", "Wouter (routing)", "Framer Motion"],
                color: "border-indigo-500/30",
              },
              {
                title: "Backend",
                items: ["FastAPI (Python)", "PostgreSQL + SQLAlchemy", "JWT + OAuth2", "Pydantic v2", "Alembic migrations"],
                color: "border-violet-500/30",
              },
              {
                title: "DevOps",
                items: ["Docker Compose (dev)", "GitHub Actions (CI)", "Railway (deploy)", "Cloudflare Pages", "Dependabot"],
                color: "border-emerald-500/30",
              },
            ].map(section => (
              <div key={section.title} className={cn("rounded-lg p-3 border bg-white/[0.02]", section.color)}>
                <p className="font-semibold text-slate-200 mb-2">{section.title}</p>
                <ul className="space-y-1">
                  {section.items.map(item => (
                    <li key={item} className="text-slate-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
