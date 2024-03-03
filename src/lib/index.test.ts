import type { GlobFiles, GuardFile } from './types.js';
import { test, expect } from 'vitest';
import { LoadGuards } from './load-guard.js';

/**
 * Checks of the LoadGuards function loads all of the guards
 * from the route directory or not.
 */
test('Load guards from the route directory', async () => {
	const files = import.meta.glob('../routes/**/-guard.*');
	const guards = await LoadGuards(files as GlobFiles<GuardFile>);
	expect(Object.keys(files).length).toBe(Object.keys(guards).length);
});
