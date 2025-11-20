import { useEffect, useRef } from 'react';

export default function Chat({ messages }) {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
      {messages.map((m, idx) => {
        const isUser = m.role === 'user';
        const isConsensus = m.role === 'consensus';
        return (
          <div key={idx} className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl backdrop-blur-xl border transition shadow-lg ${isConsensus ? 'mx-auto bg-white/10 border-blue-400/30' : isUser ? 'bg-white/10 border-white/20' : 'bg-[#0a0e2a]/40 border-blue-400/20'} p-4 text-white`}
                 role="article" aria-live="polite">
              {isConsensus && (
                <div className="text-xs uppercase tracking-wide text-blue-300/80 mb-2">Final Consensus Answer</div>
              )}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {m.content}
              </div>
              {isConsensus && m.meta?.similarities && (
                <div className="mt-3 text-[11px] text-blue-200/70">
                  Agreement summary: gpt5↔gemini {m.meta.similarities.gpt5_gemini?.toFixed(2)}, gpt5↔entropy {m.meta.similarities.gpt5_entropy?.toFixed(2)}, gemini↔entropy {m.meta.similarities.gemini_entropy?.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
