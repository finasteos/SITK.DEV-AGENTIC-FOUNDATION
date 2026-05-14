import React from 'react';
import { 
  Zap, 
  Shield, 
  Users, 
  ArrowUpRight, 
  Clock, 
  Server,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: '00:00', val: 400 },
  { name: '04:00', val: 300 },
  { name: '08:00', val: 600 },
  { name: '12:00', val: 800 },
  { name: '16:00', val: 500 },
  { name: '20:00', val: 900 },
  { name: '24:00', val: 700 },
];

export const DashboardHome = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Spirits', val: '12', icon: Users, color: 'text-blue-500' },
          { label: 'Process Load', val: '42.8%', icon: Zap, color: 'text-yellow-500' },
          { label: 'System Integrity', val: '99.9%', icon: Shield, color: 'text-green-500' },
          { label: 'Uptime', val: '144h', icon: Clock, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 rounded-xl hover:border-[#333] transition-colors group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-current opacity-5 blur-3xl -mr-8 -mt-8 ${stat.color}`} />
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <ArrowUpRight className="w-4 h-4 text-[#333] group-hover:text-[#666] transition-colors" />
            </div>
            <div className="text-2xl font-bold tracking-tight mb-1">{stat.val}</div>
            <div className="text-xs font-mono uppercase tracking-widest text-[#555]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-8 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-medium">Neural Traffic</h3>
              <p className="text-sm text-[#555]">Inference frequency over last 24 hours</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-green-500 bg-green-500/5 px-2 py-1 rounded border border-green-500/20">
              <Activity className="w-3 h-3" />
              LIVE
            </div>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fff" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#444', fontSize: 10 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#444', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="val" 
                  stroke="#fff" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorVal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-8">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl p-6">
            <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-500" />
              Cluster Health
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Mainframe-1', status: 'online', load: 85 },
                { name: 'Logic-Edge-A', status: 'online', load: 42 },
                { name: 'Vault-Storage', status: 'stable', load: 12 },
              ].map((node, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono uppercase">
                    <span className="text-[#888]">{node.name}</span>
                    <span className="text-[#555]">{node.load}%</span>
                  </div>
                  <div className="h-1 bg-[#111] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${node.load}%` }}
                      transition={{ delay: i * 0.2, duration: 1 }}
                      className={`h-full ${node.load > 80 ? 'bg-red-500' : 'bg-white'}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-white/20 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-white opacity-20" />
            <h3 className="text-sm font-medium mb-2">Security Audit</h3>
            <p className="text-xs text-[#888] leading-relaxed mb-4">
              Last integrity check performed 14 minutes ago. No unauthorized access attempts detected in this cycle.
            </p>
            <button className="text-[10px] font-mono text-white underline underline-offset-4 opacity-50 group-hover:opacity-100 transition-opacity">
              VIEW FULL REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
