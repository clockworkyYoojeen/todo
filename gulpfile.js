// paths
let project_folder = "dist" // папка с готовым проектом
let source_folder = "src" // источник файлов для сборки

let path = {
    build: { // пути для сборки (куда сливаем)
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts",
        bootstrap: project_folder + "/bootstrap/css",
        bootstrap_fonts: project_folder + "/bootstrap/fonts"
    },
    src: { // пути для исходных файлов 
        // не включать в сборку html файлы, начинающиеся с символа подчёркивания (_header.html и т.п)
        html: [source_folder + "/*.html", "!"+source_folder + "/_*.html"],
        css: [source_folder + "/scss/main.scss",source_folder + "/scss/media.scss", source_folder + "/scss/reset.css"], // можно писать пути к нескольким файлам (в массиве)
        js: source_folder + "/js/common.js",
        bootstrap: [source_folder + "/libs/bootstrap/css/bootstrap-grid.min.css", source_folder + "/libs/bootstrap/css/bootstrap.min.css"],
        bootstrap_fonts: [source_folder + "/libs/bootstrap/fonts/*.{eot,ttf,svg,woff,woff2}"],
        img: source_folder + "/img/**/*.{png,jpg,jpeg,ico,gif,webp}",
        fonts: source_folder + "/fonts/*.{ttf}",
        uuid: source_folder + "/uuid/**/*"
    },
    watch: { // пути для наблюдения
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{png,jpg,jpeg,ico,gif,webp}",
    },
    clean: "./" + project_folder + "/"
}
// переменные из установленных пакетов
let {src, dest} = require('gulp')
let gulp = require('gulp')
browsersync = require('browser-sync').create() // автообновление браузера
let fileinclude = require('gulp-file-include') // подключаемые файлы
let del = require('del')
let scss = require('gulp-sass') // работа с sass
let autoprefixer = require('gulp-autoprefixer') // префиксы css для разных браузеров
let clean_css = require('gulp-clean-css') // минификация css
let gulp_rename = require('gulp-rename') // переименование файлов
let uglify_es = require('gulp-uglify-es').default // минификация js файлов
let imagemin = require('gulp-imagemin') // минификация изображений


// автообновление браузера
function browserSync(){
    browsersync.init({
        server:  "./" + project_folder + "/" ,
        port: 8080,
        notify: false
    })
}

// обработка html
function html(){
    return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}
// bootstrap отдельно
function bootstrap(){
    return src(path.src.bootstrap)
    .pipe(dest(path.build.bootstrap))
    .pipe(browsersync.stream())
}
// bootstrap fonts
function bootstrap_fonts(){
    return src(path.src.bootstrap_fonts)
    .pipe(dest(path.build.bootstrap_fonts))
    .pipe(browsersync.stream())
}

function css(){
    return src(path.src.css)
    .pipe(
        scss({
            outputStyle: 'expanded'
        })
    )
    .pipe(autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true
    }))
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(gulp_rename({
        extname: ".min.css"
    }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function js(){
    return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(
        uglify_es()
    )
    .pipe(
        gulp_rename({
            extname: ".min.js"
        })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}
function uuid(){
    return src(path.src.uuid)
    .pipe(dest(path.build.js))
}
function images(){
    return src(path.src.img)
    .pipe(
        imagemin({
            progressive: true,
            interlaced: true,
            optimizationLevel: 3
        })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}
// следим за файлами
function watchFiles(){
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], images)
}

function clean(){
    return del(path.clean)
}
// конечная сборка
let build = gulp.series(clean, gulp.parallel(js, css, html, bootstrap, uuid, bootstrap_fonts, images))
let watch = gulp.parallel(build, watchFiles, browserSync)

exports.images = images
exports.js = js
exports.css = css
exports.build = build
exports.html = html
exports.watch = watch
exports.default = watch
exports.uuid = uuid