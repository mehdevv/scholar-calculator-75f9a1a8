
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Calculator from "./pages/Calculator";
import TemplateView from "./pages/TemplateView";
import { User, AuthState, mockAuthenticate } from "./utils/authUtils";
import { Template } from "./utils/gpaUtils";
import { useToast } from "./hooks/use-toast";

const queryClient = new QueryClient();

// Mock templates data
const initialTemplates: Template[] = [
  {
    id: "1",
    name: "First Semester CS",
    description: "Computer Science first semester courses",
    courses: [
      {
        id: "c1",
        name: "Algorithms",
        coefficient: 3,
        courseType: "tp_td_exam",
        examGrade: 14,
        tdGrade: 16,
        tpGrade: 15
      },
      {
        id: "c2",
        name: "Data Structures",
        coefficient: 2,
        courseType: "td_exam",
        examGrade: 13,
        tdGrade: 12
      }
    ],
    createdBy: "1", // user id
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    isPublic: true,
    usageCount: 42,
    userAccess: []
  },
  {
    id: "2",
    name: "Math Courses",
    description: "All mathematics related courses",
    courses: [
      {
        id: "c3",
        name: "Calculus",
        coefficient: 4,
        courseType: "td_exam",
        examGrade: 15,
        tdGrade: 14
      },
      {
        id: "c4",
        name: "Algebra",
        coefficient: 3,
        courseType: "exam",
        examGrade: 16
      },
      {
        id: "c5",
        name: "Statistics",
        coefficient: 2,
        courseType: "tp_td_exam",
        examGrade: 13,
        tdGrade: 14,
        tpGrade: 15
      }
    ],
    createdBy: "admin1", // admin id
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
    isPublic: true,
    usageCount: 89,
    userAccess: ["1"]
  }
];

const App = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  
  // Check if user is already logged in (from localStorage in this demo)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedEmail = localStorage.getItem("userEmail");
        const storedPassword = localStorage.getItem("userPassword");
        
        if (storedEmail && storedPassword) {
          const user = await mockAuthenticate(storedEmail, storedPassword);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Auth error:", error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };
    
    checkAuth();
  }, []);

  const handleAuthSuccess = (email: string, password: string) => {
    // Store credentials in localStorage (in a real app, use tokens instead)
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);
    
    // Authenticate the user
    mockAuthenticate(email, password).then((user) => {
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    });
  };

  const handleLogout = () => {
    // Clear stored credentials
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPassword");
    
    // Reset auth state
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      setAuthState({
        ...authState,
        user: updatedUser,
      });
    }
  };

  const handleCopyTemplate = (template: Template) => {
    if (!authState.user) return;
    
    const newTemplate: Template = {
      ...template,
      id: crypto.randomUUID(),
      name: `Copy of ${template.name}`,
      createdBy: authState.user.id,
      createdAt: new Date(),
      isPublic: false,
      usageCount: 0,
      userAccess: []
    };
    
    setTemplates([...templates, newTemplate]);
  };

  // Protected route component
  const ProtectedRoute = ({ 
    element, 
    redirectTo = "/auth?mode=login" 
  }: { 
    element: JSX.Element; 
    redirectTo?: string; 
  }) => {
    if (authState.isLoading) {
      // Show loading state while checking auth
      return <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>;
    }
    
    return authState.isAuthenticated ? element : <Navigate to={redirectTo} />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            <Route 
              path="/auth" 
              element={
                authState.isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Auth onAuthSuccess={handleAuthSuccess} />
                )
              }
            />
            
            <Route 
              path="/calculator" 
              element={
                <Calculator 
                  user={authState.user} 
                  onLogout={handleLogout} 
                />
              } 
            />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  element={
                    <Dashboard 
                      user={authState.user!} 
                      onLogout={handleLogout} 
                    />
                  }
                />
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  element={
                    <Profile 
                      user={authState.user!}
                      onUpdateUser={handleUpdateUser}
                      onLogout={handleLogout}
                    />
                  }
                />
              }
            />
            
            <Route
              path="/template/:templateId"
              element={
                <TemplateView
                  user={authState.user}
                  onLogout={handleLogout}
                  templates={templates}
                  onCopyTemplate={handleCopyTemplate}
                />
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
