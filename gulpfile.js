const gulp = require('gulp')
const clean = require('gulp-clean')
const cleanhtml = require('gulp-cleanhtml')
const minifycss = require('gulp-minify-css')
const jshint = require('gulp-jshint')
const uglify = require('gulp-uglify')
const zip = require('gulp-zip')
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const pump = require('pump')

// Delete the files in the build directory
gulp.task('clean', function() {
	return gulp.src('build/*', {read: false})
		.pipe(clean());
});

// Copy static folders to build directory
gulp.task('copy', function() {
	gulp.src('src/fonts/**')
		.pipe(gulp.dest('build/fonts'));
	gulp.src('src/icons/**')
		.pipe(gulp.dest('build/icons'));
	gulp.src('src/_locales/**')
		.pipe(gulp.dest('build/_locales'));
	// Copy the devtools.js file, because it doesn't get processed by webpack
	gulp.src('src/devtools.js')
		.pipe(gulp.dest('build'))
	return gulp.src('src/manifest.json')
		.pipe(gulp.dest('build'));
});

// Copy and compress HTML files
gulp.task('html', function() {
	return gulp.src('src/*.html')
		.pipe(cleanhtml())
		.pipe(gulp.dest('build'));
});

// Lint Javascript files with JSHint
gulp.task('jshint', function() {
	return gulp.src('src/scripts/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Build scripts, creating source maps
gulp.task('scripts', ['jshint'], function(cb) {
	// Pump is used to correctly dipslay errors
  pump([
    gulp.src('src/**/*.js'),
    webpackStream(require('./webpack.config.js'), webpack),
    uglify(),
    gulp.dest('build')
  ], cb)
});

// Minify styles
gulp.task('styles', function() {
// 	return gulp.src('src/styles/**/*.css')
// 		.pipe(minifycss({root: 'src/styles', keepSpecialComments: 0}))
// 		.pipe(gulp.dest('build/styles'));
	// Copy the lone CSS file
	// (This will change once more css is used)
	gulp.src('src/style.css')
		.pipe(gulp.dest('build'))
	return gulp.src('src/styles/**')
		.pipe(gulp.dest('build/styles'));
});

//build ditributable and sourcemaps after other tasks completed
gulp.task('zip', ['html', 'scripts', 'styles', 'copy'], function() {
	var manifest = require('./src/manifest'),
		distFileName = manifest.name + ' v' + manifest.version + '.zip',
		mapFileName = manifest.name + ' v' + manifest.version + '-maps.zip';
	//collect all source maps
	gulp.src('build/scripts/**/*.map')
		.pipe(zip(mapFileName))
		.pipe(gulp.dest('dist'));
	//build distributable extension
	return gulp.src(['build/**', '!build/scripts/**/*.map'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'));
});

//run all tasks after build directory has been cleaned
gulp.task('default', ['clean'], function() {
    gulp.start('zip');
});
