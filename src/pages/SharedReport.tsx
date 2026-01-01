import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CareerReport, CareerPath, PersonalityBadge } from '@/types/conversation';
import PersonalityBadgeCard from '@/components/PersonalityBadgeCard';
import DayInLifeSection from '@/components/DayInLifeSection';
import CollegeCourseMapping from '@/components/CollegeCourseMapping';

const SharedReport = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [report, setReport] = useState<CareerReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!shareId) {
        setError('Invalid share link');
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('career_reports')
          .select('*')
          .eq('share_id', shareId)
          .maybeSingle();

        if (fetchError) throw fetchError;
        
        if (!data) {
          setError('Report not found');
          setIsLoading(false);
          return;
        }

        // Transform database data to CareerReport format
        const transformedReport: CareerReport = {
          studentSnapshot: {
            name: data.student_name,
            grade: data.student_grade || '',
            board: data.student_board || '',
            country: data.student_country || '',
            topInterests: data.top_interests || [],
            keyStrengths: data.key_strengths || [],
          },
          recommendedPaths: (data.recommended_paths as unknown as CareerPath[]) || [],
          personalityBadge: data.personality_type ? {
            type: data.personality_type,
            title: data.personality_type,
            description: data.personality_description || '',
            emoji: getPersonalityEmoji(data.personality_type),
            color: getPersonalityColor(data.personality_type),
          } : undefined,
          generatedAt: new Date(data.created_at),
          shareId: data.share_id,
        };

        setReport(transformedReport);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Failed to load report');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [shareId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-2">Report Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'This report may have been removed or the link is invalid.'}
          </p>
          <Link to="/">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Start Your Own Discovery
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4"
          >
            Shared Career Report
          </motion.div>
          <motion.h1
            className="text-3xl md:text-4xl font-bold gradient-text mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {report.studentSnapshot.name}'s Career Discovery
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Generated on {report.generatedAt.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </motion.p>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
          {/* Personality Badge */}
          {report.personalityBadge && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <PersonalityBadgeCard 
                badge={report.personalityBadge} 
                studentName={report.studentSnapshot.name} 
              />
            </motion.section>
          )}

          {/* Student Snapshot */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Student Snapshot</h2>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                  <p className="font-medium text-gray-900">{report.studentSnapshot.name}</p>
                </div>
                {report.studentSnapshot.grade && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Grade</p>
                    <p className="font-medium text-gray-900">{report.studentSnapshot.grade}</p>
                  </div>
                )}
                {report.studentSnapshot.board && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Board</p>
                    <p className="font-medium text-gray-900">{report.studentSnapshot.board}</p>
                  </div>
                )}
                {report.studentSnapshot.country && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Country</p>
                    <p className="font-medium text-gray-900">{report.studentSnapshot.country}</p>
                  </div>
                )}
              </div>

              {report.studentSnapshot.topInterests.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Top Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {report.studentSnapshot.topInterests.map((interest, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {report.studentSnapshot.keyStrengths.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Key Strengths</p>
                  <div className="flex flex-wrap gap-2">
                    {report.studentSnapshot.keyStrengths.map((strength, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          {/* Recommended Career Paths */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Top Recommended Career Paths</h2>
            </div>

            <div className="space-y-6">
              {report.recommendedPaths.map((path, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="border border-gray-200 rounded-xl p-5 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">{path.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{path.cluster}</p>
                      
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Why This Fits</p>
                        <ul className="space-y-1">
                          {path.fitReasons.map((reason, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-primary mt-1">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Application Hints</p>
                        <ul className="space-y-1">
                          {path.applicationHints.map((hint, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-secondary mt-1">→</span>
                              {hint}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <DayInLifeSection careerPath={path} index={index} />
                      <CollegeCourseMapping careerPath={path} index={index} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <Link to="/">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-accent">
              Start Your Own Career Discovery
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Helper functions for personality badge
function getPersonalityEmoji(type: string): string {
  const emojiMap: Record<string, string> = {
    'The Innovator': '💡',
    'The Caregiver': '💚',
    'The Analyst': '🔍',
    'The Creator': '🎨',
    'The Leader': '👑',
    'The Explorer': '🧭',
    'The Builder': '🔧',
    'The Connector': '🤝',
  };
  return emojiMap[type] || '✨';
}

function getPersonalityColor(type: string): string {
  const colorMap: Record<string, string> = {
    'The Innovator': '#8B5CF6',
    'The Caregiver': '#10B981',
    'The Analyst': '#3B82F6',
    'The Creator': '#F59E0B',
    'The Leader': '#EF4444',
    'The Explorer': '#06B6D4',
    'The Builder': '#6366F1',
    'The Connector': '#EC4899',
  };
  return colorMap[type] || '#6366F1';
}

export default SharedReport;
