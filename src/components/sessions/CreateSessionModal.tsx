
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CreateSessionModalProps {
  onClose: () => void;
  onSessionCreated: () => void;
}

interface Group {
  id: string;
  name: string;
  emoji: string;
}

const CreateSessionModal: React.FC<CreateSessionModalProps> = ({ onClose, onSessionCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    groupId: '',
    sessionDate: '',
    plannedStartTime: '20:00',
    primaryVenue: '',
    budgetType: 'individual' as 'individual' | 'shared',
    transportType: 'rideshare' as 'designated_driver' | 'rideshare',
    videoVisibility: 'immediate' as 'immediate' | 'recap_only'
  });

  useEffect(() => {
    fetchUserGroups();
  }, [user]);

  const fetchUserGroups = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          id, name, emoji,
          group_members!inner(role)
        `)
        .eq('group_members.user_id', user.id)
        .eq('group_members.status', 'active')
        .order('name');

      if (error) throw error;
      setGroups(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading groups",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.title.trim() || !formData.groupId || !formData.sessionDate) return;

    setLoading(true);
    try {
      // Create session
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert([{
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          host_id: user.id,
          group_id: formData.groupId,
          session_date: formData.sessionDate,
          planned_start_time: formData.plannedStartTime,
          primary_venue: formData.primaryVenue.trim() || null,
          budget_type: formData.budgetType,
          transport_type: formData.transportType,
          video_visibility: formData.videoVisibility,
          status: 'planning'
        }])
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Get all group members to invite
      const { data: members, error: membersError } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', formData.groupId)
        .eq('status', 'active')
        .neq('user_id', user.id); // Exclude the host

      if (membersError) throw membersError;

      // Create invitations for all group members
      if (members && members.length > 0) {
        const invitations = members.map(member => ({
          session_id: session.id,
          user_id: member.user_id,
          status: 'pending' as const
        }));

        const { error: inviteError } = await supabase
          .from('session_invitations')
          .insert(invitations);

        if (inviteError) throw inviteError;
      }

      toast({
        title: "Session Created!",
        description: `${formData.title} has been created and invitations sent to your group.`
      });

      onSessionCreated();
    } catch (error: any) {
      toast({
        title: "Error creating session",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
          <DialogDescription className="text-slate-400">
            Plan your next night out adventure
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Session Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Session Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Saturday Night Out, Birthday Celebration..."
                className="bg-white/10 border-white/20 text-white placeholder-slate-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell your group what to expect..."
                className="bg-white/10 border-white/20 text-white placeholder-slate-400"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="group">Select Group *</Label>
              <Select value={formData.groupId} onValueChange={(value) => handleInputChange('groupId', value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Choose which group to invite" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id} className="text-white">
                      {group.emoji} {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">When & Where</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Session Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.sessionDate}
                  onChange={(e) => handleInputChange('sessionDate', e.target.value)}
                  min={minDate}
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Start Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.plannedStartTime}
                  onChange={(e) => handleInputChange('plannedStartTime', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue">Primary Venue</Label>
              <Input
                id="venue"
                value={formData.primaryVenue}
                onChange={(e) => handleInputChange('primaryVenue', e.target.value)}
                placeholder="Where are you starting the night?"
                className="bg-white/10 border-white/20 text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Session Settings</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Budget Type</Label>
                <Select value={formData.budgetType} onValueChange={(value: 'individual' | 'shared') => handleInputChange('budgetType', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="individual" className="text-white">Individual Budgets</SelectItem>
                    <SelectItem value="shared" className="text-white">Group Shared Budget</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Transportation</Label>
                <Select value={formData.transportType} onValueChange={(value: 'designated_driver' | 'rideshare') => handleInputChange('transportType', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="designated_driver" className="text-white">Designated Driver</SelectItem>
                    <SelectItem value="rideshare" className="text-white">Taxis/Rideshare</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Video Visibility</Label>
                <Select value={formData.videoVisibility} onValueChange={(value: 'immediate' | 'recap_only') => handleInputChange('videoVisibility', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="immediate" className="text-white">Show Videos Immediately</SelectItem>
                    <SelectItem value="recap_only" className="text-white">Morning Recap Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
              disabled={loading || !formData.title.trim() || !formData.groupId || !formData.sessionDate}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              {loading ? "Creating..." : "Create Session"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSessionModal;
