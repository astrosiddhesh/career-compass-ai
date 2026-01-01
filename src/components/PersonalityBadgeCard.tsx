import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PersonalityBadge } from '@/types/conversation';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';

interface PersonalityBadgeCardProps {
  badge: PersonalityBadge;
  studentName: string;
}

const PersonalityBadgeCard: React.FC<PersonalityBadgeCardProps> = ({ badge, studentName }) => {
  const badgeRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!badgeRef.current) return;

    try {
      const canvas = await html2canvas(badgeRef.current, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `${studentName.replace(/\s+/g, '_')}_personality_badge.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Badge downloaded');
    } catch (error) {
      console.error('Error downloading badge:', error);
      toast.error('Failed to download badge');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${studentName}'s Personality Type`,
          text: `I'm a ${badge.title}! ${badge.description}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`I'm a ${badge.title}! ${badge.description}`);
      toast.success('Copied to clipboard');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-foreground" strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Your Personality Archetype</h2>
      </div>

      <div
        ref={badgeRef}
        className="relative overflow-hidden rounded-xl p-8 text-center bg-muted border border-border"
      >
        <div className="space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider bg-foreground text-background">
            {badge.type}
          </span>
          <h3 className="text-2xl font-semibold text-foreground">{badge.title}</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">{badge.description}</p>
        </div>

        <div className="mt-6 text-xs text-muted-foreground">
          {studentName} · Career Discovery
        </div>
      </div>

      <div className="flex gap-3 mt-6 justify-center">
        <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </motion.div>
  );
};

export default PersonalityBadgeCard;
