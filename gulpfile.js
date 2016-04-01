var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var include = require("gulp-include");
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

// SASS, AUTOPREFIXR, MINIMIZE
gulp.task('sass', function() {
  var processors = [
        autoprefixer({browsers: [
          'last 1 version',
          'last 2 Chrome versions',
          'last 2 Firefox versions',
          'last 2 Opera versions',
          'last 2 Edge versions'
          ]}),
        cssnano(),
    ];

  console.info('--- Compiling sass...');

  return sass('src/scss/styles.scss')
    .pipe(postcss(processors))
    .pipe(gulp.dest('assets/css'))
    .pipe(reload({ stream:true }));
});

// INCLUDE BLOCKS IN HTML
gulp.task('include', function() {
  console.info('--- Include files...');

  gulp.src('src/index.html')
    .pipe(include())
      .on('error', console.log)
    .pipe(gulp.dest('.'))
    .pipe(reload({ stream:true }));
});

// WATCH SASS, PREPROCESS AND RELOAD
gulp.task('serve', ['sass', 'include'], function() {
  browserSync({
    server: {
      baseDir: '.'
    }
  });

  gulp.watch(['src/**/*.scss'], ['sass']);
  gulp.watch(['src/**/*.html'], ['include']);
  gulp.watch(['assets/**/*.js'], {cwd: '.'}, reload);
});


