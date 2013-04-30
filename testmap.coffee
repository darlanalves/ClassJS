module.exports = (pkg)->
	specsPath = 'test/specs'
	tests =
		core:
			src: "dist/core.js"
			options:
				vendor: ["lib/lodash-dev.js"]
				# helpers: ["#{specsPath}/Helper.js"]
				specs: [
					"#{specsPath}/core/ClassSpec.js"
				]

	return tests