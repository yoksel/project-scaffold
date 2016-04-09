var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var include = require("gulp-include");
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var rename = require('gulp-rename');
var mqpacker = require("css-mqpacker");
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var copy = require('gulp-copy');
var ghPages = require('gulp-gh-pages');
var colors = require('colors/safe');
var del = require('del');
var posthtml = require('gulp-posthtml');

gulp.task('test', function () {
    return gulp.src('test.html')
        .pipe(posthtml([
            require('posthtml-classes')({
                fileSave: true,
                filePath: './classList.css',
                overwrite: false,
                eol: '\n',
                nested: false
            })
        ]));
});

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
        mqpacker()
    ];

  console.log('⬤  Run ' + colors.yellow('Sass') +
              ' + ' +
              colors.green('Autoprefixer') +
              ' + ' +
              colors.cyan('Cssnano') + ' ⬤'
              );

  return sass('src/scss/styles.scss')
    .pipe(postcss(processors))
    .pipe(gulp.dest('assets/css'))
    .pipe(reload({ stream:true }))
    .pipe(postcss([cssnano()]))
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('assets/css'));
});

// IMAGES
gulp.task('images', function () {
  console.log(colors.magenta('⬤  Optimize images... ⬤'));

  return gulp.src('src/img/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('assets/img'));
});

// INCLUDE BLOCKS IN HTML
gulp.task('include', function() {
  console.log(colors.blue('⬤  Include files to HTML... ⬤'));

  gulp.src('src/index.html')
    .pipe(include())
      .on('error', console.log)
    .pipe(gulp.dest('.'))
    .pipe(reload({ stream:true }));
});

// WATCH SASS, PREPROCESS AND RELOAD
gulp.task('serve', ['sass'], function() {
  browserSync({
    server: {
      baseDir: '.'
    }
  });

  gulp.watch(['src/**/*.scss'], ['sass']);
  gulp.watch(['src/**/*.html'], ['include']);
  gulp.watch(['assets/**/*.js'], {cwd: '.'}, reload);
});

// CLEAN BUILD
gulp.task('clean', function(){
  del(['build/*']).then(paths => {
    console.log('⬤  Deleted files and folders:\n', paths.join('\n'));
  });
});

// CLEAN BUILD & COPY FILES TO IT
gulp.task('copy', ['clean'], function() {
  console.log(colors.magenta('⬤  Clear build/ and copy files to it... ⬤'));

  return gulp.src(['assets/**/*', '*.html'])
    .pipe(copy('build/'));
});

// PUBLISH TO GITHUB PAGES
gulp.task('ghPages', function() {
  console.log(colors.rainbow('⬤  Publish to Github Pages... ⬤'));

  return gulp.src('build/**/*')
    .pipe(ghPages());
});
