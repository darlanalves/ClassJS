module.exports = function(grunt) {
	var pkg = grunt.file.readJSON('package.json'),
		libName = pkg.name;

	// wrap files
	var wrap = function(files, dest) {
		code = grunt.file.read('src/$prefix.js').toString();

		files.forEach(function(file) {
			code += grunt.file.read(file).toString();
		});

		code += grunt.file.read('src/$suffix.js').toString();
		grunt.file.write(dest, code);
	};

	grunt.registerTask('wrap', function() {
		var done = this.async();
		grunt.file.glob('src/class/*.js', null, function(err, files) {
			if (!err) {
				wrap(files, 'src/$assembled.js');
			}

			done();
		});
	});

	var uglify = {
		options: {
			banner: grunt.file.read('src/banner.txt').toString()
		},

		latest: {
			src: 'src/$assembled.js',
			dest: "dist/classjs-latest.js"
		},

		release: {
			src: 'src/$assembled.js',
			dest: 'dist/classjs-' + pkg.version + '.js'
		}
	};

	var jasmine = {
		latest: {
			src: [
				'vendor/extends-0.0.1.js',
				'dist/classjs-latest.js'
			],
			options: {
				keepRunner: true,
				outfile: 'test.html',
				specs: "test/class/*Spec.js"
			}
		}
	};

	grunt.initConfig({
		pkg: pkg,
		uglify: uglify,
		jasmine: jasmine
	});

	Object.keys(pkg.devDependencies).forEach(function(name) {
		if (name.substring(0, 6) === 'grunt-') {
			grunt.loadNpmTasks(name);
		}
	});

	grunt.registerTask('build', ['wrap', 'uglify:latest', 'jasmine']);
	grunt.registerTask('release', ['wrap', 'uglify:release', 'jasmine']);
	grunt.registerTask('test', ['jasmine']);
};