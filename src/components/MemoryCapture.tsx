
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
      case 'photo': return 'border-l-cyan-400';
      case 'quote': return 'border-l-pink-400';
      case 'location': return 'border-l-purple-400';
      default: return 'border-l-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Floating background orbs */}
      <div className="floating-orb w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 top-20 left-10"></div>
      <div className="floating-orb w-96 h-96 bg-gradient-to-r from-pink-400 to-orange-400 bottom-20 right-10"></div>
      <div className="floating-orb w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-400 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10 p-6 pb-32 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-800">Night Memories</h1>
          <p className="text-slate-600">Capture the epic moments 📸</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="liquid-glass-button-outline p-6 h-auto flex-col space-y-2 rounded-2xl">
            <GalleryHorizontal className="w-8 h-8 text-cyan-500" />
            <span className="text-sm font-semibold">Take Photo</span>
          </Button>
          
          <Button className="liquid-glass-button-outline p-6 h-auto flex-col space-y-2 rounded-2xl">
            <MapPin className="w-8 h-8 text-pink-500" />
            <span className="text-sm font-semibold">Check In</span>
          </Button>
        </div>

        {/* Add Quote */}
        <div className="liquid-glass rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center">
            <Mic className="w-5 h-5 mr-2 text-pink-500" />
            Quote of the Night
          </h3>
          <Textarea
            placeholder="What hilarious thing just happened? 😂"
            value={newQuote}
            onChange={(e) => setNewQuote(e.target.value)}
            className="liquid-glass-input resize-none text-slate-800 placeholder-slate-500 rounded-xl"
            rows={3}
          />
          <Button 
            onClick={addQuote}
            className="liquid-glass-button w-full py-3 rounded-xl"
            disabled={!newQuote.trim()}
          >
            Save Memory
          </Button>
        </div>

        {/* Memories Timeline */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Tonight's Timeline</h3>
          
          {memories.map((memory) => (
            <div key={memory.id} className={`liquid-glass rounded-2xl p-4 border-l-4 ${getMemoryColor(memory.type)}`}>
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getMemoryIcon(memory.type)}</div>
                <div className="flex-1">
                  <p className="text-slate-800 font-medium">{memory.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-slate-600">{memory.timestamp}</p>
                    {memory.location && (
                      <p className="text-sm text-cyan-600 font-medium">{memory.location}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Night Stats */}
        <div className="liquid-glass rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">Night Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-cyan-600">3</p>
              <p className="text-sm text-slate-600">Venues</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-600">12</p>
              <p className="text-sm text-slate-600">Photos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">5</p>
              <p className="text-sm text-slate-600">Quotes</p>
            </div>
          </div>
        </div>

        {/* Share Night */}
        <Button className="liquid-glass-button w-full py-4 rounded-2xl">
          <Share className="w-5 h-5 mr-2" />
          Share Night Story
        </Button>
      </div>
    </div>
  );
};

export default MemoryCapture;
