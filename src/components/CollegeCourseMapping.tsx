import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen } from 'lucide-react';
import { CareerPath } from '@/types/conversation';

interface CollegeCourseMappingProps {
  careerPath: CareerPath;
  index: number;
}

// Map careers to relevant courses and colleges
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

  // Default
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
      <div className="p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-100">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-teal-600" />
          <span className="text-sm font-medium text-teal-900">Recommended Courses</span>
        </div>
        <ul className="space-y-1">
          {courses.slice(0, 4).map((course, i) => (
            <li key={i} className="text-xs text-teal-700 flex items-start gap-1">
              <span className="text-teal-400">•</span>
              {course}
            </li>
          ))}
        </ul>
      </div>

      {/* Colleges */}
      <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
        <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-900">Top Colleges</span>
        </div>
        <ul className="space-y-1">
          {colleges.slice(0, 4).map((college, i) => (
            <li key={i} className="text-xs text-amber-700 flex items-start gap-1">
              <span className="text-amber-400">•</span>
              {college}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default CollegeCourseMapping;
