
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Coffee, Github, Globe } from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-vs-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-12 gap-4">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="text-[10px] font-mono whitespace-nowrap overflow-hidden">
              {Math.random().toString(16).substring(2, 10)} {Math.random() > 0.5 ? 'GET /api/v1/auth' : 'POST /api/v1/post'}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl w-full z-10 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-[#252526] rounded-2xl border-2 border-vs-accent mb-8 shadow-[0_0_20px_rgba(0,122,204,0.3)] matrix-text">
          <Terminal size={48} className="text-vs-accent mr-4" />
          <Coffee size={48} className="text-coffee-light" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold font-mono tracking-tighter mb-4">
          Dev<span className="text-vs-accent">Brew</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-vs-comment font-mono mb-12 max-w-2xl mx-auto leading-relaxed">
          “A coder’s place to connect, share knowledge, ask questions, and caffeinate your brain.”
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-vs-accent hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-vs-accent/50 w-full sm:w-auto text-lg"
          >
            init --session
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-[#333333] hover:bg-[#444444] text-vs-text font-bold rounded-lg transition-all border border-vs-border w-full sm:w-auto text-lg"
          >
            login --user
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-vs-border/50 grid grid-cols-1 md:grid-cols-3 gap-8 text-[#858585] text-sm font-mono">
          <div className="flex flex-col items-center gap-2">
            <Github size={20} />
            <span>Open Source Community</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Globe size={20} />
            <span>20+ Dedicated Stacks</span>
          </div>
          <div className="flex flex-col items-center gap-2 text-vs-comment">
            <Terminal size={20} />
            <span>Made For Developers</span>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-8 text-[10px] text-[#555] font-mono">
        v1.0.4-stable // devbrew_engine --runtime=coffee
      </footer>
    </div>
  );
};

export default Landing;
