
import React, { useState } from 'react';
import { Beer, Wine, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  drinks: { [key: string]: number };
  totalSpent: number;
}

interface DrinkType {
  id: string;
  name: string;
  icon: React.ReactNode;
  price: number;
  color: string;
}

const DrinkTracker: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      name: 'Alex',
      avatar: '🎉',
      drinks: { beer: 2, wine: 1, cocktail: 0 },
      totalSpent: 18.50
    },
    {
      id: '2',
      name: 'Sam',
      avatar: '🍾',
      drinks: { beer: 1, wine: 0, cocktail: 2 },
      totalSpent: 22.00
    }
  ]);

  const drinkTypes: DrinkType[] = [
    {
      id: 'beer',
      name: 'Beer',
      icon: <Beer className="drink-icon" />,
      price: 6.50,
      color: 'text-yellow-400'
    },
    {
      id: 'wine',
      name: 'Wine',
      icon: <Wine className="drink-icon" />,
      price: 8.00,
      color: 'text-purple-400'
    },
    {
      id: 'cocktail',
      name: 'Cocktail',
      icon: <div className="drink-icon">🍸</div>,
      price: 12.00,
      color: 'text-pink-400'
    }
  ];

  const updateDrinkCount = (friendId: string, drinkType: string, change: number) => {
    setFriends(prev => prev.map(friend => {
      if (friend.id === friendId) {
        const newDrinkCount = Math.max(0, friend.drinks[drinkType] + change);
        const drinkPrice = drinkTypes.find(d => d.id === drinkType)?.price || 0;
        const priceDifference = change * drinkPrice;
        
        return {
          ...friend,
          drinks: { ...friend.drinks, [drinkType]: newDrinkCount },
          totalSpent: Math.max(0, friend.totalSpent + priceDifference)
        };
      }
      return friend;
    }));
  };

  const getTotalGroupSpent = () => {
    return friends.reduce((total, friend) => total + friend.totalSpent, 0);
  };

  const getTotalDrinks = (friend: Friend) => {
    return Object.values(friend.drinks).reduce((total, count) => total + count, 0);
  };

  return (
    <div className="p-6 pb-32 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold neon-text">Drink Tracker</h1>
        <div className="glass-card p-4 mx-auto max-w-sm">
          <p className="text-lg">Group Total</p>
          <p className="text-3xl font-bold text-nightlife-green">
            ${getTotalGroupSpent().toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {friends.map((friend) => (
          <div key={friend.id} className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{friend.avatar}</div>
                <div>
                  <h3 className="text-xl font-bold text-nightlife-cyan">{friend.name}</h3>
                  <p className="text-sm text-gray-400">
                    {getTotalDrinks(friend)} drinks • ${friend.totalSpent.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {drinkTypes.map((drinkType) => (
                <div key={drinkType.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-3">
                    {drinkType.icon}
                    <div>
                      <p className="font-medium">{drinkType.name}</p>
                      <p className="text-sm text-gray-400">${drinkType.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateDrinkCount(friend.id, drinkType.id, -1)}
                      className="w-10 h-10 rounded-full bg-red-500/20 border-red-500/30 hover:bg-red-500/30"
                      disabled={friend.drinks[drinkType.id] === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    
                    <span className="text-2xl font-bold w-8 text-center animate-counter-bounce">
                      {friend.drinks[drinkType.id]}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateDrinkCount(friend.id, drinkType.id, 1)}
                      className="w-10 h-10 rounded-full bg-nightlife-green/20 border-nightlife-green/30 hover:bg-nightlife-green/30"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 text-center space-y-4">
        <h3 className="text-xl font-bold text-nightlife-pink">Night Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-bold text-nightlife-cyan">
              {friends.reduce((total, friend) => total + getTotalDrinks(friend), 0)}
            </p>
            <p className="text-sm text-gray-400">Total Drinks</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-nightlife-green">
              ${getTotalGroupSpent().toFixed(2)}
            </p>
            <p className="text-sm text-gray-400">Total Spent</p>
          </div>
        </div>
        
        <Button className="btn-neon w-full">
          <Share className="w-4 h-4 mr-2" />
          Share Night Summary
        </Button>
      </div>
    </div>
  );
};

export default DrinkTracker;
