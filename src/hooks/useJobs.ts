import { useState, useMemo, useEffect } from "react";
import { supabaseExternal } from "@/lib/supabase-external";

export type JobStatus = "pending_approval" | "approved" | "rejected" | "published";

export interface ContentOutput {
  job_id: string;
  hook: string;
  body: string;
  closing: string;
  visual_notes: string;
  cta: string;
  gatilho: string;
  pilar: string;
}

export interface ContentJob {
  id: string;
  input_id: string;
  format: string;
  pilar: string;
  status: JobStatus;
  scheduled_at: string;
  approved_at: string | null;
  // From first output
  outputs: ContentOutput[];
  hook: string;
  body: string;
  closing: string;
  visual_notes: string;
  cta: string;
  gatilho: string;
}

function mergeJobWithOutput(job: any, outputs: any[]): ContentJob {
  const jobOutputs = outputs.filter((o: any) => o.job_id === job.id);
  const first = jobOutputs[0];
  return {
    id: job.id,
    input_id: job.input_id ?? "",
    format: job.format ?? "",
    pilar: job.pilar ?? "",
    status: (job.status ?? "pending_approval") as JobStatus,
    scheduled_at: job.scheduled_at ?? "",
    approved_at: job.approved_at ?? null,
    outputs: jobOutputs as ContentOutput[],
    hook: first?.hook ?? "",
    body: first?.body ?? "",
    closing: first?.closing ?? "",
    visual_notes: first?.visual_notes ?? "",
    cta: first?.cta ?? "",
    gatilho: first?.gatilho ?? "",
  };
}

export function useJobs() {
  const [jobs, setJobs] = useState<ContentJob[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    const [jobsRes, outputsRes] = await Promise.all([
      supabaseExternal.from("content_jobs").select("*").order("scheduled_at", { ascending: false }),
      supabaseExternal.from("content_outputs").select("*"),
    ]);

    if (jobsRes.error) {
      console.error("Error fetching content_jobs:", jobsRes.error);
    }
    if (outputsRes.error) {
      console.error("Error fetching content_outputs:", outputsRes.error);
    }

    const jobsData = jobsRes.data ?? [];
    const outputsData = outputsRes.data ?? [];

    const merged = jobsData.map((job: any) => mergeJobWithOutput(job, outputsData));
    setJobs(merged);
    setLoading(false);
  };

  useEffect(() => {
    fetchJobs();

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
    () => jobs.filter((j) => j.status === "pending_approval" || j.status === "awaiting_approval").length,
    [jobs]
  );

  const updateJobStatus = async (id: string, status: JobStatus) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));

    const updateData: any = { status };
    if (status === "approved") {
      updateData.approved_at = new Date().toISOString();
    }

    const { error } = await supabaseExternal
      .from("content_jobs")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating job status:", error);
      fetchJobs();
    }
  };

  return { jobs, loading, pendingCount, updateJobStatus };
}
