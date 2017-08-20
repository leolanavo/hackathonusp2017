var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var sqlite3 = require('sqlite3');
var crypto = require('crypto');
var url = require('url');
var pkg = require('./package.json');

var db = new sqlite3.Database('database.db');

var c_help = 0;
// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license %> (https://github.com/BlackrockDigital/<%= pkg.name %>/blob/master/LICENSE)\n',
    ' */\n',
    ''
].join('');

// Compiles SCSS files from /scss into /css
gulp.task('sass', function() {
    return gulp.src('scss/creative.scss')
        .pipe(sass())
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify compiled CSS
gulp.task('minify-css', ['sass'], function() {
    return gulp.src('css/creative.css')
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify custom JS
gulp.task('minify-js', function() {
    return gulp.src('js/creative.js')
        .pipe(uglify())
        .pipe(header(banner, {
            pkg: pkg
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor files from /node_modules into /vendor
// NOTE: requires `npm install` before running!
gulp.task('copy', function() {
    gulp.src([
        'node_modules/bootstrap/dist/**/*',
        '!**/npm.js',
        '!**/bootstrap-theme.*',
        '!**/*.map'
    ])
        .pipe(gulp.dest('vendor/bootstrap'))

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('vendor/jquery'))

    gulp.src(['node_modules/magnific-popup/dist/*'])
        .pipe(gulp.dest('vendor/magnific-popup'))

    gulp.src(['node_modules/scrollreveal/dist/*.js'])
        .pipe(gulp.dest('vendor/scrollreveal'))

    gulp.src(['node_modules/popper.js/dist/umd/popper.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
        .pipe(gulp.dest('vendor/popper'))

    gulp.src(['node_modules/jquery.easing/*.js'])
        .pipe(gulp.dest('vendor/jquery-easing'))

    gulp.src([
        'node_modules/font-awesome/**',
        '!node_modules/font-awesome/**/*.map',
        '!node_modules/font-awesome/.npmignore',
        '!node_modules/font-awesome/*.txt',
        '!node_modules/font-awesome/*.md',
        '!node_modules/font-awesome/*.json'
    ])
        .pipe(gulp.dest('vendor/font-awesome'))
})

// Default task
gulp.task('default', ['sass', 'minify-css', 'minify-js', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
        middleware: function(req,res,next) {
            var values = {};
            if (req.method === 'POST') {
                req.on('data', function (data) {
                    var values = JSON.parse(data);
                    var response = {};
                    console.log('teste');
                    if (req.url === '/login') {
                        response['status'] = 'fail';
                        response['errmsg'] = 'Wrong credentials!';
                        db.each("SELECT * FROM users WHERE username='" + values['username'] + "' OR mail='" + values['username'] + "'", function(err, row) {
                            if (row.passhash == crypto.createHash('md5').update(values['password']).digest('hex')) {
                                response['status'] = 'success';
                                response['errmsg'] = null;
                            } else {
                                response['status'] = 'fail';
                                response['errmsg'] = 'Wrong credentials!';
                            }
                            res.write(JSON.stringify(response));
                            res.end();
                        });
                        return null;
                    } else if (req.url === '/register') {
                        var name = values['fullname'];
                        var username = values['username'];
                        var email = values['email'];
                        var password = values['password'];
                        var password_c = values['password_c'];
                        var passhash = crypto.createHash('md5').update(values['password']).digest('hex');
                        console.log(values);
                        db.all("SELECT * FROM users WHERE username='" + username + "' OR mail='" + email + "'", function(err, rows) {
                            if (rows == undefined || rows.length == 0) {
                                var result = db.run("insert into users values (NULL, \"" + name + "\", \"" + username + "\", \"" + email + "\", \"" + passhash + "\", \"0\")");
                                console.log(result);
                                response['status'] = 'success';
                                console.log(JSON.stringify(response));
                            } else {
                                response['status'] = 'fail';
                                response['errmsg'] = 'Username or email already exists!';
                            }
                            res.write(JSON.stringify(response));
                            res.end();
                        });
                        return null;
                    } else if (req.url === '/info') {
                        console.log(values);
                        db.each("SELECT * FROM helps WHERE id='" + c_help + "'",
                            function(err, row) {
                                db.each("SELECT * FROM users WHERE id='" + row.uid + "'",
                                    function(err2, row_user) {
                                        db.all("SELECT * FROM user_help JOIN users ON user_help.fk_uid = users.id WHERE user_help.fk_help='" + c_help + "'",
                                            function(err3, all_users) {
                                                console.log(err3);
                                                response['users'] = all_users;
                                                response['status'] = 'success';
                                                response['errmsg'] = null;
                                                response['name'] = row_user.name;
                                                response['email'] = row_user.mail;
                                                response['resumo'] = row.resumo;
                                                response['need'] = row.need;
                                                response['p_name'] = row.name;
                                                response['p_link'] = row.project_link;
                                                console.log(JSON.stringify(response));
                                                res.write(JSON.stringify(response));
                                                res.end();
                                            });
                                    });
                            });
                        return null;
                    } else if (req.url === '/u_info') {
                        console.log(values);
                        db.each("SELECT * FROM users WHERE username='" + values['user'] + "'",
                            function(err, row) {
                                db.all("SELECT id,name,need FROM helps WHERE uid='" + row.id + "'",
                                    function(err2, all_row) {
                                        response['status'] = 'success';
                                        response['errmsg'] = null;
                                        response['name'] = row.name;
                                        response['points'] = row.points;
                                        response['projects'] = all_row;
                                        console.log(JSON.stringify(response));
                                        res.write(JSON.stringify(response));
                                        res.end();
                                    });
                            });
                        return null;
                    } else if (req.url === '/addproject') {
                        var p_name = values['p_name'];
                        var username = values['username'];
                        var link = values['webpage'];
                        var need = values['message'];
                        var category = values['category'];
                        var resumo = values['description'];
                        console.log(values);
                        db.each("SELECT * FROM users WHERE username='" + username + "'", function(err, row) {
                            var result = db.run("insert into helps values (NULL, \"" + row.id + "\", \"" + resumo + "\", \"" + need + "\", \"" + p_name + "\", \"" + category + "\", \"" + link + "\")");
                            console.log(result);
                            response['status'] = 'success';
                            console.log(JSON.stringify(response));
                            res.write(JSON.stringify(response));
                            res.end();
                        });
                        return null;

                    } else if (req.url === '/listp') {
                        var category = values['category'];
                        console.log(category);
                        db.all("SELECT helps.* FROM  helps  JOIN users ON uid = users.id WHERE category='" + category + "' order by points desc",
                            function(err, rows) {
                                response['status'] = 'success';
                                response['projects'] = rows;
                                console.log(JSON.stringify(response));
                                res.write(JSON.stringify(response));
                                res.end();
                            });
                        return null;
                    }
                     else if (req.url === '/listp') {
                        var category = values['category'];
                        console.log(category);
                        db.all("SELECT helps.* FROM  helps  JOIN users ON uid = users.id WHERE category='" + category + "' order by points desc",
                            function(err, rows) {
                                response['status'] = 'success';
                                response['projects'] = rows;
                                console.log(JSON.stringify(response));
                                res.write(JSON.stringify(response));
                                res.end();
                            });
                        return null;
                    }
                });
            } else {
                var url_parts = url.parse(req.url, true);
                var query = url_parts.query;
                if (query.id)
                    c_help = query.id;
                return next();
            }
        }
    })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'sass', 'minify-css', 'minify-js'], function() {
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});
