import React, { useState, useEffect } from 'react';
import { Beer, Wine, Plus, Minus, Share, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/use-session';

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
  price: number;
  emoji: string;
}

interface DrinkTrackerProps {
  onOpenSetup: () => void;
  drinkPrices: DrinkType[];
}

const DrinkTracker: React.FC<DrinkTrackerProps> = ({ onOpenSetup, drinkPrices }) => {
  const { updateGroupTotal, updateTotalDrinks } = useSession();
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      name: 'Alex',
      avatar: '🎉',
      drinks: { beer: 2, wine: 1, cocktail: 0, shot: 0, mixed_drink: 0 },
      totalSpent: 0
    },
    {
      id: '2',
      name: 'Sam',
      avatar: '🍾',
      drinks: { beer: 1, wine: 0, cocktail: 2, shot: 1, mixed_drink: 0 },
      totalSpent: 0
    }
  ]);

  // Calculate total spent when drink prices change
  useEffect(() => {
    setFriends(prev => prev.map(friend => {
      const totalSpent = Object.entries(friend.drinks).reduce((total, [drinkId, count]) => {
        const drinkType = drinkPrices.find(d => d.id === drinkId);
        return total + (drinkType ? drinkType.price * count : 0);
      }, 0);
      return { ...friend, totalSpent };
    }));
  }, [drinkPrices]);

  // Update session data when friends or drink prices change
  useEffect(() => {
    const totalGroupSpent = friends.reduce((total, friend) => total + friend.totalSpent, 0);
    const totalDrinks = friends.reduce((total, friend) => total + getTotalDrinks(friend), 0);
    
    updateGroupTotal(totalGroupSpent);
    updateTotalDrinks(totalDrinks);
  }, [friends, drinkPrices, updateGroupTotal, updateTotalDrinks]);

  const updateDrinkCount = (friendId: string, drinkType: string, change: number) => {
    setFriends(prev => prev.map(friend => {
      if (friend.id === friendId) {
        const newDrinkCount = Math.max(0, friend.drinks[drinkType] + change);
        const drink = drinkPrices.find(d => d.id === drinkType);
        const priceDifference = change * (drink?.price || 0);
        
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Floating background orbs */}
      <div className="floating-orb w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 top-20 left-10"></div>
      <div className="floating-orb w-96 h-96 bg-gradient-to-r from-pink-400 to-orange-400 bottom-20 right-10"></div>
      <div className="floating-orb w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10 p-6 pb-32 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Drink Tracker</h1>
            <div className="liquid-glass rounded-2xl p-4 mx-auto max-w-sm">
              <p className="text-slate-600 font-medium">Group Total</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${getTotalGroupSpent().toFixed(2)}
              </p>
            </div>
          </div>
          
          <Button
            onClick={onOpenSetup}
            variant="outline"
            className="liquid-glass-button-outline p-3 rounded-2xl"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </div>

        <div className="space-y-6">
          {friends.map((friend) => (
            <div key={friend.id} className="friend-card rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-2xl">
                    {friend.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{friend.name}</h3>
                    <p className="text-slate-600 font-medium">
                      {getTotalDrinks(friend)} drinks • ${friend.totalSpent.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {drinkPrices.map((drinkType) => (
                  <div key={drinkType.id} className="drink-item rounded-2xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{drinkType.emoji}</div>
                        <div>
                          <p className="font-semibold text-slate-800">{drinkType.name}</p>
                          <p className="text-sm text-slate-600 font-medium">${drinkType.price.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateDrinkCount(friend.id, drinkType.id, -1)}
                          className="counter-button decrement w-10 h-10 rounded-xl"
                          disabled={friend.drinks[drinkType.id] === 0}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        
                        <span className="text-2xl font-bold w-8 text-center text-slate-800 animate-bounce-gentle">
                          {friend.drinks[drinkType.id]}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateDrinkCount(friend.id, drinkType.id, 1)}
                          className="counter-button increment w-10 h-10 rounded-xl"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="liquid-glass rounded-3xl p-6 text-center space-y-4">
          <h3 className="text-xl font-bold text-slate-800">Night Summary</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                {friends.reduce((total, friend) => total + getTotalDrinks(friend), 0)}
              </p>
              <p className="text-slate-600 font-medium">Total Drinks</p>
            </div>
            <div>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                ${getTotalGroupSpent().toFixed(2)}
              </p>
              <p className="text-slate-600 font-medium">Total Spent</p>
            </div>
          </div>
          
          <Button className="liquid-glass-button w-full py-4 rounded-2xl">
            <Share className="w-5 h-5 mr-2" />
            Share Night Summary
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DrinkTracker;
