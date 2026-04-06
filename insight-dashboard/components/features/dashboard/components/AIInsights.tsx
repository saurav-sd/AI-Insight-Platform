'use client';

import { useEffect, useState } from 'react';
import { fetchInsights } from '@/components/features/dashboard/services/dashboard.api';
import { RefreshCw } from 'lucide-react';

type InsightData = {
  insights: string[];
  trends: string[];
  issues: string[];
  suggestions: string[];
};

export default function AIInsights() {
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const res = await fetchInsights();
      setData(res.insight || null);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  return (
    <div className="flex flex-col h-[900px]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-xs text-gray-400">AI</p>
          <h2 className="text-lg font-semibold">Insights</h2>
        </div>

        <button
          onClick={loadInsights}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {loading && (
          <p className="text-gray-400 text-sm animate-pulse">
            Generating insights...
          </p>
        )}

        {!loading && !data && (
          <p className="text-gray-500 text-sm">No insights available</p>
        )}

        {!loading && data && (
          <>
            <Section title="Insights" items={data.insights} />
            <Section title="Trends" items={data.trends} />
            <Section title="Issues" items={data.issues} />
            <Section title="Suggestions" items={data.suggestions} />
          </>
        )}
      </div>
    </div>
  );
}

/* 🔥 Reusable Section Component */
function Section({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <h3 className="text-sm font-semibold text-indigo-400 mb-2">{title}</h3>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="text-sm text-gray-300 flex gap-2">
            <span className="text-indigo-400">•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
