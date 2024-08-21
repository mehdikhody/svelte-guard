import type { Guard } from '$lib/index.js';

/**
 * The guard async function exists to validate auth requests
 * The 'reroute' variable can be modified at will
 * 
 * Once the the function gets executed and returns a boolean value,
 * the hook will redirect, if needed, to the bellow provided reroute path
 */
export const guard: Guard = async (/**event */) => {
    // Implement database logic
    const userHasAccess = false;

    return userHasAccess
};

export const reroute = "/";