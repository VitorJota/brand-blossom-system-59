
-- Criar tabela para armazenar contas sociais conectadas
CREATE TABLE IF NOT EXISTS public.social_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'linkedin')),
  account_id TEXT NOT NULL,
  username TEXT NOT NULL,
  display_name TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  profile_picture_url TEXT,
  followers_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform, account_id)
);

-- Habilitar RLS
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança - usuários só podem ver suas próprias contas
CREATE POLICY "Users can view their own social accounts" 
  ON public.social_accounts 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social accounts" 
  ON public.social_accounts 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social accounts" 
  ON public.social_accounts 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own social accounts" 
  ON public.social_accounts 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_social_accounts_updated_at 
  BEFORE UPDATE ON public.social_accounts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
