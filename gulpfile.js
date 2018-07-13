'use strict';
const gulp = require('gulp'),
  sass = require('gulp-sass'),
  plumber = require('gulp-plumber'),
  concat = require('gulp-concat'),
  cleanCss = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  gulpif = require('gulp-if'),
  runSequence = require('run-sequence'),
  prefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  imagemin = require('gulp-imagemin'),
  jsonminify = require('gulp-jsonminify'),
  del = require('del');

var nodemon = require('gulp-nodemon');
const srcDir = './src'
const cssDir = './src/assets/css';
const jsDir = './src/assets/js';
const scssDir = './src/assets/scss';
const imgDir = './src/assets/images';

const destDir = './public';
const destAssetDir = './public/assets'

// Bootstrap scss source
gulp.task('sass', function () {
  return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', scssDir + '/*.scss'])
    .pipe(sass())
    .pipe(plumber())
    .pipe(prefixer())
    .pipe(gulpif(file => !(file.path.includes('.min.css')), cleanCss({ compatibility: "ie9" })))
    .pipe(concat('main.css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(destAssetDir + "/css"));
});

// Minify Css
gulp.task('css', function () {
  gulp.src([cssDir + '/*.css'])
    .pipe(plumber())
    .pipe(gulpif(file => !(file.path.includes('.min.css')), cleanCss({ compatibility: "ie9" })))
    .pipe(gulpif(file => !(file.path.includes('.min.css')), rename({ suffix: '.min' })))
    .pipe(gulp.dest(destAssetDir + "/css"));
});

// Jquery Files
gulp.task('jquery', () => {
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js',
    'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
    .pipe(plumber())
    .pipe(gulp.dest(destAssetDir + "/js"))

})

//Minify scripts
gulp.task('scripts', function () {
  return gulp.src(jsDir + '/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    // Minify the file
    .pipe(gulpif(file => !(file.path.includes('.min.js')), uglify()))
    // .pipe(rename({ suffix: '.min' }))
    // Output
    .pipe(gulp.dest(destAssetDir + '/js'))

});

//Minify Images
gulp.task('images', function () {
  return gulp.src(imgDir + '/**/*')
    //.pipe(imagemin({progressive: true}))
    .pipe(gulp.dest(destAssetDir + '/images'));
});

//Moving Html files
gulp.task('html', function () {
  return gulp.src(srcDir + '/**/*.html')
    .pipe(gulp.dest(destDir))
});

// Minify json
gulp.task('json', function () {
  return gulp.src(jsDir + '/*.json')
    .pipe(plumber())
    .pipe(jsonminify())
    .pipe(gulp.dest(destAssetDir + '/js/'))
});

// Delete destination directory
gulp.task('clean', function () {
  del.sync([destAssetDir + '/**'])
});

// Gulp default task
gulp.task('default', ['sass', 'css', 'jquery', 'scripts', 'images', 'html']);

// Gulp build task for production
gulp.task('build', function (callback) {
  runSequence('clean',
    ['sass', 'css'],
    'jquery', 'scripts', 'images', 'html', 'json',
    callback);
});

// Gulp build task for development
gulp.task('dev_build', function (callback) {
  runSequence(
    ['sass', 'css'],
    'scripts', 'images', 'html', 'json',
    callback);
});

// Configuring nodemon for static files
var nodemonOptions = {
  script: 'index.js',
  "ext": "js css",
  verbose: false,
  ignore: [],
  watch: ['src/**/*', 'index.js']
};

gulp.task('start', ['build'], function (done) {
  var stream = nodemon({
    script: 'index.js'
    , ext: 'html js css json'
    , ignore: [],
    watch: ['src/*', 'index.js'],
    tasks: ['sass', 'css', 'scripts', 'images', 'html', 'json'],
    done: done
  })
  stream
    .on('restart', function () {
      console.log('restarted!')
    });
});





