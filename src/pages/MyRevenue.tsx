import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, Calendar, Loader2, XCircle, ArrowLeft, ArrowRight, Filter } from 'lucide-react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { revenueData } from '../data/mockData';

interface Transaction {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  type: string;
  amount: number;
  walletType: string;
  status: string;
  description: string;
  performedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

const PAGE_SIZE = 10;
const TRANSACTION_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'recharge', label: 'Recharge' },
  { value: 'withdrawal', label: 'Withdrawal' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'bonus', label: 'Bonus' },
];

const MyRevenue: React.FC = () => {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');

  // Revenue summary
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [netRevenue, setNetRevenue] = useState(0);

  // Fetch all transactions once
  const fetchAllTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('https://api.utpfund.live/api/admin/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllTransactions(response.data.transactions || []);
    } catch (err: any) {
      setError('Failed to fetch transactions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  // Filtered transactions by type
  const filteredTransactions = type
    ? allTransactions.filter((tx) => tx.type === type)
    : allTransactions;

  // Pagination logic
  const total = filteredTransactions.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const paginatedTransactions = filteredTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Update summary cards based on filtered data
  useEffect(() => {
    let revenue = 0;
    let withdrawals = 0;
    filteredTransactions.forEach((tx: Transaction) => {
      if (tx.type === 'recharge') revenue += tx.amount;
      if (tx.type === 'withdrawal') withdrawals += Math.abs(tx.amount);
    });
    setTotalRevenue(revenue);
    setTotalWithdrawals(withdrawals);
    setNetRevenue(revenue - withdrawals);
    setPage(1); // Reset to first page when filter changes
    // eslint-disable-next-line
  }, [type, allTransactions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <DollarSign className="mr-2 h-6 w-6 text-sky-600" />
          My Revenue
        </h1>
        <p className="text-gray-600 mt-1">Track your income and financial performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Revenue (Recharge)</p>
              <h3 className="text-2xl font-bold mt-1 text-green-700">₹{totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Withdrawals</p>
              <h3 className="text-2xl font-bold mt-1 text-red-700">₹{totalWithdrawals.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Net Revenue</p>
              <h3 className={`text-2xl font-bold mt-1 ${netRevenue >= 0 ? 'text-green-700' : 'text-red-700'}`}>₹{netRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Revenue Trends</h2>
            <p className="text-gray-500 text-sm mt-1">Monthly revenue performance</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs bg-sky-600 text-white rounded-full">This Year</button>
            <button className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded-full">Last Year</button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {TRANSACTION_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={fetchAllTransactions}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-60"
            disabled={loading}
          >
            <Loader2 className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
          </div>
        ) : error ? (
          <div className="flex items-center text-red-600 bg-red-50 p-4 rounded-lg">
            <XCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedTransactions.map((tx) => (
                    <tr key={tx._id}>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        <div className="font-medium">{tx.userId?.name}</div>
                        <div className="text-xs text-gray-500">{tx.userId?.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 capitalize">{tx.type}</td>
                      <td className={`px-4 py-3 text-sm font-medium ${tx.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'}`}>{tx.type === 'withdrawal' ? '-' : '+'}₹{Math.abs(tx.amount)}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 capitalize">{tx.walletType}</td>
                      <td className={`px-4 py-3 text-sm font-medium ${tx.status === 'completed' ? 'text-green-600' : 'text-amber-600'}`}>{tx.status}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{tx.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-800">{new Date(tx.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {paginatedTransactions.length === 0 && (
                <div className="text-center text-gray-500 py-8">No transactions found.</div>
              )}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Revenue by Game Category</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800">Casino</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">$183,450</td>
                <td className="px-4 py-3 text-sm font-medium text-green-600">+14.2%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800">Arcade</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">$105,820</td>
                <td className="px-4 py-3 text-sm font-medium text-green-600">+8.7%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800">RPG</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">$89,370</td>
                <td className="px-4 py-3 text-sm font-medium text-red-600">-2.3%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800">Card</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">$64,980</td>
                <td className="px-4 py-3 text-sm font-medium text-green-600">+5.1%</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-800">Adventure</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">$25,670</td>
                <td className="px-4 py-3 text-sm font-medium text-green-600">+10.5%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-800">Upcoming Payouts</h3>
            <button className="text-sky-600 hover:text-sky-700 text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              View Schedule
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Weekly Payout</p>
                <p className="text-sm text-gray-500">Sep 15, 2025</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">$12,540</p>
                <span className="text-xs text-sky-600 font-medium">Processing</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Monthly Payout</p>
                <p className="text-sm text-gray-500">Sep 30, 2025</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">$48,290</p>
                <span className="text-xs text-amber-600 font-medium">Scheduled</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Quarterly Bonus</p>
                <p className="text-sm text-gray-500">Oct 15, 2025</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-800">$15,780</p>
                <span className="text-xs text-amber-600 font-medium">Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default MyRevenue;