-- Create table for shareable career reports
CREATE TABLE public.career_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  share_id TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  student_name TEXT NOT NULL,
  student_grade TEXT,
  student_board TEXT,
  student_country TEXT,
  top_interests TEXT[] DEFAULT '{}',
  key_strengths TEXT[] DEFAULT '{}',
  personality_type TEXT,
  personality_description TEXT,
  recommended_paths JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.career_reports ENABLE ROW LEVEL SECURITY;

-- Anyone can view a report if they have the share_id
CREATE POLICY "Reports are publicly viewable by share_id" 
ON public.career_reports 
FOR SELECT 
USING (true);

-- Anyone can create reports (anonymous users from the app)
CREATE POLICY "Anyone can create reports" 
ON public.career_reports 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster share_id lookups
CREATE INDEX idx_career_reports_share_id ON public.career_reports(share_id);