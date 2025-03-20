
import { useState } from "react";
import { Template } from "@/utils/gpaUtils";
import { User } from "@/utils/authUtils";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateCard from "./TemplateCard";
import { Search } from "lucide-react";

interface TemplatesListProps {
  templates: Template[];
  currentUser: User | null;
  onUseTemplate: (template: Template) => void;
  onDeleteTemplate?: (templateId: string) => void;
  onEditTemplate?: (templateId: string) => void;
  onShareTemplate?: (templateId: string) => void;
  onCopyTemplate?: (template: Template) => void;
}

const TemplatesList = ({
  templates,
  currentUser,
  onUseTemplate,
  onDeleteTemplate,
  onEditTemplate,
  onShareTemplate,
  onCopyTemplate,
}: TemplatesListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Filter by owned/public and search query
  const myTemplates = templates.filter(
    (template) =>
      template.createdBy === currentUser?.id &&
      template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publicTemplates = templates.filter(
    (template) =>
      template.isPublic &&
      template.createdBy !== currentUser?.id &&
      template.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort templates based on selected option
  const sortTemplates = (templateList: Template[]): Template[] => {
    const sorted = [...templateList];
    
    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "popular":
        return sorted.sort((a, b) => b.usageCount - a.usageCount);
      default:
        return sorted;
    }
  };

  const sortedMyTemplates = sortTemplates(myTemplates);
  const sortedPublicTemplates = sortTemplates(publicTemplates);

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="popular">Most used</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="my-templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="my-templates">My Templates</TabsTrigger>
          <TabsTrigger value="public-templates">Public Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-templates" className="mt-0">
          {sortedMyTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedMyTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  currentUser={currentUser}
                  onUse={onUseTemplate}
                  onDelete={onDeleteTemplate}
                  onEdit={onEditTemplate}
                  onShare={onShareTemplate}
                  onCopy={onCopyTemplate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50/50 rounded-lg border border-dashed">
              <p className="text-gray-500">
                {searchQuery
                  ? "No templates match your search"
                  : "You haven't created any templates yet"}
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="public-templates" className="mt-0">
          {sortedPublicTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedPublicTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  currentUser={currentUser}
                  onUse={onUseTemplate}
                  onShare={onShareTemplate}
                  onCopy={onCopyTemplate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50/50 rounded-lg border border-dashed">
              <p className="text-gray-500">
                {searchQuery
                  ? "No public templates match your search"
                  : "No public templates available"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TemplatesList;
