import React, { useState, useEffect } from 'react';
import { CreditCard, Filter, MoreHorizontal, Check, X, ExternalLink, RefreshCw, Search } from 'lucide-react';

interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  upiId: string;
  status: string;
  remarks: string;
  processedBy?: string | null;
  processedAt?: string | null;
  createdAt: string;
}

const PAGE_SIZE = 10;
const STATUS_TYPES = [
  { value: 'all', label: 'All Requests' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

const WithdrawalRequests: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchWithdrawals = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3100/api/admin/withdrawals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setWithdrawals(data.withdrawals);
      } else {
        setError('Failed to fetch withdrawal requests');
      }
    } catch (err) {
      setError('An error occurred while fetching withdrawal requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  // Filtering, search, and pagination
  const filteredRequests = withdrawals.filter(request => {
    if (statusFilter !== 'all' && request.status !== statusFilter) return false;
    if (search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      return regex.test(request.userName) || regex.test(request.userEmail);
    }
    return true;
  });
  const total = filteredRequests.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const paginatedRequests = filteredRequests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, search, withdrawals]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Approve/Reject handlers with modal for remarks/reason
  const openActionModal = (id: string, type: 'approve' | 'reject') => {
    setActionId(id);
    setActionType(type);
    setRemarks('');
    setRejectReason('');
    setShowRemarksModal(true);
  };

  const closeModal = () => {
    setShowRemarksModal(false);
    setActionId(null);
    setActionType(null);
    setRemarks('');
    setRejectReason('');
    setActionLoading(false);
  };

  const handleAction = async () => {
    if (!actionId || !actionType) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      let url = `http://localhost:3100/api/admin/withdrawal/${actionId}/${actionType}`;
      let body: any = {};
      if (actionType === 'approve' && remarks) body.remarks = remarks;
      if (actionType === 'reject' && rejectReason) body.reason = rejectReason;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: Object.keys(body).length ? JSON.stringify(body) : undefined,
      });
      const data = await response.json();
      if (data.success) {
        await fetchWithdrawals();
        closeModal();
      } else {
        setError('Failed to process request');
      }
    } catch (err) {
      setError('An error occurred while processing the request');
    } finally {
      setActionLoading(false);
    }
  };

  // Modal for remarks/reason
  const RemarksModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4">
          {actionType === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
        </h2>
        {actionType === 'approve' ? (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">Remarks (optional)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="e.g. Payment processed via UPI"
              autoFocus
            />
          </>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Invalid UPI ID provided"
              autoFocus
            />
          </>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            disabled={actionLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleAction}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            disabled={actionLoading || (actionType === 'reject' && !rejectReason)}
          >
            {actionLoading ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showRemarksModal && <RemarksModal />}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <CreditCard className="mr-2 h-6 w-6 text-sky-600" />
            Withdrawal Requests
          </h1>
          <p className="text-gray-600 mt-1">Manage customer withdrawal requests</p>
        </div>
        <button
          onClick={fetchWithdrawals}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-60"
          disabled={isLoading}
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-500 h-5 w-5" />
            <select 
              className="border-none rounded-lg px-3 py-2 bg-white focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="relative flex items-center w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <p className="text-sm text-gray-500 min-w-fit">
            Showing <span className="font-medium">{filteredRequests.length}</span> requests
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  UPI ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remarks
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">
                        {request.userName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                        <div className="text-sm text-gray-500">{request.userEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">₹{request.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {request.upiId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.remarks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {request.status === 'pending' ? (
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => openActionModal(request.id, 'approve')}
                          className="text-green-600 hover:text-green-800 flex items-center"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                        <button 
                          onClick={() => openActionModal(request.id, 'reject')}
                          className="text-red-600 hover:text-red-800 flex items-center"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <button className="text-sky-600 hover:text-sky-800 flex items-center justify-end w-full">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalRequests;