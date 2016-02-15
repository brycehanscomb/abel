var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');

var config = {
	entryFile: './src/index.js',
	outputDir: './lib/',
	outputFile: 'abel.js'
};

// clean the output directory
gulp.task('clean', function(cb){
	rimraf(config.outputDir, cb);
});

function bundle() {
    browserify(config.entryFile, _.extend({ debug: true }))
		.transform(babelify)
		.bundle()
		.on('error', function(err) { console.log('Error: ' + err.message); })
		.pipe(source(config.outputFile))
		.pipe(gulp.dest(config.outputDir));
}

gulp.task('build', ['clean'], function() {
    bundle();
});