import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';
import promise from 'eslint-plugin-promise';
import prettier from 'eslint-plugin-prettier';

export default [
    {
        ignores: ['node_modules', 'dist', 'coverage', 'generated'],
    },

    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        files: ['**/*.ts'],
        plugins: {
            promise,
            prettier,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // Prettier
            'prettier/prettier': 'error',

            // Core JS
            eqeqeq: ['error', 'always'],
            'no-var': 'error',
            'prefer-const': 'error',
            'no-debugger': 'error',

            // TypeScript
            '@typescript-eslint/no-unused-vars': [
                'error',
                {argsIgnorePattern: '^_', varsIgnorePattern: '^_'},
            ],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/consistent-type-assertions': [
                'error',
                {assertionStyle: 'never'},
            ],
            '@typescript-eslint/no-non-null-assertion': 'warn',
            '@typescript-eslint/prefer-optional-chain': 'error',

            // Type-aware rules (requires parserOptions.project)
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
            '@typescript-eslint/await-thenable': 'error',

            // Promises
            'promise/catch-or-return': 'error',
            'promise/no-return-wrap': 'error',
            'promise/param-names': 'error',
            'promise/no-new-statics': 'error',

            // Clean code
            'max-lines': ['error', {max: 200, skipBlankLines: true, skipComments: true}],
            complexity: ['warn', 10],

            'no-restricted-syntax': [
                'error',
                {
                    selector: "CallExpression[callee.object.name='console']",
                    message:
                        'Avoid using console.* in production. Use a proper logger instead.',
                },
            ],
        },
    },

    {
        ...jest.configs['flat/recommended'],
        files: ['**/*.test.ts', '**/*.spec.ts'],
        rules: {
            ...jest.configs['flat/recommended'].rules,
            // Allow 'as' casts in tests — needed for Partial<> mocks passed to typed params
            '@typescript-eslint/consistent-type-assertions': [
                'error',
                {assertionStyle: 'as', objectLiteralTypeAssertions: 'never'},
            ],
        },
    },
];
