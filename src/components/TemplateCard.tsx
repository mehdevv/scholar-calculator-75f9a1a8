
import { useState } from "react";
import { Template } from "@/utils/gpaUtils";
import { User, isAdmin } from "@/utils/authUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Copy,
  Share,
  MoreVertical,
  Edit,
  Trash,
  Users,
  Link,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TemplateCardProps {
  template: Template;
  currentUser: User | null;
  onUse: (template: Template) => void;
  onDelete?: (templateId: string) => void;
  onEdit?: (templateId: string) => void;
  onShare?: (templateId: string) => void;
  onCopy?: (template: Template) => void;
}

const TemplateCard = ({
  template,
  currentUser,
  onUse,
  onDelete,
  onEdit,
  onShare,
  onCopy,
}: TemplateCardProps) => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const { toast } = useToast();
  
  const isOwner = currentUser?.id === template.createdBy;
  const canManage = isAdmin(currentUser) || isOwner;
  
  const formattedDate = new Date(template.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  
  const courseCount = template.courses.length;
  const totalCoefficients = template.courses.reduce(
    (sum, course) => sum + course.coefficient,
    0
  );

  const handleShare = () => {
    setIsActionLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (onShare) {
        onShare(template.id);
      }
      
      // Create a shareable link
      const shareLink = `${window.location.origin}/template/${template.id}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareLink).then(
        () => {
          toast({
            title: "Link copied!",
            description: "Share link has been copied to clipboard",
          });
        },
        () => {
          toast({
            title: "Failed to copy",
            description: "Please copy the link manually",
            variant: "destructive",
          });
        }
      );
      
      setIsActionLoading(false);
    }, 300);
  };

  const handleCopy = () => {
    if (onCopy) {
      onCopy(template);
      toast({
        title: "Template copied",
        description: "A copy has been created in your templates",
      });
    }
  };

  const handleDelete = () => {
    if (!canManage) return;
    
    setIsActionLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (onDelete) {
        onDelete(template.id);
      }
      setIsActionLoading(false);
    }, 500);
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border shadow-sm p-5 hover-lift animate-scale-in">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{template.name}</h3>
            {template.isPublic ? (
              <Badge variant="outline" className="text-xs font-normal">
                Public
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-primary/10 text-xs font-normal border-primary/20">
                Private
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
            {template.description || "No description"}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onCopy && (
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Make a copy
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem onClick={handleShare}>
              <Link className="h-4 w-4 mr-2" />
              Copy share link
            </DropdownMenuItem>
            
            {canManage && onEdit && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onEdit(template.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit template
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete template
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
        <div className="bg-gray-50 rounded-md p-2">
          <p className="text-gray-500 text-xs">Courses</p>
          <p className="font-medium">{courseCount}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-2">
          <p className="text-gray-500 text-xs">Coefficients</p>
          <p className="font-medium">{totalCoefficients}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-2">
          <p className="text-gray-500 text-xs">Uses</p>
          <p className="font-medium">{template.usageCount}</p>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
        <span>Created: {formattedDate}</span>
        
        {!isOwner && template.isPublic && (
          <div className="flex items-center">
            <Users className="h-3 w-3 mr-1" />
            <span>Public template</span>
          </div>
        )}
      </div>

      <Button
        className="w-full mt-4 button-glow"
        onClick={() => onUse(template)}
        disabled={isActionLoading}
      >
        Use Template
      </Button>
    </div>
  );
};

export default TemplateCard;
