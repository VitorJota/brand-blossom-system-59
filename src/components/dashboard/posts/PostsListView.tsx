
import { Calendar } from "lucide-react";
import { Post } from './types';
import { PostCard } from './PostCard';
import { formatDate } from './utils';

interface PostsListViewProps {
  groupedPosts: { date: Date; posts: Post[] }[];
}

export const PostsListView = ({ groupedPosts }: PostsListViewProps) => {
  if (groupedPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Nenhum post agendado para este mês</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groupedPosts.map(({ date, posts }) => (
        <div key={date.toDateString()} className="border-l-4 border-blue-500 pl-6 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
              {date.getDate()}
            </div>
            <div>
              <h3 className="font-semibold text-lg capitalize">{formatDate(date)}</h3>
              <p className="text-sm text-gray-500">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
