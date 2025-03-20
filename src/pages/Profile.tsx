
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/ProfileCard";
import { User } from "@/utils/authUtils";

interface ProfileProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  onLogout: () => void;
}

const Profile = ({ user, onUpdateUser, onLogout }: ProfileProps) => {
  const handleUpdateProfile = (updatedUser: Partial<User>) => {
    onUpdateUser(updatedUser);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
          
          <ProfileCard user={user} onUpdateProfile={handleUpdateProfile} />
        </div>
      </main>
    </div>
  );
};

export default Profile;
