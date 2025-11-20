import { useRef, useState } from 'react';
import { Send, Upload, Check, X } from 'lucide-react';

const MODELS = [
  { id: 'gpt5', label: 'GPT-5' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'entropy', label: 'Entropy' }
];

export default function Composer({ onSend }) {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);

  function onDrop(e){
    e.preventDefault();
    const items = Array.from(e.dataTransfer.files || []);
    setFiles((prev) => [...prev, ...items]);
  }

  function onPick(e){
    const items = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...items]);
  }

  async function handleSend(){
    if(!text.trim() && files.length===0) return;
    await onSend?.(text, files);
    setText('');
    setFiles([]);
    inputRef.current?.focus();
  }

  return (
    <div onDragOver={(e)=>e.preventDefault()} onDrop={onDrop} className="sticky bottom-0 w-full">
      <div className="mx-auto max-w-3xl mb-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-2xl">
          {/* Fixed model picker */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {MODELS.map(m => (
              <div key={m.id} className="px-3 py-1 rounded-full text-xs bg-[#0a0e2a]/60 border border-blue-400/30 text-blue-200 whitespace-nowrap">
                {m.label}
              </div>
            ))}
          </div>

          {/* File chips */}
          {files.length>0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {files.map((f, i) => (
                <div key={i} className="px-2 py-1 text-[11px] rounded-md bg-white/10 border border-white/20 text-blue-100">
                  {f.name}
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <label className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-blue-100 cursor-pointer hover:bg-white/15 transition" title="Attach files">
              <Upload className="w-4 h-4" />
              <input type="file" multiple onChange={onPick} className="hidden" />
            </label>

            <textarea
              ref={inputRef}
              rows={1}
              value={text}
              onChange={(e)=>setText(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 resize-none bg-transparent outline-none text-white placeholder:text-blue-200/50 p-2 max-h-40 overflow-auto focus:ring-2 focus:ring-blue-500/60 rounded-md"
            />

            <button onClick={handleSend} className="shrink-0 inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#3B7CFF] text-white shadow-[0_0_20px_rgba(59,124,255,0.7)] hover:brightness-110 transition" aria-label="Send">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
