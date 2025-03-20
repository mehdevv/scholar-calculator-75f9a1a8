
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Template } from "@/utils/gpaUtils";
import { User } from "@/utils/authUtils";
import GpaCalculator from "@/components/GpaCalculator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TemplateViewProps {
  user: User | null;
  onLogout: () => void;
  templates: Template[];
  onCopyTemplate?: (template: Template) => void;
}

const TemplateView = ({
  user,
  onLogout,
  templates,
  onCopyTemplate,
}: TemplateViewProps) => {
  const { templateId } = useParams<{ templateId: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Find the template by ID
    const foundTemplate = templates.find((t) => t.id === templateId);
    
    if (foundTemplate) {
      // Check if user has access
      const isPublic = foundTemplate.isPublic;
      const isOwner = user && foundTemplate.createdBy === user.id;
      const hasAccess = user && foundTemplate.userAccess.includes(user.id);
      
      if (isPublic || isOwner || hasAccess) {
        setTemplate(foundTemplate);
        setError(null);
      } else {
        setTemplate(null);
        setError("You don't have access to this template");
      }
    } else {
      setTemplate(null);
      setError("Template not found");
    }
    
    setLoading(false);
  }, [templateId, templates, user]);

  const handleCopy = () => {
    if (!template || !user) {
      toast({
        title: "Action failed",
        description: "You need to be logged in to copy templates",
        variant: "destructive",
      });
      return;
    }

    if (onCopyTemplate) {
      onCopyTemplate(template);
      toast({
        title: "Template copied",
        description: "The template has been copied to your templates",
      });
      navigate("/dashboard?tab=templates");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      
      <main className="flex-1 container mx-auto px-4 py-24 max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          {template && user && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-1"
            >
              <Copy className="h-4 w-4" />
              Make a Copy
            </Button>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Loading template...</p>
          </div>
        ) : error ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {error}
            </h2>
            <p className="text-gray-600 mb-6">
              The template you're looking for may not exist or you don't have
              access to it.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        ) : template ? (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border p-6">
            <GpaCalculator
              initialCourses={template.courses}
              isAuthenticated={!!user}
              isTemplate={true}
              templateName={template.name}
              templateDescription={template.description}
              readOnly={!user}
            />
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default TemplateView;
