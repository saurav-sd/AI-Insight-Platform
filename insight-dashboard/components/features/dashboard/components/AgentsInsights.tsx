'use client';

import { useEffect, useState } from 'react';
import { fetchAgents } from '@/components/lib/api-client';
import { RefreshCw } from 'lucide-react';

type InsightData = {
  insights: string[];
  trends: string[];
  issues: string[];
  suggestions: string[];
};

export default function AgentsInsights() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const parseIfJSON = (content: any) => {
    if (!content) return content;

    if (typeof content === 'object') return content;

    if (typeof content === 'string') {
      try {
        return JSON.parse(content);
      } catch {
        return null;
      }
    }

    return null;
  };

  const loadAgents = async () => {
    setLoading(true);
    try {
      const res = await fetchAgents();

      setData({
        data_agent: parseIfJSON(res.agents?.data_agent),
        growth_agent: parseIfJSON(res.agents?.growth_agent),
        risk_agent: parseIfJSON(res.agents?.risk_agent),
        final: parseIfJSON(res.final),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  return (
    <div className="flex flex-col h-[900px]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-xs text-gray-400">AI</p>
          <h2 className="text-lg font-semibold">Agents</h2>
        </div>

        <button
          onClick={loadAgents}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {loading && (
          <p className="text-gray-400 text-sm animate-pulse">
            Running agents...
          </p>
        )}

        {!loading && !data && (
          <p className="text-gray-500 text-sm">No agent data available</p>
        )}

        {!loading && data && (
          <>
            {/* 🧠 DATA AGENT */}
            {data.data_agent && (
              <AgentBlock title="🧠 Data Analyst" data={data.data_agent} />
            )}

            {/* 📈 GROWTH */}
            {data.growth_agent && (
              <AgentBlock
                title="📈 Growth Strategist"
                data={data.growth_agent}
              />
            )}

            {/* ⚠️ RISK */}
            {data.risk_agent && (
              <AgentBlock title="⚠️ Risk Analyst" data={data.risk_agent} />
            )}

            {/* 🌟 FINAL SUMMARY */}
            {data.final && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-white/10">
                <Section title="Final Summary" items={data.final.insights} />
                <Section title="Trends" items={data.final.trends} />
                <Section title="Issues" items={data.final.issues} />
                <Section title="Suggestions" items={data.final.suggestions} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AgentBlock({ title, data }: any) {
  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
      <h3 className="text-sm font-semibold text-indigo-400">{title}</h3>

      <Section title="Insights" items={data.insights} />
      <Section title="Trends" items={data.trends} />
      <Section title="Issues" items={data.issues} />
      <Section title="Suggestions" items={data.suggestions} />
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
      <h3 className="text-xs font-semibold text-indigo-400 mb-1">{title}</h3>

      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="text-xs text-gray-300 flex gap-2">
            <span className="text-indigo-400">•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}