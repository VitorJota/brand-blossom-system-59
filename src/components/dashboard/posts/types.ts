
export interface Post {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'pending_approval';
  generation_type: 'manual' | 'ai_generated';
  scheduled_for: string | null;
  requires_approval: boolean;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
}

export interface PostsCalendarProps {
  platform: 'instagram' | 'linkedin';
}

export type ViewMode = 'list' | 'calendar';
