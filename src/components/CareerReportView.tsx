import React from 'react';
import { motion } from 'framer-motion';
import { CareerReport } from '@/types/conversation';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CareerReportViewProps {
  report: CareerReport;
  onRestart: () => void;
}

const CareerReportView: React.FC<CareerReportViewProps> = ({ report, onRestart }) => {
  const reportRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
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
      pdf.save(`Career_Discovery_Report_${report.studentSnapshot.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-3xl md:text-4xl font-bold gradient-text mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Your Career Discovery Report
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
        <div ref={reportRef} className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
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
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Grade</p>
                  <p className="font-medium text-gray-900">{report.studentSnapshot.grade}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Board</p>
                  <p className="font-medium text-gray-900">{report.studentSnapshot.board}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Country</p>
                  <p className="font-medium text-gray-900">{report.studentSnapshot.country}</p>
                </div>
              </div>

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

            <div className="space-y-4">
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
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Why This Fits You</p>
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
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Application Readiness Hints</p>
                        <ul className="space-y-1">
                          {path.applicationHints.map((hint, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-secondary mt-1">→</span>
                              {hint}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <Button
            onClick={handleDownloadPDF}
            className="btn-primary px-8 py-6 text-lg rounded-xl"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download PDF Report
          </Button>
          <Button
            onClick={onRestart}
            variant="outline"
            className="px-8 py-6 text-lg rounded-xl"
          >
            Start New Discovery
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CareerReportView;
