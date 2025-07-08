
-- Buscar o ID do usuário pelo email
DO $$
DECLARE
    user_uuid UUID;
    org_id UUID;
BEGIN
    -- Buscar o ID do usuário
    SELECT id INTO user_uuid 
    FROM public.profiles 
    WHERE email = 'leonardomgomes1995@gmail.com';
    
    -- Se usuário encontrado, criar organização
    IF user_uuid IS NOT NULL THEN
        -- Criar organização
        INSERT INTO public.organizations (name, slug)
        VALUES (
            'Leonardo''s Organization',
            'leonardo-' || SUBSTRING(user_uuid::TEXT, 1, 8)
        )
        RETURNING id INTO org_id;
        
        -- Adicionar usuário como owner
        INSERT INTO public.organization_members (organization_id, user_id, role)
        VALUES (org_id, user_uuid, 'owner');
        
        RAISE NOTICE 'Organização criada com sucesso para o usuário %', 'leonardomgomes1995@gmail.com';
    ELSE
        RAISE NOTICE 'Usuário não encontrado: %', 'leonardomgomes1995@gmail.com';
    END IF;
END $$;
