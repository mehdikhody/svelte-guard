# SvelteGuard: Route Guards for SvelteKit

`svelte-guard` is a lightweight, flexible package that simplifies route guarding in SvelteKit applications. It ensures only authorized users access protected routes, bolstering your app's security while reducing code duplication. By integrating guards directly into your route structure and leveraging SvelteKit's hooks, `svelte-guard` provides a seamless way to enforce access controls without the pitfalls of traditional layout-based approaches.

## Why Not Use Layouts for Authentication?

While it might seem intuitive to handle authentication in a layout's server `load` function (e.g., for a group of admin routes), this approach has significant limitations. Layout `load` functions run in parallel with nested page `load` functions, meaning sensitive data might still be fetched before authentication fails. Additionally, during client-side navigation, layout checks aren't re-executed, potentially allowing unauthorized access if a session expires or changes.

**For instance:**

- Unauthorized users could trigger database queries, wasting resources or exposing data.
- Client-side logouts (e.g., via another tab) don't invalidate cached routes, enabling continued access to protected pages.

For a deeper explanation, watch this video: <br>
[**The Problem with Using Layouts for Auth.**](https://www.youtube.com/watch?v=UbhhJWV3bmI)

[![The Problem with Using Layouts for Auth](https://img.youtube.com/vi/UbhhJWV3bmI/0.jpg)](https://www.youtube.com/watch?v=UbhhJWV3bmI)

It highlights these issues and recommends alternatives like hooks for reliable guarding—exactly what `svelte-guard` provides.

## Features

- **Simple Setup:** Define guards in dedicated files within your route directories for easy management.
- **Flexible Guards:** Support for synchronous or asynchronous functions that can return booleans, throw redirects, or deny access.
- **Inherited Guards:** Parent route guards automatically apply to children, reducing repetition.
- **Extensible Logic:** Extend guards for specific sub-routes with additional checks.
- **Hook Integration:** Runs in SvelteKit's handle hook for consistent enforcement on every request.

## Directory Structure Example

Here's a typical setup in a SvelteKit project:

```text
src/
|-- routes/
|   |-- login/
|   |   ├── -guard.ts          # redirect if already logged in
|   |   └── +page.svelte
|   |-- admin/
|   |   ├── settings/
|   |   |   ├── -guard.ts      # Extends the parent admin guard with extra logic
|   |   |   └── +page.svelte
|   |   ├── -guard.ts          # Base guard for the admin route and all sub-routes
|   |   └── +page.svelte
|   └── +layout.svelte
|-- hooks.server.ts            # Where you register the guards
```

## Installation

Install the package via npm:

```bash
npm install svelte-guard
```

## Getting Started

To implement `svelte-guard`, create guard files in your routes and register them in your server hooks. Guards are functions that determine access: return true to allow, false to deny, or throw a redirect for custom handling.

### 1. Create Guard Files

Place `-guard.ts` (or `-guard.js`) files in route directories. Each exports a `guard` function of type `Guard` from `svelte-guard`.

Example for an admin route:

```ts
// src/routes/admin/-guard.ts
import type { Guard } from 'svelte-guard';
import { redirect } from '@sveltejs/kit';

export const guard: Guard = async ({ locals }) => {
	// Check if the user is an admin
	if (!locals.user?.isAdmin) {
		return false; // Deny access
	}

	return true; // Allow access
};
```

### 2. Register Guards

In `hooks.server.ts`, use `createGuardHook` to register all guards via a glob import.

```ts
// src/hooks.server.ts
import { createGuardHook } from 'svelte-guard';

const guards = import.meta.glob('./routes/**/-guard.*');

export const handle = createGuardHook(guards);
```

## Example Guards

### Basic Protected Route Guard

Protect a dashboard, allowing access only if a session exists:

```ts
// src/routes/dashboard/-guard.ts
import type { Guard } from 'svelte-guard';

export const guard: Guard = async ({ locals }) => {
	// Redirect if there is no session
	if (locals.session === undefined) {
		redirect(307, '/login');
	}

	// Allow access if session exists
	return true;
};
```

### API Endpoint Guard

Secure an API route with header-based authentication:

```ts
// src/routes/api/-guard.ts
import type { Guard } from 'svelte-guard';

export const guard: Guard = async ({ request }) => {
	const header = request.headers.get('Authorization');
	const token = 'xxxxxxxxxxxxxxxx';
	return header && header === `Bearer ${token}`;
};
```

## Advanced Configuration

Chain `svelte-guard` with other hooks using SvelteKit's sequence:

```ts
// src/hooks.server.ts
import { sequence } from '@sveltejs/kit/hooks';
import { createGuardHook } from 'svelte-guard';

const guards = import.meta.glob('./routes/**/-guard.*');
const GuardHook = createGuardHook(guards);

export const handle = sequence(OtherHook, GuardHook);
```

## VSCode Settings

Enhance your workflow by customizing tab labels for guard files in VSCode. Add this to your `settings.json`:

```json
{
	"workbench.editor.customLabels.enabled": true,
	"workbench.editor.customLabels.patterns": {
		"**/src/routes/**/-guard.{ts,js}": "${dirname} - Guard"
	}
}
```

## Contributing

Contributions are welcome! Whether fixing bugs, adding features, or improving docs, open an issue or pull request on [GitHub](https://github.com/mehdikhody/svelte-guard).

## License

Licensed under the MIT License. See the [LICENSE](https://github.com/mehdikhody/svelte-guard/blob/master/LICENSE) file for details.
