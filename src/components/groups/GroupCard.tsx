
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Crown, Share2, Settings, Calendar, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface GroupCardProps {
  group: Group;
  onGroupUpdated: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, onGroupUpdated }) => {
  const { toast } = useToast();
  const [showInviteCode, setShowInviteCode] = useState(false);

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(group.invite_code);
      toast({
        title: "Invite code copied!",
        description: "Share this code with friends to invite them to the group."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy invite code",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="text-4xl">{group.emoji}</div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-xl font-bold text-white">{group.name}</h3>
                {group.user_role === 'admin' && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    <Crown className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{group.member_count} member{group.member_count !== 1 ? 's' : ''}</span>
                </div>
                <span>Created {formatDate(group.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInviteCode(!showInviteCode)}
              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
            {group.user_role === 'admin' && (
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {showInviteCode && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white mb-1">Invite Code</p>
                <p className="text-xs text-slate-400 mb-2">Share this code with friends to invite them</p>
                <code className="text-lg font-mono font-bold text-blue-400 bg-blue-500/20 px-3 py-1 rounded">
                  {group.invite_code}
                </code>
              </div>
              <Button
                onClick={copyInviteCode}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
              >
                Copy Code
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="border-green-500/30 text-green-400 hover:bg-green-500/20"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Create Session
          </Button>
          <span className="text-xs text-slate-500">
            Last activity: {formatDate(group.created_at)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupCard;
