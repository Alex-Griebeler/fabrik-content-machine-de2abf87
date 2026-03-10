import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type JobStatus = "pending_approval" | "approved" | "rejected" | "published";
export type ContentFormat = "CARROSSEL" | "REEL" | "STORY";

export type ContentJob = Tables<"content_jobs"> & {
  format: ContentFormat;
  status: JobStatus;
};

export function useJobs() {
  const [jobs, setJobs] = useState<ContentJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from database
  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("content_jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setJobs(data as ContentJob[]);
      }
      setLoading(false);
    };

    fetchJobs();

    // Realtime subscription
    const channel = supabase
      .channel("content_jobs_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "content_jobs" },
        () => {
          fetchJobs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const pendingCount = useMemo(
    () => jobs.filter((j) => j.status === "pending_approval").length,
    [jobs]
  );

  const updateJobStatus = async (id: string, status: JobStatus) => {
    // Optimistic update
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));

    const { error } = await supabase
      .from("content_jobs")
      .update({ status })
      .eq("id", id);

    if (error) {
      // Revert on error
      const { data } = await supabase.from("content_jobs").select("*").order("created_at", { ascending: false });
      if (data) setJobs(data as ContentJob[]);
    }
  };

  return { jobs, loading, pendingCount, updateJobStatus };
}
