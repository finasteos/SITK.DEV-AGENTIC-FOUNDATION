import React, { useState } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  Clock, 
  Circle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, Reorder } from 'motion/react';

type Status = 'todo' | 'in-progress' | 'review' | 'done';

interface Task {
  id: string;
  title: string;
  agent: string;
  status: Status;
  priority: 'low' | 'medium' | 'high';
}

const initialTasks: Task[] = [
  { id: '1', title: 'Optimize Neural Weights', agent: 'ORCHESTRATOR', status: 'in-progress', priority: 'high' },
  { id: '2', title: 'Validate Memory Shards', agent: 'MEMORY KEEPER', status: 'todo', priority: 'medium' },
  { id: '3', title: 'Critique v3.1 Scaffold', agent: 'CRITIC', status: 'review', priority: 'high' },
  { id: '4', title: 'Refactor Sync Logic', agent: 'SYSTEM', status: 'done', priority: 'low' },
];

export const KanbanBoard = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const columns: { id: Status; label: string; icon: any }[] = [
    { id: 'todo', label: 'Backlog', icon: Circle },
    { id: 'in-progress', label: 'Processing', icon: AlertCircle },
    { id: 'review', label: 'Validation', icon: Clock },
    { id: 'done', label: 'Archived', icon: CheckCircle2 },
  ];

  return (
    <div className="h-full p-8 overflow-x-auto flex gap-6 bg-[#050505]">
      {columns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <column.icon className={`w-4 h-4 ${
                column.id === 'todo' ? 'text-[#444]' : 
                column.id === 'in-progress' ? 'text-yellow-500' :
                column.id === 'review' ? 'text-blue-500' : 'text-green-500'
              }`} />
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#666]">{column.label}</h3>
              <span className="bg-[#111] text-[#444] text-[9px] px-1.5 py-0.5 rounded-full font-mono">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </div>
            <button className="p-1 hover:bg-[#111] rounded text-[#444] hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 space-y-3">
            {tasks.filter(t => t.status === column.id).map((task) => (
              <motion.div
                key={task.id}
                layoutId={task.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0a0a0a] border border-[#1a1a1a] p-4 rounded-xl hover:border-[#333] transition-all cursor-grab active:cursor-grabbing group shadow-lg"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase ${
                    task.priority === 'high' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                    'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  }`}>
                    {task.priority}
                  </div>
                  <button className="text-[#333] group-hover:text-[#666] transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                
                <h4 className="text-xs font-medium text-[#ccc] mb-4 leading-relaxed tracking-tight group-hover:text-white transition-colors">
                  {task.title}
                </h4>

                <div className="flex items-center justify-between border-t border-[#1a1a1a] pt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                      <span className="text-[8px] font-bold text-black">{task.agent[0]}</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#555] uppercase tracking-tighter">{task.agent}</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#333]">#T-{task.id.padStart(3, '0')}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
