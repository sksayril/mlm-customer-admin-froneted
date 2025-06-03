import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 145 },
  { month: 'Mar', users: 162 },
  { month: 'Apr', users: 190 },
  { month: 'May', users: 230 },
  { month: 'Jun', users: 270 },
  { month: 'Jul', users: 310 },
  { month: 'Aug', users: 350 },
];

const UserStats: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">User Growth</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-xs bg-sky-600 text-white rounded-full">Monthly</button>
          <button className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-full">Yearly</button>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="users" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserStats;