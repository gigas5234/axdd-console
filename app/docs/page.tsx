"use client";

import { useState } from "react";
import { X, FileText, BookOpen } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkdownView } from "@/components/ui/markdown-view";
// MOCK: Docs 카드 목록 + 본문 — 실제 마크다운 파일/CMS 연동으로 교체 예정
import { MOCK_DOCS, type DocItem } from "@/mocks";

export default function DocsPage() {
  const [selected, setSelected] = useState<DocItem | null>(null);

  return (
    <>
      <AppHeader title="Docs" subtitle="표준 키트 / 가이드 / 플레이북" />
      <main className="px-6 py-6 space-y-5">
        <section>
          <h1 className="h-page flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent-indigo" /> Docs
          </h1>
          <p className="h-sub">
            CLAUDE.md §11에 따라 표준 키트와 플레이북을 이 영역에서 관리합니다. 카드를 클릭하면 본문을 볼 수 있어요.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_DOCS.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelected(d)}
              className="text-left"
            >
              <Card className="hover:-translate-y-0.5 hover:shadow-glass-lg transition cursor-pointer">
                <CardHeader className="flex items-start justify-between flex-row gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="text-2xl leading-none">{d.emoji}</span>
                    <div className="min-w-0">
                      <CardTitle>
                        {d.title}{" "}
                        <span className="text-ink-400 text-sm font-normal">
                          / {d.ko}
                        </span>
                      </CardTitle>
                      <p className="text-sm text-ink-500 mt-1">{d.desc}</p>
                    </div>
                  </div>
                  <Badge status={d.status} />
                </CardHeader>
                <CardBody className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-ink-500 inline-flex items-center gap-1">
                    <FileText className="h-3 w-3" /> {d.body.split("\n").length}줄
                  </span>
                  <span className="text-[11px] text-accent-blue font-medium">
                    클릭해서 열기 →
                  </span>
                </CardBody>
              </Card>
            </button>
          ))}
        </div>
      </main>

      {selected && (
        <DocSlidePanel doc={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function DocSlidePanel({
  doc,
  onClose,
}: {
  doc: DocItem;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[640px] lg:w-[760px] p-4 sm:p-6">
      <Card className="h-full overflow-hidden flex flex-col glass-strong">
        <div className="px-5 py-4 border-b border-ink-100 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="text-2xl leading-none">{doc.emoji}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge status={doc.status} />
                <span className="text-[11px] text-ink-500">
                  / {doc.ko}
                </span>
              </div>
              <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink-900">
                {doc.title}
              </h2>
              <p className="text-sm text-ink-500 mt-0.5">{doc.desc}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-ink-100 shrink-0"
            aria-label="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <MarkdownView source={doc.body} />
        </div>
      </Card>
    </div>
  );
}
