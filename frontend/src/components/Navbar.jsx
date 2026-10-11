import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles, 
  History, 
  LayoutDashboard, 
  ChevronDown,
  ChevronRight,
  Activity
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBreadcrumbTitle = () => {
    switch (location.pathname) {
      case '/': return 'Home';
      case '/dashboard': return 'Dashboard Overview';
      case '/predict': return 'Quote Calculator';
      case '/history': return 'Quote History';
      case '/profile': return 'User Settings';
      case '/about': return 'System Architecture';
      default:
        if (location.pathname.startsWith('/history/')) return 'Quote Audit Details';
        return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 font-sans shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          
          {/* Left Brand & Context Breadcrumb Trail */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white shrink-0">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold tracking-tight text-slate-900 uppercase font-mono">
                InsureWise
              </span>
            </Link>

            <span className="text-slate-300 text-xs">/</span>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Actuarial AI</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-900 font-semibold">{getBreadcrumbTitle()}</span>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                isActive('/')
                  ? 'text-slate-900 bg-slate-100 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                isActive('/about')
                  ? 'text-slate-900 bg-slate-100 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Architecture
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/dashboard')
                      ? 'text-slate-900 bg-slate-100 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/predict"
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/predict')
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Calculate Quote</span>
                </Link>

                <Link
                  to="/history"
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isActive('/history')
                      ? 'text-slate-900 bg-slate-100 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-slate-500" />
                  <span>History</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Status & Account Controls */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Live Microservice Telemetry Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[11px] font-mono text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>FastAPI ML Online</span>
            </div>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-xs transition-colors focus:outline-none cursor-pointer"
                >
                  <div className="w-4.5 h-4.5 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-[10px]">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-semibold text-slate-800 max-w-[100px] truncate text-[11px]">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 rounded border border-slate-200 bg-white shadow-lg py-1 z-50 animate-fade-in text-xs">
                    <div className="px-3 py-2 border-b border-slate-100 space-y-0.5">
                      <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Account Settings</span>
                      </Link>

                      <Link
                        to="/history"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <History className="w-3.5 h-3.5 text-slate-400" />
                        <span>Quote History</span>
                      </Link>

                      <Link
                        to="/predict"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-1.5 text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Calculate Quote</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1 rounded text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-1.5 rounded text-xs font-medium ${
              isActive('/') ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-1.5 rounded text-xs font-medium ${
              isActive('/about') ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            System Architecture
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-1.5 rounded text-xs font-medium ${
                  isActive('/dashboard') ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/predict"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Calculate Quote
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-1.5 rounded text-xs font-medium ${
                  isActive('/history') ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                History
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-1.5 rounded text-xs font-medium ${
                  isActive('/profile') ? 'text-slate-900 bg-slate-100 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-1.5 rounded text-xs font-semibold text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-200 flex flex-col space-y-1">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-3 py-1.5 rounded border border-slate-200 text-slate-700 text-xs font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-3 py-1.5 rounded bg-slate-900 text-white text-xs font-semibold"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
