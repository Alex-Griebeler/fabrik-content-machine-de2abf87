-- Create content_jobs table
CREATE TABLE public.content_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  format TEXT NOT NULL CHECK (format IN ('CARROSSEL', 'REEL', 'STORY')),
  pillar TEXT NOT NULL,
  hook TEXT NOT NULL,
  caption TEXT NOT NULL,
  hashtags TEXT[] NOT NULL DEFAULT '{}',
  cta TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'approved', 'rejected', 'published')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_jobs ENABLE ROW LEVEL SECURITY;

-- Public read access (single-user dashboard)
CREATE POLICY "Anyone can read content_jobs"
  ON public.content_jobs FOR SELECT
  USING (true);

-- Public write access for status updates
CREATE POLICY "Anyone can update content_jobs"
  ON public.content_jobs FOR UPDATE
  USING (true);

-- Public insert for backend to create jobs
CREATE POLICY "Anyone can insert content_jobs"
  ON public.content_jobs FOR INSERT
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_jobs;

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_content_jobs_updated_at
  BEFORE UPDATE ON public.content_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();