
import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { enhancePostContent, getCoffeeFact } from '../services/geminiService';
import { Post, User } from '../types';
import PostCard from '../components/PostCard';
import { Terminal, Send, Coffee, Sparkles, Loader2 } from 'lucide-react';

interface FeedProps {
  user: User;
}

const Feed: React.FC<FeedProps> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [coffeeFact, setCoffeeFact] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeed();
    getCoffeeFact().then(setCoffeeFact);
  }, []);

  const loadFeed = async () => {
    setIsLoading(true);
    const data = await db.getPosts();
    setPosts(data);
    setIsLoading(false);
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    await db.createPost({
      author_id: user.id,
      author_username: user.username,
      content: newPostContent,
      tags: newPostContent.match(/#\w+/g)?.map(t => t.slice(1)) || []
    });
    
    setNewPostContent('');
    loadFeed();
  };

  const handleAIEnhance = async () => {
    if (!newPostContent.trim()) return;
    setIsEnhancing(true);
    const enhanced = await enhancePostContent(newPostContent);
    setNewPostContent(enhanced);
    setIsEnhancing(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Create Post Section */}
      <div className="bg-[#252526] border border-vs-border rounded-lg p-4 mb-8 shadow-xl">
        <div className="flex items-center gap-2 mb-3 text-[11px] font-mono text-vs-comment">
          <Terminal size={14} />
          <span>~/new-post.md</span>
        </div>
        <textarea 
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Share some code or thoughts... Use #tags if you like."
          className="w-full bg-[#1e1e1e] border border-vs-border rounded p-3 font-mono text-sm text-vs-text min-h-[120px] focus:outline-none focus:border-vs-accent transition-colors resize-none"
        />
        <div className="flex justify-between items-center mt-3">
          <div className="flex gap-2">
            <button 
              onClick={handleAIEnhance}
              disabled={isEnhancing || !newPostContent}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#333333] hover:bg-[#444444] rounded text-xs font-mono disabled:opacity-50 transition-colors"
            >
              {isEnhancing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-yellow-400" />}
              <span>Enhance (AI)</span>
            </button>
          </div>
          <button 
            onClick={handleCreatePost}
            className="flex items-center gap-2 px-4 py-1.5 bg-vs-accent hover:bg-blue-600 text-white rounded text-sm font-bold shadow-lg transition-all"
          >
            <Send size={14} />
            <span>Deploy</span>
          </button>
        </div>
      </div>

      {/* Coffee Break Alert */}
      {coffeeFact && (
        <div className="bg-[#1e1e1e] border border-coffee-light/20 rounded-lg p-4 mb-8 flex items-start gap-4 text-sm italic text-coffee-light border-l-4 border-l-coffee-light">
          <Coffee size={20} className="flex-shrink-0" />
          <p>{coffeeFact}</p>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-vs-accent" size={32} />
          </div>
        ) : posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-20 text-[#858585] font-mono">
            <Terminal className="mx-auto mb-4 opacity-20" size={48} />
            <p>No activity detected in local network...</p>
            <p className="text-xs mt-2">await broadcastPost();</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
