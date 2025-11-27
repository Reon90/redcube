import { defineConfig } from 'eslint/config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    {
        extends: compat.extends('eslint:recommended'),

        plugins: {
            '@typescript-eslint': typescriptEslint,
            'unused-imports': unusedImports,
        },

        files: ["**/*.ts"],

        languageOptions: {
            globals: {
                ...globals.browser,
            },

            parser: tsParser,
            ecmaVersion: 5,
            sourceType: 'module',
        },

        rules: {
            'unused-imports/no-unused-vars': ['error'],
            'unused-imports/no-unused-imports': 'error',
            'no-undef': 'off',
            'no-redeclare': ['error'],
            'no-unused-vars': ['off'],
            'no-console': ['off'],
            'no-unreachable': ['error'],
            'no-empty': ['error'],
            indent: ['error', 4],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            curly: ['error', 'all'],
            'brace-style': ['error', '1tbs'],
            'no-multi-spaces': ['error'],
            'space-before-blocks': ['error', 'always'],
            'space-before-function-paren': ['error', 'never'],
            'space-infix-ops': ['error'],
            'space-unary-ops': ['error'],

            'comma-spacing': [
                'error',
                {
                    before: false,
                    after: true,
                },
            ],

            'key-spacing': [
                'error',
                {
                    afterColon: true,
                },
            ],

            'keyword-spacing': [
                'error',
                {
                    before: true,
                },
            ],

            'arrow-spacing': [
                'error',
                {
                    before: true,
                    after: true,
                },
            ],

            eqeqeq: ['error'],
            'no-var': 'error',
            'prefer-arrow-callback': 'error',
            'prefer-template': 'error',
            'prefer-destructuring': 'error',
            'prefer-const': 'error',
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
        },
    },
]);
