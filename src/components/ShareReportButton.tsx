import React, { useState } from 'react';
import { Share2, Link, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { CareerReport } from '@/types/conversation';
import { toast } from 'sonner';

interface ShareReportButtonProps {
  report: CareerReport;
  onShareIdGenerated?: (shareId: string) => void;
}

const ShareReportButton: React.FC<ShareReportButtonProps> = ({ report, onShareIdGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateShareLink = async () => {
    if (report.shareId) {
      const url = `${window.location.origin}/report/${report.shareId}`;
      setShareUrl(url);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('career_reports')
        .insert([{
          student_name: report.studentSnapshot.name,
          student_grade: report.studentSnapshot.grade,
          student_board: report.studentSnapshot.board,
          student_country: report.studentSnapshot.country,
          top_interests: report.studentSnapshot.topInterests,
          key_strengths: report.studentSnapshot.keyStrengths,
          personality_type: report.personalityBadge?.type || null,
          personality_description: report.personalityBadge?.description || null,
          recommended_paths: report.recommendedPaths as unknown as any,
        }])
        .select('share_id')
        .single();

      if (error) throw error;

      const url = `${window.location.origin}/report/${data.share_id}`;
      setShareUrl(url);
      
      if (onShareIdGenerated) {
        onShareIdGenerated(data.share_id);
      }
      
      toast.success('Share link created!');
    } catch (error) {
      console.error('Error generating share link:', error);
      toast.error('Failed to create share link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 px-6 py-5 text-base rounded-xl"
          onClick={() => {
            setIsOpen(true);
            if (!shareUrl) generateShareLink();
          }}
        >
          <Share2 className="h-5 w-5" />
          Share with Parents/Counselor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Report</DialogTitle>
          <DialogDescription>
            Share this link with your parents, teachers, or counselors so they can view your career discovery report.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Creating share link...</span>
            </div>
          ) : shareUrl ? (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={shareUrl}
                  readOnly
                  className="pl-10 pr-4"
                />
              </div>
              <Button onClick={handleCopy} variant="secondary" className="shrink-0">
                {copied ? <Check className="h-4 w-4" /> : 'Copy'}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Something went wrong. Please try again.
            </p>
          )}
          
          <p className="text-xs text-muted-foreground text-center">
            Anyone with this link can view your career report. The link never expires.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareReportButton;
