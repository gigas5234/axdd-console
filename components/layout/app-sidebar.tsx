"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  Workflow,
  FlaskConical,
  Boxes,
  ShieldCheck,
  BookText,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  labelKo: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "Workspace",
    items: [
      {
        href: "/",
        label: "Overview",
        labelKo: "현황",
        icon: LayoutDashboard,
      },
      {
        href: "/skills",
        label: "Skill Library",
        labelKo: "스킬 라이브러리",
        icon: Library,
      },
      {
        href: "/work-units",
        label: "Work Units",
        labelKo: "업무 실행 세트",
        icon: Workflow,
      },
    ],
  },
  {
    section: "Operations",
    items: [
      {
        href: "/sandbox",
        label: "Sandbox",
        labelKo: "실행 테스트",
        icon: FlaskConical,
      },
      {
        href: "/assets",
        label: "Asset Repository",
        labelKo: "자산 레포지토리",
        icon: Boxes,
      },
      {
        href: "/governance",
        label: "Governance",
        labelKo: "검증·승인",
        icon: ShieldCheck,
      },
    ],
  },
  {
    section: "Reference",
    items: [
      {
        href: "/docs",
        label: "Docs",
        labelKo: "문서",
        icon: BookText,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 shrink-0 flex-col glass-dark text-white border-r border-black/20 shadow-[2px_0_8px_rgba(0,0,0,0.06)]">
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-white/5">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-cyan flex items-center justify-center shadow-neon-blue">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">
            AXDD SkillOps
          </div>
          <div className="text-[11px] text-ink-300">Console · MVP</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map((section) => (
          <div key={section.section}>
            <div className="nav-section">{section.section}</div>
            {section.items.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("nav-item", active && "nav-item-active")}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="flex flex-col leading-tight">
                    <span>{item.label}</span>
                    <span className="text-[10px] text-ink-400">
                      {item.labelKo}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/5 px-4 py-3 text-[11px] text-ink-400 leading-relaxed">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Local Harness · Mock Run Mode
        </div>
      </div>
    </aside>
  );
}
