import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Chat from './components/Chat.jsx';
import Composer from './components/Composer.jsx';
import { Menu, MessageSquare, X } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || '';

export default function App(){
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  async function fetchChats(){
    const r = await fetch(`${API}/api/chats`);
    const j = await r.json();
    setChats(j.chats || []);
    if(!activeId && (j.chats||[]).length){ setActiveId(j.chats[0].id); }
  }

  async function ensureChat(){
    if(activeId) return activeId;
    const r = await fetch(`${API}/api/chats`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    const j = await r.json();
    setActiveId(j.id);
    await fetchChats();
    return j.id;
  }

  async function fetchMessages(id){
    if(!id) return;
    const r = await fetch(`${API}/api/chats/${id}/messages`);
    const j = await r.json();
    setMessages(j.messages || []);
  }

  useEffect(()=>{ fetchChats(); }, []);
  useEffect(()=>{ fetchMessages(activeId); }, [activeId]);

  async function handleSend(text, files){
    const id = await ensureChat();
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: text }]);

    const form = new FormData();
    form.append('text', text);
    for(const f of files){ form.append('files', f); }

    await fetch(`${API}/api/chats/${id}/message`, { method: 'POST', body: form });

    const started = Date.now();
    async function poll(){
      await new Promise(r=>setTimeout(r, 1000));
      await fetchMessages(id);
      const ms = Date.now() - started;
      const hasConsensus = (m=>m.some(x=>x.role==='consensus'))(messages || []);
      if(!hasConsensus && ms < 20000) return poll();
      setLoading(false);
    }
    poll();
  }

  async function handleRegenerate(){
    if(!activeId) return;
    setLoading(true);
    await fetch(`${API}/api/chats/${activeId}/regenerate`, { method: 'POST' });
    await new Promise(r=>setTimeout(r, 1200));
    await fetchMessages(activeId);
    setLoading(false);
  }

  function handleCopy(text){
    navigator.clipboard.writeText(text);
  }

  async function handleNewChat(){
    const r = await fetch(`${API}/api/chats`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    const j = await r.json();
    setActiveId(j.id);
    await fetchChats();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3B7CFF] to-[#04043A] text-white">
      <Header onNewChat={handleNewChat} />

      {/* Mobile history button */}
      <button
        onClick={()=>setShowDrawer(true)}
        className="md:hidden fixed top-3 left-3 z-50 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-xl text-blue-100 shadow hover:bg-white/15 transition"
        aria-label="Open history"
      >
        <Menu className="w-4 h-4" />
        <span className="text-xs">History</span>
      </button>

      {/* Mobile Drawer */}
      {showDrawer && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setShowDrawer(false)} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-[#0a0e2a]/90 backdrop-blur-2xl border-r border-white/10 p-4 flex flex-col animate-in">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-blue-200/80 text-sm"><MessageSquare className="w-4 h-4"/> History</div>
              <button onClick={()=>setShowDrawer(false)} className="p-2 rounded-lg hover:bg-white/10" aria-label="Close history"><X className="w-4 h-4"/></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {(chats||[]).map(c => (
                <button key={c.id} onClick={()=>{ setActiveId(c.id); setShowDrawer(false); }} className={`w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition ${activeId===c.id?'bg-white/10':''}`}>
                  <div className="text-sm">{c.title}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[18rem_1fr]">
          <Sidebar chats={chats} activeId={activeId} onSelect={setActiveId} />
          <div className="flex flex-col h-[calc(100dvh-240px)]">
            <Chat messages={messages} onRegenerate={handleRegenerate} onCopy={handleCopy} />
            <Composer onSend={handleSend} />
          </div>
        </div>
      </div>
    </div>
  );
}
