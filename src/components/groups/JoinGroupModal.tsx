
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

interface JoinGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ open, onOpenChange, onSuccess }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim() || !user) return;

    setLoading(true);
    try {
      // First, find the group with this invite code
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('id, name, emoji')
        .eq('invite_code', inviteCode.trim().toUpperCase())
        .single();

      if (groupError || !group) {
        toast({
          title: "Invalid Code",
          description: "The invite code you entered is not valid. Please check and try again.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', group.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        toast({
          title: "Already a Member",
          description: `You're already a member of ${group.emoji} ${group.name}!`,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Add user to the group
      const { error: joinError } = await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'member',
          status: 'active'
        });

      if (joinError) throw joinError;

      toast({
        title: "Welcome to the Group!",
        description: `You've successfully joined ${group.emoji} ${group.name}.`
      });

      setInviteCode('');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error joining group:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to join group. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Join Group</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              type="text"
              placeholder="Enter 8-character code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="bg-white/10 border-white/20 text-white placeholder-slate-400 text-center text-lg font-mono"
              maxLength={8}
              required
            />
            <p className="text-xs text-slate-400 text-center">
              Ask your friend for their group's invite code
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !inviteCode.trim() || inviteCode.length !== 8}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              {loading ? "Joining..." : "Join Group"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupModal;
