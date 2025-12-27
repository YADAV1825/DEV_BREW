
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Heart, Share2, Tag, Terminal } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onLike?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-[#252526] border border-vs-border rounded-lg overflow-hidden mb-6 matrix-text shadow-xl group">
      {/* Header */}
      <div className="bg-[#2d2d2d] px-4 py-2 border-b border-vs-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-vs-keyword" />
          <Link to={`/profile/${post.author_username}`} className="text-sm font-mono text-vs-function hover:underline">
            {post.author_username}
          </Link>
          <span className="text-[10px] text-[#858585]">
            {new Date(post.created_at).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 font-mono text-sm leading-relaxed">
        <pre className="whitespace-pre-wrap break-words text-vs-text">
          {post.content}
        </pre>
        
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-[11px] text-vs-keyword bg-[#1e1e1e] px-2 py-0.5 rounded border border-vs-border">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="px-4 py-2 border-t border-vs-border flex items-center gap-6 bg-[#2d2d2d]">
        <button className="flex items-center gap-1.5 text-[#858585] hover:text-red-400 transition-colors">
          <Heart size={16} />
          <span className="text-xs">0</span>
        </button>
        <button className="flex items-center gap-1.5 text-[#858585] hover:text-vs-accent transition-colors">
          <MessageCircle size={16} />
          <span className="text-xs">0</span>
        </button>
        <button className="flex items-center gap-1.5 text-[#858585] hover:text-vs-string transition-colors">
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default PostCard;
