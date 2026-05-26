"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * MarkdownView — GFM 테이블/체크리스트/취소선까지 지원하는 통합 렌더러.
 *
 * Tailwind typography 플러그인 의존성을 추가하지 않기 위해, 글로벌
 * `.markdown-body` 클래스에 직접 스타일을 정의한다 (globals.css 참고).
 */
export function MarkdownView({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  return (
    <div className={cn("markdown-body", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 코드블록의 ASCII 아트가 가로 스크롤 가능하도록
          pre: ({ children, ...props }) => (
            <pre {...props} className="markdown-pre">
              {children}
            </pre>
          ),
          // 테이블 가로 스크롤 wrapper
          table: ({ children, ...props }) => (
            <div className="markdown-table-wrap">
              <table {...props}>{children}</table>
            </div>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
