import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, GamepadIcon, DollarSign, CreditCard, Settings, HelpCircle, ArrowDownCircle, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.reload();
  };

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/customers', name: 'My Customers', icon: <Users size={20} /> },
    // { path: '/games', name: 'My Games', icon: <GamepadIcon size={20} /> },
    { path: '/revenue', name: 'My Revenue', icon: <DollarSign size={20} /> },
    { path: '/deposit-requests', name: 'Deposit Requests', icon: <CreditCard size={20} /> },
    { path: '/withdrawal-requests', name: 'Withdrawal Requests', icon: <ArrowDownCircle size={20} /> },
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-sky-600 text-white flex flex-col">
      <div className="p-5 border-b border-sky-700 flex-shrink-0">
        <h2 className="text-2xl font-bold flex items-center">
          <GamepadIcon className="mr-2" />
          GameAdmin
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <div className="px-4 py-6">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center py-3 px-4 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-white text-sky-600 font-medium'
                        : 'text-white hover:bg-sky-700'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-10 pt-6 border-t border-sky-700">
            <ul className="space-y-1">
              <li>
                <a href="#" className="flex items-center py-3 px-4 rounded-lg text-white hover:bg-sky-700 transition-colors duration-200">
                  <Settings className="mr-3" size={20} />
                  <span>Settings</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center py-3 px-4 rounded-lg text-white hover:bg-sky-700 transition-colors duration-200">
                  <HelpCircle className="mr-3" size={20} />
                  <span>Help & Support</span>
                </a>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center py-3 px-4 rounded-lg text-white hover:bg-red-600 transition-colors duration-200"
                >
                  <LogOut className="mr-3" size={20} />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;