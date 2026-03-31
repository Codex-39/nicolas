-- 1. Create or Update `login_users` table
CREATE TABLE IF NOT EXISTS public.login_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    photo TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.login_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view all users" ON public.login_users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.login_users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.login_users;

CREATE POLICY "Users can view all users" ON public.login_users FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.login_users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.login_users FOR UPDATE USING (auth.uid() = id);

-- 2. Create `notifications` table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    from_email TEXT,
    title TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Users can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own notifications" ON public.notifications FOR DELETE USING (true);

-- 3. Create `progress` table
CREATE TABLE IF NOT EXISTS public.progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course TEXT NOT NULL,
    chapter TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view all progress" ON public.progress;
DROP POLICY IF EXISTS "Users can modify their own progress" ON public.progress;

CREATE POLICY "Users can view all progress" ON public.progress FOR SELECT USING (true);
CREATE POLICY "Users can modify their own progress" ON public.progress FOR ALL USING (auth.uid() = user_id);

-- 4. Create `friends` table
CREATE TABLE IF NOT EXISTS public.friends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_email TEXT NOT NULL,
    receiver_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view all friends" ON public.friends;
DROP POLICY IF EXISTS "Users can modify friends" ON public.friends;

CREATE POLICY "Users can view all friends" ON public.friends FOR SELECT USING (true);
CREATE POLICY "Users can modify friends" ON public.friends FOR ALL USING (true);

-- 5. Create `groups` table
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_name TEXT NOT NULL,
    group_code TEXT UNIQUE NOT NULL,
    admin_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view all groups" ON public.groups;
DROP POLICY IF EXISTS "Users can modify groups" ON public.groups;

CREATE POLICY "Users can view all groups" ON public.groups FOR SELECT USING (true);
CREATE POLICY "Users can modify groups" ON public.groups FOR ALL USING (true);

-- 6. Create `group_members` table
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view all group_members" ON public.group_members;
DROP POLICY IF EXISTS "Users can modify group_members" ON public.group_members;

CREATE POLICY "Users can view all group_members" ON public.group_members FOR SELECT USING (true);
CREATE POLICY "Users can modify group_members" ON public.group_members FOR ALL USING (true);

-- 7. Create `messages` table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
    sender_email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view all messages" ON public.messages;
DROP POLICY IF EXISTS "Users can modify messages" ON public.messages;

CREATE POLICY "Users can view all messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Users can modify messages" ON public.messages FOR ALL USING (true);

-- 8. Enable Realtime for Messages and Notifications
begin;
  -- remove the supabase_realtime publication
  drop publication if exists supabase_realtime;
  -- re-create the supabase_realtime publication with no tables
  create publication supabase_realtime;
commit;
-- add tables to the publication
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
