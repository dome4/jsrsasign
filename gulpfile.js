'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const git = require('gulp-git');
const bump = require('gulp-bump');
const fs = require('fs');

// helper function
const getPackageJsonVersion = function () {
  const pkg = JSON.parse(fs.readFileSync('./npm/package.json', 'utf8'));

  if (!pkg.version) {
    throw new Error('package.json - version not found');
  }

  return pkg.version;
};

// Transpile, concatenate and minify scripts
gulp.task('publishJwths', function () {
  var files = [
    'npm/lib/header.js',
    'npm/lib/jsrsasign-jwths-min.js',
    'npm/lib/footer.js',
  ];

  return gulp
    .src(files)
    .pipe(concat('jsrsasign.js')) // merge files
    .pipe(uglify()) // minimize
    .pipe(gulp.dest('./dist/jsrsasign-jwths/'));
});

// Update bower, component, npm at once:
gulp.task('bump', function () {
  const version = getPackageJsonVersion();

  return gulp
    .src(['./package.json'])
    .pipe(bump({ version: version }))
    .pipe(gulp.dest('./'));
});

gulp.task('commit', function () {
  const version = getPackageJsonVersion();

  return gulp
    .src('./dist/*')
    .pipe(git.add())
    .pipe(git.commit(`Release ${version}`));
});

const build = gulp.series('publishJwths', 'bump', 'commit');

exports.build = build;
exports.default = build;
