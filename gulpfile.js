(function() {

  'use strict';

  // Include Gulp & Plugins
  var gulp         = require('gulp'),
      sass         = require('gulp-sass')(require('sass')),
      cleanCSS     = require('gulp-clean-css'),
      autoprefixer = require('gulp-autoprefixer'),
      concat       = require('gulp-concat'),
      rename       = require('gulp-rename'),
      uglify       = require('gulp-uglify'),
      jshint       = require('gulp-jshint'),
      replace      = require('gulp-replace'),
      size         = require('gulp-size'),
      zip          = require('gulp-zip'),
      fs           = require('fs');

  // SASS
  gulp.task('sass', function (done) {
    return gulp.src('./assets/sass/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./assets/css'))
    .pipe(size())
    done();
  });

  // inlineCSS
  gulp.task('inlinecss', function(done) {
    return gulp.src(['partials/inline-css.hbs'])
    .pipe(replace('@@compiled_css', fs.readFileSync('assets/css/style.min.css')))
    .pipe(gulp.dest('partials/compiled'))
    done();
  });

  // inlineCSSDark
  gulp.task('inlinecssdark', function(done) {
    return gulp.src(['partials/inline-css-dark.hbs'])
    .pipe(replace('@@compiled_css_dark', fs.readFileSync('assets/css/dark.min.css')))
    .pipe(gulp.dest('partials/compiled'))
    done();
  });

  // JavaScript
  gulp.task('js', function(done) {
    return gulp.src([
      './bower_components/jquery/dist/jquery.js',
      './bower_components/bootstrap-transition/scripts/transition.js',
      './bower_components/zoom.js/dist/zoom.js',
      './bower_components/jquery.fitvids/jquery.fitvids.js',
      './bower_components/jQuery-viewport-checker/dist/jquery.viewportchecker.min.js',
      './bower_components/masonry-layout/dist/masonry.pkgd.min.js',
      './bower_components/imagesloaded/imagesloaded.pkgd.min.js',
      './node_modules/lazysizes/lazysizes.min.js',
      './node_modules/evil-icons/assets/evil-icons.min.js',
      './node_modules/clipboard/dist/clipboard.js',
      './node_modules/prismjs/prism.js',
      './assets/js/app.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(concat('app.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest('./assets/js'))
      .pipe(size())
      done();
  });

  // Watch
  gulp.task('watch', function() {
    gulp.watch('assets/sass/**/*.scss', gulp.series('build_css'));
    gulp.watch(['./assets/js/app.js'], gulp.series('js'));
  });

  gulp.task(
    'build_css',
    gulp.series('sass', 'inlinecss', 'inlinecssdark')
  );

  gulp.task(
    'build',
    gulp.series('build_css', 'js')
  );

  gulp.task('zip', function () {
    return gulp.src([
      './**',
      '!node_modules/**',
      '!bower_components/**',
      '!.git/**',
      '!.DS_Store',
      '!package-lock.json'
    ], { dot: true })
    .pipe(zip('sinai.zip'))
    .pipe(gulp.dest('../'))
    done();
  });

  gulp.task(
    'default',
    gulp.series('build', 'watch')
  );

})();