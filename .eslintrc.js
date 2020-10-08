module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	extends: [
		'eslint:recommended',
	],
	plugins: [
		'only-warn'
	],
	// add your custom rules here
	rules: {
		"indent":[1,"tab"],
		"space-before-function-paren": [1, {
			"anonymous": "ignore",
			"named": "ignore",
			"asyncArrow": "ignore"
		}],
		"no-console": [1, { allow: ["warn", "error"] }],
		"semi": [1, "never"]
	}
}
