
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Course,
  GpaResult,
  calculateGpa,
  generateNewCourse,
  formatGrade,
} from "@/utils/gpaUtils";
import CourseInput from "./CourseInput";
import { Plus, Save, Share, FileUp, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GpaCalculatorProps {
  initialCourses?: Course[];
  onSaveTemplate?: (name: string, description: string, courses: Course[]) => void;
  isAuthenticated?: boolean;
  isTemplate?: boolean;
  templateName?: string;
  templateDescription?: string;
  readOnly?: boolean;
}

const GpaCalculator = ({
  initialCourses,
  onSaveTemplate,
  isAuthenticated = false,
  isTemplate = false,
  templateName = "",
  templateDescription = "",
  readOnly = false,
}: GpaCalculatorProps) => {
  const [courses, setCourses] = useState<Course[]>(
    initialCourses || [generateNewCourse()]
  );
  const [gpaResult, setGpaResult] = useState<GpaResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState(templateName);
  const [newTemplateDescription, setNewTemplateDescription] = useState(templateDescription);
  const { toast } = useToast();

  // Calculate GPA whenever courses change
  useEffect(() => {
    if (courses.length > 0) {
      const result = calculateGpa(courses);
      setGpaResult(result);
    } else {
      setGpaResult(null);
    }
  }, [courses]);

  const handleCourseChange = (index: number, updatedCourse: Course) => {
    const newCourses = [...courses];
    newCourses[index] = updatedCourse;
    setCourses(newCourses);
  };

  const handleAddCourse = () => {
    setCourses([...courses, generateNewCourse()]);
  };

  const handleRemoveCourse = (index: number) => {
    if (courses.length > 1) {
      const newCourses = [...courses];
      newCourses.splice(index, 1);
      setCourses(newCourses);
    } else {
      toast({
        title: "Cannot remove",
        description: "You need at least one course",
        variant: "destructive",
      });
    }
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    // Simulate calculation delay
    setTimeout(() => {
      const result = calculateGpa(courses);
      setGpaResult(result);
      setIsCalculating(false);
    }, 300);
  };

  const handleSaveTemplate = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to save templates",
        variant: "destructive",
      });
      return;
    }

    if (!newTemplateName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your template",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    // Simulate saving delay
    setTimeout(() => {
      if (onSaveTemplate) {
        onSaveTemplate(newTemplateName, newTemplateDescription, courses);
      }
      setIsSaving(false);
      setShowSaveForm(false);
      toast({
        title: "Template saved",
        description: "Your template has been saved successfully",
      });
    }, 500);
  };

  const handleExport = () => {
    const dataToExport = {
      courses,
      templateName: newTemplateName,
      templateDescription: newTemplateDescription,
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${newTemplateName || "gpa-calculator"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported successfully",
      description: "Your calculator data has been exported",
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (importedData.courses && Array.isArray(importedData.courses)) {
          setCourses(importedData.courses);
          if (importedData.templateName) {
            setNewTemplateName(importedData.templateName);
          }
          if (importedData.templateDescription) {
            setNewTemplateDescription(importedData.templateDescription);
          }
          toast({
            title: "Imported successfully",
            description: "Calculator data has been imported",
          });
        } else {
          throw new Error("Invalid file format");
        }
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The file format is invalid",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Reset input
  };

  const handleToggleSaveForm = () => {
    setShowSaveForm(!showSaveForm);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border p-6 animate-fade-in">
      {!isTemplate && !readOnly && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">GPA Calculator</h2>
          
          <div className="flex space-x-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <Button variant="outline" size="sm" className="gap-1">
                <FileUp className="h-4 w-4" />
                <span className="hidden sm:inline">Import</span>
              </Button>
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="gap-1"
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>
      )}

      {isTemplate && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">{templateName}</h2>
          {templateDescription && (
            <p className="text-gray-600 mt-1">{templateDescription}</p>
          )}
        </div>
      )}

      {/* Course Inputs */}
      <div className="space-y-4">
        {courses.map((course, index) => (
          <CourseInput
            key={course.id}
            course={course}
            onChange={(updatedCourse) => handleCourseChange(index, updatedCourse)}
            onRemove={() => handleRemoveCourse(index)}
            index={index}
          />
        ))}
      </div>

      {!readOnly && (
        <Button
          variant="outline"
          className="mt-4 w-full hover-lift border-dashed"
          onClick={handleAddCourse}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      )}

      <div className="mt-8">
        <Button
          className="w-full button-glow"
          onClick={handleCalculate}
          disabled={isCalculating}
          size="lg"
        >
          {isCalculating ? "Calculating..." : "Calculate GPA"}
        </Button>
      </div>

      {/* Results Section */}
      {gpaResult && (
        <div className="mt-8 animate-slide-up">
          <Separator className="my-4" />
          
          <div className="text-center my-6">
            <h3 className="text-lg font-medium mb-2">Your GPA</h3>
            <div className="text-4xl font-bold my-2">
              <span
                className={
                  gpaResult.isPassing ? "success-text" : "error-text"
                }
              >
                {formatGrade(gpaResult.totalGpa)}/20
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              Total Coefficient: {gpaResult.totalCoefficients}
            </p>
            <div
              className={`inline-block px-3 py-1 mt-2 rounded-full text-sm ${
                gpaResult.isPassing
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {gpaResult.isPassing ? "Passing" : "Not Passing"}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Course Results</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Coefficient
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {gpaResult.courseResults.map((result) => (
                    <tr
                      key={result.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-3 text-sm">{result.name || "Unnamed Course"}</td>
                      <td className="py-3 px-3 text-sm text-center">
                        {result.coefficient}
                      </td>
                      <td className="py-3 px-3 text-sm text-center font-medium">
                        <span
                          className={
                            result.isPassing ? "success-text" : "error-text"
                          }
                        >
                          {formatGrade(result.finalGrade)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            result.isPassing
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Save Template Form */}
      {!readOnly && isAuthenticated && (
        <div className="mt-8">
          <Separator className="my-4" />
          
          {!showSaveForm ? (
            <Button
              variant="outline"
              className="w-full hover-lift"
              onClick={handleToggleSaveForm}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Template
            </Button>
          ) : (
            <div className="space-y-4 animate-slide-up">
              <h3 className="font-medium">Save as Template</h3>
              
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="mt-1"
                  placeholder="e.g., First Semester CS"
                />
              </div>
              
              <div>
                <Label htmlFor="template-description">Description (Optional)</Label>
                <Input
                  id="template-description"
                  value={newTemplateDescription}
                  onChange={(e) => setNewTemplateDescription(e.target.value)}
                  className="mt-1"
                  placeholder="Brief description of this template"
                />
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleToggleSaveForm}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 button-glow"
                  onClick={handleSaveTemplate}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Template"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GpaCalculator;
