export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  referralCode: string;
  referredBy: string | null;
  level: number;
  wallet: {
    normal: number;
    benefit: number;
    game: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  userId: number;
  userName: string;
  content: string;
  rating: number;
  date: string;
}

export interface Game {
  id: number;
  name: string;
  category: string;
  players: number;
  revenue: number;
  status: 'active' | 'maintenance';
}

export interface DepositRequest {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approvedDate?: string;
  notes: string;
}

export interface Revenue {
  date: string;
  amount: number;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UsersResponse {
  success: boolean;
  count: number;
  users: User[];
}

export interface DepositRequestsResponse {
  success: boolean;
  count: number;
  depositRequests: DepositRequest[];
}