import type { MaybePromise, RequestEvent } from '@sveltejs/kit';

export type Guard = <T extends RequestEvent>(event: T, reroute?: string) => MaybePromise<boolean>;
export type Guards = Record<string, { guard: Guard; reroute?: string }>;
export type GuardFile = { guard: Guard; reroute?: string };
export type GlobFiles<T> = Record<string, () => Promise<T>>;