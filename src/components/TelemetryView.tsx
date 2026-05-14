import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Wifi, 
  Terminal as TerminalIcon,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

export const TelemetryView = () => {
  const [data, setData] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const fetchTelemetry = async () => {
    try {
      const resp = await fetch('/api/telemetry');
      const json = await resp.json();
      setData(json);
      
      // Add a new log entry
      const events = [
        "Inference cycle complete",
        "Memory shard synced",
        "Synaptic bridge established",
        "Token budget check: OK",
        "Heartbeat detected from ORCHESTRATOR"
      ];
      const newLog = `[${new Date().toLocaleTimeString()}] ${events[Math.floor(Math.random() * events.length)]}`;
      setLogs(prev => [newLog, ...prev.slice(0, 14)]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full p-8 grid grid-cols-1 lg:grid-cols-4 gap-8 bg-[#050505] overflow-auto">
      {/* Metric Cards */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-xl relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-mono text-[#555] uppercase tracking-widest">Token Budget</h3>
            <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
          </div>
          <div className="text-3xl font-bold mb-1 tabular-nums">42.8k</div>
          <div className="text-[10px] font-mono text-yellow-500/50">8.2% INCREASE SINCE LAST CYCLE</div>
          <div className="mt-6 h-1 bg-[#111] rounded-full overflow-hidden">
             <motion.div animate={{ width: '65%' }} className="h-full bg-yellow-500" />
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-xl">
          <h3 className="text-[10px] font-mono text-[#555] uppercase tracking-widest mb-4">Neural Latency</h3>
          <div className="flex items-end gap-2 h-24 mb-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div 
                key={i}
                animate={{ height: `${Math.random() * 100}%` }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.05 }}
                className="flex-1 bg-white/10 rounded-t-sm"
              />
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-mono text-[#444]">
            <span>0ms</span>
            <span>AVG: 124ms</span>
            <span>500ms</span>
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-xl flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#555] uppercase tracking-widest">Spiritual Load</span>
            <Activity className="w-3 h-3 text-red-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-lg font-bold">1.2s</div>
              <div className="text-[8px] font-mono text-[#444]">TTFT</div>
            </div>
            <div>
              <div className="text-lg font-bold">84%</div>
              <div className="text-[8px] font-mono text-[#444]">RECALL</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-8 h-[400px] flex flex-col">
          <h3 className="text-sm font-medium mb-8">Inference Energy Consumption</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#333', fontSize: 8 }} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #222', fontSize: '10px' }}
                />
                <Bar dataKey="tokens" radius={[2, 2, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#fff' : '#222'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-xl">
             <div className="flex items-center gap-3 mb-4">
               <Cpu className="w-4 h-4 text-[#888]" />
               <span className="text-xs font-medium">Memory Allocation</span>
             </div>
             <div className="flex items-center gap-4">
               <div className="text-2xl font-bold">4.2GB</div>
               <div className="flex-1 h-2 bg-[#111] rounded-full overflow-hidden">
                 <div className="h-full bg-white w-3/4" />
               </div>
             </div>
          </div>
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-xl">
             <div className="flex items-center gap-3 mb-4">
               <Wifi className="w-4 h-4 text-[#888]" />
               <span className="text-xs font-medium">Synchronous Nodes</span>
             </div>
             <div className="flex items-center gap-4">
               <div className="text-2xl font-bold">18</div>
               <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-[#222]" />
                 ))}
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Real-time Logs */}
      <div className="lg:col-span-1 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-[#1a1a1a] flex items-center gap-2">
          <TerminalIcon className="w-3 h-3 text-[#555]" />
          <h3 className="text-[10px] font-mono text-[#555] uppercase tracking-widest">Real-time Flux</h3>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-2 font-mono scrollbar-hide">
          <AnimatePresence>
            {logs.map((log, i) => (
              <motion.div 
                key={log + i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[10px] text-[#888] leading-relaxed break-all"
              >
                <span className="text-[#333] mr-2">❯</span>
                {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
