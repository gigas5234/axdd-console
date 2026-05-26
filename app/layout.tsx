import "./globals.css";
import type { Metadata } from "next";
import { AppSidebar } from "@/components/layout/app-sidebar";

export const metadata: Metadata = {
  title: "AXDD SkillOps Console",
  description:
    "AXDD 스킬 / 에이전트 / 하네스 룰 / 워크 유닛을 운영하는 SkillOps 콘솔",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          {/*
            min-w-0 + overflow-x-hidden: 메인 영역에서 wide 콘텐츠
            (마크다운 테이블, ASCII 와이어프레임, ReactFlow 등)가 사이드바를
            덮거나 페이지 전체에 horizontal scroll을 만들지 않도록 격리.
          */}
          <div className="flex-1 min-w-0 overflow-x-hidden flex flex-col">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
