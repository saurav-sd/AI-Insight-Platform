'use client';

import { Bell, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  // 🔥 Route आधारित title mapping
  const getPageMeta = () => {
    switch (pathname) {
      case '/dashboard':
        return {
          title: 'Dashboard',
          subtitle: 'Overview of your platform activity',
        };

      case '/ai-insights':
        return {
          title: 'AI Insights',
          subtitle: 'AI-powered business intelligence',
        };

      default:
        return {
          title: 'InsightAI',
          subtitle: 'Turn Data into Decisions',
        };
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <header className="flex items-center justify-between px-6 h-16 border-b border-white/10 bg-white/5 backdrop-blur">
      {/* 🔥 LEFT (Dynamic Title) */}
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>

      {/* 🔥 RIGHT */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-white/10 transition">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
          <User size={16} />
          <span className="text-sm">Sourav</span>
        </div>
      </div>
    </header>
  );
}
