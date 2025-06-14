import React, { useState } from 'react';
import { Share, GalleryHorizontal, Mic, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Memory {
  id: string;
  type: 'photo' | 'quote' | 'location';
  content: string;
  timestamp: string;
  location?: string;
}

const MemoryCapture: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: '1',
      type: 'quote',
      content: "Alex said: 'I swear I can still do a backflip!' 😂",
      timestamp: '9:15 PM',
      location: 'The Rooftop Lounge'
    },
    {
      id: '2',
      type: 'location',
      content: 'Checked into Electric Nightclub',
      timestamp: '10:30 PM',
      location: 'Electric Nightclub'
    }
  ]);
  
  const [newQuote, setNewQuote] = useState('');

  const addQuote = () => {
    if (newQuote.trim()) {
      const newMemory: Memory = {
        id: Date.now().toString(),
        type: 'quote',
        content: newQuote.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        location: 'Current Location'
      };
      setMemories([newMemory, ...memories]);
      setNewQuote('');
    }
  };

  const getMemoryIcon = (type: string) => {
    switch (type) {
      case 'photo': return '📸';
      case 'quote': return '💬';
      case 'location': return '📍';
      default: return '✨';
    }
  };

  const getMemoryColor = (type: string) => {
    switch (type) {
      case 'photo': return 'border-nightlife-cyan/30';
      case 'quote': return 'border-nightlife-pink/30';
      case 'location': return 'border-nightlife-purple/30';
      default: return 'border-white/20';
    }
  };

  return (
    <div className="p-6 pb-32 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold neon-text">Night Memories</h1>
        <p className="text-gray-400">Capture the epic moments 📸</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button className="glass-card p-6 h-auto flex-col space-y-2 hover:scale-105 transition-all duration-300">
          <GalleryHorizontal className="w-8 h-8 text-nightlife-cyan" />
          <span className="text-sm font-medium">Take Photo</span>
        </Button>
        
        <Button className="glass-card p-6 h-auto flex-col space-y-2 hover:scale-105 transition-all duration-300">
          <MapPin className="w-8 h-8 text-nightlife-pink" />
          <span className="text-sm font-medium">Check In</span>
        </Button>
      </div>

      {/* Add Quote */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-bold text-nightlife-pink flex items-center">
          <Mic className="w-5 h-5 mr-2" />
          Quote of the Night
        </h3>
        <Textarea
          placeholder="What hilarious thing just happened? 😂"
          value={newQuote}
          onChange={(e) => setNewQuote(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder-gray-400 resize-none"
          rows={3}
        />
        <Button 
          onClick={addQuote}
          className="btn-neon w-full"
          disabled={!newQuote.trim()}
        >
          Save Memory
        </Button>
      </div>

      {/* Memories Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-nightlife-cyan">Tonight's Timeline</h3>
        
        {memories.map((memory) => (
          <div key={memory.id} className={`glass-card p-4 border-l-4 ${getMemoryColor(memory.type)}`}>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{getMemoryIcon(memory.type)}</div>
              <div className="flex-1">
                <p className="text-white font-medium">{memory.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-400">{memory.timestamp}</p>
                  {memory.location && (
                    <p className="text-sm text-nightlife-cyan">{memory.location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Night Stats */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-bold text-nightlife-green">Night Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-nightlife-cyan">3</p>
            <p className="text-sm text-gray-400">Venues</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-nightlife-pink">12</p>
            <p className="text-sm text-gray-400">Photos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-nightlife-green">5</p>
            <p className="text-sm text-gray-400">Quotes</p>
          </div>
        </div>
      </div>

      {/* Share Night */}
      <Button className="btn-neon w-full">
        <Share className="w-4 h-4 mr-2" />
        Share Night Story
      </Button>
    </div>
  );
};

export default MemoryCapture;
