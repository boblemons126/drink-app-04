
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Plus, UserPlus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import GroupCard from './GroupCard';
import CreateGroupModal from './CreateGroupModal';
import JoinGroupModal from './JoinGroupModal';

interface Group {
  id: string;
  name: string;
  emoji: string;
  member_count: number;
  invite_code: string;
  created_at: string;
}

const GroupsManager: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchGroups = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('group_members')
        .select(`
          groups (
            id,
            name,
            emoji,
            member_count,
            invite_code,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) throw error;

      const userGroups = data
        ?.filter(item => item.groups)
        .map(item => item.groups)
        .filter(Boolean) as Group[];

      setGroups(userGroups || []);
    } catch (error: any) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Error",
        description: "Failed to load groups. Please try again.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGroupSuccess = () => {
    fetchGroups();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Your Groups</h1>
          <p className="text-slate-300">Manage your friend circles and plan epic nights out</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Group
          </Button>
          
          <Button
            onClick={() => setShowJoinModal(true)}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-14"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Join Group
          </Button>
        </div>

        {/* Search */}
        {groups.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              placeholder="Search your groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-slate-400 pl-12"
            />
          </div>
        )}

        {/* Groups List */}
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onGroupUpdated={handleGroupSuccess}
              />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <CardTitle className="text-white mb-2">No Groups Yet</CardTitle>
              <p className="text-slate-300 mb-6">
                Create your first group or join an existing one to get started!
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Group
                </Button>
                <Button
                  onClick={() => setShowJoinModal(true)}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-full"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Join Existing Group
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardContent className="text-center py-12">
              <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <CardTitle className="text-white mb-2">No Groups Found</CardTitle>
              <p className="text-slate-300">
                No groups match your search. Try a different search term.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Modals */}
        <CreateGroupModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          onSuccess={handleGroupSuccess}
        />

        <JoinGroupModal
          open={showJoinModal}
          onOpenChange={setShowJoinModal}
          onSuccess={handleGroupSuccess}
        />
      </div>
    </div>
  );
};

export default GroupsManager;
