
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface CreateGroupModalProps {
  onClose: () => void;
  onGroupCreated: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onGroupCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🎉');
  const [loading, setLoading] = useState(false);

  const emojiOptions = ['🎉', '🍻', '🎊', '🥳', '🎪', '🎭', '🍾', '🎸', '🎤', '⭐', '🔥', '💫', '🌟', '🎨', '🎯'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert([{
          name: name.trim(),
          emoji,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Group Created!",
        description: `${emoji} ${name} has been created successfully.`
      });

      onGroupCreated();
    } catch (error: any) {
      toast({
        title: "Error creating group",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription className="text-slate-400">
            Create a new friend group for your night out adventures
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              type="text"
              placeholder="e.g., Weekend Crew, Work Buddies..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-slate-400"
              required
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label>Choose Emoji</Label>
            <div className="grid grid-cols-5 gap-2">
              {emojiOptions.map((emojiOption) => (
                <Button
                  key={emojiOption}
                  type="button"
                  variant={emoji === emojiOption ? "default" : "outline"}
                  className={`text-2xl h-12 ${
                    emoji === emojiOption 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                  onClick={() => setEmoji(emojiOption)}
                >
                  {emojiOption}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !name.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
