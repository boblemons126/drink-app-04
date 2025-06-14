
import React, { useState } from 'react';
import { Mic, Users, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DrinkingGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');

  const games = [
    {
      id: 'never-have-i-ever',
      name: 'Never Have I Ever',
      description: 'Classic confession game',
      icon: '🤫',
      color: 'bg-nightlife-pink'
    },
    {
      id: 'truth-or-dare',
      name: 'Truth or Dare',
      description: 'Spicy questions & dares',
      icon: '🎯',
      color: 'bg-nightlife-cyan'
    },
    {
      id: 'categories',
      name: 'Categories',
      description: 'Name items in a category',
      icon: '📝',
      color: 'bg-nightlife-purple'
    }
  ];

  const neverHaveIEverQuestions = [
    "Never have I ever... kissed someone on the first date",
    "Never have I ever... sung karaoke in public",
    "Never have I ever... gone skinny dipping",
    "Never have I ever... had a crush on a teacher",
    "Never have I ever... pretended to be sick to skip work",
    "Never have I ever... stalked someone on social media",
    "Never have I ever... been kicked out of a bar",
    "Never have I ever... had a one-night stand"
  ];

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * neverHaveIEverQuestions.length);
    setCurrentQuestion(neverHaveIEverQuestions[randomIndex]);
  };

  const renderGameContent = () => {
    if (selectedGame === 'never-have-i-ever') {
      return (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">🤫</div>
            <h2 className="text-2xl font-bold text-nightlife-pink">Never Have I Ever</h2>
            <p className="text-gray-400">Hold up your fingers, put one down if you've done it!</p>
          </div>

          <div className="glass-card p-6 min-h-[200px] flex items-center justify-center">
            {currentQuestion ? (
              <p className="text-xl text-center font-medium leading-relaxed">
                {currentQuestion}
              </p>
            ) : (
              <p className="text-gray-400 text-center">
                Tap "New Question" to start the game!
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={getRandomQuestion}
              className="btn-neon w-full"
            >
              New Question
            </Button>
            <Button 
              variant="outline"
              onClick={() => setSelectedGame(null)}
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Back to Games
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold neon-text">Drinking Games</h1>
          <p className="text-gray-400">Choose your poison 🎮</p>
        </div>

        <div className="grid gap-4">
          {games.map((game) => (
            <div 
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className="glass-card p-6 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 ${game.color} rounded-2xl flex items-center justify-center text-2xl`}>
                  {game.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{game.name}</h3>
                  <p className="text-gray-400">{game.description}</p>
                </div>
                <div className="text-nightlife-cyan text-2xl">→</div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 text-center space-y-4">
          <h3 className="text-xl font-bold text-nightlife-cyan">Game Rules</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>🍺 Take a sip for minor violations</p>
            <p>🍻 Finish your drink for major ones</p>
            <p>💧 Stay hydrated - drink water between rounds</p>
            <p>🚗 Never drink and drive</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 pb-32 space-y-6">
      {renderGameContent()}
    </div>
  );
};

export default DrinkingGames;
