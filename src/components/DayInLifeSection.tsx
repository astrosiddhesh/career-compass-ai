import React from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';
import { CareerPath } from '@/types/conversation';

interface DayInLifeSectionProps {
  careerPath: CareerPath;
  index: number;
}

// Curated "Day in the Life" video suggestions based on career clusters
const getVideoSuggestion = (careerName: string, cluster: string): string | null => {
  const careerVideos: Record<string, string> = {
    // Tech
    'software': 'https://www.youtube.com/results?search_query=day+in+the+life+software+engineer',
    'data': 'https://www.youtube.com/results?search_query=day+in+the+life+data+scientist',
    'developer': 'https://www.youtube.com/results?search_query=day+in+the+life+developer',
    'engineer': 'https://www.youtube.com/results?search_query=day+in+the+life+engineer',
    'designer': 'https://www.youtube.com/results?search_query=day+in+the+life+ux+designer',
    // Healthcare
    'doctor': 'https://www.youtube.com/results?search_query=day+in+the+life+medical+doctor',
    'nurse': 'https://www.youtube.com/results?search_query=day+in+the+life+nurse',
    'medical': 'https://www.youtube.com/results?search_query=day+in+the+life+healthcare',
    'psychologist': 'https://www.youtube.com/results?search_query=day+in+the+life+psychologist',
    // Business
    'consultant': 'https://www.youtube.com/results?search_query=day+in+the+life+consultant',
    'analyst': 'https://www.youtube.com/results?search_query=day+in+the+life+business+analyst',
    'manager': 'https://www.youtube.com/results?search_query=day+in+the+life+manager',
    'entrepreneur': 'https://www.youtube.com/results?search_query=day+in+the+life+entrepreneur',
    // Creative
    'artist': 'https://www.youtube.com/results?search_query=day+in+the+life+artist',
    'writer': 'https://www.youtube.com/results?search_query=day+in+the+life+writer',
    'architect': 'https://www.youtube.com/results?search_query=day+in+the+life+architect',
    // Science
    'scientist': 'https://www.youtube.com/results?search_query=day+in+the+life+scientist',
    'researcher': 'https://www.youtube.com/results?search_query=day+in+the+life+researcher',
    // Law
    'lawyer': 'https://www.youtube.com/results?search_query=day+in+the+life+lawyer',
    'attorney': 'https://www.youtube.com/results?search_query=day+in+the+life+attorney',
    // Education
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

  // Default search
  return `https://www.youtube.com/results?search_query=day+in+the+life+${encodeURIComponent(careerName)}`;
};

const DayInLifeSection: React.FC<DayInLifeSectionProps> = ({ careerPath, index }) => {
  const videoUrl = careerPath.dayInLifeVideo || getVideoSuggestion(careerPath.name, careerPath.cluster);

  if (!videoUrl) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.1 }}
      className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100"
    >
      <div className="flex items-center gap-2 mb-2">
        <Play className="h-4 w-4 text-purple-600" />
        <span className="text-sm font-medium text-purple-900">Day in the Life</span>
      </div>
      <p className="text-xs text-purple-700 mb-2">
        Watch real professionals share what a typical day looks like in this career.
      </p>
      <a
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
      >
        Explore Videos <ExternalLink className="h-3 w-3" />
      </a>
    </motion.div>
  );
};

export default DayInLifeSection;
