module.exports = {
	root: true,
	env: {
		node: true,
	},
	plugins: ['prettier', 'cypress'],
	extends: [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'@vue/typescript/recommended',
		'@vue/prettier',
		'@vue/prettier/@typescript-eslint',
		'plugin:prettier/recommended',
		'plugin:cypress/recommended',
	],
	parserOptions: {
		ecmaVersion: 2020,
	},

	rules: {
		'prettier/prettier': 0,
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'cypress/no-assigning-return-values': 'error',
		'cypress/no-unnecessary-waiting': 'error',
		'cypress/assertion-before-screenshot': 'warn',
		'cypress/no-force': 'warn',
		'cypress/no-async-tests': 'error',
		'no-unused-expressions': 0,
		'@typescript-eslint/explicit-module-boundary-types': 'off',
	},
	ignorePatterns: ['*.md', 'tailwind.config.js', '*.spec.js'],
	overrides: [
		{
			files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
			env: {
				jest: true,
				'cypress/globals': true,
			},
		},
		{
			files: ['*.ts', '*.tsx'],
			rules: {
				'@typescript-eslint/explicit-module-boundary-types': ['off'],
			},
		},
	],
};
