
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import GpaCalculator from "@/components/GpaCalculator";
import TemplatesList from "@/components/TemplatesList";
import { User, isAdmin } from "@/utils/authUtils";
import { Course, Template } from "@/utils/gpaUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users } from "lucide-react";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

// Mock templates data
const mockTemplates: Template[] = [
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
  },
  {
    id: "3",
    name: "Physics Courses",
    description: "Physics department courses",
    courses: [
      {
        id: "c6",
        name: "Mechanics",
        coefficient: 3,
        courseType: "tp_td_exam",
        examGrade: 12,
        tdGrade: 14,
        tpGrade: 16
      },
      {
        id: "c7",
        name: "Electromagnetism",
        coefficient: 3,
        courseType: "tp_td_exam",
        examGrade: 11,
        tdGrade: 13,
        tpGrade: 15
      }
    ],
    createdBy: "1", // user id
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    isPublic: false,
    usageCount: 7,
    userAccess: []
  }
];

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("calculator");
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  // For admin user management (simplified)
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      email: "student@example.com",
      fullName: "Example Student",
      institute: "University of Algiers",
      role: "user",
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      templates: [],
      isBanned: false
    },
    {
      id: "2",
      email: "another@example.com",
      fullName: "Another Student",
      institute: "University of Constantine",
      role: "user",
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      templates: [],
      isBanned: false
    }
  ]);
  
  const handleSaveTemplate = (name: string, description: string, courses: Course[]) => {
    const newTemplate: Template = {
      id: crypto.randomUUID(),
      name,
      description,
      courses,
      createdBy: user.id,
      createdAt: new Date(),
      isPublic: false, // Default to private
      usageCount: 0,
      userAccess: []
    };
    
    setTemplates([newTemplate, ...templates]);
    
    toast({
      title: "Template saved",
      description: "Your template has been saved successfully",
    });
    
    // Switch to templates tab
    setActiveTab("templates");
  };
  
  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setActiveTab("calculator");
    
    // Update usage count
    const updatedTemplates = templates.map(t => 
      t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t
    );
    setTemplates(updatedTemplates);
  };
  
  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(t => t.id !== templateId));
    
    toast({
      title: "Template deleted",
      description: "The template has been deleted successfully",
    });
  };
  
  const handleEditTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setActiveTab("calculator");
    }
  };
  
  const handleCopyTemplate = (templateToCopy: Template) => {
    const newTemplate: Template = {
      ...templateToCopy,
      id: crypto.randomUUID(),
      name: `Copy of ${templateToCopy.name}`,
      createdBy: user.id,
      createdAt: new Date(),
      isPublic: false,
      usageCount: 0,
      userAccess: []
    };
    
    setTemplates([newTemplate, ...templates]);
  };
  
  const toggleUserBanStatus = (userId: string) => {
    setUsers(prev => 
      prev.map(u => 
        u.id === userId ? { ...u, isBanned: !u.isBanned } : u
      )
    );
    
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      toast({
        title: targetUser.isBanned ? "User unbanned" : "User banned",
        description: `${targetUser.fullName} has been ${targetUser.isBanned ? "unbanned" : "banned"}`,
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      
      <main className="flex-1 container mx-auto px-4 py-24 max-w-6xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {isAdmin(user)
                ? "Manage templates and users"
                : "Calculate your GPA and manage templates"}
            </p>
          </div>
          
          {activeTab === "calculator" && (
            <Button
              onClick={() => {
                setSelectedTemplate(null);
                setActiveTab("calculator");
              }}
              className="mt-4 md:mt-0 button-glow"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Calculation
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex mb-8">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            {isAdmin(user) && (
              <TabsTrigger value="users" className="hidden md:flex">
                <Users className="w-4 h-4 mr-2" />
                Users Management
              </TabsTrigger>
            )}
          </TabsList>
          
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border shadow-sm p-6">
            <TabsContent value="calculator" className="mt-0">
              {selectedTemplate ? (
                <GpaCalculator
                  initialCourses={selectedTemplate.courses}
                  onSaveTemplate={handleSaveTemplate}
                  isAuthenticated={true}
                  isTemplate={true}
                  templateName={selectedTemplate.name}
                  templateDescription={selectedTemplate.description}
                />
              ) : (
                <GpaCalculator
                  onSaveTemplate={handleSaveTemplate}
                  isAuthenticated={true}
                />
              )}
            </TabsContent>
            
            <TabsContent value="templates" className="mt-0">
              <TemplatesList
                templates={templates}
                currentUser={user}
                onUseTemplate={handleUseTemplate}
                onDeleteTemplate={handleDeleteTemplate}
                onEditTemplate={handleEditTemplate}
                onShareTemplate={(id) => console.log("Share template:", id)}
                onCopyTemplate={handleCopyTemplate}
              />
            </TabsContent>
            
            {isAdmin(user) && (
              <TabsContent value="users" className="mt-0">
                <div className="w-full animate-fade-in">
                  <h2 className="text-xl font-semibold mb-4">User Management</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                          <th className="py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                          <th className="py-3 px-4 text-sm font-medium text-gray-500">Institute</th>
                          <th className="py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
                          <th className="py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                          <th className="py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} className="border-t hover:bg-gray-50">
                            <td className="py-3 px-4">{u.fullName}</td>
                            <td className="py-3 px-4">{u.email}</td>
                            <td className="py-3 px-4">{u.institute}</td>
                            <td className="py-3 px-4">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full ${
                                  u.isBanned
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {u.isBanned ? "Banned" : "Active"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleUserBanStatus(u.id)}
                                className={u.isBanned ? "text-green-600" : "text-red-600"}
                              >
                                {u.isBanned ? "Unban" : "Ban"}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
