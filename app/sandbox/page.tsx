import { AppHeader } from "@/components/layout/app-header";
import { PromptRunner } from "@/components/sandbox/prompt-runner";

export default function SandboxPage() {
  return (
    <>
      <AppHeader
        title="Export Builder"
        subtitle="AxDD-SKILLS 호환 UX/UI 스킬셋을 zip으로 추출"
      />
      <main className="px-6 py-6 space-y-5">
        <section>
          <h1 className="h-page">스킬셋 추출</h1>
          <p className="h-sub">
            전사 내부 프로젝트에서 동일하게 쓸 수 있는 <strong>AxDD-SKILLS 호환 UX/UI 스킬 레포</strong>를
            zip으로 받습니다. Export Profile과 Work Unit을 고른 뒤 다운로드하세요.
            Mock 실행은 제공하지 않습니다 — 다운받은 zip을 Claude Code · Cursor에서 직접 실행합니다.
          </p>
        </section>

        <PromptRunner />
      </main>
    </>
  );
}
