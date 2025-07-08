
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Post } from './types';
import { getStatusColor, getStatusText, formatTime } from './utils';

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900">{post.title}</h4>
            {post.generation_type === 'ai_generated' && (
              <span className="text-purple-600 text-sm" title="Gerado por IA">🤖</span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(post.status)} text-xs`}>
              {getStatusText(post.status)}
            </Badge>
            {post.scheduled_for && (
              <span className="text-xs text-gray-500">
                {formatTime(post.scheduled_for)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {post.status === 'pending_approval' && (
            <>
              <Button size="sm" variant="outline" className="h-8 px-3">
                <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                Aprovar
              </Button>
              <Button size="sm" variant="outline" className="h-8 px-3">
                <XCircle className="w-4 h-4 mr-1 text-red-600" />
                Rejeitar
              </Button>
            </>
          )}
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            •••
          </Button>
        </div>
      </div>
    </div>
  );
};
