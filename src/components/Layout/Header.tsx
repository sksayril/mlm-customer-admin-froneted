import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex justify-between items-center px-6 py-3">
        <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-sky-500 transition-colors duration-200" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer group">
            <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-sky-500 transition-colors duration-200">Admin</span>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center text-gray-500 hover:text-red-500 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;