import { test, expect } from 'vitest';
import * as lib from './index.js';

test('index exports createGuardHook', () => {
	expect(lib.createGuardHook).toBeDefined();
});
