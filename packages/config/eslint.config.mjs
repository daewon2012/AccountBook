export default [
  {
    ignores: ['dist/**', 'coverage/**', '.next/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/infrastructure/**'],
              message: 'Domain and application code must depend on ports, not adapters.',
            },
          ],
        },
      ],
    },
  },
];
