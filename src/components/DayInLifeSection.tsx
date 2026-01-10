import React from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';
import { CareerPath } from '@/types/conversation';

interface DayInLifeSectionProps {
  careerPath: CareerPath;
  index: number;
}

const getVideoSuggestion = (careerName: string, cluster: string): string | null => {
  const careerVideos: Record<string, string> = {
    'software': 'https://www.youtube.com/results?search_query=day+in+the+life+software+engineer',
    'data': 'https://www.youtube.com/results?search_query=day+in+the+life+data+scientist',
    'developer': 'https://www.youtube.com/results?search_query=day+in+the+life+developer',
    'engineer': 'https://www.youtube.com/results?search_query=day+in+the+life+engineer',
    'designer': 'https://www.youtube.com/results?search_query=day+in+the+life+ux+designer',
    'doctor': 'https://www.youtube.com/results?search_query=day+in+the+life+medical+doctor',
    'nurse': 'https://www.youtube.com/results?search_query=day+in+the+life+nurse',
    'medical': 'https://www.youtube.com/results?search_query=day+in+the+life+healthcare',
    'psychologist': 'https://www.youtube.com/results?search_query=day+in+the+life+psychologist',
    'consultant': 'https://www.youtube.com/results?search_query=day+in+the+life+consultant',
    'analyst': 'https://www.youtube.com/results?search_query=day+in+the+life+business+analyst',
    'manager': 'https://www.youtube.com/results?search_query=day+in+the+life+manager',
    'entrepreneur': 'https://www.youtube.com/results?search_query=day+in+the+life+entrepreneur',
    'artist': 'https://www.youtube.com/results?search_query=day+in+the+life+artist',
    'writer': 'https://www.youtube.com/results?search_query=day+in+the+life+writer',
    'architect': 'https://www.youtube.com/results?search_query=day+in+the+life+architect',
    'scientist': 'https://www.youtube.com/results?search_query=day+in+the+life+scientist',
    'researcher': 'https://www.youtube.com/results?search_query=day+in+the+life+researcher',
    'lawyer': 'https://www.youtube.com/results?search_query=day+in+the+life+lawyer',
    'attorney': 'https://www.youtube.com/results?search_query=day+in+the+life+attorney',
    'teacher': 'https://www.youtube.com/results?search_query=day+in+the+life+teacher',
    'professor': 'https://www.youtube.com/results?search_query=day+in+the+life+professor',
  };

  const lowerName = careerName.toLowerCase();
  const lowerCluster = cluster.toLowerCase();

  for (const [keyword, url] of Object.entries(careerVideos)) {
    if (lowerName.includes(keyword) || lowerCluster.includes(keyword)) {
      return url;
    }
  }

  return `https://www.youtube.com/results?search_query=day+in+the+life+${encodeURIComponent(careerName)}`;
};

const DayInLifeSection: React.FC<DayInLifeSectionProps> = ({ careerPath, index }) => {
  const videoUrl = careerPath.dayInLifeVideo || getVideoSuggestion(careerPath.name, careerPath.cluster);

  if (!videoUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 + index * 0.1 }}
      className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-accent/5 rounded-xl border border-primary/20"
    >
      <div className="flex items-center gap-2 mb-2">
        <Play className="h-4 w-4 text-primary" strokeWidth={1.5} />
        <span className="text-sm font-medium text-foreground">Day in the Life</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        Watch real professionals share what a typical day looks like.
      </p>
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-accent font-medium transition-colors"
      >
        Explore Videos <ExternalLink className="h-3 w-3" />
      </a>
    </motion.div>
  );
};

export default DayInLifeSection;
