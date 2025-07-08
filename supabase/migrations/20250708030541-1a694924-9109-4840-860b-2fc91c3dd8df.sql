
-- Criar função que cria organização automaticamente quando um perfil é criado
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

-- Criar trigger que executa após inserção na tabela profiles
CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.create_user_organization();
