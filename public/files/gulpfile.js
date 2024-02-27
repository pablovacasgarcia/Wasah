const {series, parallel, src, dest} = require ("gulp");
const sass = require('gulp-dart-scss');
const sassdoc = require('sassdoc');
const processhtml = require('gulp-processhtml');

var rename = require("gulp-rename");
const cssmin = require('gulp-cssmin');




function concatenar(){
    return src("css/css?.css").pipe(concat("style.css")).pipe(dest("css/"));
}

function minimizar(){
    return src("css/css?.css").pipe(concat("styles.css")).pipe(cssmin()).pipe(dest('css/'));
}

function min_rename(){
    return src("css/css?.css").pipe(concat("styles.css")).pipe(cssmin()).pipe(rename({suffix:".min",extname:".css"})).pipe(dest("css/"));
}

var doc_options = {
    dest:'docs'
}

function generar_docs(){
    return src("scss/styles.scss").pipe(sassdoc(doc_options));
}
function html(){
    return src('*.html').pipe(processhtml()).pipe(dest("subir/"));
}

function todo(){
    return src("scss/styles.scss").pipe(sass()).pipe(cssmin()).pipe(rename({suffix:".min",extname:".css"})).pipe(dest("subir/assets/css/"))
}

exports.concatena=concatenar;
exports.minimiza=minimizar;
exports.minimizayrenombra=min_rename;
exports.todo=todo;
exports.revisahtml=html;