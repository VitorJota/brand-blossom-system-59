
-- Adicionar campos para aprovação nos posts
ALTER TABLE public.posts 
ADD COLUMN requires_approval BOOLEAN DEFAULT false,
ADD COLUMN approved_by UUID REFERENCES public.profiles(id),
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN rejection_reason TEXT;

-- Criar enum para tipos de geração de post
CREATE TYPE public.post_generation_type AS ENUM ('manual', 'ai_generated');

-- Adicionar campo para tipo de geração
ALTER TABLE public.posts 
ADD COLUMN generation_type public.post_generation_type DEFAULT 'manual';

-- Criar função para verificar se post precisa de aprovação baseado no papel do usuário
CREATE OR REPLACE FUNCTION public.post_requires_approval(user_id UUID, org_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN get_user_role_in_org(user_id, org_id) IN ('owner', 'admin', 'manager') THEN false
    ELSE true
  END;
$$;

-- Atualizar status enum para incluir 'pending_approval'
ALTER TYPE public.post_status ADD VALUE 'pending_approval';

-- Criar política para aprovação de posts
CREATE POLICY "Users can approve posts if manager or above"
ON public.posts
FOR UPDATE
USING (
  organization_id IN (SELECT get_user_organizations(auth.uid()))
  AND get_user_role_in_org(auth.uid(), organization_id) IN ('owner', 'admin', 'manager')
  AND status = 'pending_approval'
);
