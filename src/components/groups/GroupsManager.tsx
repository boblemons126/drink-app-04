
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Share2 } from 'lucide-react';
import CreateGroupModal from './CreateGroupModal';
import GroupCard from './GroupCard';
import JoinGroupModal from './JoinGroupModal';

interface Group {
  id: string;
  name: string;
  emoji: string;
  invite_code: string;
  member_count: number;
  created_at: string;
  avatar_url?: string;
  user_role?: 'admin' | 'member';
}

const GroupsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const fetchGroups = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner(role)
        `)
        .eq('group_members.user_id', user.id)
        .eq('group_members.status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const groupsWithRole = data?.map(group => ({
        ...group,
        user_role: group.group_members[0]?.role
      })) || [];

      setGroups(groupsWithRole);
    } catch (error: any) {
      toast({
        title: "Error loading groups",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const handleGroupCreated = () => {
    fetchGroups();
    setShowCreateModal(false);
  };

  const handleGroupJoined = () => {
    fetchGroups();
    setShowJoinModal(false);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white/10 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-32 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Groups</h1>
          <p className="text-slate-400">Manage your friend circles</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setShowJoinModal(true)}
            variant="outline"
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Join Group
          </Button>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>
      </div>

      {/* Groups Grid */}
      {groups.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <CardTitle className="text-white mb-2">No Groups Yet</CardTitle>
            <CardDescription className="text-slate-400 mb-6">
              Create your first group or join an existing one to get started
            </CardDescription>
            <div className="flex justify-center space-x-3">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
              <Button
                onClick={() => setShowJoinModal(true)}
                variant="outline"
                className="border-blue-500/30 text-blue-400"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Join Group
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onGroupUpdated={fetchGroups}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateGroupModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleGroupCreated}
        />
      )}

      {showJoinModal && (
        <JoinGroupModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onSuccess={handleGroupJoined}
        />
      )}
    </div>
  );
};

export default GroupsManager;
