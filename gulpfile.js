var gulp  = require('gulp');
var spawn = require('child_process').spawn;

gulp.task('jekyll', function() {
  spawn('jekyll', ['build'], {stdio: 'inherit'});
});

gulp.task('default', ['jekyll'], function() {
  spawn('jekyll', ['serve'], {stdio: 'inherit'});
  gulp.watch(['**/*.html', '!_site/**/*'], ['jekyll']);
});
