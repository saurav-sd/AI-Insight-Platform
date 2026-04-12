'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bot, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Insights', href: '/ai-insights', icon: Bot },
  ];

  return (
    <div className="h-full bg-[#030712] border-r border-white/5 flex flex-col p-4">
      <div className="relative mb-10 w-fit">
        <Link href="/dashboard" className="flex items-center gap-3">
          {/* The Animated Border Wrapper */}
          <div className="relative p-[1.2px] overflow-hidden rounded-2xl w-12 h-12 flex-shrink-0 group">
            {/* Rotating Indigo/Purple Gradient Sweep */}
            <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_120deg,#6366f1_180deg,#a855f7_270deg,transparent_360deg)] animate-rotate-slow opacity-90" />

            {/* Inner Container for the PNG */}
            <div className="relative bg-[#030712] w-full h-full rounded-[14px] flex items-center justify-center overflow-hidden">
              <Image
                src="/logo.png"
                alt="InsightAI Logo"
                width={40}
                height={40}
                className="object-contain p-1.5 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </div>

          {/* Logotype */}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white leading-none">
              Insight<span className="text-indigo-400">AI</span>
            </h1>
            <p className="text-[9px] text-indigo-400/50 uppercase tracking-[0.2em] font-bold mt-1.5">
              Intelligence Platform
            </p>
          </div>
        </Link>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                active
                  ? 'bg-indigo-500/10 text-white border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.05)]'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon
                size={18}
                className={`transition-colors ${active ? 'text-indigo-400' : 'group-hover:text-gray-300'}`}
              />
              <span className="font-medium text-sm">{item.name}</span>

              {active && (
                <div className="ml-auto w-1 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
