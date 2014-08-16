var gulp        = require('gulp');
var del         = require('del');
var spawn       = require('child_process').spawn;
var browserSync = require('browser-sync');
var prefix      = require('gulp-autoprefixer');

gulp.task('clean', function(done) {
  del(['_site'], done);
});

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

gulp.task('styles', function() {
  gulp.src('site.css')
    .pipe(prefix())
    .pipe(gulp.dest('_site/'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['jekyll-build'], function() {
  gulp.watch(['**/*.html', '!_site/**/*'], ['reload-server', 'styles']);
  gulp.watch('site.css', ['styles']);
});


gulp.task('default', ['start-server', 'watch']);
