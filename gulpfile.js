var gulp        = require('gulp');
var spawn       = require('child_process').spawn;
var browserSync = require('browser-sync');

gulp.task('jekyll-build', function(done) {
  spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('start-server', ['jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('reload-server', ['jekyll-build'], function() {
  browserSync.reload();
});

gulp.task('watch', ['jekyll-build'], function() {
  gulp.watch(['**/*.html', '!_site/**/*'], ['reload-server']);
});


gulp.task('default', ['start-server', 'watch']);
