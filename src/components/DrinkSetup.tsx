
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Save, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DrinkPrice {
  id: string;
  name: string;
  price: number;
  emoji: string;
}

interface DrinkSetupProps {
  onComplete: (prices: DrinkPrice[]) => void;
  onBack: () => void;
  existingPrices?: DrinkPrice[];
}

const DrinkSetup: React.FC<DrinkSetupProps> = ({ onComplete, onBack, existingPrices }) => {
  const [drinkPrices, setDrinkPrices] = useState<DrinkPrice[]>(
    existingPrices || [
      { id: 'beer', name: 'Beer', price: 6.50, emoji: '🍺' },
      { id: 'wine', name: 'Wine', price: 8.00, emoji: '🍷' },
      { id: 'cocktail', name: 'Cocktail', price: 12.00, emoji: '🍸' },
      { id: 'shot', name: 'Shot', price: 5.00, emoji: '🥃' },
      { id: 'mixed_drink', name: 'Mixed Drink', price: 10.00, emoji: '🍹' }
    ]
  );

  const updatePrice = (id: string, newPrice: string) => {
    const price = parseFloat(newPrice) || 0;
    setDrinkPrices(prev => prev.map(drink => 
      drink.id === id ? { ...drink, price } : drink
    ));
  };

  const handleSave = () => {
    localStorage.setItem('drinkPrices', JSON.stringify(drinkPrices));
    onComplete(drinkPrices);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Liquid glass background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="liquid-glass p-3 rounded-2xl border border-white/20 backdrop-blur-xl"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Drink Menu</h1>
            <p className="text-slate-600 text-sm">Set your venue's prices</p>
          </div>
          
          <Button
            onClick={handleSave}
            className="liquid-glass-button px-6 py-3 rounded-2xl"
          >
            <Save className="w-5 h-5 mr-2" />
            Save
          </Button>
        </div>

        {/* Venue Info Card */}
        <div className="liquid-glass rounded-3xl p-6 mb-6 border border-white/20 backdrop-blur-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Price Setup</h3>
              <p className="text-slate-600 text-sm">Customize for your venue</p>
            </div>
          </div>
        </div>

        {/* Drink Prices */}
        <div className="space-y-4">
          {drinkPrices.map((drink) => (
            <div key={drink.id} className="liquid-glass rounded-2xl p-5 border border-white/20 backdrop-blur-xl">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{drink.emoji}</div>
                <div className="flex-1">
                  <Label className="text-slate-700 font-medium">{drink.name}</Label>
                  <div className="mt-2 relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={drink.price}
                      onChange={(e) => updatePrice(drink.id, e.target.value)}
                      className="pl-8 liquid-glass-input rounded-xl border border-white/30 backdrop-blur-sm text-slate-800 font-medium"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Presets */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Presets</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                const barPrices = [
                  { id: 'beer', name: 'Beer', price: 8.00, emoji: '🍺' },
                  { id: 'wine', name: 'Wine', price: 12.00, emoji: '🍷' },
                  { id: 'cocktail', name: 'Cocktail', price: 15.00, emoji: '🍸' },
                  { id: 'shot', name: 'Shot', price: 7.00, emoji: '🥃' },
                  { id: 'mixed_drink', name: 'Mixed Drink', price: 13.00, emoji: '🍹' }
                ];
                setDrinkPrices(barPrices);
              }}
              className="liquid-glass-button-outline rounded-xl p-4"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">🍻</div>
                <div className="font-medium text-slate-700">Sports Bar</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                const clubPrices = [
                  { id: 'beer', name: 'Beer', price: 12.00, emoji: '🍺' },
                  { id: 'wine', name: 'Wine', price: 16.00, emoji: '🍷' },
                  { id: 'cocktail', name: 'Cocktail', price: 18.00, emoji: '🍸' },
                  { id: 'shot', name: 'Shot', price: 10.00, emoji: '🥃' },
                  { id: 'mixed_drink', name: 'Mixed Drink', price: 20.00, emoji: '🍹' }
                ];
                setDrinkPrices(clubPrices);
              }}
              className="liquid-glass-button-outline rounded-xl p-4"
            >
              <div className="text-center">
                <div className="text-2xl mb-1">🎭</div>
                <div className="font-medium text-slate-700">Nightclub</div>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrinkSetup;
