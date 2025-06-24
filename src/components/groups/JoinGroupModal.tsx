
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface JoinGroupModalProps {
  onClose: () => void;
  onGroupJoined: () => void;
}

const JoinGroupModal: React.FC<JoinGroupModalProps> = ({ onClose, onGroupJoined }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !inviteCode.trim()) return;

    setLoading(true);
    try {
      // First, find the group by invite code
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('invite_code', inviteCode.trim().toUpperCase())
        .single();

      if (groupError) {
        throw new Error('Invalid invite code');
      }

      // Check if user is already a member
      const { data: existingMember } = await supabase
        .from('group_members')
        .select('*')
        .eq('group_id', group.id)
        .eq('user_id', user.id)
        .single();

      if (existingMember) {
        if (existingMember.status === 'active') {
          throw new Error('You are already a member of this group');
        } else {
          // Reactivate membership
          const { error: updateError } = await supabase
            .from('group_members')
            .update({ status: 'active', joined_at: new Date().toISOString() })
            .eq('id', existingMember.id);

          if (updateError) throw updateError;
        }
      } else {
        // Add new member
        const { error: insertError } = await supabase
          .from('group_members')
          .insert([{
            group_id: group.id,
            user_id: user.id,
            role: 'member',
            status: 'active'
          }]);

        if (insertError) throw insertError;
      }

      toast({
        title: "Joined Group!",
        description: `Welcome to ${group.emoji} ${group.name}!`
      });

      onGroupJoined();
    } catch (error: any) {
      toast({
        title: "Error joining group",
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
          <DialogTitle>Join Group</DialogTitle>
          <DialogDescription className="text-slate-400">
            Enter the invite code to join an existing group
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="invite-code">Invite Code</Label>
            <Input
              id="invite-code"
              type="text"
              placeholder="Enter 8-character invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="bg-white/10 border-white/20 text-white placeholder-slate-400 font-mono text-center text-lg"
              required
              maxLength={8}
            />
            <p className="text-xs text-slate-500">
              Ask a group member for the invite code to join their group
            </p>
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
              disabled={loading || inviteCode.length !== 8}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
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
