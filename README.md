# SvelteGuard: Route Guards for SvelteKit

`svelte-guard` is a lightweight and flexible package designed to make route guarding in SvelteKit applications easy and efficient. It ensures that only authorized users can access specific routes, enhancing your app’s security. With `svelte-guard`, you can manage route guards seamlessly, avoiding redundant code across your project.

## Features

- **✅ Simple Setup:** Easily define route guards by adding individual guard files to your routes.
- **✅ Flexible Guards:** Supports both synchronous and asynchronous guard functions. Guards can redirect users to another route if access is denied.
- **✅ Inherited Guards:** Guards can be inherited from parent routes, minimizing duplication of guard logic.
- **✅ Extensible:** You can extend existing guards to add extra logic for specific routes or groups of routes.

### Directory Structure Example

```plaintext
app/
│-- routes/
│   │-- login/
│   │   ├── -guard.ts          # Guard for login route
│   │   └── +page.svelte
│   │-- admin/
│   │   ├── settings/
│   │   │   ├── -guard.ts      # Extends admin guard
│   │   │   └── +page.svelte
│   │   ├── -guard.ts          # Admin guard for all sub-routes
│   │   └── +page.svelte
│   └── +layout.svelte
│-- hooks.server.ts            # Register guards here
```

## Installation

Install `svelte-guard` via npm:

```bash
npm install svelte-guard
```

## Getting Started

To use `svelte-guard`, you need to define guard files for your routes and register them.

### 1. Create Guard Files

Define guards in \`-guard.ts\` (or \`.js\`) files inside your route directories. Each guard file controls access to its associated route and its children.

Example:

```typescript
// routes/admin/-guard.ts
import type { Guard } from 'svelte-guard';
import { redirect } from '@sveltejs/kit';

export const guard: Guard = async ({ locals }) => {
	// Example: Check if the user is an admin
	if (!locals.user.isAdmin) {
		return false; // Access denied
		// or redirect the request in here:
		// return redirect(307, '/');
	}
	return true;
};

// Optional redirect for unauthorized users
// this will be the default for nested sub-routes
export const reroute = '/';
```

### 2. Register Guards

In \`hooks.server.ts\`, register your route guards using the \`createGuardHook\` function from \`svelte-guard\`:

```typescript
// hooks.server.ts
import { createGuardHook } from 'svelte-guard';

const guards = import.meta.glob('./routes/**/-guard.*');
export const handle = createGuardHook(guards);
// Optional: Specify a default redirect route if a guard fails
// export const handle = createGuardHook(guards, '/login');
```

## Example Guards

### Basic Route Guard

```typescript
// src/routes/dashboard/-guard.ts
import type { Guard } from 'svelte-guard';

export const guard: Guard = async ({ locals }) => {
	return locals.session === undefined;
};

// Redirect if the guard fails
export const reroute = '/login';
```

### API Endpoint Guard

```typescript
// src/routes/api/-guard.ts
import type { Guard } from 'svelte-guard';

export const guard: Guard = async (event) => {
	const header = request.headers.get('Authorization');
	const token = 'xxxxxxxxxxxxxxxx';
	if (!header || header !== `Bearer ${token}`) {
		return false;
	}

	return true;
};

// No reroute specified = 403 Forbidden on failure
```

## Advanced Configuration

You can chain multiple hooks together using SvelteKit’s \`sequence\` function:

```typescript
// hooks.server.ts
import { sequence } from '@sveltejs/kit/hooks';
import { createGuardHook } from 'svelte-guard';

const guards = import.meta.glob('./routes/**/-guard.*');
const GuardHook = createGuardHook(guards);

export const handle = sequence(OtherHook, GuardHook);
```

## VSCode Settings

To help you easily identify guard files in VSCode, you can enable custom labels for tabs. Add the following to your \`settings.json\`:

```json
"workbench.editor.customLabels.enabled": true,
"workbench.editor.customLabels.patterns": {
  "**/src/routes/**/-guard.{ts,js}": "${dirname} - Guard"
}
```

## Contributing

We welcome contributions to \`svelte-guard\`! Whether it's fixing bugs, adding new features, or suggesting improvements, feel free to open issues or submit pull requests on [GitHub](https://github.com/mehdikhody/svelte-guard).

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/mehdikhody/svelte-guard/blob/master/LICENSE) file for details.
