
import React, { useState } from 'react';
import { Users, Plus, MapPin, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

const GroupManager: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Alex', avatar: '🎉', status: 'online' },
    { id: '2', name: 'Sam', avatar: '🍾', status: 'online' },
    { id: '3', name: 'Jordan', avatar: '🥳', status: 'offline' }
  ]);
  
  const [newFriendName, setNewFriendName] = useState('');
  const [inviteCode] = useState('PARTY2024');

  const avatarEmojis = ['🎉', '🍾', '🥳', '🎊', '🍻', '🎭', '🎪', '🎨', '🎸', '🎤'];

  const addFriend = () => {
    if (newFriendName.trim()) {
      const randomAvatar = avatarEmojis[Math.floor(Math.random() * avatarEmojis.length)];
      const newFriend: Friend = {
        id: Date.now().toString(),
        name: newFriendName.trim(),
        avatar: randomAvatar,
        status: 'online'
      };
      setFriends([...friends, newFriend]);
      setNewFriendName('');
    }
  };

  const removeFriend = (friendId: string) => {
    setFriends(friends.filter(f => f.id !== friendId));
  };

  return (
    <div className="p-6 pb-32 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold neon-text">Squad Manager</h1>
        <p className="text-gray-400">Manage your night out crew</p>
      </div>

      {/* Invite Code */}
      <div className="glass-card p-6 text-center space-y-4">
        <h3 className="text-lg font-bold text-nightlife-cyan">Invite Code</h3>
        <div className="bg-nightlife-purple/30 p-4 rounded-xl">
          <p className="text-3xl font-mono font-bold text-nightlife-pink tracking-wider">
            {inviteCode}
          </p>
        </div>
        <p className="text-sm text-gray-400">
          Share this code with friends to join your group
        </p>
        <Button className="btn-neon w-full">
          <Share className="w-4 h-4 mr-2" />
          Share Invite Code
        </Button>
      </div>

      {/* Add New Friend */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-bold text-nightlife-pink">Add Friend</h3>
        <div className="flex space-x-2">
          <Input
            placeholder="Enter friend's name..."
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && addFriend()}
          />
          <Button onClick={addFriend} className="bg-nightlife-green hover:bg-nightlife-green/80">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Friends List */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-nightlife-cyan">
            Squad ({friends.length})
          </h3>
          <Users className="w-5 h-5 text-nightlife-cyan" />
        </div>

        <div className="space-y-3">
          {friends.map((friend) => (
            <div key={friend.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="text-2xl">{friend.avatar}</div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                    friend.status === 'online' ? 'bg-nightlife-green' : 'bg-gray-500'
                  }`} />
                </div>
                <div>
                  <p className="font-medium text-white">{friend.name}</p>
                  <p className="text-sm text-gray-400 capitalize">{friend.status}</p>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFriend(friend.id)}
                className="text-red-400 border-red-400/30 hover:bg-red-400/20"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Location Check-in */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-bold text-nightlife-pink">Current Location</h3>
        <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl">
          <MapPin className="w-5 h-5 text-nightlife-cyan" />
          <div>
            <p className="font-medium">The Rooftop Lounge</p>
            <p className="text-sm text-gray-400">Downtown • 8:45 PM</p>
          </div>
        </div>
        <Button variant="outline" className="w-full border-nightlife-cyan/30 text-nightlife-cyan hover:bg-nightlife-cyan/20">
          <MapPin className="w-4 h-4 mr-2" />
          Check into New Venue
        </Button>
      </div>

      {/* Safety Section */}
      <div className="glass-card p-6 space-y-4 bg-red-500/10 border-red-500/20">
        <h3 className="text-lg font-bold text-red-400">Safety First</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p>• Always stay with your group</p>
          <p>• Keep emergency contacts handy</p>
          <p>• Arrange safe transportation home</p>
          <p>• Look out for each other</p>
        </div>
        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
          🚨 Quick Emergency Call
        </Button>
      </div>
    </div>
  );
};

export default GroupManager;
