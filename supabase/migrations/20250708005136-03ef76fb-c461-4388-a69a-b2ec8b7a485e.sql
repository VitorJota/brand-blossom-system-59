
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums for standardized types
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'manager', 'editor', 'viewer');
CREATE TYPE organization_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE post_status AS ENUM ('draft', 'scheduled', 'published', 'failed');
CREATE TYPE social_platform AS ENUM ('instagram', 'linkedin', 'facebook', 'twitter');
CREATE TYPE content_type AS ENUM ('image', 'video', 'carousel', 'text');

-- Organizations table (multi-tenancy)
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan organization_plan DEFAULT 'free',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    locale TEXT DEFAULT 'pt-BR',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization members (user-organization relationship)
CREATE TABLE public.organization_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role DEFAULT 'viewer',
    invited_by UUID REFERENCES public.profiles(id),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Social accounts connected to organizations
CREATE TABLE public.social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    platform social_platform NOT NULL,
    account_id TEXT NOT NULL,
    username TEXT NOT NULL,
    display_name TEXT,
    profile_picture_url TEXT,
    access_token TEXT, -- encrypted
    refresh_token TEXT, -- encrypted
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    connected_by UUID REFERENCES public.profiles(id),
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(organization_id, platform, account_id)
);

-- Posts table
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.profiles(id),
    title TEXT,
    content TEXT,
    content_type content_type DEFAULT 'text',
    media_urls TEXT[],
    hashtags TEXT[],
    status post_status DEFAULT 'draft',
    scheduled_for TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post publications (many-to-many: posts can be published to multiple platforms)
CREATE TABLE public.post_publications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE CASCADE,
    platform_post_id TEXT,
    status post_status DEFAULT 'scheduled',
    published_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, social_account_id)
);

-- Analytics data
CREATE TABLE public.post_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_publication_id UUID REFERENCES public.post_publications(id) ON DELETE CASCADE,
    platform social_platform NOT NULL,
    impressions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data JSONB DEFAULT '{}'
);

-- Content templates
CREATE TABLE public.content_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.profiles(id),
    name TEXT NOT NULL,
    description TEXT,
    content_template TEXT NOT NULL,
    variables JSONB DEFAULT '[]',
    category TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER content_templates_updated_at
    BEFORE UPDATE ON public.content_templates
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Performance indexes
CREATE INDEX idx_organization_members_org_id ON public.organization_members(organization_id);
CREATE INDEX idx_organization_members_user_id ON public.organization_members(user_id);
CREATE INDEX idx_social_accounts_org_id ON public.social_accounts(organization_id);
CREATE INDEX idx_social_accounts_platform ON public.social_accounts(platform);
CREATE INDEX idx_posts_org_id ON public.posts(organization_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_scheduled_for ON public.posts(scheduled_for) WHERE status = 'scheduled';
CREATE INDEX idx_post_publications_post_id ON public.post_publications(post_id);
CREATE INDEX idx_post_publications_status ON public.post_publications(status);
CREATE INDEX idx_post_analytics_publication_id ON public.post_analytics(post_publication_id);
CREATE INDEX idx_content_templates_org_id ON public.content_templates(organization_id);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;

-- Security definer functions for role checking
CREATE OR REPLACE FUNCTION public.get_user_organizations(user_uuid UUID)
RETURNS SETOF UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role_in_org(user_uuid UUID, org_uuid UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT role 
    FROM public.organization_members 
    WHERE user_id = user_uuid AND organization_id = org_uuid;
$$;

CREATE OR REPLACE FUNCTION public.user_can_manage_org(user_uuid UUID, org_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE user_id = user_uuid 
        AND organization_id = org_uuid 
        AND role IN ('owner', 'admin', 'manager')
    );
$$;

-- RLS Policies

-- Profiles: Users can see their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Organizations: Users can see organizations they belong to
CREATE POLICY "Users can view their organizations" ON public.organizations
    FOR SELECT USING (id IN (SELECT public.get_user_organizations(auth.uid())));

CREATE POLICY "Organization owners can update" ON public.organizations
    FOR UPDATE USING (public.get_user_role_in_org(auth.uid(), id) = 'owner');

-- Organization members: Users can see members of their organizations
CREATE POLICY "Users can view org members" ON public.organization_members
    FOR SELECT USING (organization_id IN (SELECT public.get_user_organizations(auth.uid())));

CREATE POLICY "Users can manage org members" ON public.organization_members
    FOR ALL USING (public.user_can_manage_org(auth.uid(), organization_id));

-- Social accounts: Users can manage social accounts of their organizations
CREATE POLICY "Users can view org social accounts" ON public.social_accounts
    FOR SELECT USING (organization_id IN (SELECT public.get_user_organizations(auth.uid())));

CREATE POLICY "Users can manage org social accounts" ON public.social_accounts
    FOR ALL USING (public.user_can_manage_org(auth.uid(), organization_id));

-- Posts: Users can manage posts of their organizations
CREATE POLICY "Users can view org posts" ON public.posts
    FOR SELECT USING (organization_id IN (SELECT public.get_user_organizations(auth.uid())));

CREATE POLICY "Users can manage org posts" ON public.posts
    FOR ALL USING (organization_id IN (SELECT public.get_user_organizations(auth.uid())));

-- Post publications: Users can view publications of their org posts
CREATE POLICY "Users can view post publications" ON public.post_publications
    FOR SELECT USING (
        post_id IN (
            SELECT id FROM public.posts 
            WHERE organization_id IN (SELECT public.get_user_organizations(auth.uid()))
        )
    );

CREATE POLICY "Users can manage post publications" ON public.post_publications
    FOR ALL USING (
        post_id IN (
            SELECT id FROM public.posts 
            WHERE organization_id IN (SELECT public.get_user_organizations(auth.uid()))
        )
    );

-- Analytics: Users can view analytics of their org posts
CREATE POLICY "Users can view post analytics" ON public.post_analytics
    FOR SELECT USING (
        post_publication_id IN (
            SELECT pp.id FROM public.post_publications pp
            JOIN public.posts p ON pp.post_id = p.id
            WHERE p.organization_id IN (SELECT public.get_user_organizations(auth.uid()))
        )
    );

-- Content templates: Users can manage templates of their organizations
CREATE POLICY "Users can view org templates" ON public.content_templates
    FOR SELECT USING (
        organization_id IN (SELECT public.get_user_organizations(auth.uid())) 
        OR is_public = TRUE
    );

CREATE POLICY "Users can manage org templates" ON public.content_templates
    FOR ALL USING (organization_id IN (SELECT public.get_user_organizations(auth.uid())));

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data ->> 'first_name',
        new.raw_user_meta_data ->> 'last_name'
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
