
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Clock, Users, MapPin } from 'lucide-react';
import CreateSessionModal from './CreateSessionModal';

interface Session {
  id: string;
  title: string;
  description?: string;
  session_date: string;
  planned_start_time: string;
  status: 'planning' | 'active' | 'completed';
  primary_venue?: string;
  host_id: string;
  groups: {
    name: string;
    emoji: string;
  };
  session_invitations: {
    status: string;
  }[];
}

const SessionsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          groups (name, emoji),
          session_invitations (status)
        `)
        .or(`host_id.eq.${user.id},session_invitations.user_id.eq.${user.id}`)
        .order('session_date', { ascending: true });

      if (error) throw error;

      setSessions(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading sessions",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const handleSessionCreated = () => {
    fetchSessions();
    setShowCreateModal(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filterSessions = (status: string) => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    switch (status) {
      case 'upcoming':
        return sessions.filter(s => s.session_date >= today && s.status !== 'completed');
      case 'active':
        return sessions.filter(s => s.status === 'active');
      case 'past':
        return sessions.filter(s => s.session_date < today || s.status === 'completed');
      default:
        return sessions;
    }
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
          <h1 className="text-3xl font-bold text-white">Sessions</h1>
          <p className="text-slate-400">Organize your night out events</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Session
        </Button>
      </div>

      {/* Sessions Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/5 border-white/10">
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-white/20">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-white/20">
            Active
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-white/20">
            Past
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filterSessions(activeTab).length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <CardTitle className="text-white mb-2">
                  No {activeTab} sessions
                </CardTitle>
                <CardDescription className="text-slate-400 mb-6">
                  {activeTab === 'upcoming' 
                    ? "Create your first session to start planning your night out"
                    : `No ${activeTab} sessions found`
                  }
                </CardDescription>
                {activeTab === 'upcoming' && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Session
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filterSessions(activeTab).map((session) => (
                <Card key={session.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl">{session.groups.emoji}</span>
                          <h3 className="text-xl font-bold text-white">{session.title}</h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(session.status)}`}>
                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                          </span>
                        </div>
                        
                        {session.description && (
                          <p className="text-slate-300 mb-3">{session.description}</p>
                        )}

                        <div className="flex items-center space-x-6 text-sm text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(session.session_date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatTime(session.planned_start_time)}</span>
                          </div>
                          {session.primary_venue && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{session.primary_venue}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{session.session_invitations.length} invited</span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center space-x-2">
                          <span className="text-xs text-slate-500">Group:</span>
                          <span className="text-xs text-slate-300">{session.groups.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-800"
                        >
                          View Details
                        </Button>
                        {session.host_id === user?.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                          >
                            Manage
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Session Modal */}
      {showCreateModal && (
        <CreateSessionModal
          onClose={() => setShowCreateModal(false)}
          onSessionCreated={handleSessionCreated}
        />
      )}
    </div>
  );
};

export default SessionsManager;
