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
  /**
   * Phase 7-G: Sandbox(Export Builder)만 정렬되어 있어서 다른 탭은 일단 숨김.
   * 코드는 보존 — flag만 true 로 바꾸면 다시 노출됨.
   * 페이지 라우트(`/skills`, `/work-units` 등)는 그대로 동작하므로 URL 직접 입력으로 접근 가능.
   */
  hidden?: boolean;
};

const NAV: { section: string; items: NavItem[]; hidden?: boolean }[] = [
  {
    section: "Workspace",
    hidden: true, // Phase 7-G: 전체 섹션 숨김
    items: [
      {
        href: "/",
        label: "Overview",
        labelKo: "현황",
        icon: LayoutDashboard,
        hidden: true,
      },
      {
        href: "/skills",
        label: "Skill Library",
        labelKo: "스킬 라이브러리",
        icon: Library,
        hidden: true,
      },
      {
        href: "/work-units",
        label: "Work Units",
        labelKo: "업무 실행 세트",
        icon: Workflow,
        hidden: true,
      },
    ],
  },
  {
    section: "Operations",
    items: [
      {
        href: "/sandbox",
        label: "Export Builder",
        labelKo: "스킬셋 추출",
        icon: FlaskConical,
      },
      {
        href: "/assets",
        label: "Asset Repository",
        labelKo: "자산 레포지토리",
        icon: Boxes,
        hidden: true,
      },
      {
        href: "/governance",
        label: "Governance",
        labelKo: "검증·승인",
        icon: ShieldCheck,
        hidden: true,
      },
    ],
  },
  {
    section: "Reference",
    hidden: true,
    items: [
      {
        href: "/docs",
        label: "Docs",
        labelKo: "문서",
        icon: BookText,
        hidden: true,
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
        {/*
          Phase 7-G: 보이는 메뉴가 1개뿐이라 섹션 헤더는 표시하지 않음.
          여러 메뉴 다시 살릴 때 (hidden 플래그 풀 때) 섹션 헤더 자동 복귀하도록
          visibleSectionCount > 1 일 때만 헤더 렌더링.
        */}
        {(() => {
          const visibleSections = NAV.filter((s) => !s.hidden)
            .map((s) => ({ ...s, items: s.items.filter((i) => !i.hidden) }))
            .filter((s) => s.items.length > 0);
          const showSectionHeaders = visibleSections.length > 1;

          return visibleSections.map((section) => (
            <div key={section.section}>
              {showSectionHeaders && (
                <div className="nav-section">{section.section}</div>
              )}
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
          ));
        })()}
      </nav>

      <div className="border-t border-white/5 px-4 py-3 text-[11px] text-ink-400 leading-relaxed">
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          AxDD-SKILLS Export Mode
        </div>
      </div>
    </aside>
  );
}
