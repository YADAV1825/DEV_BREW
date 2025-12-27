
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/database';
import { User } from '../types';
import { Terminal, Github, Mail, ShieldCheck, Loader2, Info } from 'lucide-react';

interface AuthProps {
  type: 'login' | 'signup';
  onAuthSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ type, onAuthSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (type === 'signup') {
        const existing = await db.getUserByUsername(formData.username);
        if (existing) {
          setError('Username already taken in this segment.');
          setLoading(false);
          return;
        }

        const newUser: User = {
          id: crypto.randomUUID(),
          email: formData.email,
          username: formData.username,
          password: formData.password, // Store password for simulation
          message_privacy: 'all',
          created_at: new Date().toISOString()
        };
        
        await db.createUser(newUser);
        onAuthSuccess(newUser);
      } else {
        // Authenticate against stored data
        const user = await db.getUserByUsername(formData.username);
        
        if (user) {
          // Fix: Checking user's actual password stored in DB during signup
          if (user.password === formData.password) {
            onAuthSuccess(user);
          } else {
            setError('Invalid passphrase. Please verify your credentials.');
          }
        } else {
          setError('User not found in registry. Have you registered your node?');
        }
      }
    } catch (err) {
      setError('An unexpected system error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = (provider: 'google' | 'github') => {
    setError('');
    setSocialLoading(provider);
    
    // Simulate a redirect to the provider in the same window
    // In a real production app, this would be:
    // window.location.href = `https://auth.devbrew.io/${provider}`;
    
    setTimeout(async () => {
      try {
        const mockUsername = `${provider}_user_${Math.floor(Math.random() * 1000)}`;
        const newUser: User = {
          id: crypto.randomUUID(),
          email: `${mockUsername}@${provider}.com`,
          username: mockUsername,
          message_privacy: 'all',
          created_at: new Date().toISOString()
        };
        
        await db.createUser(newUser);
        onAuthSuccess(newUser);
      } catch (err) {
        setError(`${provider} authentication failed.`);
      } finally {
        setSocialLoading(null);
      }
    }, 1200); 
  };

  return (
    <div className="min-h-screen bg-vs-bg flex items-center justify-center p-6 font-mono">
      <div className="max-w-md w-full bg-[#252526] border border-vs-border rounded-xl shadow-2xl p-8 matrix-text relative overflow-hidden">
        {socialLoading && (
          <div className="absolute inset-0 bg-vs-bg/90 z-50 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-vs-accent" size={48} />
            <p className="text-vs-accent animate-pulse uppercase tracking-widest text-sm">Redirecting to {socialLoading}...</p>
          </div>
        )}

        <div className="flex flex-col items-center mb-8">
          <Terminal className="text-vs-accent mb-2" size={32} />
          <h2 className="text-2xl font-bold uppercase tracking-widest">
            {type === 'login' ? 'system_login' : 'create_node'}
          </h2>
          <p className="text-xs text-vs-comment">Secure Socket Layer v3.2</p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded text-xs mb-6 flex items-center gap-2">
            <ShieldCheck size={16} />
            {error}
          </div>
        )}

        <div className="bg-vs-accent/5 border border-vs-accent/20 p-3 rounded text-[10px] mb-6 flex items-start gap-2 text-vs-text">
          <Info size={14} className="text-vs-accent flex-shrink-0" />
          <div>
            <p className="font-bold text-vs-accent uppercase mb-1">Local Debug Credentials</p>
            <p>Admin: <span className="text-vs-keyword">coffee_coder</span></p>
            <p>Key: <span className="text-vs-keyword">password123</span></p>
            <p className="mt-1 text-[9px] text-vs-comment">Note: New accounts you create will use your own password.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-[#858585] uppercase mb-1">Username</label>
            <input 
              required
              className="w-full bg-[#1e1e1e] border border-vs-border rounded p-3 text-sm focus:border-vs-accent outline-none transition-colors"
              placeholder="user_id"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>
          {type === 'signup' && (
            <div>
              <label className="block text-[10px] text-[#858585] uppercase mb-1">Email</label>
              <input 
                required
                type="email"
                className="w-full bg-[#1e1e1e] border border-vs-border rounded p-3 text-sm focus:border-vs-accent outline-none transition-colors"
                placeholder="developer@domain.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] text-[#858585] uppercase mb-1">Passphrase</label>
            <input 
              required
              type="password"
              className="w-full bg-[#1e1e1e] border border-vs-border rounded p-3 text-sm focus:border-vs-accent outline-none transition-colors"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            disabled={loading || !!socialLoading}
            className="w-full py-3 bg-vs-accent hover:bg-blue-600 text-white font-bold rounded mt-4 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Execute {type}</span>}
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-3">
          <div className="relative h-px bg-vs-border w-full my-2">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#252526] px-2 text-[10px] text-[#555]">OR CONNECT VIA</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => handleSocialAuth('github')}
              disabled={loading || !!socialLoading}
              className="flex items-center justify-center gap-2 py-2.5 bg-[#333333] hover:bg-[#444444] border border-vs-border rounded text-xs transition-colors disabled:opacity-50"
            >
              <Github size={16} /> GitHub
            </button>
            <button 
              type="button"
              onClick={() => handleSocialAuth('google')}
              disabled={loading || !!socialLoading}
              className="flex items-center justify-center gap-2 py-2.5 bg-[#333333] hover:bg-[#444444] border border-vs-border rounded text-xs transition-colors disabled:opacity-50"
            >
              <Mail size={16} /> Google
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] text-[#858585]">
          {type === 'login' ? "New around here?" : "Already have a node?"} {' '}
          <button 
            onClick={() => navigate(type === 'login' ? '/signup' : '/login')}
            className="text-vs-accent hover:underline"
          >
            {type === 'login' ? 'register.sh' : 'login.exe'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
