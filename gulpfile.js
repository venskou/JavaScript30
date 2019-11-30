'use strict';

// Declare plugins
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const htmlhint = require('gulp-htmlhint');
const prettyHtml = require('gulp-pretty-html');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const autoprefixer = require('gulp-autoprefixer');
const rimraf = require('gulp-rimraf');
const babel = require('gulp-babel');

// Config directories
const dirs = {
  src: {
    html: 'tasks/**/*.html',
    styles: 'tasks/**/*.scss',
    js: 'tasks/**/*.js',
    vendors: 'tasks/**/vendors/*.*',
  },
  dist: {
    html: 'dist/',
    styles: 'dist/',
    js: 'dist/',
    vendors: 'dist/',
  },
  watch: {
    html: 'tasks/**/*.html',
    styles: 'tasks/**/*.scss',
    js: 'tasks/**/*.js',
    vendors: 'tasks/**/vendors/*.*',
  },
  clean: ['dist/*']
};

// Local Server
function server(done) {
  browserSync.init({
    server: {
      baseDir: './dist/',
      directory: true,
    },
    logPrefix: 'localhost',
    notify: false,
  });
  done();
}

// Reload local server
function reloadServer(done) {
  browserSync.reload();
  done();
}

// Clean dist folder
function clean() {
  return gulp.src(dirs.clean)
    .pipe(rimraf());
}

// Build HTML
function buildHTML() {
  return gulp.src(dirs.src.html)
    .pipe(prettyHtml({
      indent_size: 2,
      extra_liners: [],
    }))
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter())
    .pipe(gulp.dest(dirs.dist.html));
}

// Build styles
function buildStyles() {
  return gulp.src(dirs.src.styles)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded',
      indentWidth: 2
    }))
    .pipe(autoprefixer({
      cascade: true
    }))
    .pipe(gulp.dest(dirs.dist.styles));
}

// Build JS
function buildJS() {
   return gulp.src(dirs.src.js)
    .pipe(plumber())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest(dirs.dist.js));
}

// Copy vendors
function copyVendors() {
  return gulp.src(dirs.src.vendors)
    .pipe(gulp.dest(dirs.dist.vendors));
}

// Watch files
function watch() {
  gulp.watch(dirs.watch.html, gulp.series(buildHTML, reloadServer));
  gulp.watch(dirs.watch.styles, gulp.series(buildStyles, reloadServer));
  gulp.watch(dirs.watch.js, gulp.series(buildJS, reloadServer));
  gulp.watch(dirs.watch.vendors, gulp.series(copyVendors, reloadServer));
}

// Export tasks
exports.server = server;
exports.watch = watch;
exports.clean = clean;
exports.buildHTML = buildHTML;
exports.buildStyles = buildStyles;
exports.buildJS = buildJS;
exports.copyVendors = copyVendors;
const build = gulp.series(clean, gulp.parallel(buildHTML, buildStyles, buildJS, copyVendors));
exports.build = build;

// Default task
exports.default = gulp.series(build, server, watch);