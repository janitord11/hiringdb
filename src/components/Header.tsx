import React from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { Building, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../lib/auth/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-blue-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/dashboard" className="flex-shrink-0 flex items-center">
                <Building className="h-8 w-8 text-white" />
                <span className="ml-2 text-white text-xl font-bold">
                  District 11 Management Portal
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard/admin" 
                    className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Admin Login
                </Link>
              )}
              <Link 
                to="/dashboard/reports" 
                className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                Reports
              </Link>
              <button className="p-2 rounded-md text-white hover:bg-blue-600">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </>
  );
}