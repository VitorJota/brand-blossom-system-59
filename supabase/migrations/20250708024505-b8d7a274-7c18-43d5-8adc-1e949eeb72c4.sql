
-- Criar tabela para convites de usuários
CREATE TABLE public.user_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role user_role NOT NULL,
    invited_by UUID REFERENCES public.profiles(id),
    token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, email)
);

-- RLS para convites
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- Política para visualizar convites da organização
CREATE POLICY "Users can view org invitations" ON public.user_invitations
    FOR SELECT USING (organization_id IN (SELECT get_user_organizations(auth.uid())));

-- Política para gerenciar convites (apenas owners e admins)
CREATE POLICY "Users can manage org invitations" ON public.user_invitations
    FOR ALL USING (user_can_manage_org(auth.uid(), organization_id));

-- Política para aceitar convites (qualquer usuário autenticado)
CREATE POLICY "Users can accept invitations" ON public.user_invitations
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Atualizar os tipos de role para incluir os novos tipos
-- Primeiro, verificar se já existem os novos tipos
DO $$
BEGIN
    -- Adicionar novos valores ao enum se não existirem
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumtypid = 'user_role'::regtype AND enumlabel = 'social_media') THEN
        ALTER TYPE user_role ADD VALUE 'social_media';
    END IF;
END
$$;

-- Função para criar organização automaticamente quando usuário se cadastra
CREATE OR REPLACE FUNCTION public.create_user_organization()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    org_id UUID;
    user_name TEXT;
BEGIN
    -- Obter nome do usuário ou usar email como fallback
    user_name := COALESCE(
        TRIM(CONCAT(NEW.first_name, ' ', NEW.last_name)),
        SPLIT_PART(NEW.email, '@', 1)
    );
    
    -- Criar organização
    INSERT INTO public.organizations (name, slug)
    VALUES (
        user_name || '''s Organization',
        LOWER(REPLACE(user_name, ' ', '-')) || '-' || SUBSTRING(NEW.id::TEXT, 1, 8)
    )
    RETURNING id INTO org_id;
    
    -- Adicionar usuário como owner da organização
    INSERT INTO public.organization_members (organization_id, user_id, role)
    VALUES (org_id, NEW.id, 'owner');
    
    RETURN NEW;
END;
$$;

-- Trigger para criar organização automaticamente
CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.create_user_organization();

-- Função para aceitar convite
CREATE OR REPLACE FUNCTION public.accept_invitation(invitation_token TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    invitation_record RECORD;
    result JSONB;
BEGIN
    -- Buscar convite válido
    SELECT * INTO invitation_record
    FROM public.user_invitations
    WHERE token = invitation_token
      AND expires_at > NOW()
      AND accepted_at IS NULL;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Convite inválido ou expirado');
    END IF;
    
    -- Verificar se o usuário já é membro da organização
    IF EXISTS (
        SELECT 1 FROM public.organization_members
        WHERE organization_id = invitation_record.organization_id
          AND user_id = auth.uid()
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Você já é membro desta organização');
    END IF;
    
    -- Adicionar usuário à organização
    INSERT INTO public.organization_members (organization_id, user_id, role, invited_by)
    VALUES (
        invitation_record.organization_id,
        auth.uid(),
        invitation_record.role,
        invitation_record.invited_by
    );
    
    -- Marcar convite como aceito
    UPDATE public.user_invitations
    SET accepted_at = NOW()
    WHERE id = invitation_record.id;
    
    RETURN jsonb_build_object('success', true, 'message', 'Convite aceito com sucesso');
END;
$$;
