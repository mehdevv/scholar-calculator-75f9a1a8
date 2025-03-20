
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import GpaCalculator from "@/components/GpaCalculator";
import { User } from "@/utils/authUtils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CalculatorProps {
  user: User | null;
  onLogout: () => void;
}

const Calculator = ({ user, onLogout }: CalculatorProps) => {
  const { toast } = useToast();

  const handleSaveTemplate = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save templates",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      
      <main className="flex-1 container mx-auto px-4 py-24 max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">GPA Calculator</h1>
            <p className="text-gray-600 mt-1">
              Calculate your GPA based on the Algerian grading system
            </p>
          </div>
          
          {!user && (
            <div className="mt-4 md:mt-0">
              <Link to="/auth?mode=login">
                <Button variant="outline" className="mr-2">
                  Login
                </Button>
              </Link>
              <Link to="/auth?mode=register">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm border p-6">
          <GpaCalculator
            isAuthenticated={!!user}
            onSaveTemplate={user ? undefined : handleSaveTemplate}
          />
        </div>
      </main>
    </div>
  );
};

export default Calculator;
