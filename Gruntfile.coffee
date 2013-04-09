module.exports = (grunt)->
	src_core = [
		"lib/Whapp.js",
		"lib/core/Class.js",
		"lib/core/ClassManager.js",
		"lib/core/EventManager.js",
		"lib/core/HookManager.js",
		"lib/core/Component.js"
	]

	src_data = [
		"lib/data/Types.js",
		"lib/data/Field.js",
		"lib/data/Model.js"
	]

	src_view = [
		"lib/view/ViewAbstract.js",
		"lib/view/LiveView.js",
		"lib/view/LiteView.js",
		"lib/view/LiveRange.js",
	]

	src_form = [
		"lib/view/form/Button.js",
		"lib/view/form/ButtonGroup.js",
		"lib/view/form/Form.js",
		"lib/view/form/Group.js",
		"lib/view/form/Input.js",
		"lib/view/form/Text.js",
		"lib/view/form/Toolbar.js"
	]

	src_all = []
	for group in [src_core, src_data, src_view, src_form]
		for file in group
			src_all.push file

	grunt.initConfig
		pkg: grunt.file.readJSON('package.json')
		uglify:
			options:
				banner: '/*\n WhappJS\n Built on <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n\n'

			core:
				src: src_core
				dest: "build/core.js"

			data:
				src: src_data,
				dest: "build/model.js"

			view:
				src: src_view
				dest: "build/view.js"

			form:
				src: src_form
				dest: "build/form.js"

			all:
				src: src_all
				dest: "build/all.js"

	grunt.loadNpmTasks('grunt-contrib-concat')
	grunt.loadNpmTasks('grunt-contrib-uglify')

	# Register default task(s)
	grunt.registerTask('build', ['uglify'])

	grunt.registerTask('build-all', ['uglify:all'])