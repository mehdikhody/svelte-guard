import type { Guard } from '$lib/index.js';
import { redirect } from '@sveltejs/kit';

export const guard: Guard = async (/**event */) => {
	redirect(307, '/');
};
