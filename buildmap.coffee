module.exports = (pkg)->
	sources = [
		"src/core/Class.js",
		"src/core/EventEmitter.js",
	]
	packages =
		demo:
			src: 'src/demo/*.js'
			dest: 'docs/demo.js'

		latest:
			src: sources
			dest: "dist/classjs-latest.js"

		release:
			src: sources
			dest: "dist/classjs-#{pkg.version}.js"

	return packages
