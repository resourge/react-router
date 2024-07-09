module.exports = {
	extends: ['resourge/react'],
	rules: {
		'resourge-custom-react/no-index': 'off',
		'resourge-custom-react/folder-file-convention': 'off',
		'@stylistic/object-property-newline': 'off'
	},
	ignorePatterns: ['src/examples/**/*', 'src/todo/**/*']
};
