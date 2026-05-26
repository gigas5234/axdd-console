import { AppHeader } from "@/components/layout/app-header";
import { PromptRunner } from "@/components/sandbox/prompt-runner";

export default function SandboxPage() {
  return (
    <>
      <AppHeader
        title="Sandbox"
        subtitle="바이브 코딩 콘솔 · Hook → Work Unit → Skills → Output → Validation → Figma"
      />
      <main className="px-6 py-6 space-y-5">
        <section>
          <h1 className="h-page">실행 테스트 (Sandbox)</h1>
          <p className="h-sub">
            프리셋을 선택하거나 프롬프트를 입력한 뒤 [실행]을 누르면, 우측에서 Hook → Work Unit → Skills → Output → Validation → Figma 흐름이 순서대로 시각화됩니다.
          </p>
        </section>

        <PromptRunner />
      </main>
    </>
  );
}
