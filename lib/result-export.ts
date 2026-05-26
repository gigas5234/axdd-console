/**
 * 실행 결과 zip 패키지 생성 — 클라이언트사이드 (JSZip).
 * 빌더 함수는 lib/result-builders.ts (서버와 공유).
 */

import JSZip from "jszip";
import {
  buildIntentMd,
  buildManifest,
  buildResultReadme,
  buildValidationMd,
  type ResultPayload,
} from "./result-builders";

export type ResultPackageInput = ResultPayload & { figmaPrompt?: string };

export async function downloadResultZip(
  input: ResultPackageInput,
): Promise<void> {
  const { workUnit } = input;
  const ts = Date.now();
  const folderName = `${workUnit.id}-${ts}`;

  const zip = new JSZip();
  const root = zip.folder(folderName);
  if (!root) throw new Error("zip folder failed");

  root.file("README.md", buildResultReadme(input));
  root.file("output.md", input.output);
  root.file("validation.md", buildValidationMd(input.validation));
  root.file("manifest.json", JSON.stringify(buildManifest(input), null, 2));

  const intentMd = buildIntentMd(input.intent);
  if (intentMd) root.file("intent.md", intentMd);

  if (input.figmaPrompt) {
    root.file("figma-prompt.md", input.figmaPrompt);
  }

  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
