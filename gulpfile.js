var gulp = require('gulp');
var gulpif = require('gulp-if');
var argv = require('yargs').argv;
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var nodemon = require('gulp-nodemon');
var nodeInspector = require('gulp-node-inspector');
var browserSync = require('browser-sync');

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var less = require('gulp-less');

var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var notify = require('gulp-notify');
var clean = require('gulp-clean');

var BROWSER_SYNC_RELOAD = 1000;
var DEBUG_FLAG = false;

if (argv.dev) {
  DEBUG_FLAG = argv.dev
}

if (argv.d) {
  DEBUG_FLAG = true;
}

var dist_base = './client/public';

var paths = {
  client: {
    js: [
      './client/app.js',
      './client/app/**/**/*.js',
      './client/components/**/*.js'
    ],
    less: './client/assets/less/app.less',
    image: './client/assets/images/**/*.{jpg,jpeg,png,gif}'
  },
  server: {
    app: './server/app.js',
    js: ['./server/**/*.js'],
  },
  vendor_js: {
    angular: [
      './vendor/angular/angular.min.js',
      './vendor/angular-resource/angular-resource.min.js',
      './vendor/angular-cookies/angular-cookies.min.js',
      './vendor/angular-sanitize/angular-sanitize.min.js',
      './vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
      './vendor/lodash/dist/lodash.compat.min.js',
      './vendor/angular-socket-io/socket.min.js',
      './vendor/angular-ui-router/release/angular-ui-router.min.js',
      './node_modules/socket.io-client/socket.io.js'
    ],
    other: [
      './client/assets/js/*.js',
      './vendor/jquery/dist/jquery.min.js',
      './vendor/bootstrap/dist/bootstrap.min.js'
    ]
  },
  vendor_less: './client/assets/less/vendor.less',
  vendor_css: './client/assets/css/*.css',
  fonts: [
    './vendor/font-awesome/fonts/*',
    './vendor/bootstrap/fonts/*'
  ],
  build: {
    css: './client/build/css'
  },
  dist: {
    js:     dist_base + '/js',
    css:    dist_base + '/css',
    img:    dist_base + '/images',
    fonts:  dist_base + '/fonts'
  }
};

var nodemon_options = {
  script: paths.server.app,
  watch: './server/'
}

gulp.task('clean', function() {
  return gulp.src(['./public/'], {read: false, force: true})
    .pipe(clean());
})

gulp.task('clean:build', function() {
  return gulp.src(['./client/build/'], {read: false, force: true})
    .pipe(clean());
});

// Server javascript files
gulp.task('server-lint', function() {
  return gulp.src(paths.server.js)
    .pipe(jshint()).pipe(jshint.reporter(stylish))
    .pipe(notify({message: 'Finished linting server js files', onLast: true}));
});

// All client-side javascript files
gulp.task('build:angular', function() {
  return gulp.src(paths.vendor_js.angular)
    .pipe(concat('angular.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js));
});

gulp.task('build:vendor-js', function() {
  return gulp.src(paths.vendor_js.other)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.dist.js));
});

gulp.task('build:client-js', function() {
  return gulp.src(paths.client.js)
    .pipe(sourcemaps.init())
      .pipe(jshint())
      .pipe(jshint.reporter(stylish))
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .pipe(gulpif(!DEBUG_FLAG, uglify()))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist.js))
    .pipe(notify({message: 'Client-side js files built', onLast: true }));
});

// All client-side less and css
gulp.task('build:vendor-less', function() {
  return gulp.src(paths.vendor_less)
    .pipe(plumber())
    .pipe(less({compress: true}))
    .pipe(gulp.dest(paths.build.css));
});

gulp.task('build:other-css', function() {
  return gulp.src(paths.vendor_css)
    .pipe(minifyCSS())
    .pipe(concat('other.css'))
    .pipe(gulp.dest(paths.build.css));
});

gulp.task('build:client-less', function() {
  return gulp.src(paths.client.less)
    .pipe(less({compress: true}))
    .pipe(gulp.dest(paths.dist.css))
    .pipe(notify({message: 'Client-side less files compiled', onLast: true }));
});

gulp.task('build:move-css', function() {
  return gulp.src(paths.build.css + '/*.css')
    .pipe(minifyCSS())
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(paths.dist.css))
});

// Assets
gulp.task('images', function() {
  return gulp.src(paths.client.image)
    .pipe(imagemin({progressive: true, optimizationLevel: 3, use: [pngquant()]}))
    .pipe(gulp.dest(paths.dist.img))
});

gulp.task('fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest(paths.dist.fonts));
});

gulp.task('index', function() {
  return gulp.src(['./client/index.html', './client/favicon.ico', './client/robots.txt'])
    .pipe(gulp.dest(dist_base));
});

gulp.task('build:vendor-css', function(cb) {
  runSequence('clean:build', 
              ['build:vendor-less', 'build:other-css'],
              'build:move-css', cb);
});

gulp.task('build', function(cb) {
  runSequence('clean', 'clean:build', 'server-lint',
              ['build:angular', 'build:vendor-js', 'build:client-js'],
              ['build:vendor-css', 'build:client-less'],
              ['fonts', 'images', 'index'], cb);
});

gulp.task('serve', function(cb) {
  var called = false;
  if (DEBUG_FLAG === true) {
    nodemon_options.nodeArgs = ['--debug'];
    nodemon_options.env = { 'NODE_ENV': 'development' };
  } else {
    nodemon_options.env = { 'NODE_ENV': 'production' };
  }
  return nodemon(nodemon_options)
    .on('start', function onStart() {
      if (!called) {cb();}
      called = true;
    })
    .on('restart', function onRestart() {
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        })
      }, BROWSER_SYNC_RELOAD);
    });
});

gulp.task('watch', function() {
  var port = (DEBUG_FLAG) ? '9000' : '8080';
  browserSync.init({
    files: ['./public/**/*.*', 
            './client/index.html',
            './client/app/**/**/*.html',
            './client/components/**/**/*.html'],
    proxy: 'http://localhost:' + port,
    port: 3000,
    browser: ['google chrome']
  });

  gulp.watch(paths.client.js, ['build:client-js']);
  gulp.watch(paths.client.less, ['build:client-less']);
  gulp.watch(paths.client.image, ['images']);
  gulp.watch(paths.server.js, ['server-lint']);
  gulp.watch([paths.vendor_css,paths.vendor_less], ['build:vendor-css']);
  gulp.watch(paths.vendor_js.other, ['build:vendor-js']);
});

gulp.task('default', function(cb) {
  runSequence('build', cb);
});

gulp.task('develop', function(cb) {
  DEBUG_FLAG = true;
  runSequence('build', 'serve', 'watch', cb);
});

gulp.task('production', function(cb) {
  DEBUG_FLAG = false;
  runSequence('build', 'serve', 'watch', cb);
});