import React, { useState, useEffect } from 'react';
import { 
  Folder, 
  File, 
  ChevronRight, 
  ChevronDown, 
  Search, 
  RefreshCcw,
  BookOpen,
  Edit3,
  Save,
  Terminal
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface FileItem {
  name: string;
  isDirectory: boolean;
  path: string;
}

export const FileExplorer = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async (path: string = '') => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/files?path=${encodeURIComponent(path)}`);
      const data = await resp.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async (file: FileItem) => {
    try {
      const resp = await fetch(`/api/file-content?path=${encodeURIComponent(file.path)}`);
      const data = await resp.json();
      setFileContent(data.content);
      setSelectedFile(file);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const saveContent = async () => {
    if (!selectedFile) return;
    try {
      await fetch('/api/file-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: selectedFile.path, content: fileContent })
      });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath]);

  return (
    <div className="h-full flex overflow-hidden bg-[#050505]">
      {/* Sidebar explorer */}
      <div className="w-80 border-r border-[#1a1a1a] flex flex-col bg-[#0a0a0a]">
        <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between">
          <div className="text-[10px] font-mono text-[#555] uppercase tracking-widest">Navigation</div>
          <button onClick={() => fetchFiles(currentPath)} className="p-1 hover:bg-[#1a1a1a] rounded transition-colors text-[#555] hover:text-white">
            <RefreshCcw className="w-3 h-3" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-2 space-y-0.5">
          {currentPath && (
            <button 
              onClick={() => setCurrentPath(currentPath.split('/').slice(0, -1).join('/'))}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-[#555] hover:bg-[#111] hover:text-white rounded transition-all"
            >
              <ChevronRight className="w-3 h-3 rotate-180" />
              ..
            </button>
          )}
          
          {files.map((file) => (
            <button
              key={file.path}
              onClick={() => file.isDirectory ? setCurrentPath(file.path) : fetchContent(file)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded transition-all group ${
                selectedFile?.path === file.path 
                  ? 'bg-white text-black' 
                  : 'text-[#888] hover:bg-[#111] hover:text-[#eee]'
              }`}
            >
              {file.isDirectory ? (
                <Folder className={`w-3.5 h-3.5 ${selectedFile?.path === file.path ? 'text-black' : 'text-blue-500'}`} />
              ) : (
                <File className={`w-3.5 h-3.5 ${selectedFile?.path === file.path ? 'text-black' : 'text-[#555]'}`} />
              )}
              <span className="truncate">{file.name}</span>
            </button>
          ))}
          {loading && (
            <div className="flex justify-center p-4">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Main viewer */}
      <div className="flex-1 flex flex-col min-w-0">
        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div 
              key={selectedFile.path}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              <div className="h-12 border-b border-[#1a1a1a] flex items-center justify-between px-6 bg-[#0a0a0a]/50">
                <div className="flex items-center gap-3">
                  <File className="w-4 h-4 text-[#555]" />
                  <span className="text-xs font-mono text-[#aaa]">{selectedFile.path}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-2 px-3 py-1 rounded text-[10px] font-mono transition-all ${
                      isEditing ? 'bg-orange-500 text-white' : 'bg-[#1a1a1a] text-[#888] hover:text-white'
                    }`}
                  >
                    {isEditing ? <BookOpen className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                    {isEditing ? 'VIEW' : 'EDIT'}
                  </button>
                  {isEditing && (
                    <button 
                      onClick={saveContent}
                      className="flex items-center gap-2 px-3 py-1 bg-white text-black rounded text-[10px] font-mono hover:bg-[#eee] transition-all"
                    >
                      <Save className="w-3 h-3" />
                      SAVE
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-auto bg-[#030303] p-8 lg:p-12">
                <div className="max-w-4xl mx-auto h-full">
                  {isEditing ? (
                    <textarea 
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      className="w-full h-full bg-transparent text-[#999] font-mono text-sm resize-none focus:outline-none leading-relaxed"
                      spellCheck={false}
                    />
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none prose-headings:font-bold prose-headings:tracking-tighter prose-code:text-gray-400 prose-code:bg-white/5 prose-code:px-1 prose-code:rounded">
                      <ReactMarkdown>{fileContent}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#222]">
              <Terminal className="w-24 h-24 mb-4 opacity-50" />
              <div className="font-mono text-xs uppercase tracking-widest">Select a sacred file to interface</div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
