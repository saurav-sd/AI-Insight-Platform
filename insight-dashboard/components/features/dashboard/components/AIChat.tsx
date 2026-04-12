'use client';

import { useState, useRef, useEffect } from 'react';
import { chatWithAgents } from '@/components/lib/api-client';
import { MessageCircle, X } from 'lucide-react';
import { SendHorizonal } from 'lucide-react';

function parseAIResponse(content: any) {
  if (!content) return content;

  // Already object
  if (typeof content === 'object') return content;

  // Try parsing JSON string
  if (typeof content === 'string') {
    try {
      return JSON.parse(content);
    } catch {
      return content; // normal text
    }
  }

  return content;
}

function PrettyJSON({ data }: any) {
  return (
    <pre className="text-xs bg-black/30 p-2 rounded overflow-x-auto">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function renderMessage(content: any) {
  // Case 1: Normal string
  if (typeof content === 'string') {
    return <span>{content}</span>;
  }

  // Case 2: AI structured response
  if (typeof content === 'object') {
    // Detect known AI structure
    if (
      content.insights ||
      content.trends ||
      content.issues ||
      content.suggestions
    ) {
      return <StructuredResponse data={content} />;
    }

    // Generic object fallback
    return <PrettyJSON data={content} />;
  }

  return <span>{String(content)}</span>;
}

function StructuredResponse({ data }: any) {
  return (
    <div className="space-y-2 text-sm">
      <Section title="📊 Insights" items={data.insights} />
      <Section title="📈 Trends" items={data.trends} />
      <Section title="⚠️ Issues" items={data.issues} />
      <Section title="💡 Suggestions" items={data.suggestions} />
    </div>
  );
}

function Section({ title, items }: any) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <p className="font-semibold text-white">{title}</p>
      <ul className="ml-4 list-disc text-gray-300">
        {items.map((item: string, i: number) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = async (text: string) => {
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await chatWithAgents(text);

      const parsed = parseAIResponse(res.final);

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: parsed || 'Sorry, I had trouble processing that.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:scale-105 transition-all"
      >
        {open ? <X /> : <MessageCircle />}
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-20 right-6 w-[360px] h-[520px] bg-[#0b1220]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col">
          {/* HEADER */}
          <div className="p-4 border-b border-white/10 font-semibold text-white flex items-center gap-2">
            AI Assistant
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl max-w-[75%] text-sm ${
                  m.role === 'user'
                    ? 'ml-auto bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md'
                    : 'bg-white/5 text-gray-300'
                }`}
              >
                {typeof m.content === 'object' ? (
                  <StructuredResponse data={m.content} />
                ) : (
                  <span>{renderMessage(m.content)}</span>
                )}
              </div>
            ))}

            {loading && (
              <p className="text-gray-400 animate-pulse">Thinking...</p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <ChatInput onSend={sendMessage} disabled={loading} />
        </div>
      )}
    </>
  );
}


function ChatInput({ onSend, disabled }: any) {
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="p-3 border-t border-white/10">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-2 backdrop-blur-md">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-400"
          placeholder="Ask AI..."
          onKeyDown={(e) => e.key === 'Enter' && send()}
          disabled={disabled}
        />

        <button
          onClick={send}
          disabled={disabled}
          className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition"
        >
          <SendHorizonal size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}
