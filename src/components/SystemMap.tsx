import React, { useCallback } from 'react';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  applyEdgeChanges, 
  applyNodeChanges,
  Node,
  Edge,
  Position,
  Handle
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Cpu, Brain, ShieldCheck, Database } from 'lucide-react';

const CustomNode = ({ data }: any) => {
  return (
    <div className={`px-5 py-4 shadow-2xl rounded-2xl border-2 bg-black flex flex-col items-center gap-2 group transition-all duration-300 ${
      data.active ? 'border-white shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'border-[#222] grayscale'
    }`}>
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!bg-white !w-1.5 !h-1.5 !border-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-white !w-1.5 !h-1.5 !border-0" />
      
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
        data.active ? 'bg-white text-black' : 'bg-[#111] text-[#444]'
      }`}>
        <data.icon size={24} />
      </div>
      
      <div className="text-center">
        <div className={`text-xs font-bold uppercase tracking-widest ${data.active ? 'text-white' : 'text-[#555]'}`}>
          {data.label}
        </div>
        <div className="text-[9px] font-mono text-[#555] mt-1">
          LOAD: {data.load}%
        </div>
      </div>

      {data.pulse && (
        <div className="absolute inset-0 rounded-2xl border border-white animate-ping opacity-0 group-hover:opacity-10" />
      )}
    </div>
  );
};

const nodeTypes = {
  agent: CustomNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'agent',
    data: { label: 'ORCHESTRATOR', icon: Brain, active: true, load: 82, pulse: true },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    type: 'agent',
    data: { label: 'CRITIC', icon: ShieldCheck, active: true, load: 45 },
    position: { x: 0, y: 150 },
  },
  {
    id: '3',
    type: 'agent',
    data: { label: 'MEMORY KEEPER', icon: Database, active: true, load: 12 },
    position: { x: 500, y: 150 },
  },
  {
    id: '4',
    type: 'agent',
    data: { label: 'CODER-1', icon: Cpu, active: false, load: 0 },
    position: { x: 150, y: 300 },
  },
  {
    id: '5',
    type: 'agent',
    data: { label: 'RESEARCHER', icon: Cpu, active: false, load: 0 },
    position: { x: 350, y: 300 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#555' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#555' } },
  { id: 'e1-4', source: '1', target: '4', style: { stroke: '#222' } },
  { id: 'e1-5', source: '1', target: '5', style: { stroke: '#222' } },
];

export const SystemMap = () => {
  const [nodes, setNodes] = React.useState(initialNodes);
  const [edges, setEdges] = React.useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div className="h-full w-full bg-[#050505]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#1a1a1a" gap={20} />
        <Controls 
          className="bg-black border border-[#222] rounded-lg shadow-xl"
        />
      </ReactFlow>
      
      {/* Legend */}
      <div className="absolute bottom-8 left-8 bg-[#0a0a0a]/80 backdrop-blur-md border border-[#1a1a1a] p-4 rounded-xl z-50">
        <h4 className="text-[10px] font-mono text-[#555] uppercase tracking-widest mb-3">Neural Status</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-xs text-[#aaa]">SYNAPTIC ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#222]" />
            <span className="text-xs text-[#555]">STASIS / COLD STORAGE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
