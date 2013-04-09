module.exports = (grunt)->
	grunt.initConfig
		pkg: grunt.file.readJSON('package.json')
		uglify:
			options:
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'

			build:
				src: "lib/<%= pkg.name %>.js"
				dest: "build/<%= pkg.name %>.js"

	# Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-uglify')

	# Register default task
	grunt.registerTask('default', ['uglify'])