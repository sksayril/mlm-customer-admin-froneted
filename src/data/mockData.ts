import { User, Review, Game, DepositRequest, Revenue } from '../types';

export const users: User[] = [
  { id: 1, name: 'John Smith', email: 'john@example.com', joinDate: '2023-01-15', status: 'active', balance: 450 },
  { id: 2, name: 'Emma Wilson', email: 'emma@example.com', joinDate: '2023-02-20', status: 'active', balance: 780 },
  { id: 3, name: 'Michael Brown', email: 'michael@example.com', joinDate: '2023-03-05', status: 'active', balance: 320 },
  { id: 4, name: 'Sophia Lee', email: 'sophia@example.com', joinDate: '2023-03-18', status: 'inactive', balance: 0 },
  { id: 5, name: 'Robert Johnson', email: 'robert@example.com', joinDate: '2023-04-10', status: 'active', balance: 920 },
  { id: 6, name: 'Olivia Davis', email: 'olivia@example.com', joinDate: '2023-05-22', status: 'active', balance: 540 },
  { id: 7, name: 'William Taylor', email: 'william@example.com', joinDate: '2023-06-14', status: 'inactive', balance: 0 },
  { id: 8, name: 'Ava Martinez', email: 'ava@example.com', joinDate: '2023-07-30', status: 'active', balance: 670 },
];

export const reviews: Review[] = [
  { id: 1, userId: 1, userName: 'John Smith', content: 'Great platform with amazing games!', rating: 5, date: '2024-01-10' },
  { id: 2, userId: 2, userName: 'Emma Wilson', content: 'Love the variety of games available.', rating: 4, date: '2024-01-15' },
  { id: 3, userId: 3, userName: 'Michael Brown', content: 'Withdrawal process is fast and reliable.', rating: 5, date: '2024-02-05' },
  { id: 4, userId: 5, userName: 'Robert Johnson', content: 'Customer service could be better.', rating: 3, date: '2024-02-18' },
  { id: 5, userId: 6, userName: 'Olivia Davis', content: 'The new interface is much better!', rating: 4, date: '2024-03-01' },
];

export const games: Game[] = [
  { id: 1, name: 'Cosmic Clash', category: 'Arcade', players: 1240, revenue: 8750, status: 'active' },
  { id: 2, name: 'Fortune Wheel', category: 'Casino', players: 2150, revenue: 15680, status: 'active' },
  { id: 3, name: 'Treasure Hunt', category: 'Adventure', players: 890, revenue: 5430, status: 'maintenance' },
  { id: 4, name: 'Poker Master', category: 'Card', players: 1680, revenue: 12450, status: 'active' },
  { id: 5, name: 'Dragon Quest', category: 'RPG', players: 760, revenue: 4280, status: 'active' },
  { id: 6, name: 'Blackjack Pro', category: 'Casino', players: 1920, revenue: 18350, status: 'active' },
];

export const depositRequests: DepositRequest[] = [
  { id: 1, userId: 1, userName: 'John Smith', amount: 100, date: '2024-03-01', status: 'approved' },
  { id: 2, userId: 2, userName: 'Emma Wilson', amount: 200, date: '2024-03-02', status: 'pending' },
  { id: 3, userId: 3, userName: 'Michael Brown', amount: 150, date: '2024-03-03', status: 'approved' },
  { id: 4, userId: 5, userName: 'Robert Johnson', amount: 300, date: '2024-03-04', status: 'rejected' },
  { id: 5, userId: 6, userName: 'Olivia Davis', amount: 250, date: '2024-03-05', status: 'pending' },
  { id: 6, userId: 1, userName: 'John Smith', amount: 180, date: '2024-03-06', status: 'pending' },
  { id: 7, userId: 8, userName: 'Ava Martinez', amount: 400, date: '2024-03-07', status: 'pending' },
];

export const revenueData: Revenue[] = [
  { date: 'Jan', amount: 45000 },
  { date: 'Feb', amount: 52000 },
  { date: 'Mar', amount: 48000 },
  { date: 'Apr', amount: 61000 },
  { date: 'May', amount: 55000 },
  { date: 'Jun', amount: 67000 },
  { date: 'Jul', amount: 72000 },
  { date: 'Aug', amount: 69000 },
];