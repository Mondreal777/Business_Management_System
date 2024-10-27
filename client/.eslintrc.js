module.exports = {
	root: true,
	env: {
		node: true,
		jest: true
	},
	extends: ["plugin:vue/essential"],
	rules: {
		"no-console": process.env.VUE_APP_NODE_ENV === "production" ? "error" : "off",
		"no-debugger": process.env.VUE_APP_NODE_ENV === "production" ? "error" : "off"
	},
	parserOptions: {
		parser: "babel-eslint"
	}
};