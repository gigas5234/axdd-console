/**
 * MOCK SEAM: 이 모듈은 시드 JSON을 동기적으로 임포트해 반환합니다.
 * 실제 백엔드가 붙으면 이 파일 안의 임포트를 fetch('/api/...') 기반으로
 * 교체하기만 하면 됩니다. 컴포넌트 코드는 수정 불필요.
 *
 * data/*.json 파일들은 mocks/ 가 아닌 data/ 에 둡니다 — 정식 스키마이며
 * 백엔드 응답과 동일한 모양을 따르기 때문입니다.
 *
 * @see mocks/README.md
 */
import skillsJson from "@/data/skills.catalog.json";
import workUnitsJson from "@/data/work-units.json";
import hooksJson from "@/data/hooks.json";
import assetsJson from "@/data/assets.json";
import runsJson from "@/data/runs.json";
import type { Skill, WorkUnit, Hook, AssetItem, Run } from "./types";

export const skills = skillsJson as Skill[];
export const workUnits = workUnitsJson as WorkUnit[];
export const hooks = hooksJson as Hook[];
export const assets = assetsJson as AssetItem[];
export const runs = runsJson as Run[];

export function getSkill(id: string): Skill | undefined {
  return skills.find((s) => s.id === id);
}
export function getWorkUnit(id: string): WorkUnit | undefined {
  return workUnits.find((w) => w.id === id);
}
export function getHook(id: string): Hook | undefined {
  return hooks.find((h) => h.id === id);
}
