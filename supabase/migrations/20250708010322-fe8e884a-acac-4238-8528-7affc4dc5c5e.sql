
-- Limpar completamente o banco de dados
DROP TABLE IF EXISTS public.social_accounts CASCADE;
DROP TABLE IF EXISTS public.post_analytics CASCADE;
DROP TABLE IF EXISTS public.post_publications CASCADE;
DROP TABLE IF EXISTS public.posts CASCADE;
DROP TABLE IF EXISTS public.content_templates CASCADE;
DROP TABLE IF EXISTS public.organization_members CASCADE;
DROP TABLE IF EXISTS public.organizations CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Remover funções
DROP FUNCTION IF EXISTS public.get_user_organizations(uuid);
DROP FUNCTION IF EXISTS public.get_user_role_in_org(uuid, uuid);
DROP FUNCTION IF EXISTS public.user_can_manage_org(uuid, uuid);
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.set_updated_at();

-- Remover tipos
DROP TYPE IF EXISTS public.user_role;
DROP TYPE IF EXISTS public.organization_plan;
DROP TYPE IF EXISTS public.social_platform;
DROP TYPE IF EXISTS public.post_status;
DROP TYPE IF EXISTS public.content_type;

-- Criar tipos enums para segurança e consistência
CREATE TYPE public.user_role AS ENUM ('owner', 'admin', 'manager', 'editor', 'viewer');
CREATE TYPE public.organization_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE public.social_platform AS ENUM ('instagram', 'linkedin', 'facebook', 'twitter');
CREATE TYPE public.post_status AS ENUM ('draft', 'scheduled', 'published', 'failed');
CREATE TYPE public.content_type AS ENUM ('image', 'video', 'carousel', 'text');

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Tabela de perfis de usuário (segura e otimizada)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC'::TEXT,
    locale TEXT DEFAULT 'pt-BR'::TEXT,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret TEXT,
    backup_codes TEXT[],
    last_login_at TIMESTAMPTZ,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Organizações (multi-tenancy seguro)
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    plan organization_plan DEFAULT 'free'::organization_plan,
    settings JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para organizações
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- 3. Membros da organização (controle de acesso granular)
CREATE TABLE public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role DEFAULT 'viewer'::user_role,
    invited_by UUID REFERENCES public.profiles(id),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- RLS para membros
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- 4. Posts (estrutura otimizada)
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT,
    content TEXT,
    content_type content_type DEFAULT 'text'::content_type,
    media_urls TEXT[],
    hashtags TEXT[],
    status post_status DEFAULT 'draft'::post_status,
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_posts_organization_id ON public.posts(organization_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_scheduled_for ON public.posts(scheduled_for) WHERE scheduled_for IS NOT NULL;

-- RLS para posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 5. Contas de redes sociais (tokens seguros)
CREATE TABLE public.social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    platform social_platform NOT NULL,
    account_id TEXT NOT NULL,
    username TEXT NOT NULL,
    display_name TEXT,
    profile_picture_url TEXT,
    access_token TEXT, -- Será criptografado via vault
    refresh_token TEXT, -- Será criptografado via vault
    expires_at TIMESTAMPTZ,
    connected_by UUID REFERENCES public.profiles(id),
    connected_at TIMESTAMPTZ DEFAULT NOW(),
    last_sync_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(organization_id, platform, account_id)
);

-- RLS para contas sociais
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- 6. Publicações de posts
CREATE TABLE public.post_publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE CASCADE,
    platform_post_id TEXT,
    status post_status DEFAULT 'scheduled'::post_status,
    published_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para publicações
ALTER TABLE public.post_publications ENABLE ROW LEVEL SECURITY;

-- 7. Analytics de posts
CREATE TABLE public.post_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_publication_id UUID REFERENCES public.post_publications(id) ON DELETE CASCADE,
    platform social_platform NOT NULL,
    impressions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    data JSONB DEFAULT '{}'::JSONB
);

-- 8. Templates de conteúdo
CREATE TABLE public.content_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    content_template TEXT NOT NULL,
    category TEXT,
    variables JSONB DEFAULT '[]'::JSONB,
    is_public BOOLEAN DEFAULT FALSE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS para templates
ALTER TABLE public.content_templates ENABLE ROW LEVEL SECURITY;

-- Funções de segurança (Security Definer para evitar recursão RLS)
CREATE OR REPLACE FUNCTION public.get_user_organizations(user_uuid UUID)
RETURNS SETOF UUID
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.get_user_role_in_org(user_uuid UUID, org_uuid UUID)
RETURNS user_role
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
    SELECT role 
    FROM public.organization_members 
    WHERE user_id = user_uuid AND organization_id = org_uuid;
$$;

CREATE OR REPLACE FUNCTION public.user_can_manage_org(user_uuid UUID, org_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.organization_members 
        WHERE user_id = user_uuid 
        AND organization_id = org_uuid 
        AND role IN ('owner', 'admin', 'manager')
    );
$$;

-- Políticas RLS otimizadas para organizações
CREATE POLICY "Users can view their organizations" ON public.organizations
    FOR SELECT USING (id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "Organization owners can update" ON public.organizations
    FOR UPDATE USING (get_user_role_in_org(auth.uid(), id) = 'owner'::user_role);

-- Políticas para membros da organização
CREATE POLICY "Users can view org members" ON public.organization_members
    FOR SELECT USING (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "Users can manage org members" ON public.organization_members
    FOR ALL USING (user_can_manage_org(auth.uid(), organization_id));

-- Políticas para posts
CREATE POLICY "Users can view org posts" ON public.posts
    FOR SELECT USING (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "Users can manage org posts" ON public.posts
    FOR ALL USING (organization_id IN (SELECT get_user_organizations(auth.uid())));

-- Políticas para contas sociais
CREATE POLICY "Users can view org social accounts" ON public.social_accounts
    FOR SELECT USING (organization_id IN (SELECT get_user_organizations(auth.uid())));

CREATE POLICY "Users can manage org social accounts" ON public.social_accounts
    FOR ALL USING (user_can_manage_org(auth.uid(), organization_id));

-- Políticas para publicações
CREATE POLICY "Users can view post publications" ON public.post_publications
    FOR SELECT USING (post_id IN (
        SELECT id FROM public.posts 
        WHERE organization_id IN (SELECT get_user_organizations(auth.uid()))
    ));

CREATE POLICY "Users can manage post publications" ON public.post_publications
    FOR ALL USING (post_id IN (
        SELECT id FROM public.posts 
        WHERE organization_id IN (SELECT get_user_organizations(auth.uid()))
    ));

-- Políticas para analytics
CREATE POLICY "Users can view post analytics" ON public.post_analytics
    FOR SELECT USING (post_publication_id IN (
        SELECT pp.id FROM public.post_publications pp
        JOIN public.posts p ON pp.post_id = p.id
        WHERE p.organization_id IN (SELECT get_user_organizations(auth.uid()))
    ));

-- Políticas para templates
CREATE POLICY "Users can view org templates" ON public.content_templates
    FOR SELECT USING (
        organization_id IN (SELECT get_user_organizations(auth.uid())) 
        OR is_public = TRUE
    );

CREATE POLICY "Users can manage org templates" ON public.content_templates
    FOR ALL USING (organization_id IN (SELECT get_user_organizations(auth.uid())));

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data ->> 'first_name',
        NEW.raw_user_meta_data ->> 'last_name'
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers para updated_at
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_organizations
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_posts
    BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_content_templates
    BEFORE UPDATE ON public.content_templates
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
