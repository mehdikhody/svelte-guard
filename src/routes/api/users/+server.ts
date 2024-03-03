import type { RequestHandler } from './$types.js';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	return json({
		ok: true,
		message: 'There is no users'
	});
};
