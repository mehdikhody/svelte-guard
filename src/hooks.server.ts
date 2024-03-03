import { createGuardHook } from '$lib/index.js';

const guards = import.meta.glob('./routes/**/-guard.*');
export const handle = createGuardHook(guards);
