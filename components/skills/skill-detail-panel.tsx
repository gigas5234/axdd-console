"use client";

import { useEffect, useState } from "react";
import {
  X,
  FileText,
  FolderTree,
  Workflow,
  Github,
  Copy,
  Download,
  Package,
  Terminal,
  Check,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MarkdownView } from "@/components/ui/markdown-view";
import { CATEGORY_LABELS, CATEGORY_TONE } from "@/lib/types";
import type { Skill } from "@/lib/types";
import { workUnits } from "@/lib/data";

function FileList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-500">{title}</span>
        <span className="text-ink-400">없음</span>
      </div>
    );
  }
  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-ink-600">{title}</div>
      <ul className="space-y-1">
        {items.map((path) => (
          <li
            key={path}
            className="font-mono text-[11px] text-ink-700 bg-ink-50 border border-ink-100 rounded-md px-2 py-1 flex items-center gap-2"
          >
            <FileText className="h-3 w-3 text-ink-400 shrink-0" />
            <span className="truncate">{path}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * SKILL.md 본문 fetch + Copy / Download 버튼 묶음.
 * Claude Code 사용 안내까지 포함.
 */
function SkillMarkdownExport({ skill }: { skill: Skill }) {
  const [body, setBody] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/skills/${skill.id}/skill-md`)
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((text) => {
        if (!cancelled) setBody(text);
      })
      .catch(() => {
        if (!cancelled)
          setBody(`(SKILL.md를 가져오지 못했습니다: /api/skills/${skill.id}/skill-md)`);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [skill.id]);

  async function copyMd() {
    if (!body) return;
    try {
      await navigator.clipboard.writeText(body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  }

  function downloadMd() {
    if (!body) return;
    const blob = new Blob([body], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${skill.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-ink-500" />
          <h4 className="text-sm font-semibold text-ink-900">SKILL.md</h4>
          <Badge tone="bg-emerald-50 text-emerald-700 border-emerald-200">
            Claude Code 호환
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={copyMd}
            disabled={!body}
            className="h-7 px-2 inline-flex items-center gap-1 rounded-md border border-ink-200 bg-white text-xs text-ink-700 hover:bg-ink-50 disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-600" /> 복사됨
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> 복사
              </>
            )}
          </button>
          <button
            onClick={downloadMd}
            disabled={!body}
            className="h-7 px-2 inline-flex items-center gap-1 rounded-md border border-ink-200 bg-white text-xs text-ink-700 hover:bg-ink-50 disabled:opacity-50"
          >
            <Download className="h-3 w-3" /> .md
          </button>
          <a
            href={`/api/skills/${skill.id}/package`}
            className="h-7 px-2 inline-flex items-center gap-1 rounded-md border border-accent-indigo bg-accent-indigo text-white text-xs hover:bg-indigo-600"
          >
            <Package className="h-3 w-3" /> zip
          </a>
        </div>
      </div>

      <Card glass={false} className="overflow-hidden">
        <div className="bg-navy-deep text-ink-100 px-4 py-2 flex items-center justify-between border-b border-ink-700">
          <span className="font-mono text-[11px] text-ink-300">
            {skill.files.skill}
          </span>
          {loading && (
            <span className="text-[10px] text-ink-400">로딩 중...</span>
          )}
        </div>
        <CardBody className="p-0">
          <div className="max-h-72 overflow-auto px-5 py-4 bg-white">
            {loading ? (
              <div className="text-xs text-ink-400">불러오는 중...</div>
            ) : (
              <MarkdownView source={body ?? ""} />
            )}
          </div>
        </CardBody>
      </Card>

      <details className="mt-2 rounded-lg border border-ink-200 bg-ink-50/50">
        <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-ink-700 select-none flex items-center gap-1.5">
          <Terminal className="h-3 w-3" /> Claude Code에서 직접 테스트하는 법
        </summary>
        <div className="px-3 pb-3 text-[11px] text-ink-600 leading-relaxed space-y-2">
          <p>
            <strong>1.</strong> 위 <code className="font-mono">zip</code>{" "}
            버튼으로 패키지를 받습니다.
          </p>
          <p>
            <strong>2.</strong> 압축을 풀어{" "}
            <code className="font-mono">
              ~/.claude/skills/{skill.id}/
            </code>{" "}
            에 둡니다.
          </p>
          <p>
            <strong>3.</strong> Claude Code (CLI) 또는 Claude Desktop에서 새 세션을 시작하면 자동 인식됩니다.
          </p>
          <p>
            <strong>4.</strong> 또는 SKILL.md 본문을 <code className="font-mono">복사</code> 해서 Anthropic Console / Claude Code 새 스킬에 그대로 붙여넣어 테스트할 수 있어요.
          </p>
        </div>
      </details>
    </section>
  );
}

export function SkillDetailPanel({
  skill,
  onClose,
}: {
  skill: Skill | null;
  onClose: () => void;
}) {
  if (!skill) return null;
  const cat = CATEGORY_LABELS[skill.category];
  const relatedWus = workUnits.filter((w) =>
    skill.relatedWorkUnits.includes(w.id),
  );

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[560px] lg:w-[640px] p-4 sm:p-6">
      <Card className="h-full overflow-hidden flex flex-col glass-strong">
        <div className="px-5 py-4 border-b border-ink-100 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone={CATEGORY_TONE[skill.category]}>
                {cat.en} · {cat.ko}
              </Badge>
              <Badge status={skill.status} />
            </div>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink-900">
              {skill.name}
            </h2>
            <p className="mt-1 text-sm text-ink-500">{skill.description}</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-ink-100"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <section className="grid grid-cols-2 gap-3">
            <Card glass={false}>
              <CardBody>
                <div className="label-eyebrow">Input Schema</div>
                <ul className="mt-2 space-y-1">
                  {skill.input.map((i) => (
                    <li key={i} className="font-mono text-xs text-ink-700">
                      • {i}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
            <Card glass={false}>
              <CardBody>
                <div className="label-eyebrow">Output Schema</div>
                <ul className="mt-2 space-y-1">
                  {skill.output.map((o) => (
                    <li key={o} className="font-mono text-xs text-ink-700">
                      • {o}
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </section>

          {/* SKILL.md 본문 + Copy / Download / Zip */}
          <SkillMarkdownExport skill={skill} />

          <section>
            <div className="flex items-center gap-2 mb-2">
              <FolderTree className="h-4 w-4 text-ink-500" />
              <h4 className="text-sm font-semibold text-ink-900">Files</h4>
            </div>
            <Card glass={false}>
              <CardBody className="space-y-3">
                <FileList title="SKILL.md" items={[skill.files.skill]} />
                <FileList
                  title="references/"
                  items={skill.files.references}
                />
                <FileList title="scripts/" items={skill.files.scripts} />
                <FileList title="assets/" items={skill.files.assets} />
                <FileList title="tests/" items={skill.files.tests} />
              </CardBody>
            </Card>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <Workflow className="h-4 w-4 text-ink-500" />
              <h4 className="text-sm font-semibold text-ink-900">
                Related Work Units
              </h4>
            </div>
            {relatedWus.length === 0 ? (
              <p className="text-xs text-ink-500">
                연결된 Work Unit이 없어요.
              </p>
            ) : (
              <div className="grid gap-2">
                {relatedWus.map((w) => (
                  <Card key={w.id} glass={false}>
                    <CardBody className="py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-ink-900 truncate">
                            {w.name}
                          </div>
                          <div className="text-xs text-ink-500 line-clamp-1">
                            {w.description}
                          </div>
                        </div>
                        <Badge status={w.status} />
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="text-xs text-ink-500 mb-1">Tags</div>
            <div className="flex flex-wrap gap-1.5">
              {skill.tags.map((t) => (
                <Badge key={t} tone="bg-ink-100 text-ink-700 border-ink-200">
                  #{t}
                </Badge>
              ))}
            </div>
          </section>
        </div>

        <div className="px-5 py-4 border-t border-ink-100 flex items-center justify-between gap-2 bg-white/60">
          <div className="text-xs text-ink-500 truncate">
            <span className="font-mono">{skill.files.skill}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Github className="h-3.5 w-3.5" /> GitHub
            </Button>
            <Button size="sm">샌드박스에서 실행</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
