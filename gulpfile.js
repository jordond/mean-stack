var gulp = require('gulp');
var gutil = require('gulp-util');
var changed = require('gulp-changed');
var notify = require('gulp-notify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var clean = require('gulp-clean');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon')
var refresh = require('gulp-livereload');
var server = require('tiny-lr')();
var port = 35728; // default 35729

var paths = {
  client: {
    html: [
      './client/index.html',
      './client/app/**/**/*.html',
      './client/components/**/**/*.html'
    ],
    js: [
      './client/app.js',
      './client/app/**/**/*.js',
      './client/components/**/*.js'
    ],
    less: './client/assets/less/app.less'
  },
  server: {
    app: './server/app.js',
    js: ['./server/**/*.js'],
  },
  vendor_js: {
    angular: [
      './client/vendor/angular/angular.js',
      './client/vendor/angular-resource/angular-resource.js',
      './client/vendor/angular-cookies/angular-cookies.js',
      './client/vendor/angular-sanitize/angular-sanitize.js',
      './client/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      './client/vendor/lodash/dist/lodash.compat.js',
      './client/vendor/angular-socket-io/socket.js',
      './client/vendor/angular-ui-router/release/angular-ui-router.js'
    ],
    other: [
      './client/vendor/jquery/dist/jquery.js',
      './client/vendor/bootstrap/dist/bootstrap.js',
    ]
  },
  vendor_less: './client/assets/less/vendor.less',
  vendor_css: [
    ''
  ],
  fonts: [
    './client/vendor/font-awesome/fonts/*',
    './client/vendor/bootstrap/fonts/*'
  ],
  dest: {
    js:     './client/public/js',
    css:    './client/public/css',
    img:    './client/public/images',
    fonts:  './client/public/fonts'
  }
};

var options = {
  script: paths.server.app,
  env: { 'NODE_ENV': 'development' },
  watch: './server/',
  ignore: ['./client/app.js', './client/', './client/app/', './client/public/js/']
}

gulp.task('clean', function() {
  return gulp.src('./client/public/', {read: false, force: true})
    .pipe(clean());
});

gulp.task('server-lint', function() {
  return gulp.src(paths.server.js)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(notify({message: 'Finished linting server js files', onLast: true}));
});

gulp.task('angular-js', function() {
  return gulp.src(paths.vendor_js.angular)
    .pipe(plumber())
    .pipe(concat('angular.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dest.js));
});

gulp.task('vendor-js', function() {
  return gulp.src(paths.vendor_js.other)
    .pipe(plumber())
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dest.js));
});

gulp.task('vendor-less', function() {
  return gulp.src(paths.vendor_less)
    .pipe(plumber())
    .pipe(less({compress: true}))
    .pipe(gulp.dest(paths.dest.css));
});

gulp.task('vendor-fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.dest.fonts));
});

gulp.task('client-js', function() {
  return gulp.src(paths.client.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dest.js))
    .pipe(refresh(server))
    .pipe(notify({message: 'Client-side js files built', onLast: true }));
});

gulp.task('client-less', function() {
  return gulp.src(paths.client.less)
    .pipe(plumber())
    .pipe(less({compress: true}))
    .pipe(gulp.dest(paths.dest.css))
    .pipe(refresh(server))
    .pipe(notify({message: 'Client-side less files compiled', onLast: true }));
});

gulp.task('html', function() {
  return gulp.task('html', function(){
    gulp.src(paths.client.html)
    .pipe(refresh(server))
    .pipe(notify({message: 'HTML files were reloaded', onLast: true }));
  });
});

gulp.task('build:angular', ['angular-js']);
gulp.task('build:vendor', ['vendor-js', 'vendor-less', 'vendor-fonts']);
gulp.task('build:client', ['client-js', 'client-less']);

gulp.task('build', ['build:angular', 'build:vendor', 'build:client']);

gulp.task('serve', ['server-lint'], function() {
  nodemon(options);
});

gulp.task('serve:production', ['server-lint'], function() {
  options.env = { 'NODE_ENV': 'production' },
  nodemon(options);
});

gulp.task('lr', function() {
  server.listen(port, function(err){
    if(err) {return console.error(err);}
    gutil.log('Launched livereload server on port ' + port);
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.client.html, ['html']);
  gulp.watch(paths.client.js, ['client-js']);
  gulp.watch(paths.client.less, ['client-less']);
  gulp.watch(paths.server.js, ['server-lint']);
});

// Main Tasks
gulp.task('default', ['build', 'serve', 'lr', 'watch']);
gulp.task('develop:prod', ['build', 'serve:production', 'lr', 'watch']);
gulp.task('production', ['server-lint', 'build']);