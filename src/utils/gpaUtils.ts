
export type CourseType = "exam" | "td_exam" | "tp_td_exam";

export interface Course {
  id: string;
  name: string;
  coefficient: number;
  courseType: CourseType;
  examGrade?: number;
  tdGrade?: number;
  tpGrade?: number;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  courses: Course[];
  createdBy: string;
  createdAt: Date;
  isPublic: boolean;
  usageCount: number;
  userAccess: string[];
}

export interface GpaResult {
  totalGpa: number;
  totalCoefficients: number;
  isPassing: boolean;
  courseResults: CourseResult[];
}

export interface CourseResult {
  id: string;
  name: string;
  coefficient: number;
  finalGrade: number;
  isPassing: boolean;
}

export const calculateCourseGrade = (course: Course): number => {
  switch (course.courseType) {
    case "exam":
      return course.examGrade || 0;
    case "td_exam":
      return (
        ((course.tdGrade || 0) * 0.4) +
        ((course.examGrade || 0) * 0.6)
      );
    case "tp_td_exam":
      return (
        ((course.tdGrade || 0) * 0.2) +
        ((course.tpGrade || 0) * 0.2) +
        ((course.examGrade || 0) * 0.6)
      );
    default:
      return 0;
  }
};

export const calculateGpa = (courses: Course[]): GpaResult => {
  if (!courses.length) {
    return {
      totalGpa: 0,
      totalCoefficients: 0,
      isPassing: false,
      courseResults: [],
    };
  }

  let totalWeightedGrade = 0;
  let totalCoefficients = 0;
  const courseResults: CourseResult[] = [];

  courses.forEach((course) => {
    const { id, name, coefficient } = course;
    const finalGrade = calculateCourseGrade(course);
    const isPassing = finalGrade >= 10;

    totalWeightedGrade += finalGrade * coefficient;
    totalCoefficients += coefficient;

    courseResults.push({
      id,
      name,
      coefficient,
      finalGrade,
      isPassing,
    });
  });

  const totalGpa = totalCoefficients > 0
    ? totalWeightedGrade / totalCoefficients
    : 0;

  return {
    totalGpa,
    totalCoefficients,
    isPassing: totalGpa >= 10,
    courseResults,
  };
};

export const generateNewCourse = (): Course => {
  return {
    id: crypto.randomUUID(),
    name: "",
    coefficient: 1,
    courseType: "exam",
  };
};

export const formatGrade = (grade: number): string => {
  return grade.toFixed(2);
};
