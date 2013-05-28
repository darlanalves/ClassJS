module.exports = (grunt)->
	prefix = grunt.file.read('./src/$prefix.js', encoding: 'utf8')
	suffix = grunt.file.read('./src/$suffix.js', encoding: 'utf8')

	pkg = grunt.file.readJSON('package.json')

	buildmap = require('./buildmap')
	testmap = require('./testmap')

	# generates a build map
	uglify = buildmap(pkg)
	uglify.options =
		banner: prefix
		footer: suffix		# NOTE: this is not implemented yet! It's a task to grunt-wrap!

	# generates a test map
	jasmine = testmap(pkg)

	grunt.initConfig
		pkg: pkg
		uglify: uglify
		jasmine: jasmine

	for name of pkg.devDependencies when name.substring(0, 6) is 'grunt-'
		grunt.loadNpmTasks name

	grunt.registerTask('build', 		['uglify:latest', 'jasmine'])
	grunt.registerTask('build-demo',	['uglify:demo'])
	grunt.registerTask('release', 		['uglify:release', 'jasmine'])
	grunt.registerTask('test', 			['jasmine'])
	grunt.registerTask('default', 		['build']);
