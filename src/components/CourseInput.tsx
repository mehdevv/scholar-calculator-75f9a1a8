
import { useState, useEffect } from "react";
import { Course, CourseType } from "@/utils/gpaUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";

interface CourseInputProps {
  course: Course;
  onChange: (updatedCourse: Course) => void;
  onRemove: () => void;
  index: number;
}

const courseTypeOptions = [
  { value: "exam", label: "Exam Only (100%)" },
  { value: "td_exam", label: "TD + Exam (40% + 60%)" },
  { value: "tp_td_exam", label: "TD + TP + Exam (20% + 20% + 60%)" },
];

const CourseInput = ({ course, onChange, onRemove, index }: CourseInputProps) => {
  const [localCourse, setLocalCourse] = useState<Course>(course);

  // Update parent component when local state changes
  useEffect(() => {
    onChange(localCourse);
  }, [localCourse, onChange]);

  // Update local state when props change
  useEffect(() => {
    setLocalCourse(course);
  }, [course]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Course
  ) => {
    const value = e.target.value;
    
    if (field === "coefficient") {
      const coefficient = parseFloat(value);
      if (coefficient > 0) {
        setLocalCourse({ ...localCourse, [field]: coefficient });
      }
    } else if (field === "examGrade" || field === "tdGrade" || field === "tpGrade") {
      const grade = parseFloat(value);
      if (!isNaN(grade) && grade >= 0 && grade <= 20) {
        setLocalCourse({ ...localCourse, [field]: grade });
      } else if (value === "") {
        setLocalCourse({ ...localCourse, [field]: undefined });
      }
    } else {
      setLocalCourse({ ...localCourse, [field]: value });
    }
  };

  const handleCourseTypeChange = (value: string) => {
    const courseType = value as CourseType;
    
    setLocalCourse({
      ...localCourse,
      courseType,
      // Reset grades when changing course type
      examGrade: localCourse.examGrade,
      tdGrade: courseType !== "exam" ? localCourse.tdGrade : undefined,
      tpGrade: courseType === "tp_td_exam" ? localCourse.tpGrade : undefined,
    });
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border rounded-xl p-4 shadow-sm mb-4 hover:shadow-md transition-shadow duration-300 animate-scale-in">
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-500">Course {index + 1}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRemove}
          className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid gap-4 mb-4">
        <div>
          <Label htmlFor={`course-name-${course.id}`}>Course Name</Label>
          <Input
            id={`course-name-${course.id}`}
            placeholder="e.g., Mathematics, Physics"
            value={localCourse.name}
            onChange={(e) => handleInputChange(e, "name")}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor={`coefficient-${course.id}`}>Coefficient</Label>
            <Input
              id={`coefficient-${course.id}`}
              type="number"
              min="1"
              step="1"
              value={localCourse.coefficient}
              onChange={(e) => handleInputChange(e, "coefficient")}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor={`course-type-${course.id}`}>Evaluation Type</Label>
            <Select
              value={localCourse.courseType}
              onValueChange={handleCourseTypeChange}
            >
              <SelectTrigger id={`course-type-${course.id}`} className="mt-1">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {courseTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3 mt-1">
          {localCourse.courseType === "tp_td_exam" && (
            <div>
              <Label htmlFor={`tp-grade-${course.id}`}>TP Grade (out of 20)</Label>
              <Input
                id={`tp-grade-${course.id}`}
                type="number"
                min="0"
                max="20"
                step="0.25"
                placeholder="Enter TP grade"
                value={localCourse.tpGrade === undefined ? "" : localCourse.tpGrade}
                onChange={(e) => handleInputChange(e, "tpGrade")}
                className="mt-1"
              />
            </div>
          )}
          
          {(localCourse.courseType === "td_exam" || localCourse.courseType === "tp_td_exam") && (
            <div>
              <Label htmlFor={`td-grade-${course.id}`}>TD Grade (out of 20)</Label>
              <Input
                id={`td-grade-${course.id}`}
                type="number"
                min="0"
                max="20"
                step="0.25"
                placeholder="Enter TD grade"
                value={localCourse.tdGrade === undefined ? "" : localCourse.tdGrade}
                onChange={(e) => handleInputChange(e, "tdGrade")}
                className="mt-1"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor={`exam-grade-${course.id}`}>Exam Grade (out of 20)</Label>
            <Input
              id={`exam-grade-${course.id}`}
              type="number"
              min="0"
              max="20"
              step="0.25"
              placeholder="Enter exam grade"
              value={localCourse.examGrade === undefined ? "" : localCourse.examGrade}
              onChange={(e) => handleInputChange(e, "examGrade")}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseInput;
