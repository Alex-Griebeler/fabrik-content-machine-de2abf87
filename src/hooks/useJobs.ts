import { useState, useMemo, useEffect } from "react";
import { supabaseExternal } from "@/lib/supabase-external";

export type JobStatus = "pending_approval" | "approved" | "rejected" | "published";
export type ContentFormat = "CARROSSEL" | "REEL" | "STORY";

export interface ContentOutput {
  id: string;
  job_id: string;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
  format: ContentFormat;
  pillar: string;
  trigger: string;
  created_at: string;
}

export interface ContentJob {
  id: string;
  status: JobStatus;
  input_type: string;
  raw_content: string;
  created_at: string;
  updated_at: string;
  // Joined from content_outputs
  outputs: ContentOutput[];
  // Convenience: first output fields (for display)
  format: ContentFormat;
  pillar: string;
  hook: string;
  caption: string;
  hashtags: string[];
  cta: string;
}

function mergeJobWithOutput(job: any, outputs: any[]): ContentJob {
  const jobOutputs = outputs.filter((o: any) => o.job_id === job.id);
  const first = jobOutputs[0];
  return {
    id: job.id,
    status: job.status as JobStatus,
    input_type: job.input_type ?? "",
    raw_content: job.raw_content ?? "",
    created_at: job.created_at,
    updated_at: job.updated_at,
    outputs: jobOutputs as ContentOutput[],
    format: (first?.format ?? "CARROSSEL") as ContentFormat,
    pillar: first?.pillar ?? "",
    hook: first?.hook ?? "",
    caption: first?.caption ?? "",
    hashtags: first?.hashtags ?? [],
    cta: first?.cta ?? "",
  };
}

export function useJobs() {
  const [jobs, setJobs] = useState<ContentJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    const [jobsRes, outputsRes] = await Promise.all([
      supabaseExternal.from("content_jobs").select("*").order("created_at", { ascending: false }),
      supabaseExternal.from("content_outputs").select("*"),
    ]);

    if (!jobsRes.error && !outputsRes.error && jobsRes.data && outputsRes.data) {
      const merged = jobsRes.data.map((job: any) =>
        mergeJobWithOutput(job, outputsRes.data)
      );
      setJobs(merged);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();

    // Realtime subscription on content_jobs
    const channel = supabaseExternal
      .channel("content_jobs_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "content_jobs" },
        () => fetchJobs()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "content_outputs" },
        () => fetchJobs()
      )
      .subscribe();

    return () => {
      supabaseExternal.removeChannel(channel);
    };
  }, []);

  const pendingCount = useMemo(
    () => jobs.filter((j) => j.status === "pending_approval").length,
    [jobs]
  );

  const updateJobStatus = async (id: string, status: JobStatus) => {
    // Optimistic update
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));

    const { error } = await supabaseExternal
      .from("content_jobs")
      .update({ status })
      .eq("id", id);

    if (error) {
      fetchJobs(); // Revert on error
    }
  };

  return { jobs, loading, pendingCount, updateJobStatus };
}
