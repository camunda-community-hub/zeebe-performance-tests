module.exports = {
	endOfLine: 'lf',
	jsxSingleQuote: true,
	overrides: [
		{
			files: ['*.yaml', '*.yml'],
			options: {
				singleQuote: false,
				tabWidth: 2,
				useTabs: false,
			},
		},
	],
	printWidth: 100,
	semi: false,
	singleQuote: true,
	tabWidth: 4,
	trailingComma: 'es5',
	useTabs: true,
}
