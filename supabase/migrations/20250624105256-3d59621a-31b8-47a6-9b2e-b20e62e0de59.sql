
-- Create custom types
CREATE TYPE group_member_role AS ENUM ('admin', 'member');
CREATE TYPE group_member_status AS ENUM ('active', 'inactive');
CREATE TYPE session_status AS ENUM ('planning', 'active', 'completed');
CREATE TYPE budget_type AS ENUM ('individual', 'shared');
CREATE TYPE transport_type AS ENUM ('designated_driver', 'rideshare');
CREATE TYPE video_visibility AS ENUM ('immediate', 'recap_only');
CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'declined');

-- Groups table
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  emoji TEXT DEFAULT '🎉',
  invite_code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  avatar_url TEXT,
  member_count INTEGER DEFAULT 1 NOT NULL
);

-- Group members table
CREATE TABLE public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role group_member_role DEFAULT 'member' NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  nickname TEXT,
  status group_member_status DEFAULT 'active' NOT NULL,
  emergency_contact TEXT,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- User profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Sessions table
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  session_date DATE NOT NULL,
  planned_start_time TIME NOT NULL,
  actual_start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  status session_status DEFAULT 'planning' NOT NULL,
  budget_type budget_type DEFAULT 'individual' NOT NULL,
  transport_type transport_type DEFAULT 'rideshare' NOT NULL,
  video_visibility video_visibility DEFAULT 'immediate' NOT NULL,
  cover_photo_url TEXT,
  primary_venue TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Session invitations table
CREATE TABLE public.session_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status invitation_status DEFAULT 'pending' NOT NULL,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  responded_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(session_id, user_id)
);

-- Session confirmations table
CREATE TABLE public.session_confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  has_eaten BOOLEAN NOT NULL,
  last_meal_hours_ago INTEGER,
  transport_method TEXT NOT NULL,
  personal_budget DECIMAL(10,2),
  emergency_contact TEXT NOT NULL,
  dietary_notes TEXT,
  special_notes TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(session_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_confirmations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for groups
CREATE POLICY "Users can view groups they're members of" ON public.groups FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = id AND user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Users can create groups" ON public.groups FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group admins can update groups" ON public.groups FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = id AND user_id = auth.uid() AND role = 'admin' AND status = 'active'
  )
);

CREATE POLICY "Group admins can delete groups" ON public.groups FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = id AND user_id = auth.uid() AND role = 'admin' AND status = 'active'
  )
);

-- RLS Policies for group_members
CREATE POLICY "Users can view group members for their groups" ON public.group_members FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm 
    WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid() AND gm.status = 'active'
  )
);

CREATE POLICY "Users can join groups (insert themselves)" ON public.group_members FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own membership" ON public.group_members FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Group admins can manage members" ON public.group_members FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm 
    WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid() AND gm.role = 'admin' AND gm.status = 'active'
  )
);

CREATE POLICY "Group admins can remove members" ON public.group_members FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm 
    WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid() AND gm.role = 'admin' AND gm.status = 'active'
  )
);

-- RLS Policies for sessions
CREATE POLICY "Users can view sessions for their groups" ON public.sessions FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = sessions.group_id AND user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Users can create sessions for their groups" ON public.sessions FOR INSERT 
WITH CHECK (
  auth.uid() = host_id AND
  EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE group_id = sessions.group_id AND user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY "Session hosts can update sessions" ON public.sessions FOR UPDATE 
USING (auth.uid() = host_id);

CREATE POLICY "Session hosts can delete sessions" ON public.sessions FOR DELETE 
USING (auth.uid() = host_id);

-- RLS Policies for session_invitations
CREATE POLICY "Users can view their own invitations" ON public.session_invitations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Session hosts can view all invitations for their sessions" ON public.session_invitations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.sessions 
    WHERE id = session_id AND host_id = auth.uid()
  )
);

CREATE POLICY "Session hosts can create invitations" ON public.session_invitations FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.sessions 
    WHERE id = session_id AND host_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own invitation responses" ON public.session_invitations FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for session_confirmations
CREATE POLICY "Users can view confirmations for sessions they're invited to" ON public.session_confirmations FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.session_invitations 
    WHERE session_id = session_confirmations.session_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can create their own confirmations" ON public.session_confirmations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own confirmations" ON public.session_confirmations FOR UPDATE 
USING (auth.uid() = user_id);

-- Functions to generate unique invite codes
CREATE OR REPLACE FUNCTION generate_invite_code() RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate invite codes
CREATE OR REPLACE FUNCTION set_invite_code() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invite_code IS NULL THEN
    LOOP
      NEW.invite_code := generate_invite_code();
      EXIT WHEN NOT EXISTS (SELECT 1 FROM public.groups WHERE invite_code = NEW.invite_code);
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER groups_invite_code_trigger
  BEFORE INSERT ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION set_invite_code();

-- Trigger to update member count
CREATE OR REPLACE FUNCTION update_group_member_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.groups 
    SET member_count = (
      SELECT COUNT(*) FROM public.group_members 
      WHERE group_id = NEW.group_id AND status = 'active'
    )
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.groups 
    SET member_count = (
      SELECT COUNT(*) FROM public.group_members 
      WHERE group_id = NEW.group_id AND status = 'active'
    )
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.groups 
    SET member_count = (
      SELECT COUNT(*) FROM public.group_members 
      WHERE group_id = OLD.group_id AND status = 'active'
    )
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER group_member_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.group_members
  FOR EACH ROW
  EXECUTE FUNCTION update_group_member_count();

-- Trigger to auto-add group creator as admin member
CREATE OR REPLACE FUNCTION add_group_creator_as_member() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.group_members (group_id, user_id, role, status)
  VALUES (NEW.id, NEW.created_by, 'admin', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER add_group_creator_trigger
  AFTER INSERT ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION add_group_creator_as_member();

-- Create indexes for performance
CREATE INDEX idx_groups_invite_code ON public.groups(invite_code);
CREATE INDEX idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX idx_sessions_group_id ON public.sessions(group_id);
CREATE INDEX idx_sessions_host_id ON public.sessions(host_id);
CREATE INDEX idx_session_invitations_session_id ON public.session_invitations(session_id);
CREATE INDEX idx_session_invitations_user_id ON public.session_invitations(user_id);
CREATE INDEX idx_session_confirmations_session_id ON public.session_confirmations(session_id);
