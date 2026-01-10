import React from 'react';
import { motion } from 'framer-motion';
import { CareerReport } from '@/types/conversation';
import { Button } from '@/components/ui/button';
import { Download, User, Target, ArrowRight, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ShareReportButton from '@/components/ShareReportButton';
import PersonalityBadgeCard from '@/components/PersonalityBadgeCard';
import DayInLifeSection from '@/components/DayInLifeSection';
import CollegeCourseMapping from '@/components/CollegeCourseMapping';

interface CareerReportViewProps {
  report: CareerReport;
  onRestart: () => void;
}

const CareerReportView: React.FC<CareerReportViewProps> = ({ report, onRestart }) => {
  const reportRef = React.useRef<HTMLDivElement>(null);
  const [localReport, setLocalReport] = React.useState(report);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#0a0810',
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Career_Report_${report.studentSnapshot.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleShareIdGenerated = (shareId: string) => {
    setLocalReport(prev => ({ ...prev, shareId }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative border-b border-border/50 backdrop-blur-xl bg-background/50">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <motion.p
            className="text-sm text-muted-foreground mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Generated on {report.generatedAt.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </motion.p>
          <motion.h1
            className="text-3xl font-bold text-foreground tracking-tight"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Your <span className="gradient-text">Career Discovery</span> Report
          </motion.h1>
        </div>
      </div>

      {/* Report Content */}
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        <div ref={reportRef} className="space-y-12">
          {/* Personality Badge */}
          {localReport.personalityBadge && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <PersonalityBadgeCard 
                badge={localReport.personalityBadge} 
                studentName={report.studentSnapshot.name} 
              />
            </motion.section>
          )}

          {/* Student Snapshot */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center border border-primary/20">
                <User className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Student Profile</h2>
            </div>
            
            <div className="glass-panel p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Name</p>
                  <p className="font-medium text-foreground">{report.studentSnapshot.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Grade</p>
                  <p className="font-medium text-foreground">{report.studentSnapshot.grade}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Board</p>
                  <p className="font-medium text-foreground">{report.studentSnapshot.board}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Country</p>
                  <p className="font-medium text-foreground">{report.studentSnapshot.country}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {report.studentSnapshot.topInterests.map((interest, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-gradient-to-r from-primary/20 to-accent/10 text-foreground rounded-full text-sm font-medium border border-primary/20"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Strengths</p>
                <div className="flex flex-wrap gap-2">
                  {report.studentSnapshot.keyStrengths.map((strength, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-gradient-to-r from-accent/20 to-primary/10 text-foreground rounded-full text-sm font-medium border border-accent/20"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Recommended Career Paths */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/30 to-primary/20 flex items-center justify-center border border-accent/20">
                <Target className="h-5 w-5 text-accent" strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Recommended Career Paths</h2>
            </div>

            <div className="space-y-6">
              {report.recommendedPaths.map((path, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="glass-panel p-6"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0 shadow-glow">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-5">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{path.name}</h3>
                        <p className="text-sm text-muted-foreground">{path.cluster}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Why This Fits</p>
                        <ul className="space-y-2">
                          {path.fitReasons.map((reason, i) => (
                            <li key={i} className="text-sm text-foreground flex items-start gap-2">
                              <Sparkles className="h-3.5 w-3.5 text-primary mt-1 shrink-0" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Next Steps</p>
                        <ul className="space-y-2">
                          {path.applicationHints.map((hint, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <ArrowRight className="h-3.5 w-3.5 text-accent mt-1 shrink-0" />
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

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12 pt-12 border-t border-border/50"
        >
          <Button
            onClick={handleDownloadPDF}
            className="gap-2 px-6 py-5 btn-primary rounded-xl"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
          
          <ShareReportButton 
            report={localReport} 
            onShareIdGenerated={handleShareIdGenerated}
          />
          
          <Button
            onClick={onRestart}
            variant="outline"
            className="px-6 py-5 rounded-xl border-border/50 hover:bg-muted/30"
          >
            Start New Discovery
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default CareerReportView;
