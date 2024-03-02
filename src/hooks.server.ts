import { createGuardHook } from '$lib/index.js';

export const handle = createGuardHook(import.meta.glob('./routes/**/-guard.*'));
