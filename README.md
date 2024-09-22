# Router Guard for SvelteKit Apps

`svelte-guard` is a versatile package designed to streamline the process of implementing route guards in SvelteKit applications. Route guards play a crucial role in ensuring that specific routes are accessible only to authorized users, enhancing the security of your application. With `svelte-guard`, you can efficiently manage and implement route guards without cluttering your codebase with repetitive guard logic.

## Features

- ✅ **Simplicity:** `svelte-guard` simplifies the implementation of route guards by allowing you to define guards for individual routes within your project directory structure.
- ✅ **Flexibility:** Guards can be implemented as synchronous or asynchronous functions, and requests can be redirected to a different route if necessary.
- ✅ **Inheritance:** Guards can be inherited from parent routes, allowing you to define a single guard for multiple routes.
- ✅ **Extensibility:** Alongside inheriting guards, you can also extend guards to add additional functionality to specific routes.

## Installation

You can easily install `svelte-guard` via `npm` using the following command:

```bash
npm install svelte-guard
```

## Getting Started

Implementing route guards with `svelte-guard` involves two main steps: creating guard files and registering the guards.

```
app                                      #
|-- routes                               #
|   |-- login                            #
|   |   |-- -guard.ts                    # redirect if user is logged in
|   |   |-- +page.svelte                 #
|   |-- admin                            #
|   |   |   |-- settings                 #
|   |   |   |   |-- -guard.ts            # extend parent guard
|   |   |   |   |-- +page.svelte         #
|   |   |-- -guard.ts                    # protect admin route and sub-routes
|   |   |-- +page.svelte                 #
|   |-- user                             #
|   |   |-- +page.svelte                 #
|   |-- +page.svelte                     #
|   |-- +layout.svelte                   #
|-- hooks.server.ts                      # register guards and hooks
```

This structure provides a clear separation of concerns, making it easy to manage and extend the route guarding functionality within SvelteKit applications.

### 1. Create Guard Files

Create guard files for your routes following the convention `-guard.js` or `-guard.ts` and place them within the respective route directories. These guard files encapsulate the authorization logic for each route and its child routes.

```typescript
// routes/admin/-guard.ts
import type { Guard } from 'svelte-guard';
import { redirect } from '@sveltejs/kit';

export const guard: Guard = async ({ locals }) => {
	// Implement your authorization logic here
	// return redirect(307, '/login');
	return locals.user.isAdmin;
};

// optional
export const reroute = '/login';
```

### 2. Register Guards

Register the guards by creating a hook to handle app requests in the `hooks.server.js` or `hooks.server.ts` file. Utilize the `createGuardHook` function provided by `svelte-guard` to register the guards.

```typescript
// hooks.server.ts
import { createGuardHook } from 'svelte-guard';

const guards = import.meta.glob('./routes/**/-guard.*');
export const handle = createGuardHook(guards);
// export const handle = createGuardHook(guards, '/login');
// will reroute to /login on 403 error
```

## Example Blocks

```typescript
// src/routes/dashboard/-guard.ts

/**
 * If you want to redirect users and not display a 403 Forbidden error, export a reroute path like displayed bellow.
 * Perfect for authentication / authorization flows
 */
import type { Guard } from '$lib/index.js';

export const guard: Guard = async (event) => {
	console.log(event.locals);
	// Your own logic implementation
	const userHasAccess = false;

	return userHasAccess;
};

export const reroute = '/';
```

```typescript
// src/routes/api/example/-guide.ts

/**
 * If an API / endpoint should not be reached by everyone or really needs any type of restriction,
 * there is no need to implement a reroute. Leaving the variable export out of the code automatically
 * responds with a '403 Forbidden' error.
 */
import type { Guard } from '$lib/index.js';

export const guard: Guard = async (event) => {
	// Your own logic implementation
	const shouldReturnCustomerId = false;

	return shouldReturnCustomerId;
};
```

### Additional Configuration

If you have multiple hooks or need to execute guards in a specific sequence, you can utilize the `sequence` function from `@sveltejs/kit/hooks` to serialize the hooks.

```typescript
// hooks.server.ts
import { sequence } from '@sveltejs/kit/hooks';
import { createGuardHook } from 'svelte-guard';

const guards = import.meta.glob('./routes/**/-guard.*');
const GuardHook = createGuardHook(guards);

export const handle = sequence(AuthHook, GuardHook);
```

## VSCode Settings

Having multiple `-guard.{ts|js}` files open can be difficult to distinguish. As such, [custom labels](https://code.visualstudio.com/docs/getstarted/userinterface#_customize-tab-labels) for open tabs can be set in VSCode.

You can configure your workspace's `settings.json` file to the settings below. Now, each open `-guard.{ts,js}` tab will show the guard file's directory with designation that it is a guard file.

```json
"workbench.editor.customLabels.enabled": true
"workbench.editor.customLabels.patterns": {
  "**/src/routes/**/-guard.{ts,js}": "/${dirname} - Guard"
}
```

## Contribution

Contributions to `svelte-guard` are highly encouraged! Whether it's bug fixes, feature enhancements, or new ideas, your contributions are valuable. You can contribute by submitting bug reports, feature requests, or pull requests on [GitHub](https://github.com/mehdikhody/svelte-guard).

For any questions, feedback, or support inquiries, feel free to reach out via the GitHub repository. We're here to help and improve the library together!

## License

`svelte-guard` is licensed under the MIT License. You can find the detailed licensing information in the [LICENSE](https://github.com/mehdikhody/svelte-guard/blob/master/LICENSE) file.
