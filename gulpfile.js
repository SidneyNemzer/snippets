const gulp = require('gulp')
const clean = require('gulp-clean')
const cleanhtml = require('gulp-cleanhtml')
const uglify = require('gulp-uglify')
const zip = require('gulp-zip')
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const pump = require('pump')
const todo = require('gulp-todo')

// Delete the files in the build directory
gulp.task('clean', function() {
	return gulp.src('build/*', {read: false})
		.pipe(clean())
});

// Copy static folders and files to build directory
gulp.task('copy', function() {
	gulp.src('src/icons/**')
		.pipe(gulp.dest('build/icons'))
	// Copy the devtools.js file, because it doesn't get processed by webpack
	gulp.src('src/devtools.js')
		.pipe(gulp.dest('build'))
	return gulp.src('src/manifest.json')
		.pipe(gulp.dest('build'))
});

// Minify and copy HTML files
gulp.task('html', function() {
	return gulp.src('src/*.html')
		.pipe(cleanhtml())
		.pipe(gulp.dest('build'))
});

gulp.task('todo', function() {
	gulp.src(['src/**/*.js', 'gulpfile.js', 'webpack.config.js'])
		.pipe(todo())
		.pipe(gulp.dest('.'))
})

gulp.task('scripts-build', ['todo'], function (cb) {
	pump([
		gulp.src('src/**/*.js'),
		webpackStream(require('./webpack.config.js'), webpack),
		gulp.dest('build')
	], cb)
})

// Build scripts into a single file with Webpack and UglifyJS
gulp.task('scripts-build-minify', ['todo'], function (cb) {
  pump([
    gulp.src('src/**/*.js'),
    webpackStream(require('./webpack.config.js'), webpack),
    uglify(),
    gulp.dest('build')
  ], cb)
});

// Minify and copy CSS files
gulp.task('styles', function() {
	return gulp.src('src/styles/**')
		.pipe(gulp.dest('build/styles'))
});

// Create the distributable zip file
gulp.task('zip', ['html', 'scripts-build-minify', 'styles', 'copy'], function() {
	const manifest = require('./src/manifest')
	const distFileName = manifest.name + ' v' + manifest.version + '.zip'
	const mapFileName = manifest.name + ' v' + manifest.version + '-maps.zip'
	// Collect all source maps
	gulp.src('build/scripts/**/*.map')
		.pipe(zip(mapFileName))
		.pipe(gulp.dest('dist'))
	// Build distributable extension
	return gulp.src(['build/**', '!build/scripts/**/*.map'])
		.pipe(zip(distFileName))
		.pipe(gulp.dest('dist'))
});

gulp.task('build-dev', ['clean'], function () {
	gulp.start('html')
	gulp.start('scripts-build')
	gulp.start('styles')
	gulp.start('copy')
})

// TODO Configure sourcemaps for production
gulp.task('build-prod', ['clean'], function() {
    gulp.start('zip')
});
