module.exports = (pkg)->
	specsPath = 'test/specs'
	tests =
		core:
			src: [
				"lib/lodash-dev.js"
				"dist/core.js"
			]
			options:
				specs: [
					"#{specsPath}/core/ClassSpec.js"
				]

	return tests