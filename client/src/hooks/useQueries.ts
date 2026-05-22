/**
 * TanStack Query hooks — wraps API calls (mock in demo, real FastAPI in production)
 * Design: Slate Precision — data-first, typed responses
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MOCK_PIPELINES,
  MOCK_PROJECTS,
  MOCK_METRICS,
  MOCK_CHART_DATA,
  type Pipeline,
} from "@/lib/mockData";

// Simulated API fetch with realistic latency
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// Query keys
export const queryKeys = {
  pipelines: ["pipelines"] as const,
  pipeline: (id: string) => ["pipelines", id] as const,
  projects: ["projects"] as const,
  metrics: ["metrics"] as const,
  chartData: ["chartData"] as const,
};

export function usePipelines() {
  return useQuery({
    queryKey: queryKeys.pipelines,
    queryFn: async () => {
      await delay(400);
      return MOCK_PIPELINES;
    },
    staleTime: 30_000,
    refetchInterval: 15_000, // Auto-refresh every 15s (simulates live CI updates)
  });
}

export function usePipeline(id: string) {
  return useQuery({
    queryKey: queryKeys.pipeline(id),
    queryFn: async () => {
      await delay(200);
      const pipeline = MOCK_PIPELINES.find(p => p.id === id);
      if (!pipeline) throw new Error("Pipeline not found");
      return pipeline;
    },
    enabled: !!id,
  });
}

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: async () => {
      await delay(300);
      return MOCK_PROJECTS;
    },
    staleTime: 60_000,
  });
}

export function useMetrics() {
  return useQuery({
    queryKey: queryKeys.metrics,
    queryFn: async () => {
      await delay(250);
      return MOCK_METRICS;
    },
    staleTime: 30_000,
  });
}

export function useChartData() {
  return useQuery({
    queryKey: queryKeys.chartData,
    queryFn: async () => {
      await delay(200);
      return MOCK_CHART_DATA;
    },
    staleTime: 60_000,
  });
}

export function useRetryPipeline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pipelineId: string) => {
      await delay(500);
      // In production: POST /api/pipelines/{id}/retry
      return { id: pipelineId, status: "running" as Pipeline["status"] };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pipelines });
    },
  });
}
