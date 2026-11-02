export enum PromptStatus {
  Draft = 'Draft',
  Live = 'Live',
  Scheduled = 'Scheduled',
  Expired = 'Expired'
}

export interface PromptInstruction {
  id?: number;
  promptId?: number;
  instructionText: string;
  sortOrder: number;
  createdAtUtc?: string;
  updatedAtUtc?: string;
}

export interface Prompt {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  keywords?: string | null;
  promptText: string;
  isPublished: boolean;
  isFeatured: boolean;
  startsAtUtc?: string | null;
  endsAtUtc?: string | null;
  createdAtUtc: string;
  updatedAtUtc: string;
  instructions: PromptInstruction[];
}

export function getPromptStatus(prompt: Prompt, now: Date = new Date()): PromptStatus {
  if (!prompt.isPublished) {
    return PromptStatus.Draft;
  }
  const nowMs = now.getTime();
  if (prompt.startsAtUtc) {
    const startsAtMs = new Date(prompt.startsAtUtc).getTime();
    if (startsAtMs > nowMs) {
      return PromptStatus.Scheduled;
    }
  }
  if (prompt.endsAtUtc) {
    const endsAtMs = new Date(prompt.endsAtUtc).getTime();
    if (endsAtMs <= nowMs) {
      return PromptStatus.Expired;
    }
  }
  return PromptStatus.Live;
}

export function isPromptLive(prompt: Prompt, now: Date = new Date()): boolean {
  return getPromptStatus(prompt, now) === PromptStatus.Live;
}
