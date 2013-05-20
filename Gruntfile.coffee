module.exports = (grunt)->
	pkg = grunt.file.readJSON('package.json')
	buildmap = require('./buildmap')
	testmap = require('./testmap')

	uglify = buildmap(pkg)
	uglify.options = banner: '/*\n WhappJS\n Built on <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n\n'

	grunt.initConfig
		pkg: pkg
		clean:
			dist: 'dist/'

		uglify: uglify
		jasmine: testmap(pkg)

	for name of pkg.devDependencies when name.substring(0, 6) is 'grunt-'
		grunt.loadNpmTasks name
	#grunt.loadNpmTasks('grunt-contrib-concat')
	#grunt.loadNpmTasks('grunt-contrib-uglify')
	#grunt.loadNpmTasks('grunt-contrib-jasmine')
	#grunt.loadNpmTasks('grunt-contrib-clean')

	grunt.registerTask('build', [
		'clean:dist',
		'uglify:core',
		'uglify:service',
		'uglify:model',
		'uglify:view',
		'uglify:form'
	])
	grunt.registerTask('build-demo',	['uglify:demo'])
	grunt.registerTask('release', 		['build', 'test', 'uglify:release'])
	grunt.registerTask('test', 			['jasmine'])
	grunt.registerTask('default', 		['release']);
