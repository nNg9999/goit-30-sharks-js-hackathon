import Dashboard from "../pages/Dashboard/Dashboard";
import Top from "../pages/Top/Top";

console.log(Dashboard);
console.log(Top);

function getCurrentPath() {
    return location.pathname;
}

function init() {
    const root = document.getElementById('root');
    const path = getCurrentPath();

    switch (path) {
        case '/': {
            Dashboard(root);

            break;
        }
        case '/top': {
            Top(root);

            break;
        }

        default: {

            break;
        }
    }
}

init();


// var routes = require('gulp-routes');
// var Router = require('en-route').Router;
// var router = new Router();

// // define middleware
// router.all(/\.hbs/, function (file, next) {
//     var str = file.contents.toString();
//     // do anything to `file` that can be done
//     // in a gulp plugin
//     file.contents = new Buffer(str);
//     next();
// });

// // pass the router to `gulp-routes`
// var route = routes(router);

// gulp.src('*.hbs')
//     .pipe(route())
//     .pipe(gulp.dest('_gh_pages/'));

