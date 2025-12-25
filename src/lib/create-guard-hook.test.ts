import { test, expect } from 'vitest';
import { createGuardHook } from './index.js';

test('createGuardHook allows access when guard returns true', async () => {
	const files: Record<string, () => Promise<any>> = {
		'routes/foo/-guard.ts': async () => ({ guard: async () => true })
	};

	const handle = createGuardHook(files as any);

	const event: any = { route: { id: '/foo/bar' }, locals: {} };
	let resolved = false;

	const result = await handle({
		event,
		resolve: async () => {
			resolved = true;
			return 'ok';
		}
	} as any);

	expect(resolved).toBe(true);
	expect(result).toBe('ok');
	expect(event.locals.guards).toBeTruthy();
});

test('createGuardHook denies access when guard returns false', async () => {
	const files: Record<string, () => Promise<any>> = {
		'routes/foo/-guard.ts': async () => ({ guard: async () => false })
	};

	const handle = createGuardHook(files as any);

	const event: any = { route: { id: '/foo' }, locals: {} };

	await expect(
		handle({
			event,
			resolve: async () => 'ok'
		} as any)
	).rejects.toThrow();
});
