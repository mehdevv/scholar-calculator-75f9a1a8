
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, BookOpen, Users, Award, Download } from "lucide-react";
import { DownloadButton } from "@/components/DownloadButton";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4 md:pt-36 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-gradient-to-b from-blue-50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-block px-3 py-1 mb-2 text-sm rounded-full bg-primary/10 text-primary animate-fade-in">
                Calculate your GPA easily
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-slide-up">
                GPA Calculator
                <span className="text-primary block mt-1">for Algerian Students</span>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-md mx-auto md:mx-0 animate-slide-up" style={{ animationDelay: "100ms" }}>
                Calculate your GPA based on the Algerian grading system, create templates, and share them with classmates.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center md:justify-start animate-slide-up" style={{ animationDelay: "200ms" }}>
                <Link to="/calculator">
                  <Button size="lg" className="button-glow w-full sm:w-auto">
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Now
                  </Button>
                </Link>
                
                <Link to="/auth?mode=register">
                  <Button size="lg" variant="outline" className="hover-lift w-full sm:w-auto">
                    Sign Up
                  </Button>
                </Link>
              </div>
              
              {/* Download Button */}
              <div className="flex justify-center md:justify-start animate-slide-up" style={{ animationDelay: "300ms" }}>
                <DownloadButton />
              </div>
            </div>
            
            <div className="relative animate-fade-in order-first md:order-last mx-auto md:mx-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl transform rotate-3 scale-95 opacity-50"></div>
              <div className="relative w-full h-full bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">GPA Preview</h3>
                    <div className="text-xl font-bold text-green-600">14.75/20</div>
                  </div>
                  
                  {[
                    { name: "Mathematics", grade: 16.5, coef: 3 },
                    { name: "Physics", grade: 13.25, coef: 2 },
                    { name: "Computer Science", grade: 18.0, coef: 4 },
                    { name: "English", grade: 12.0, coef: 1 },
                  ].map((course, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex justify-between items-center"
                      style={{ animationDelay: `${100 * index}ms` }}
                    >
                      <div>
                        <div className="font-medium">{course.name}</div>
                        <div className="text-xs text-gray-500">Coefficient: {course.coef}</div>
                      </div>
                      <div className={course.grade >= 10 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {course.grade.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our GPA calculator is tailored specifically for Algerian students with all the features you need.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Calculator className="w-10 h-10 text-primary" />,
                title: "Accurate Calculation",
                description: "Calculate your GPA based on the Algerian grading system with support for Exam, TD, and TP assessments."
              },
              {
                icon: <BookOpen className="w-10 h-10 text-primary" />,
                title: "Create Templates",
                description: "Save your course structures as templates for future semesters or to share with classmates."
              },
              {
                icon: <Users className="w-10 h-10 text-primary" />,
                title: "Collaboration",
                description: "Share your templates with classmates and use templates created by others."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border hover-lift"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Calculate your GPA in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: "01",
                title: "Add Courses",
                description: "Enter your course names and select their evaluation types (Exam, TD+Exam, or TD+TP+Exam)."
              },
              {
                number: "02",
                title: "Input Grades",
                description: "Enter your grades for each course component and set the coefficient for each course."
              },
              {
                number: "03",
                title: "Get Your Results",
                description: "View your GPA instantly with color-coded results to see if you're passing or need improvement."
              }
            ].map((step, index) => (
              <div
                key={index}
                className="relative p-6 rounded-xl hover-lift"
              >
                <div className="absolute top-0 right-6 text-8xl font-bold text-gray-100 -z-10">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 relative z-10">{step.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/calculator">
              <Button size="lg" className="button-glow">
                <Calculator className="w-5 h-5 mr-2" />
                Try Calculator Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 px-4 mt-auto">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Calculator className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold">GPA Calculator</span>
            </div>
            
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} GPA Calculator for Algerian Students
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
