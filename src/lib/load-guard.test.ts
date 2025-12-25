import { test, expect } from 'vitest';
import { LoadGuards } from './load-guard.js';

test('LoadGuards collects guards and ignores non-guards', async () => {
	const files: Record<string, () => Promise<any>> = {
		'routes/foo/-guard.ts': async () => ({ guard: async () => true }),
		'routes/bar/-guard.ts': async () => ({ guard: () => false }),
		'routes/-guard.ts': async () => ({ guard: () => true }),
		'routes/skip/file.ts': async () => ({})
	};

	const guards = await LoadGuards(files as any);

	expect(Object.keys(guards).sort()).toEqual(['/', '/bar', '/foo'].sort());
	expect(typeof guards['/foo'].guard).toBe('function');
	expect(await guards['/bar'].guard({} as any)).toBe(false);
});
