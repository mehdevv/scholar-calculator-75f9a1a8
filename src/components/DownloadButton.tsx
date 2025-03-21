
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadProjectFiles } from "../utils/fileDownloader";
import { useToast } from "@/hooks/use-toast";

export const DownloadButton = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      const success = await downloadProjectFiles();
      
      if (success) {
        toast({
          title: "Download started",
          description: "Your file is being downloaded",
          variant: "default",
        });
      } else {
        toast({
          title: "Download failed",
          description: "There was an error creating the zip file",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      size="lg"
      className="mt-6 button-glow"
    >
      <Download className="w-5 h-5 mr-2" />
      {isDownloading ? "Preparing download..." : "Download Project Files"}
    </Button>
  );
};
