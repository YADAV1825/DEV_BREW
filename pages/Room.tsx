
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Hash, Send, Terminal, Loader2, User as UserIcon } from 'lucide-react';
import { STATIC_ROOMS } from '../constants';
import { db } from '../services/database';
import { Message, User } from '../types';

interface RoomProps {
  user: User;
}

const Room: React.FC<RoomProps> = ({ user }) => {
  const { slug } = useParams<{ slug: string }>();
  const room = STATIC_ROOMS.find(r => r.slug === slug);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (room) {
      loadMessages();
      // Polling for demo updates
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [room?.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    if (!room) return;
    const data = await db.getRoomMessages(room.id);
    setMessages(data);
    setIsLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !room) return;

    const msg = input;
    setInput('');
    
    await db.sendMessage({
      room_id: room.id,
      sender_id: user.id,
      sender_username: user.username,
      content: msg
    });
    
    loadMessages();
  };

  if (!room) return <div className="p-10 text-center font-mono">Error: Room 404 Not Found</div>;

  return (
    <div className="flex flex-col h-full bg-vs-bg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-vs-border bg-vs-sidebar flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1e1e1e] rounded border border-vs-border text-vs-accent">
            <Hash size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold">{room.name}</h2>
            <p className="text-xs text-[#858585]">{room.description}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-4"
      >
        {isLoading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin text-vs-accent" /></div>
        ) : messages.length > 0 ? (
          messages.map(msg => (
            <div key={msg.id} className="group flex items-start gap-4 hover:bg-[#2d2d2d]/50 p-2 rounded transition-colors">
              <Link to={`/profile/${msg.sender_username}`}>
                <div className="w-10 h-10 rounded bg-[#333333] border border-vs-border flex items-center justify-center text-vs-keyword">
                  <UserIcon size={20} />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link to={`/profile/${msg.sender_username}`} className="text-sm font-mono text-vs-function hover:underline">
                    {msg.sender_username}
                  </Link>
                  <span className="text-[10px] text-[#555]">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-vs-text break-words font-mono">
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-20 font-mono">
            <Terminal size={48} className="mb-4" />
            <p>Connection established. Standing by for packets.</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-vs-border bg-vs-sidebar">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center gap-3 bg-[#1e1e1e] border border-vs-border rounded-lg p-1 px-3 focus-within:border-vs-accent transition-colors">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Message #${room.name.toLowerCase()}...`}
            className="flex-1 bg-transparent py-3 text-sm font-mono outline-none"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="p-2 text-vs-accent hover:bg-[#333333] rounded transition-colors disabled:opacity-30"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-[10px] text-center mt-2 text-[#555] font-mono uppercase tracking-widest">
          End-to-end encrypted channel // {room.slug}_v2.1
        </p>
      </div>
    </div>
  );
};

export default Room;
