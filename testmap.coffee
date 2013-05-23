module.exports = (pkg)->
	tests =
		core:
			src: "dist/core.js"
			options:
				specs: [
					"test/core/ClassSpec.js"
				]

	return tests