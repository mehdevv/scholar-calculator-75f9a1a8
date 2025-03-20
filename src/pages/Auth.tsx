
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { mockAuthenticate, mockRegister } from "@/utils/authUtils";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

interface AuthProps {
  onAuthSuccess: (email: string, password: string) => void;
}

const Auth = ({ onAuthSuccess }: AuthProps) => {
  // Get the mode from URL query params
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get("mode") || "login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [institute, setInstitute] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { toast } = useToast();

  // Update the URL when mode changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("mode", mode);
    navigate({ search: newSearchParams.toString() }, { replace: true });
  }, [mode, navigate, location.search]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (mode === "register") {
      if (!fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }
      
      if (!institute.trim()) {
        newErrors.institute = "Institute is required";
      }
      
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === "login") {
        await mockAuthenticate(email, password);
        toast({
          title: "Logged in successfully",
          description: "Welcome back to GPA Calculator!",
        });
      } else {
        await mockRegister(email, password, fullName, institute);
        toast({
          title: "Account created",
          description: "Your account has been created successfully!",
        });
      }
      
      // In both cases, authenticate the user
      onAuthSuccess(email, password);
      
      // Navigate to dashboard after successful auth
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: mode === "login" ? "Login failed" : "Registration failed",
        description: (error as Error).message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    navigate({
      search: `?mode=${mode === "login" ? "register" : "login"}`,
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="fixed top-6 left-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border p-8 animate-scale-in">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                GPA
              </div>
              <h1 className="text-2xl font-bold">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h1>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`mt-1 ${errors.fullName ? "border-red-500" : ""}`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="institute">Institute</Label>
                  <Input
                    id="institute"
                    type="text"
                    value={institute}
                    onChange={(e) => setInstitute(e.target.value)}
                    className={`mt-1 ${errors.institute ? "border-red-500" : ""}`}
                    placeholder="Enter your institute or university"
                    disabled={isLoading}
                  />
                  {errors.institute && (
                    <p className="text-red-500 text-xs mt-1">{errors.institute}</p>
                  )}
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 ${errors.email ? "border-red-500" : ""}`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`mt-1 ${errors.password ? "border-red-500" : ""}`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            
            {mode === "register" && (
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`mt-1 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full button-glow mt-6"
              disabled={isLoading}
              size="lg"
            >
              {isLoading
                ? mode === "login"
                  ? "Logging in..."
                  : "Creating account..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </Button>
          </form>
          
          <div className="mt-6">
            <Separator />
            <p className="text-center text-sm text-gray-600 mt-4">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="ml-1 text-primary hover:underline"
                type="button"
              >
                {mode === "login" ? "Sign up" : "Login"}
              </button>
            </p>
          </div>
          
          {mode === "login" && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                For testing, you can use:
                <br />
                Email: mehdi@admin.com
                <br />
                Password: me123
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
