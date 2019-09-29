'use strict';

// Declare plugins
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const htmlhint = require('gulp-htmlhint');
const prettyHtml = require('gulp-pretty-html');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const cssnano = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const rimraf = require('gulp-rimraf');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');

// Config directories
const dirs = {
  src: {
    html: 'tasks/**/*.html',
    styles: 'tasks/**/*.scss',
    js: 'tasks/**/*.js',
  },
  dist: {
    html: 'dist/',
    styles: 'dist/',
    js: 'dist/',
  },
  watch: {
    html: 'tasks/**/*.html',
    styles: 'tasks/**/*.scss',
    js: 'tasks/**/*.js',
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
function buildHTML(done) {
  gulp.src(dirs.src.html)
    .pipe(prettyHtml({
      indent_size: 2,
      extra_liners: [],
    }))
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter())
    .pipe(gulp.dest(dirs.dist.html));
  done();
}

// Build styles
function buildStyles(done) {
  gulp.src(dirs.src.styles)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded',
      indentWidth: 2
    }))
    .pipe(autoprefixer({
      cascade: true
    }))
    .pipe(gulp.dest(dirs.dist.styles))
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min',
      extname: '.css',
    }))
    .pipe(gulp.dest(dirs.dist.styles));
  done();
}

// Build JS
function buildJS(done) {
  gulp.src(dirs.src.js)
    .pipe(plumber())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest(dirs.dist.js))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min',
      extname: '.js'
    }))
    .pipe(gulp.dest(dirs.dist.js));
  done();
}

// Watch files
function watch() {
  gulp.watch(dirs.watch.html, gulp.series(buildHTML, reloadServer));
  gulp.watch(dirs.watch.styles, gulp.series(buildStyles, reloadServer));
  gulp.watch(dirs.watch.js, gulp.series(buildJS, reloadServer));
}

// Export tasks
exports.server = server;
exports.watch = watch;
exports.clean = clean;
exports.buildHTML = buildHTML;
exports.buildStyles = buildStyles;
exports.buildJS = buildJS;
const build = gulp.series(clean, gulp.parallel(buildHTML, buildStyles, buildJS));
exports.build = build;

// Default task
exports.default = gulp.series(build, server, watch);