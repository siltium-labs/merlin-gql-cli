const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const nodemon = require("gulp-nodemon");
const sourcemaps = require("gulp-sourcemaps");
const relativeSourcemapsSource = require("gulp-relative-sourcemaps-source");

gulp.task("assets", () => {
    return gulp.src(["./src/**/*", "!./src/**/*.ts"]).pipe(gulp.dest("dist"));
});

gulp.task(
    "compile",
    gulp.series(() => {
        return gulp
            .src("src/**/*.ts")
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .pipe(relativeSourcemapsSource({ dest: "dist" }))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("dist"));
    }, "assets")
);

gulp.task("nodemon", cb => {
    let started = false;
    return nodemon({
        script: "dist/app.js"
    }).on("start", () => {
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task("watch", () => {
    return gulp.watch(["src/**/*.ts", "src/**/*.json","src/**/*.graphql","src/**/*.ejs"], gulp.series("compile"));
});

gulp.task("default", gulp.parallel("watch", gulp.series("compile", "nodemon")));
