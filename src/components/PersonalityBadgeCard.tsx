import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Download } from 'lucide-react';
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
      toast.success('Badge downloaded!');
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
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateY: -10 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
      className="relative"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
          <span className="text-xl">🎭</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Your Personality Archetype</h2>
      </div>

      <div
        ref={badgeRef}
        className="relative overflow-hidden rounded-2xl p-6 text-center"
        style={{
          background: `linear-gradient(135deg, ${badge.color}20, ${badge.color}40)`,
          border: `2px solid ${badge.color}50`,
        }}
      >
        <motion.div
          className="text-6xl mb-4"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          {badge.emoji}
        </motion.div>

        <div className="space-y-2">
          <span
            className="inline-block px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wider"
            style={{ backgroundColor: `${badge.color}30`, color: badge.color }}
          >
            {badge.type}
          </span>
          <h3 className="text-2xl font-bold text-gray-900">{badge.title}</h3>
          <p className="text-gray-600 text-sm max-w-xs mx-auto">{badge.description}</p>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          {studentName} • Career Discovery
        </div>

        {/* Decorative elements */}
        <div
          className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
          style={{ backgroundColor: badge.color }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-15"
          style={{ backgroundColor: badge.color }}
        />
      </div>

      <div className="flex gap-2 mt-4 justify-center">
        <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Save Badge
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
