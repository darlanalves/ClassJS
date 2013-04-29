module.exports = (pkg)->
	packages =
		core:
			src: [
				"src/core/Class.js",
				#"src/core/ClassManager.js",
				#"src/core/EventManager.js",
				#"src/core/HookManager.js",
				#"src/core/Component.js"
			]
			dest: 'dist/core.js'

		model:
			src: [
				"src/model/Types.js",
				"src/model/Field.js",
				"src/model/Model.js"
			]
			dest: 'dist/model.js'

		service:
			src:[
				'src/service/ServiceLocator.js'
			]
			dest: 'dist/service.js'

		view:
			src: [
				"src/view/ViewAbstract.js",
				"src/view/LiveView.js",
				"src/view/LiteView.js",
				"src/view/LiveRange.js",
			]
			dest: 'dist/view.js'
		form:
			src:[
				"src/form/Button.js",
				"src/form/ButtonGroup.js",
				"src/form/Form.js",
				"src/form/Group.js",
				"src/form/Input.js",
				"src/form/Text.js",
				"src/form/Toolbar.js"
			]
			dest: 'dist/form.js'

		release:
			dest: "release/whappjs-#{pkg.version}.js"

		###
		all:
			src: [
				'dist/core.js'
				'dist/model.js'
				'dist/service.js'
				'dist/view.js'
				'dist/form.js'
			]
			dest: "dist/whappjs-all.js"
		###

	allFiles = []
	for name in ['core', 'model', 'service', 'view', 'form']
		allFiles = allFiles.concat packages[name].src

	packages.release.src = allFiles
	# packages.all.src =

	return packages
