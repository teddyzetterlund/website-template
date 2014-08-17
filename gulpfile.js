var gulp        = require('gulp');
var del         = require('del');
var spawn       = require('child_process').spawn;
var browserSync = require('browser-sync');
var prefix      = require('gulp-autoprefixer');
var rev         = require('gulp-rev');
var inject      = require('gulp-inject');

gulp.task('clean', function(done) {
  var manifest = require('./rev-manifest.json');
  del(['_site/', 'site.css', 'rev-manifest.json', manifest['site.css']], done);
});

gulp.task('jekyll-build', function(done) {
  spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function() {
  browserSync.reload();
});

gulp.task('styles', function() {
  return gulp.src('_styles/site.css')
    .pipe(prefix())
    .pipe(gulp.dest('./_site/'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('./')); // So we won't loose it on `jekyll-(re)build`.
});

gulp.task('browser-sync', ['styles', 'jekyll-build'], function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
});

gulp.task('watch', function() {
  gulp.watch(['index.html'], ['jekyll-rebuild']);
  gulp.watch(['_styles/site.css'], ['styles']);
});

gulp.task('rev-styles', ['styles'], function() {
  return gulp.src('site.css')
    .pipe(rev())
    .pipe(gulp.dest('.'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('.'));
});

gulp.task('rev-html', ['rev-styles'], function() {
  var manifest = require('./rev-manifest.json');

  gulp.src('_site/index.html')
    .pipe(inject(gulp.src(manifest['site.css'])))
    .pipe(gulp.dest('_site'));
});

gulp.task('build', ['rev-html']);
gulp.task('server', ['browser-sync', 'watch']);
gulp.task('default', ['server']);
