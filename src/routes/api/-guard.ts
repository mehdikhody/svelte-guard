import type { Guard } from '$lib/index.js';
import { redirect } from '@sveltejs/kit';

/**
 * This will guard this route and all of its children.
 * It is a test guard, it will allow the access to the route
 * 50% of the time.
 */
export const guard: Guard = () => {
	const hasPermission = Math.random() > 0.5;
	if (!hasPermission) {
		return redirect(307, '/');
	}

	return true;
};
