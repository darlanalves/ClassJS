module.exports = (pkg)->
	packages =
		demo:
			src: 'src/demo/*.js'
			dest: 'docs/demo.js'

		release:
			src: [
				"src/core/Class.js",
				"src/core/EventEmitter.js",
			]
			dest: "dist/classjs-#{pkg.version}.js"

	return packages
