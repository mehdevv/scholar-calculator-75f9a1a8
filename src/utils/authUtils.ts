
export interface User {
  id: string;
  email: string;
  fullName: string;
  institute: string;
  profilePicture?: string;
  role: "user" | "admin";
  createdAt: Date;
  templates: string[];
  isBanned: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Mock authenticated user (in a real app, this would interact with a backend)
export const mockUser: User = {
  id: "1",
  email: "student@example.com",
  fullName: "Example Student",
  institute: "University of Algiers",
  role: "user",
  createdAt: new Date(),
  templates: [],
  isBanned: false
};

// Mock admin user
export const mockAdmin: User = {
  id: "admin1",
  email: "mehdi@admin.com",
  fullName: "Mehdi",
  institute: "Admin Institute",
  role: "admin",
  createdAt: new Date(),
  templates: [],
  isBanned: false
};

export const mockAuthenticate = async (email: string, password: string): Promise<User> => {
  // This is a mock implementation for demonstration purposes
  // In a real app, this would make an API call to your authentication endpoint
  
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
  
  if (email === "mehdi@admin.com" && password === "me123") {
    return mockAdmin;
  }
  
  if (email && password) {
    return mockUser;
  }
  
  throw new Error("Invalid credentials");
};

export const mockRegister = async (
  email: string, 
  password: string, 
  fullName: string, 
  institute: string
): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validate inputs
  if (!email || !password || !fullName || !institute) {
    throw new Error("All fields are required");
  }
  
  // In a real app, this would create a new user account
  return {
    id: crypto.randomUUID(),
    email,
    fullName,
    institute,
    role: "user",
    createdAt: new Date(),
    templates: [],
    isBanned: false
  };
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role === "admin";
};
