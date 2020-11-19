module.exports = {
    parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
    },
    env: {
        es6: true,
        browser: true,
    },
    plugins: [
        'svelte3',
    ],
    overrides: [
        {
            files: ['**/*.svelte'],
            processor: 'svelte3/svelte3',
        },
    ],
    extends: ['airbnb'],
    rules: {
        'indent': ['error', 4],
        'max-len': ['error', 120],
    }
};
