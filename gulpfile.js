const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require ("postcss-csso");
const rename = require ("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const terser = require ("gulp-terser");
const imagemin = require ("gulp-imagemin");
const webp = require ("gulp-webp");
const svgstore = require ("gulp-svgstore");
const del = require ("del");
// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemap.write("."))
    .pipe (rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/js/script.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html,reload));
}

exports.default = gulp.series(
  styles, server, watcher
);

//HTML

const html = () =>{
  return gulp.src("source/*.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
}

exports.html = html;

//Images

const optimizeImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin( [
    imagemin.mozjpeg({progressive: true}),
    imagemin.optipng({optimizationLevel:3}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"))
}
exports.optimizeImages = optimizeImages;

// Copy

const copyImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
 .pipe(gulp.dest("build/img"))
}

exports.copyImages = copyImages;

//Scripts
const scripts = () => {
  return gulp.src("source/js/script.js")
  .pipe(terser())
  .pipe(rename("script.min.js"))
  .pipe(gulp.dest("build/js"))
  .pipe(sync.stream());
}

exports.scripts = scripts;

//WebP

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
    .pipe(webp({quality:90}))
    .pipe(gulp.dest("build/img"))
}

exports.createWebp = createWebp;

// Sprite

const sprite = () =>{
  return gulp.src("source/img/icons/sprite-icons/*.svg")
  .pipe(svgstore({
    inlineSvg:true
  }))
  .pipe(rename("sprite2.svg"))
  .pipe(gulp.dest("build"));
}

exports.sprite = sprite;

//Copy

const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/sprite.svg",
    "source/img/**/*.{jpg,png,svg}",
  ], {
    base:"source"
  } )
  .pipe(gulp.dest("build"))
  done();
}

exports.copy = copy;

//Clean

const clean = () => {
  return del("build");
};

exports.clean = clean;

//Build

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    createWebp
  ),
);

exports.build = build;

//Default

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  )
);
