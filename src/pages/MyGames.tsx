import React, { useState, useEffect } from 'react';
import { 
  GamepadIcon, 
  BarChart2, 
  Activity, 
  Palette, 
  ArrowUpDown, 
  Plus, 
  Users, 
  DollarSign, 
  Clock, 
  X, 
  Edit2, 
  Trash2, 
  Loader2,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import axios from 'axios';

interface Game {
  id: number;
  name: string;
  category: string;
  status: string;
  players: number;
  revenue: number;
  icon: React.ElementType;
  description: string;
  gradient: string;
}

interface ColorGameRoom {
  id: string;
  roomId: string;
  entryFee: number;
  benefitFeeMultiplier: number;
  winningAmount: number;
  maxPlayers: number;
  currentPlayers: number;
  availableColors: string[];
  status: string;
  createdAt: string;
}

interface NumberGameRoom {
  id: string;
  roomId: string;
  entryFee: number;
  winningMultiplier: number;
  maxPlayers: number;
  currentPlayers: number;
  bigPlayers: number;
  smallPlayers: number;
  status: string;
  winningType: string | null;
  startTime: string | null;
  endTime: string | null;
  createdAt: string;
}

interface CreateColorRoomForm {
  entryFee: number;
  benefitFeeMultiplier: number;
  winningAmount: number;
  maxPlayers: number;
  availableColors: string[];
}

interface CreateNumberRoomForm {
  entryFee: number;
  winningMultiplier: number;
  maxPlayers: number;
}

const MyGames: React.FC = () => {
  const [showCreateColorRoomModal, setShowCreateColorRoomModal] = useState(false);
  const [showCreateNumberRoomModal, setShowCreateNumberRoomModal] = useState(false);
  const [showColorRoomsModal, setShowColorRoomsModal] = useState(false);
  const [showNumberRoomsModal, setShowNumberRoomsModal] = useState(false);
  const [colorGameRooms, setColorGameRooms] = useState<ColorGameRoom[]>([]);
  const [numberGameRooms, setNumberGameRooms] = useState<NumberGameRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [roomDetails, setRoomDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState({
    colorRooms: false,
    numberRooms: false,
    createColorRoom: false,
    createNumberRoom: false,
    closeRoom: false,
    deleteRoom: false,
    updateRoom: false,
    roomDetails: false
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
    show: boolean;
  }>({
    type: 'success',
    message: '',
    show: false
  });

  const [createColorRoomForm, setCreateColorRoomForm] = useState<CreateColorRoomForm>({
    entryFee: 50,
    benefitFeeMultiplier: 1,
    winningAmount: 100,
    maxPlayers: 3,
    availableColors: ['red', 'green', 'blue', 'yellow']
  });

  const [createNumberRoomForm, setCreateNumberRoomForm] = useState<CreateNumberRoomForm>({
    entryFee: 50,
    winningMultiplier: 2,
    maxPlayers: 10
  });

  const getAuthToken = () => {
    return localStorage.getItem('adminToken');
  };

  const api = axios.create({
    baseURL: 'https://api.utpfund.live/api',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`
    }
  });

  const games: Game[] = [
    {
      id: 1,
      name: 'Color Prediction',
      category: 'Prediction',
      status: 'active',
      players: 1250,
      revenue: 25000,
      icon: Palette,
      description: 'Predict the next color and win big!',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 2,
      name: 'Big & Small',
      category: 'Prediction',
      status: 'active',
      players: 980,
      revenue: 18000,
      icon: ArrowUpDown,
      description: 'Choose between big or small numbers!',
      gradient: 'from-blue-500 to-cyan-500'
    }
  ];

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification({ type: 'success', message: '', show: false });
    }, 3000);
  };

  const fetchColorGameRooms = async () => {
    setIsLoading(prev => ({ ...prev, colorRooms: true }));
    try {
      const response = await api.get('/admin/game/rooms');
      setColorGameRooms(response.data.gameRooms);
      showNotification('success', 'Game rooms loaded successfully');
    } catch (error) {
      console.error('Error fetching color game rooms:', error);
      showNotification('error', 'Failed to load game rooms');
    } finally {
      setIsLoading(prev => ({ ...prev, colorRooms: false }));
    }
  };

  const fetchNumberGameRooms = async () => {
    setIsLoading(prev => ({ ...prev, numberRooms: true }));
    try {
      const response = await api.get('/admin/number-game/rooms');
      setNumberGameRooms(response.data.gameRooms);
      showNotification('success', 'Game rooms loaded successfully');
    } catch (error) {
      console.error('Error fetching number game rooms:', error);
      showNotification('error', 'Failed to load game rooms');
    } finally {
      setIsLoading(prev => ({ ...prev, numberRooms: false }));
    }
  };

  const handleCreateColorRoom = async () => {
    setIsLoading(prev => ({ ...prev, createColorRoom: true }));
    try {
      await api.post('/admin/game/room/create', createColorRoomForm);
      setShowCreateColorRoomModal(false);
      fetchColorGameRooms();
      showNotification('success', 'Game room created successfully');
    } catch (error) {
      console.error('Error creating color game room:', error);
      showNotification('error', 'Failed to create game room');
    } finally {
      setIsLoading(prev => ({ ...prev, createColorRoom: false }));
    }
  };

  const handleCreateNumberRoom = async () => {
    setIsLoading(prev => ({ ...prev, createNumberRoom: true }));
    try {
      await api.post('/admin/number-game/room/create', createNumberRoomForm);
      setShowCreateNumberRoomModal(false);
      fetchNumberGameRooms();
      showNotification('success', 'Game room created successfully');
    } catch (error) {
      console.error('Error creating number game room:', error);
      showNotification('error', 'Failed to create game room');
    } finally {
      setIsLoading(prev => ({ ...prev, createNumberRoom: false }));
    }
  };

  const handleCloseNumberRoom = async (roomId: string) => {
    setIsLoading(prev => ({ ...prev, closeRoom: true }));
    try {
      await api.post(`/admin/number-game/room/${roomId}/close`);
      fetchNumberGameRooms();
      showNotification('success', 'Game room closed successfully');
    } catch (error) {
      console.error('Error closing number game room:', error);
      showNotification('error', 'Failed to close game room');
    } finally {
      setIsLoading(prev => ({ ...prev, closeRoom: false }));
    }
  };

  const handleDeleteNumberRoom = async (roomId: string) => {
    setIsLoading(prev => ({ ...prev, deleteRoom: true }));
    try {
      await api.delete(`/admin/number-game/room/${roomId}`);
      fetchNumberGameRooms();
      showNotification('success', 'Game room deleted successfully');
    } catch (error) {
      console.error('Error deleting number game room:', error);
      showNotification('error', 'Failed to delete game room');
    } finally {
      setIsLoading(prev => ({ ...prev, deleteRoom: false }));
    }
  };

  const handleUpdateNumberRoom = async (roomId: string, data: Partial<CreateNumberRoomForm>) => {
    setIsLoading(prev => ({ ...prev, updateRoom: true }));
    try {
      await api.put(`/admin/number-game/room/${roomId}`, data);
      fetchNumberGameRooms();
      showNotification('success', 'Game room updated successfully');
    } catch (error) {
      console.error('Error updating number game room:', error);
      showNotification('error', 'Failed to update game room');
    } finally {
      setIsLoading(prev => ({ ...prev, updateRoom: false }));
    }
  };

  const fetchRoomDetails = async (roomId: string) => {
    setIsLoading(prev => ({ ...prev, roomDetails: true }));
    try {
      const response = await api.get(`/admin/number-game/room/${roomId}/details`);
      setRoomDetails(response.data);
      setShowRoomDetails(true);
      showNotification('success', 'Room details loaded successfully');
    } catch (error) {
      console.error('Error fetching room details:', error);
      showNotification('error', 'Failed to load room details');
    } finally {
      setIsLoading(prev => ({ ...prev, roomDetails: false }));
    }
  };

  useEffect(() => {
    if (showColorRoomsModal) {
      fetchColorGameRooms();
    }
  }, [showColorRoomsModal]);

  useEffect(() => {
    if (showNumberRoomsModal) {
      fetchNumberGameRooms();
    }
  }, [showNumberRoomsModal]);

  const CreateRoomModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create New Game Room</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Entry Fee</label>
            <input
              type="number"
              value={createColorRoomForm.entryFee}
              onChange={(e) => setCreateColorRoomForm({...createColorRoomForm, entryFee: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Benefit Fee Multiplier</label>
            <input
              type="number"
              value={createColorRoomForm.benefitFeeMultiplier}
              onChange={(e) => setCreateColorRoomForm({...createColorRoomForm, benefitFeeMultiplier: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Winning Amount</label>
            <input
              type="number"
              value={createColorRoomForm.winningAmount}
              onChange={(e) => setCreateColorRoomForm({...createColorRoomForm, winningAmount: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Players</label>
            <input
              type="number"
              value={createColorRoomForm.maxPlayers}
              onChange={(e) => setCreateColorRoomForm({...createColorRoomForm, maxPlayers: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowCreateColorRoomModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateColorRoom}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              Create Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const GameRoomsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Game Rooms</h2>
          <div className="flex gap-2">
            <button
              onClick={fetchColorGameRooms}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-60"
              disabled={isLoading.colorRooms}
            >
              <Loader2 className={`h-5 w-5 mr-2 ${isLoading.colorRooms ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            {/* <button
              onClick={() => setShowCreateColorRoomModal(true)}
              className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Room
            </button> */}
          </div>
        </div>
        {isLoading.colorRooms ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorGameRooms.map((room) => (
              <div key={room.id} className="border rounded-lg p-4 bg-gray-50 hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{room.roomId}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      room.status === 'waiting' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Entry Fee</p>
                    <p className="font-semibold">₹{room.entryFee}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{room.currentPlayers}/{room.maxPlayers} Players</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                    <span>Win ₹{room.winningAmount}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowColorRoomsModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const CreateNumberRoomModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create New Number Game Room</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Entry Fee</label>
            <input
              type="number"
              value={createNumberRoomForm.entryFee}
              onChange={(e) => setCreateNumberRoomForm({...createNumberRoomForm, entryFee: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Winning Multiplier</label>
            <input
              type="number"
              step="0.1"
              value={createNumberRoomForm.winningMultiplier}
              onChange={(e) => setCreateNumberRoomForm({...createNumberRoomForm, winningMultiplier: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Players</label>
            <input
              type="number"
              value={createNumberRoomForm.maxPlayers}
              onChange={(e) => setCreateNumberRoomForm({...createNumberRoomForm, maxPlayers: Number(e.target.value)})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500"
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowCreateNumberRoomModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateNumberRoom}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              Create Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const Notification = () => (
    <div className={`fixed top-4 right-4 z-50 transform transition-transform duration-300 ${
      notification.show ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className={`rounded-lg p-4 shadow-lg ${
        notification.type === 'success' ? 'bg-green-500' :
        notification.type === 'error' ? 'bg-red-500' :
        'bg-blue-500'
      } text-white`}>
        <div className="flex items-center">
          {notification.type === 'success' && <CheckCircle className="h-5 w-5 mr-2" />}
          {notification.type === 'error' && <XCircle className="h-5 w-5 mr-2" />}
          {notification.type === 'info' && <Info className="h-5 w-5 mr-2" />}
          <p>{notification.message}</p>
        </div>
      </div>
    </div>
  );

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600 mb-2" />
        <p className="text-gray-700">Loading...</p>
      </div>
    </div>
  );

  const NumberGameRoomsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Number Game Rooms</h2>
          <button
            onClick={fetchNumberGameRooms}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-60"
            disabled={isLoading.numberRooms}
          >
            <Loader2 className={`h-5 w-5 mr-2 ${isLoading.numberRooms ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        {isLoading.numberRooms ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {numberGameRooms.map((room) => (
              <div key={room.id} className="border rounded-lg p-4 bg-gray-50 hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{room.roomId}</h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      room.status === 'waiting' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Entry Fee</p>
                    <p className="font-semibold">₹{room.entryFee}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{room.currentPlayers}/{room.maxPlayers} Players</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                    <span>Multiplier: {room.winningMultiplier}x</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fetchRoomDetails(room.roomId)}
                      className="text-sky-600 hover:text-sky-800 transition-colors duration-200"
                      disabled={isLoading.roomDetails}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleCloseNumberRoom(room.roomId)}
                      className="text-amber-600 hover:text-amber-800 transition-colors duration-200"
                      disabled={isLoading.closeRoom}
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNumberRoom(room.roomId)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      disabled={isLoading.deleteRoom}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-sm">
                    <span className="text-green-600 font-medium">Big: {room.bigPlayers}</span>
                    <span className="mx-2 text-gray-400">|</span>
                    <span className="text-blue-600 font-medium">Small: {room.smallPlayers}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowNumberRoomsModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const RoomDetailsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Room Details</h2>
          <button
            onClick={() => setShowRoomDetails(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {roomDetails && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Room Information</h3>
                <div className="space-y-2">
                  <p>Room ID: {roomDetails.gameRoom.roomId}</p>
                  <p>Status: {roomDetails.gameRoom.status}</p>
                  <p>Entry Fee: ₹{roomDetails.gameRoom.entryFee}</p>
                  <p>Winning Multiplier: {roomDetails.gameRoom.winningMultiplier}x</p>
                  <p>Players: {roomDetails.gameRoom.currentPlayers}/{roomDetails.gameRoom.maxPlayers}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Player Distribution</h3>
                <div className="space-y-2">
                  <p>Big Players: {roomDetails.gameRoom.bigPlayers}</p>
                  <p>Small Players: {roomDetails.gameRoom.smallPlayers}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Players List</h3>
              <div className="space-y-2">
                {roomDetails.players.map((player: any) => (
                  <div key={player.id} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{player.user.name}</p>
                        <p className="text-sm text-gray-500">{player.user.email}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${player.numberType === 'big' ? 'text-green-600' : 'text-blue-600'}`}>
                          {player.numberType.toUpperCase()}
                        </p>
                        <p className="text-sm">Entry: ₹{player.entryAmount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <GamepadIcon className="mr-2 h-6 w-6 text-sky-600" />
            My Games
          </h1>
          <p className="text-gray-600 mt-1">Manage your game portfolio and performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${game.gradient} opacity-90`}></div>
            <div className="relative p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <game.icon className="h-8 w-8" />
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    {game.status}
                  </span>
                </div>
                
              <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
              <p className="text-white/80 mb-6">{game.description}</p>
              
              {/* <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/20 p-3 rounded-lg">
                  <div className="flex items-center text-sm mb-1">
                      <Activity className="h-4 w-4 mr-1" />
                    <span>Players</span>
                  </div>
                  <p className="text-xl font-bold">{game.players.toLocaleString()}</p>
                </div> */}
                {/* <div className="bg-white/20 p-3 rounded-lg">
                  <div className="flex items-center text-sm mb-1">
                      <BarChart2 className="h-4 w-4 mr-1" />
                    <span>Revenue</span>
                    </div>
                  <p className="text-xl font-bold">₹{game.revenue.toLocaleString()}</p>
                  </div>
                </div> */}
                
              <div className="flex justify-between">
                {game.name === 'Color Prediction' ? (
                  <>
                    <button 
                      onClick={() => setShowCreateColorRoomModal(true)}
                      className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition duration-200"
                    >
                      Create Game Room
                    </button>
                    <button 
                      onClick={() => setShowColorRoomsModal(true)}
                      className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition duration-200"
                    >
                      View Game Rooms
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setShowCreateNumberRoomModal(true)}
                      className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition duration-200"
                    >
                      Create Game Room
                  </button>
                    <button 
                      onClick={() => setShowNumberRoomsModal(true)}
                      className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition duration-200"
                    >
                      View Game Rooms
                  </button>
                  </>
                )}
                </div>
              </div>
            </div>
          ))}
        </div>

      {showCreateColorRoomModal && <CreateRoomModal />}
      {showCreateNumberRoomModal && <CreateNumberRoomModal />}
      {showColorRoomsModal && <GameRoomsModal />}
      {showNumberRoomsModal && <NumberGameRoomsModal />}
      {showRoomDetails && <RoomDetailsModal />}
      <Notification />
      {(isLoading.createColorRoom || isLoading.createNumberRoom || isLoading.closeRoom || 
        isLoading.deleteRoom || isLoading.updateRoom) && <LoadingOverlay />}
    </div>
  );
};

export default MyGames;