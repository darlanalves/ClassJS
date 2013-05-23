module.exports = (pkg)->
	packages =
		demo:
			src: 'src/demo/*.js'
			dest: 'docs/demo.js'
		core:
			src: [
				"src/core/Class.js",
				"src/core/EventEmitter.js",
			]
			dest: 'dist/core.js'

		release:
			dest: "dist/classjs-#{pkg.version}.js"

	allFiles = []
	for name in ['core']
		allFiles = allFiles.concat packages[name].src

	packages.release.src = allFiles

	return packages
