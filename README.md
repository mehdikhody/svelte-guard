# `svelte-guard` - Router Guard for SvelteKit Apps

![NPM Version](https://img.shields.io/npm/v/svelte-guard)
![test workflow](https://github.com/mehdikhody/svelte-guard/actions/workflows/test.yml/badge.svg)
![GitHub License](https://img.shields.io/github/license/mehdikhody/svelte-guard)
![NPM Downloads](https://img.shields.io/npm/dt/svelte-guard)
[![GitHub Repo stars](https://img.shields.io/github/stars/mehdikhody/svelte-guard?style=flat)](https://github.com/mehdikhody/svelte-guard)

`svelte-guard` is a package designed to simplify the process of guarding protected routes in SvelteKit applications. With `svelte-guard`, you can easily implement route guards without cluttering your `+layout.server.js`, `+page.server.js` or `+server.js` files with repetitive guard logic.

## Introduction

In many SvelteKit applications, ensuring that certain routes are accessible only to authorized users is crucial for security. However, writing and managing guard logic can become cumbersome, especially as your application grows. `svelte-guard` streamlines this process by allowing you to define guards for individual routes within your project directory structure.

[Huntabyte](https://www.youtube.com/@Huntabyte) highlights the challenges and pitfalls of using layouts for authentication in SvelteKit applications in this informative video: [Understanding the Problem with Using Layouts for Authentication.](https://www.youtube.com/watch?v=UbhhJWV3bmI)

## Installation

You can install `svelte-guard` via npm with the following command:

```bash
npm install svelte-guard
```

## Usage

With `svelte-guard`, protecting your routes is straightforward. Here's how you can integrate it into your SvelteKit application:

### 1. Create Guard Files:

Instead of repeating yourself or cluttering your code with multiple if statements for route authorization, create guard files for your routes. These files should be named following the convention `-guard.js` or `-guard.ts` and placed within the respective route directories.

Example guard file (`routes/admin/-guard.ts`):

```typescript
// routes/admin/-guard.ts
import type { Guard } from 'svelte-guard';

// guard can be async or sync, it's up to you
// for type safety, you can use: Guard<RequestEvent>
export const guard: Guard = async ({ locals }) => {
	// Implement your authorization logic here
	// Return true if the request is authorized, false otherwise
	return locals.user.isAdmin;
};
```

### 2. Registering Guards

To register the guards, you need to create a hook to handle your app requests in the `hooks.server.js` or `hooks.server.ts` file. You can use the createGuardHook function provided by `svelte-guard`.

Example hook registration:

```typescript
// hooks.server.ts
import { createGuardHook } from 'svelte-guard';

// Import all guard files using glob pattern
const guards = import.meta.glob('./routes/**/-guard.*');
export const handle = createGuardHook(guards);
```

If you have multiple hooks, you can use the `sequence` function from `@sveltejs/kit/hooks` to serialize them.

```typescript
// hooks.server.ts
import { sequence } from '@sveltejs/kit/hooks';
import { AuthHook } from '$lib/server/hooks/auth-hook';
import { createGuardHook } from 'svelte-guard';

const guards = import.meta.glob('./routes/**/-guard.*');
const GuardHook = createGuardHook(guards);

// First we run the AuthHook, so we can have access to locals.user
// or locals.session in our guards.
export const handle = sequence(AuthHook, GuardHook);
```

### Enjoy Protecting Your Routes

With `svelte-guard`, all children routes will be automatically protected, and each route can have its own specific guard. Guards are run for both the parent and current paths, ensuring that routes are accessible only to authorized users. If any guard returns false, a `403 - Forbidden` error will be returned.

## Contribution

Contributions to `svelte-guard` are welcome! Feel free to submit bug reports, feature requests, or pull requests on [GitHub](https://github.com/mehdikhody/svelte-guard).

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/mehdikhody/svelte-guard/blob/master/LICENSE) file for details.
