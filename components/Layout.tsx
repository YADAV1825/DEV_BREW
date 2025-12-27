
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Home, MessageSquare, Users, Settings, User as UserIcon, 
  Terminal, Coffee, LogOut, ChevronRight, Hash, Bell
} from 'lucide-react';
import { STATIC_ROOMS } from '../constants';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [roomsExpanded, setRoomsExpanded] = useState(true);

  if (!user) return <>{children}</>;

  const NavItem = ({ to, icon: Icon, label, active }: any) => (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-[#37373d] ${active ? 'bg-[#37373d] text-vs-accent border-l-2 border-vs-accent' : 'text-[#858585]'}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );

  return (
    <div className="flex h-screen w-full bg-vs-bg text-vs-text overflow-hidden font-sans">
      {/* Activity Bar (Slim Left) */}
      <div className="w-12 bg-[#333333] flex flex-col items-center py-4 gap-4 flex-shrink-0 border-r border-vs-border">
        <div className="p-2 text-vs-accent hover:text-white cursor-pointer" onClick={() => navigate('/feed')}>
          <Terminal size={24} />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <NavItem to="/feed" icon={Home} active={location.pathname === '/feed'} />
          <NavItem to="/friends" icon={Users} active={location.pathname === '/friends'} />
          <NavItem to="/notifications" icon={Bell} active={location.pathname === '/notifications'} />
        </div>
        <div className="flex flex-col gap-4 pb-4">
          <div className="p-2 hover:bg-[#37373d] rounded cursor-pointer" onClick={() => navigate(`/profile/${user.username}`)}>
            <UserIcon size={20} />
          </div>
          <div className="p-2 hover:bg-[#37373d] rounded cursor-pointer" onClick={() => navigate('/settings')}>
            <Settings size={20} />
          </div>
          <div className="p-2 hover:bg-[#37373d] rounded cursor-pointer text-red-400" onClick={onLogout}>
            <LogOut size={20} />
          </div>
        </div>
      </div>

      {/* Sidebar (Explorer) */}
      <div className="w-64 bg-vs-sidebar border-r border-vs-border flex flex-col flex-shrink-0">
        <div className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] flex justify-between items-center">
          <span>Explorer</span>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Main Nav Section */}
          <div className="mb-2">
            <NavItem to="/feed" icon={Terminal} label="Feed.js" active={location.pathname === '/feed'} />
            <NavItem to="/friends" icon={Users} label="Friends.json" active={location.pathname === '/friends'} />
          </div>

          {/* Rooms Section */}
          <div className="mb-4">
            <button 
              onClick={() => setRoomsExpanded(!roomsExpanded)}
              className="w-full flex items-center px-2 py-1 hover:bg-[#37373d] text-[12px] font-bold text-[#bbbbbb] transition-colors"
            >
              <ChevronRight size={14} className={`transition-transform ${roomsExpanded ? 'rotate-90' : ''}`} />
              <span className="ml-1 uppercase">Community_Rooms</span>
            </button>
            {roomsExpanded && (
              <div className="mt-1">
                {STATIC_ROOMS.map(room => (
                  <Link 
                    key={room.id}
                    to={`/room/${room.slug}`}
                    className={`flex items-center gap-2 px-6 py-1 text-[13px] hover:bg-[#37373d] transition-colors ${location.pathname === `/room/${room.slug}` ? 'bg-[#37373d] text-vs-accent' : 'text-[#858585]'}`}
                  >
                    <Hash size={14} />
                    <span>{room.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Coffee Corner */}
        <div className="p-4 bg-[#1e1e1e] border-t border-vs-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-coffee-dark border border-coffee-light flex items-center justify-center text-coffee-light font-bold">
            {user.username[0].toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-semibold truncate">{user.username}</div>
            <div className="text-[10px] text-vs-comment">Online: Breathing Code</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Editor Tabs */}
        <div className="h-9 bg-vs-sidebar flex items-center border-b border-vs-border overflow-x-auto no-scrollbar">
          <div className="px-4 h-full flex items-center bg-vs-bg border-t border-vs-accent text-[12px] gap-2 min-w-[120px]">
            <Hash size={12} className="text-vs-accent" />
            <span>current_file.tsx</span>
          </div>
        </div>
        
        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
          {children}
        </main>

        {/* Status Bar */}
        <div className="h-6 bg-vs-accent text-white flex items-center px-3 text-[11px] justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer">
              <Terminal size={12} />
              <span>DevBrew Master</span>
            </div>
            <div className="flex items-center gap-1 hover:bg-white/10 px-2 h-full cursor-pointer">
              <Coffee size={12} />
              <span>Caffeine Level: High</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>UTF-8</span>
            <span>TypeScript JSX</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
