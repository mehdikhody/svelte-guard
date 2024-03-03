import type { MaybePromise, RequestEvent } from '@sveltejs/kit';

export type Guard = <T extends RequestEvent>(event: T) => MaybePromise<boolean>;
export type Guards = Record<string, Guard>;
export type GuardFile = { guard: Guard };
export type GlobFiles<T> = Record<string, () => Promise<T>>;
