import type { RequestEvent } from '@sveltejs/kit';

type MaybePromise<T> = T | Promise<T>;
export type Guard = <T extends RequestEvent>(event: T) => MaybePromise<boolean>;
export type Guards = Record<string, { guard: Guard }>;
export type GuardFile = { guard: Guard };
export type GlobFiles<T> = Record<string, () => Promise<T>>;
