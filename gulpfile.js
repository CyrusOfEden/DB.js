var gulp = require('gulp');
var babel = require('gulp-babel');
var util = require('gulp-util');
var source = require('vinyl-source-stream');

gulp.task('default', function() {
  return gulp.src('./src/index.js')
    .pipe(babel())
    .pipe(gulp.dest('./'));
});
