import type { Guard } from '$lib/index.js';

export const guard: Guard = async (event) => {
	const id = event.params.id;
	return id === '43';
};
