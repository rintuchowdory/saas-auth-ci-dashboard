/**
 * Mock data — simulates FastAPI/PostgreSQL backend responses
 * In production: TanStack Query would fetch from /api/pipelines, /api/projects, etc.
 */

export type PipelineStatus = "success" | "running" | "failed" | "pending" | "cancelled";

export interface PipelineStage {
  name: string;
  status: PipelineStatus;
  duration?: string;
}

export interface Pipeline {
  id: string;
  name: string;
  branch: string;
  commit: string;
  commitMessage: string;
  author: string;
  authorAvatar: string;
  status: PipelineStatus;
  duration: string;
  triggeredAt: string;
  stages: PipelineStage[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  language: string;
  lastDeploy: string;
  status: PipelineStatus;
  successRate: number;
  totalRuns: number;
}

export interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

export const MOCK_PIPELINES: Pipeline[] = [
  {
    id: "pipe_1",
    name: "saas-backend",
    branch: "main",
    commit: "a3f9c12",
    commitMessage: "feat: add JWT refresh token rotation",
    author: "Alex Developer",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=AD&backgroundColor=6366f1&textColor=ffffff",
    status: "success",
    duration: "2m 34s",
    triggeredAt: "2 minutes ago",
    stages: [
      { name: "Install", status: "success", duration: "18s" },
      { name: "Lint", status: "success", duration: "12s" },
      { name: "Test", status: "success", duration: "1m 04s" },
      { name: "Build", status: "success", duration: "38s" },
      { name: "Deploy", status: "success", duration: "22s" },
    ],
  },
  {
    id: "pipe_2",
    name: "saas-frontend",
    branch: "feature/dashboard-ui",
    commit: "b7e2d45",
    commitMessage: "feat: CI/CD pipeline visualization component",
    author: "Alex Developer",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=AD&backgroundColor=6366f1&textColor=ffffff",
    status: "running",
    duration: "1m 12s",
    triggeredAt: "1 minute ago",
    stages: [
      { name: "Install", status: "success", duration: "14s" },
      { name: "Lint", status: "success", duration: "9s" },
      { name: "Test", status: "running" },
      { name: "Build", status: "pending" },
      { name: "Deploy", status: "pending" },
    ],
  },
  {
    id: "pipe_3",
    name: "saas-backend",
    branch: "fix/auth-middleware",
    commit: "c1a8f67",
    commitMessage: "fix: OAuth2 token validation edge case",
    author: "Sam Viewer",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=SV&backgroundColor=8b5cf6&textColor=ffffff",
    status: "failed",
    duration: "1m 48s",
    triggeredAt: "15 minutes ago",
    stages: [
      { name: "Install", status: "success", duration: "16s" },
      { name: "Lint", status: "success", duration: "11s" },
      { name: "Test", status: "failed", duration: "1m 21s" },
      { name: "Build", status: "cancelled" },
      { name: "Deploy", status: "cancelled" },
    ],
  },
  {
    id: "pipe_4",
    name: "saas-infra",
    branch: "main",
    commit: "d4c3e89",
    commitMessage: "chore: update Docker base images to latest",
    author: "Alex Developer",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=AD&backgroundColor=6366f1&textColor=ffffff",
    status: "success",
    duration: "4m 12s",
    triggeredAt: "1 hour ago",
    stages: [
      { name: "Install", status: "success", duration: "22s" },
      { name: "Lint", status: "success", duration: "8s" },
      { name: "Test", status: "success", duration: "2m 14s" },
      { name: "Build", status: "success", duration: "1m 02s" },
      { name: "Deploy", status: "success", duration: "26s" },
    ],
  },
  {
    id: "pipe_5",
    name: "saas-backend",
    branch: "main",
    commit: "e9b1f23",
    commitMessage: "perf: optimize PostgreSQL query with index",
    author: "Sam Viewer",
    authorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=SV&backgroundColor=8b5cf6&textColor=ffffff",
    status: "success",
    duration: "2m 58s",
    triggeredAt: "3 hours ago",
    stages: [
      { name: "Install", status: "success", duration: "17s" },
      { name: "Lint", status: "success", duration: "10s" },
      { name: "Test", status: "success", duration: "1m 44s" },
      { name: "Build", status: "success", duration: "35s" },
      { name: "Deploy", status: "success", duration: "12s" },
    ],
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj_1",
    name: "saas-backend",
    description: "FastAPI + PostgreSQL REST API with JWT auth",
    language: "Python",
    lastDeploy: "2 minutes ago",
    status: "success",
    successRate: 94,
    totalRuns: 127,
  },
  {
    id: "proj_2",
    name: "saas-frontend",
    description: "React + TypeScript + TanStack Query SPA",
    language: "TypeScript",
    lastDeploy: "Running...",
    status: "running",
    successRate: 98,
    totalRuns: 89,
  },
  {
    id: "proj_3",
    name: "saas-infra",
    description: "Docker Compose + GitHub Actions CI/CD",
    language: "YAML",
    lastDeploy: "1 hour ago",
    status: "success",
    successRate: 100,
    totalRuns: 34,
  },
];

export const MOCK_METRICS: MetricCard[] = [
  { label: "Total Pipelines", value: "250", change: "+12 this week", trend: "up" },
  { label: "Success Rate", value: "94.8%", change: "+2.1% vs last week", trend: "up" },
  { label: "Avg. Duration", value: "2m 41s", change: "-18s vs last week", trend: "up" },
  { label: "Failed Runs", value: "13", change: "-5 vs last week", trend: "up" },
];

export const MOCK_CHART_DATA = [
  { day: "Mon", success: 18, failed: 2 },
  { day: "Tue", success: 24, failed: 1 },
  { day: "Wed", success: 20, failed: 3 },
  { day: "Thu", success: 28, failed: 0 },
  { day: "Fri", success: 22, failed: 2 },
  { day: "Sat", success: 14, failed: 1 },
  { day: "Sun", success: 10, failed: 0 },
];
