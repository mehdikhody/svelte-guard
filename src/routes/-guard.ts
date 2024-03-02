import type { Guard } from '$lib/index.js';

export const guard: Guard = async (event) => {
	console.log('Guarding the route', event.route);
	return true;
};
