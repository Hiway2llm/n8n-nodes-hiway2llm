module.exports = {
	root: true,
	env: { node: true, es2019: true },
	parser: '@typescript-eslint/parser',
	parserOptions: { project: './tsconfig.json' },
	plugins: ['@typescript-eslint', 'n8n-nodes-base'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/community',
	],
	rules: {
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
	},
};
