import React, { useState } from 'react';
import {
  FolderOpen,
  Search,
  FileText,
  FileCode,
  Image as ImageIcon,
  Download,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { LibraryItem } from '../../types';

export const LibraryWorkspace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'document' | 'research' | 'code' | 'image'>('all');

  const SAMPLE_ITEMS: LibraryItem[] = [
    {
      id: 'lib-1',
      title: 'Neural Networks Architecture Dossier.md',
      type: 'research',
      createdAt: 'Today, 11:20 AM',
      size: '14.2 KB',
      summary: 'Synthesis of transformer architectures and AdaL perception layers.',
      isReal: true,
    },
    {
      id: 'lib-2',
      title: 'Sharthi_AI_Launch_Announcement.pdf',
      type: 'document',
      createdAt: 'Yesterday',
      size: '2.4 MB',
      summary: 'Press release and product launch presentation for Sharthi AI.',
      isReal: true,
    },
    {
      id: 'lib-3',
      title: 'adalCompanion.ts (Core Engine)',
      type: 'code',
      createdAt: '2 days ago',
      size: '6.8 KB',
      summary: 'Autonomous sequential execution loop and self-correction algorithm.',
      isReal: true,
    },
    {
      id: 'lib-4',
      title: 'Sharthi_Logo_Brand_Asset.png',
      type: 'image',
      createdAt: '3 days ago',
      size: '175 KB',
      summary: 'Official cyan-purple orbital ribbon brand mark.',
      isReal: true,
    },
  ];

  const filtered = SAMPLE_ITEMS.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getIcon = (type: LibraryItem['type']) => {
    switch (type) {
      case 'research':
      case 'document':
        return <FileText size={18} className="text-cyan-400" />;
      case 'code':
        return <FileCode size={18} className="text-purple-400" />;
      case 'image':
        return <ImageIcon size={18} className="text-pink-400" />;
      default:
        return <FileText size={18} className="text-blue-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full glass-panel rounded-2xl p-5 overflow-y-auto no-scrollbar border border-white/10 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <FolderOpen size={16} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-white">Artifact Library</h2>
            <p className="text-[11px] text-[#BAC7E8]">
              Saved documents, research briefs, media, and code outputs
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex items-center bg-[#151c3d] border border-white/15 rounded-xl px-3 py-1.5 w-60">
          <Search size={14} className="text-[#8D9BBF] mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search artifacts..."
            className="w-full bg-transparent text-[12px] text-white focus:outline-none placeholder:text-[#8D9BBF]"
          />
        </div>
      </div>

      {/* Grid of Artifacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col justify-between min-h-[135px]"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-white/10 border border-white/10">
                  {getIcon(item.type)}
                </div>
                <span className="text-[10px] text-[#8D9BBF] capitalize bg-white/5 px-2 py-0.5 rounded-full">
                  {item.type}
                </span>
              </div>
              <h4 className="text-[13px] font-semibold text-white line-clamp-1">
                {item.title}
              </h4>
              <p className="text-[11px] text-[#BAC7E8] line-clamp-2 mt-1">
                {item.summary}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#8D9BBF]">
              <span>{item.size} • {item.createdAt}</span>
              <button
                onClick={() => alert(`Opening ${item.title}`)}
                className="text-cyan-400 hover:text-white flex items-center gap-1 transition"
              >
                <span>View</span>
                <ExternalLink size={11} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

