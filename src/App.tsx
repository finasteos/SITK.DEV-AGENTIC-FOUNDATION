/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Terminal, 
  LayoutDashboard, 
  ClipboardList, 
  Activity,
  Cpu,
  Database,
  Search,
  Settings,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SystemMap } from './components/SystemMap';
import { FileExplorer } from './components/FileExplorer';
import { KanbanBoard } from './components/KanbanBoard';
import { TelemetryView } from './components/TelemetryView';
import { DashboardHome } from './components/DashboardHome';
import { AgentCreator } from './components/AgentCreator';

export type View = 'dashboard' | 'system-map' | 'terminal' | 'kanban' | 'telemetry' | 'creator';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { id: 'dashboard', label: 'Monitor', icon: LayoutDashboard },
    { id: 'system-map', label: 'Neural Mesh', icon: Network },
    { id: 'terminal', label: 'Arkitekt FS', icon: Terminal },
    { id: 'kanban', label: 'Active Flows', icon: ClipboardList },
    { id: 'telemetry', label: 'Telemetry', icon: Activity },
    { id: 'creator', label: 'Laboratory', icon: Cpu },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-[#e0e0e0] font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="border-r border-[#1a1a1a] bg-[#0a0a0a] flex flex-col z-50"
      >
        <div className="p-6 flex items-center gap-3 border-b border-[#1a1a1a]">
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            <Cpu className="w-6 h-6 text-black" />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono font-bold text-lg tracking-tighter"
              >
                ARKITEKT <span className="text-[#555]">v3.1</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as View)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${
                currentView === item.id 
                  ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]' 
                  : 'text-[#888] hover:bg-[#1a1a1a] hover:text-[#fff]'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isSidebarOpen && (
                <span className="font-medium text-sm tracking-tight">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#1a1a1a]">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-md hover:bg-[#1a1a1a] text-[#555] transition-colors"
          >
            <ChevronRight className={`w-5 h-5 transform transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full overflow-hidden bg-[radial-gradient(circle_at_50%_0%,_#111_0%,_#050505_100%)]">
        {/* Top Header */}
        <header className="h-16 border-b border-[#1a1a1a] flex items-center justify-between px-8 bg-[#0a0a0a]/50 backdrop-blur-md z-40">
          <div className="flex items-center gap-6">
            <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#666]">
              {navigation.find(n => n.id === currentView)?.label}
            </h2>
            <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#2a2a2a]">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]" />
              <span className="text-[10px] font-mono text-[#aaa]">SYSTEM NOMINAL</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
              <input 
                type="text" 
                placeholder="Query system..." 
                className="bg-[#111] border border-[#2a2a2a] rounded-md text-[11px] py-1.5 pl-9 pr-4 w-48 focus:w-64 transition-all focus:border-[#444] focus:outline-none placeholder:text-[#333]" 
              />
            </div>
            <button className="p-2 text-[#555] hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {currentView === 'dashboard' && <DashboardHome />}
              {currentView === 'system-map' && <SystemMap />}
              {currentView === 'terminal' && <FileExplorer />}
              {currentView === 'kanban' && <KanbanBoard />}
              {currentView === 'telemetry' && <TelemetryView />}
              {currentView === 'creator' && <AgentCreator />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Status Bar */}
        <footer className="h-8 border-t border-[#1a1a1a] bg-[#0a0a0a] flex items-center justify-between px-6 px-4">
          <div className="flex items-center gap-6 text-[10px] font-mono text-[#444]">
            <div className="flex items-center gap-2 uppercase">
              <Database className="w-3 h-3" />
              <span>ARKITEKT_FS READY</span>
            </div>
            <div className="flex items-center gap-2 uppercase">
              <Monitor className="w-3 h-3" />
              <span>CPU 4.2%</span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-[#444] uppercase">
            UTC-0: {new Date().toISOString().slice(11, 19)}
          </div>
        </footer>
      </main>
    </div>
  );
}

