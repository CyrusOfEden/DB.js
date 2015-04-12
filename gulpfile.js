var gulp = require('gulp');
var babel = require('gulp-babel');
var util = require('gulp-util');

var paths = {
  src: 'src/**/*.js',
  dest: 'lib/'
};

gulp.task('default', function() {
  return gulp.src(paths.src)
    .pipe(babel())
    .pipe(gulp.dest(paths.dest));
});

gulp.task('watch', function() {
  gulp.watch(paths.src, ['default']);
})
