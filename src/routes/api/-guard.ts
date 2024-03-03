import type { Guard } from '$lib/index.js';

/**
 * This will guard this route and all of its children.
 * It is a test guard, it will allow the access to the route
 * 50% of the time.
 */
export const guard: Guard = async (event) => {
	const hasPermission = Math.random() > 0.5;
	console.log('Guarding the route', event.route, hasPermission);
	return hasPermission;
};
