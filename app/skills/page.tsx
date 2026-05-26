"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Layers,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SkillCard } from "@/components/skills/skill-card";
import { SkillDetailPanel } from "@/components/skills/skill-detail-panel";
import {
  SkillCategoryFilter,
  type SkillFilter,
} from "@/components/skills/skill-category-filter";
import { skills } from "@/lib/data";
import type { Skill, SkillCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function SkillsPage() {
  const [filter, setFilter] = useState<SkillFilter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Skill | null>(null);

  const counts = useMemo(() => {
    const base: Record<SkillFilter, number> = {
      all: skills.length,
      simple: 0,
      reference: 0,
      template: 0,
      script: 0,
      asset: 0,
      fullstep: 0,
      metadata: 0,
      test: 0,
    };
    for (const s of skills) {
      base[s.category as SkillCategory] =
        (base[s.category as SkillCategory] ?? 0) + 1;
    }
    return base;
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((s) => {
      if (filter !== "all" && s.category !== filter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [filter, query]);

  const stats = useMemo(() => {
    const verified = skills.filter((s) => s.status === "verified").length;
    const unverified = skills.length - verified;
    const owners = new Set(skills.map((s) => s.owner)).size;
    return { total: skills.length, verified, unverified, owners };
  }, []);

  return (
    <>
      <AppHeader
        title="Skill Library"
        subtitle="스킬 라이브러리 · 8개 카테고리 / Skills.sh 스타일"
      />
      <main className="px-6 py-6 space-y-5">
        <section className="space-y-3">
          <div>
            <h1 className="h-page">스킬 라이브러리</h1>
            <p className="h-sub">
              재사용 가능한 작업 능력(Skill)을 카테고리·상태·소유자 기준으로 탐색하세요.
            </p>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card>
              <CardBody>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="label-eyebrow">Total</div>
                    <div className="mt-1 text-2xl font-semibold text-ink-900">
                      {stats.total}
                    </div>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                    <Layers className="h-4 w-4" />
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="label-eyebrow">Verified</div>
                    <div className="mt-1 text-2xl font-semibold text-ink-900">
                      {stats.verified}
                    </div>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="label-eyebrow">Unverified</div>
                    <div className="mt-1 text-2xl font-semibold text-ink-900">
                      {stats.unverified}
                    </div>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="label-eyebrow">Owners</div>
                    <div className="mt-1 text-2xl font-semibold text-ink-900">
                      {stats.owners}
                    </div>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
            <SkillCategoryFilter
              value={filter}
              onChange={setFilter}
              counts={counts}
            />
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink-400" />
              <Input
                className="pl-9"
                placeholder="이름, 설명, 태그 검색"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="text-xs text-ink-500">
          <span className={cn("font-medium", visible.length !== stats.total && "text-ink-700")}>
            {visible.length}개 표시
          </span>{" "}
          / 총 {stats.total}개
        </div>

        {visible.length === 0 ? (
          <div className="rounded-2xl glass p-10 text-center text-sm text-ink-500">
            조건에 맞는 스킬이 없어요.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {visible.map((s) => (
              <SkillCard
                key={s.id}
                skill={s}
                active={selected?.id === s.id}
                onClick={() => setSelected(s)}
              />
            ))}
          </div>
        )}
      </main>

      {selected && (
        <SkillDetailPanel skill={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}
