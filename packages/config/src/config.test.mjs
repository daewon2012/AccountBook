import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import eslintConfig from '../eslint.config.mjs';
import prettierConfig from '../prettier.config.mjs';

test('shared TypeScript config enables strict checks', async () => {
  const config = JSON.parse(await readFile(new URL('../tsconfig.base.json', import.meta.url)));
  assert.equal(config.compilerOptions.strict, true);
  assert.equal(config.compilerOptions.noUncheckedIndexedAccess, true);
});

test('shared quality config exposes boundary and formatting rules', () => {
  assert.ok(eslintConfig.some((entry) => entry.rules?.['no-restricted-imports']));
  assert.equal(prettierConfig.singleQuote, true);
});
