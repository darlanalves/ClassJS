module.exports = (pkg)->
	tests =
		core:
			src: "dist/classjs-latest.js"
			options:
				specs: [
					"test/core/ClassSpec.js"
				]

	return tests