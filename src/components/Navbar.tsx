
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User } from "@/utils/authUtils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Calculator,
  User as UserIcon,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <Calculator className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold tracking-tight">
              GPA Calculator
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === "/dashboard" ? "text-primary" : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === "/profile" ? "text-primary" : ""
                  }`}
                >
                  Profile
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/auth?mode=login"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === "/auth" && location.search.includes("login")
                      ? "text-primary"
                      : ""
                  }`}
                >
                  Login
                </Link>
                <Link to="/auth?mode=register">
                  <Button size="sm" className="button-glow">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b animate-slide-down">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                >
                  <LayoutDashboard className="w-5 h-5 text-gray-500" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
                >
                  <UserIcon className="w-5 h-5 text-gray-500" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 w-full text-left"
                >
                  <LogOut className="w-5 h-5 text-gray-500" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth?mode=login"
                  className="block p-2 rounded-md hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/auth?mode=register"
                  className="block p-2 bg-primary text-white rounded-md text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
