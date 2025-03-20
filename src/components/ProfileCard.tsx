
import { useState } from "react";
import { User } from "@/utils/authUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Pencil, Check, X, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileCardProps {
  user: User;
  onUpdateProfile: (updatedUser: Partial<User>) => void;
}

const ProfileCard = ({ user, onUpdateProfile }: ProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [institute, setInstitute] = useState(user.institute);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = () => {
    if (!fullName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return;
    }

    if (!institute.trim()) {
      toast({
        title: "Institute required",
        description: "Please enter your institute name",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onUpdateProfile({
        fullName,
        institute,
      });
      
      setIsUpdating(false);
      setIsEditing(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    }, 500);
  };

  const handleCancelEdit = () => {
    setFullName(user.fullName);
    setInstitute(user.institute);
    setIsEditing(false);
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 2MB",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would upload the image to a server
    // For this demo, we'll create a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onUpdateProfile({
          profilePicture: event.target.result as string,
        });
        
        toast({
          title: "Profile picture updated",
          description: "Your profile picture has been updated",
        });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border p-6 max-w-md w-full mx-auto animate-fade-in">
      <div className="text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mx-auto border-2 border-primary/20">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/70">
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
          </div>
          
          <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer shadow-md hover:bg-primary/90 transition-colors">
            <Camera className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
          </label>
        </div>
        
        <h2 className="text-xl font-semibold mb-1">{user.fullName}</h2>
        <p className="text-gray-500 text-sm">{user.email}</p>
        
        {!isEditing && (
          <div className="mt-2 text-sm text-gray-600">{user.institute}</div>
        )}
      </div>

      <Separator className="my-4" />

      {!isEditing ? (
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">{user.fullName}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Institute</p>
            <p className="font-medium">{user.institute}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Account Type</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
          
          <Button
            onClick={() => setIsEditing(true)}
            className="w-full mt-4 button-glow"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email}
              disabled
              className="mt-1 bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          
          <div>
            <Label htmlFor="institute">Institute</Label>
            <Input
              id="institute"
              value={institute}
              onChange={(e) => setInstitute(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancelEdit}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              className="flex-1 button-glow"
              onClick={handleSaveProfile}
              disabled={isUpdating}
            >
              <Check className="w-4 h-4 mr-2" />
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
