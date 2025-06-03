import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GamepadIcon, DollarSign, ArrowUpRight, UserPlus, TrendingUp, BarChart2, PieChart } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface RecentUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface DashboardStats {
  users: {
    total: number;
    playing: number;
    notPlaying: number;
    recentUsers: RecentUser[];
  };
  games: {
    colorPrediction: { count: number; percentage: string };
    numberPrediction: { count: number; percentage: string };
    mostPlayed: string;
  };
  finance: {
    totalDeposits: number;
    totalWithdrawals: number;
    revenue: number;
  };
  userGrowth: {
    count: number;
    year: number;
    month: number;
    monthName: string;
  }[];
}

interface FinancialOverview {
  period: {
    from: string;
    to: string;
    label: string;
  };
  overview: {
    totalDeposits: number;
    depositCount: number;
    totalWithdrawals: number;
    withdrawalCount: number;
    netRevenue: number;
    profitMargin: string;
  };
  dailyTransactions: {
    _id: string;
    transactions: {
      type: string;
      total: number;
    }[];
  }[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [financialData, setFinancialData] = useState<FinancialOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Fetch dashboard stats
        const statsResponse = await fetch('https://api.utpfund.live/api/admin/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (statsResponse.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/login');
          return;
        }
        
        const statsData = await statsResponse.json();
        
        // Fetch financial overview
        const financialResponse = await fetch('https://api.utpfund.live/api/admin/dashboard/financial-overview', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (financialResponse.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/login');
          return;
        }
        
        const financialData = await financialResponse.json();

        if (statsData.success && financialData.success) {
          setStats(statsData.dashboardStats);
          setFinancialData(financialData);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        if (err instanceof Error && err.message.includes('401')) {
          localStorage.removeItem('adminToken');
          navigate('/login');
          return;
        }
        setError('An error occurred while fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !stats || !financialData) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error || 'No data available.'}</div>
    );
  }

  // Prepare data for charts
  const userGrowthData = stats.userGrowth.map(growth => ({
    name: `${growth.monthName} ${growth.year}`,
    users: growth.count
  }));

  const financialChartData = financialData.dailyTransactions.map(day => {
    const dayData: any = { date: new Date(day._id).toLocaleDateString() };
    day.transactions.forEach(tx => {
      dayData[tx.type] = tx.total;
    });
    return dayData;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Users" 
          value={stats.users.total.toLocaleString()} 
          icon={<Users className="h-6 w-6 text-white" />} 
          trend={undefined}
          color="bg-sky-600"
        />
        <StatsCard 
          title="Playing Now" 
          value={stats.users.playing.toLocaleString()} 
          icon={<UserPlus className="h-6 w-6 text-white" />} 
          trend={undefined}
          color="bg-green-600"
        />
        <StatsCard 
          title="Not Playing" 
          value={stats.users.notPlaying.toLocaleString()} 
          icon={<Users className="h-6 w-6 text-white" />} 
          trend={undefined}
          color="bg-amber-500"
        />
        <StatsCard 
          title="Revenue" 
          value={`₹${stats.finance.revenue.toLocaleString()}`} 
          icon={<DollarSign className="h-6 w-6 text-white" />} 
          trend={undefined}
          color="bg-purple-600"
        />
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Withdrawals" 
          value={`₹${financialData.overview.totalWithdrawals.toLocaleString()}`} 
          icon={<ArrowUpRight className="h-6 w-6 text-white" />} 
          trend={undefined}
          color="bg-red-600"
        />
        <StatsCard 
          title="Withdrawal Count" 
          value={financialData.overview.withdrawalCount.toString()} 
          icon={<BarChart2 className="h-6 w-6 text-white" />} 
          trend={undefined}
          color="bg-orange-600"
        />
        <StatsCard 
          title="Net Revenue" 
          value={`₹${financialData.overview.netRevenue.toLocaleString()}`} 
          icon={<DollarSign className="h-6 w-6 text-white" />} 
          trend={undefined}
          color="bg-green-600"
        />
        <StatsCard 
          title="Profit Margin" 
          value={`${financialData.overview.profitMargin}%`} 
          icon={<PieChart className="h-6 w-6 text-white" />} 
          trend={undefined}
          color="bg-blue-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">User Growth Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#0284c7" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Daily Transactions</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="recharge" fill="#22c55e" name="Recharge" />
                <Bar dataKey="withdrawal" fill="#ef4444" name="Withdrawal" />
                <Bar dataKey="game" fill="#3b82f6" name="Game" />
                <Bar dataKey="transfer" fill="#f59e0b" name="Transfer" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Users</h2>
          <ul className="divide-y divide-gray-100">
            {stats.users.recentUsers.map(user => (
              <li key={user._id} className="py-3 flex items-center">
                <div className="h-10 w-10 flex-shrink-0 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-xs text-gray-400">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Games Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Color Prediction</span>
              <div className="text-right">
                <div className="font-semibold">{stats.games.colorPrediction.count}</div>
                <div className="text-sm text-gray-500">{stats.games.colorPrediction.percentage}%</div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Number Prediction</span>
              <div className="text-right">
                <div className="font-semibold">{stats.games.numberPrediction.count}</div>
                <div className="text-sm text-gray-500">{stats.games.numberPrediction.percentage}%</div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Most Played Game</span>
                <span className="font-semibold text-sky-600">{stats.games.mostPlayed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;