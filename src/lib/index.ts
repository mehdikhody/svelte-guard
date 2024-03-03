import type { Handle, MaybePromise, RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export type Guard = <T extends RequestEvent>(event: T) => MaybePromise<boolean>;
type Guards = Record<string, Guard>;
type GuardFile = { guard: Guard };
type GlobFiles<T> = Record<string, () => Promise<T>>;

/**
 * Load the guards from the guard files.
 * returns a record with the guards and the route id
 * as key for each guard.
 */
const LoadGuards = async (files: GlobFiles<GuardFile>) => {
	const guards: Guards = {};
	for (const filename in files) {
		const mod = await files[filename]();
		if (!mod || !mod.guard) continue;
		const route = filename.match(/routes\/(.+?)\/-guard/)?.[1];
		const routeId = `/${route !== undefined ? route : ''}`;
		guards[routeId] = mod.guard;
	}
	return guards;
};

/**
 * Create the guard hook.
 * Guards will be loaded from the glob files and
 * will be executed before the route handler.
 */
export const createGuardHook = (files: GlobFiles<unknown>): Handle => {
	let guards: Guards = {};

	/**
	 * The guard handler.
	 * This handler is responsible for checking the route guards
	 * and alowing or denying the access to the route.
	 */
	return async ({ event, resolve }) => {
		if (Object.keys(guards).length === 0) {
			guards = await LoadGuards(files as GlobFiles<GuardFile>);
			guards = Object.freeze(guards);
		}
		const routeId = event.route.id || '/';
		const currentGuards = Object.keys(guards).filter((guardId) => routeId.startsWith(guardId));
		for (const guardId of currentGuards) {
			const result = await guards[guardId](event);
			if (!result) throw error(403, 'Forbidden');
		}
		Reflect.set(event.locals, 'guards', guards);
		return await resolve(event);
	};
};
