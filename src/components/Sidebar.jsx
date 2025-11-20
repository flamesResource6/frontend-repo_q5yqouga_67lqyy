import { Menu, MessageSquare } from 'lucide-react';

export default function Sidebar({ chats = [], activeId, onSelect }) {
  return (
    <div className="h-full w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 text-white hidden md:flex flex-col">
      <div className="p-4 flex items-center gap-3 border-b border-white/10">
        <Menu className="w-5 h-5 text-blue-300" />
        <span className="text-sm text-blue-200/80">History</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect?.(c.id)}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition ${activeId===c.id?'bg-white/10':''}`}
          >
            <MessageSquare className="w-4 h-4 text-blue-300" />
            <span className="truncate text-sm">{c.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
