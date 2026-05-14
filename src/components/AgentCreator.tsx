import React, { useState } from 'react';
import { 
  Plus, 
  Dna, 
  Shield, 
  Terminal, 
  ArrowRight,
  Loader2,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AgentCreator = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [template, setTemplate] = useState('Standard');
  const [isSpawning, setIsSpawning] = useState(false);
  const [success, setSuccess] = useState(false);

  const templates = [
    { id: 'Standard', icon: Zap, desc: 'General purpose task execution' },
    { id: 'Sniper', icon: Target, desc: 'High-precision specific targets' },
    { id: 'Researcher', icon: Sparkles, desc: 'Deep knowledge retrieval' },
    { id: 'Coder', icon: Terminal, desc: 'Architecture and implementation' },
  ];

  const handleSpawn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSpawning(true);
    try {
      const resp = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, template })
      });
      if (resp.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setName('');
          setRole('');
        }, 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSpawning(false);
    }
  };

  return (
    <div className="h-full max-w-4xl mx-auto p-12 overflow-auto">
      <div className="space-y-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter mb-4 text-white">Agent Conception</h1>
          <p className="text-[#888] font-mono text-xs uppercase tracking-widest leading-relaxed max-w-xl">
            Synthesize new neural entities into the SITK.DEV swarm. Define identity, core directives, and select a behavioral template for immediate deployment.
          </p>
        </div>

        <form onSubmit={handleSpawn} className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Inputs Section */}
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-[#555] uppercase tracking-widest ml-1">Identity Designation</label>
              <div className="relative group">
                <Dna className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333] group-focus-within:text-white transition-colors" />
                <input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. NEURO-01" 
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl py-4 pl-12 pr-4 text-sm focus:border-white focus:outline-none transition-all placeholder:text-[#222]" 
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-[#555] uppercase tracking-widest ml-1">Core Recursive Role</label>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333] group-focus-within:text-white transition-colors" />
                <input 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Distributed Security Monitor" 
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl py-4 pl-12 pr-4 text-sm focus:border-white focus:outline-none transition-all placeholder:text-[#222]" 
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSpawning}
              className={`w-full group relative overflow-hidden rounded-xl py-5 font-mono text-xs uppercase tracking-widest transition-all ${
                success ? 'bg-green-500 text-white' : 'bg-white text-black hover:bg-[#eee]'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isSpawning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : success ? (
                  'ENTITY SYNTHESIZED'
                ) : (
                  <>SPAWN RECURSIVE AGENT <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
              </span>
            </button>
          </div>

          {/* Templates Section */}
          <div className="space-y-6">
            <label className="text-[10px] font-mono text-[#555] uppercase tracking-widest ml-1">Behavioral Blueprint</label>
            <div className="space-y-4">
              <select 
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl py-4 px-4 text-sm focus:border-white focus:outline-none appearance-none transition-all cursor-pointer text-white"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#0a0a0a]">
                    {t.id.toUpperCase()} - {t.desc}
                  </option>
                ))}
              </select>
              
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  {React.createElement(templates.find(t => t.id === template)?.icon || Zap, { className: "w-4 h-4 text-white" })}
                  <span className="text-xs font-bold text-white uppercase tracking-tight">{template}</span>
                </div>
                <p className="text-[10px] font-mono text-[#555] leading-relaxed">
                  {templates.find(t => t.id === template)?.desc}
                </p>
              </div>
            </div>
          </div>
        </form>

        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-green-500 font-mono uppercase">Neural Handshake Established</h4>
                <p className="text-[11px] text-green-500/70 mt-1 uppercase tracking-tighter">Sacred files initialized in 05__AGENTS/{name.toUpperCase().replace(/\s+/g, '_')}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
