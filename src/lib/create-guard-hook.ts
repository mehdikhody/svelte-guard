import type { Handle } from '@sveltejs/kit';
import type { GlobFiles, GuardFile, Guards } from './types.js';
import { LoadGuards } from './load-guard.js';
import { error, redirect } from '@sveltejs/kit';

/**
 * Create the guard hook.
 * Guards will be loaded from the glob files and
 * will be executed before the route handler.
 */
export const createGuardHook = (files: GlobFiles<unknown>, reroute?: string): Handle => {
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
		let parentReroute: string | undefined = reroute;
		for (const guardId of currentGuards) {
			const { guard, reroute: guardReroute } = guards[guardId];
			const result = await guard(event);

			if (typeof guardReroute === 'string') parentReroute = guardReroute;
			if (!result) {
				if (parentReroute) redirect(307, parentReroute);
				else throw error(403, 'Forbidden');
			}
		}
		Reflect.set(event.locals, 'guards', guards);
		return await resolve(event);
	};
};
