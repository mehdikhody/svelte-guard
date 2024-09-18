import type { GlobFiles, GuardFile, Guards } from './types.js';

/**
 * Load the guards from the guard files.
 * returns a record with the guards and the route id
 * as key for each guard.
 *
 * Dev notice: Since reroute is an optional arg, mod.reroute doesn't have
 * to be checked in here.
 */
export const LoadGuards = async (files: GlobFiles<GuardFile>) => {
	const guards: Guards = {};
	for (const filename in files) {
		const mod = await files[filename]();
		if (!mod || !mod.guard) continue;
		const route = filename.match(/routes\/(.+?)\/-guard/)?.[1];
		const routeId = `/${route !== undefined ? route : ''}`;
		guards[routeId] = { guard: mod.guard, reroute: mod.reroute };
	}
	return guards;
};
