import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen } from 'lucide-react';
import { CareerPath } from '@/types/conversation';

interface CollegeCourseMappingProps {
  careerPath: CareerPath;
  index: number;
}

const getEducationMapping = (careerName: string, cluster: string) => {
  const careerLower = careerName.toLowerCase();
  const clusterLower = cluster.toLowerCase();

  const mappings: Record<string, { courses: string[]; colleges: string[] }> = {
    software: {
      courses: ['Computer Science', 'Software Engineering', 'Information Technology', 'Data Structures & Algorithms'],
      colleges: ['MIT', 'Stanford', 'Carnegie Mellon', 'UC Berkeley', 'IIT Bombay'],
    },
    data: {
      courses: ['Data Science', 'Statistics', 'Machine Learning', 'Applied Mathematics'],
      colleges: ['Harvard', 'Stanford', 'MIT', 'UC Berkeley', 'CMU'],
    },
    doctor: {
      courses: ['MBBS', 'Pre-Med', 'Biology', 'Biochemistry'],
      colleges: ['Johns Hopkins', 'AIIMS', 'Harvard Medical', 'Mayo Clinic School'],
    },
    engineer: {
      courses: ['Engineering', 'Physics', 'Mathematics', 'Technical Drawing'],
      colleges: ['MIT', 'Stanford', 'IIT Delhi', 'Caltech', 'Georgia Tech'],
    },
    designer: {
      courses: ['Design Thinking', 'UX/UI Design', 'Human-Computer Interaction', 'Visual Communication'],
      colleges: ['RISD', 'Parsons', 'NID', 'MIT Media Lab'],
    },
    business: {
      courses: ['Business Administration', 'Economics', 'Marketing', 'Finance'],
      colleges: ['Harvard Business', 'Wharton', 'INSEAD', 'IIM Ahmedabad'],
    },
    lawyer: {
      courses: ['Law', 'Political Science', 'Legal Studies', 'Constitutional Law'],
      colleges: ['Harvard Law', 'Yale Law', 'NLS Bangalore', 'Oxford'],
    },
    psychologist: {
      courses: ['Psychology', 'Cognitive Science', 'Behavioral Science', 'Neuroscience'],
      colleges: ['Stanford', 'Harvard', 'UCLA', 'Cambridge'],
    },
    architect: {
      courses: ['Architecture', 'Urban Planning', 'Design Studio', 'Structural Engineering'],
      colleges: ['MIT', 'AA London', 'SPA Delhi', 'Harvard GSD'],
    },
    writer: {
      courses: ['Creative Writing', 'English Literature', 'Journalism', 'Communications'],
      colleges: ['Iowa Writers\' Workshop', 'Columbia', 'NYU', 'Oxford'],
    },
    scientist: {
      courses: ['Research Methodology', 'Advanced Sciences', 'Lab Techniques', 'Scientific Writing'],
      colleges: ['MIT', 'Caltech', 'IISc Bangalore', 'Max Planck Institutes'],
    },
    teacher: {
      courses: ['Education', 'Pedagogy', 'Child Psychology', 'Curriculum Design'],
      colleges: ['Harvard Education', 'Columbia Teachers College', 'TISS Mumbai'],
    },
  };

  for (const [keyword, data] of Object.entries(mappings)) {
    if (careerLower.includes(keyword) || clusterLower.includes(keyword)) {
      return data;
    }
  }

  return {
    courses: ['Related Field Fundamentals', 'Industry Certifications', 'Professional Development'],
    colleges: ['Top universities in your region', 'Specialized institutes'],
  };
};

const CollegeCourseMapping: React.FC<CollegeCourseMappingProps> = ({ careerPath, index }) => {
  const mapping = getEducationMapping(careerPath.name, careerPath.cluster);
  const courses = careerPath.suggestedCourses?.length ? careerPath.suggestedCourses : mapping.courses;
  const colleges = careerPath.suggestedColleges?.length ? careerPath.suggestedColleges : mapping.colleges;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 + index * 0.1 }}
      className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3"
    >
      {/* Courses */}
      <div className="p-3 bg-gradient-to-r from-primary/15 to-primary/5 rounded-xl border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Recommended Courses</span>
        </div>
        <ul className="space-y-1">
          {courses.slice(0, 4).map((course, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
              <span className="text-primary/60">•</span>
              {course}
            </li>
          ))}
        </ul>
      </div>

      {/* Colleges */}
      <div className="p-3 bg-gradient-to-r from-accent/15 to-accent/5 rounded-xl border border-accent/20">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-foreground">Top Colleges</span>
        </div>
        <ul className="space-y-1">
          {colleges.slice(0, 4).map((college, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
              <span className="text-accent/60">•</span>
              {college}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default CollegeCourseMapping;
