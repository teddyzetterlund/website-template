var gulp        = require('gulp');
var del         = require('del');
var spawn       = require('child_process').spawn;
var browserSync = require('browser-sync');
var prefix      = require('gulp-autoprefixer');

gulp.task('clean', function(done) {
  del(['./_site/', './site.css'], done);
});

gulp.task('jekyll-build', function(done) {
  spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});

gulp.task('browser-sync', ['styles', 'jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('styles', function() {
  gulp.src('./_styles/site.css')
    .pipe(prefix())
    .pipe(gulp.dest('./_site/'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('./')); // So we won't loose it on `jekyll-rebuild`.
});

gulp.task('watch', function() {
  gulp.watch(['_layouts.html', 'index.html', '!_site/**/*'], ['jekyll-rebuild']);
});

gulp.task('build', ['styles', 'jekyll-build']);
gulp.task('server', ['browser-sync', 'watch']);
gulp.task('default', ['server']);
