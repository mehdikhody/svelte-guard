import type { Guard } from '$lib/index.js';

/**
 * This will guard this route and all of its children.
 * It is a test guard, it will allow the access to the route
 * 50% of the time.
 */
export const guard: Guard = ({ request }) => {
	const header = request.headers.get('Authorization');
	const token = 'xxxxxxxxxxxxxxxx';
	if (!header || header !== `Bearer ${token}`) {
		return false;
	}

	return true;
};
