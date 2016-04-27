var src = 'src/',
    src_modules = src + 'assets/css_modules/',
    dest = 'build/static/',
    paths = {
        src: src,
        src_modules: src_modules,
        dest: dest,
        index: 'src/index.html',
        js_libs: {
            src: src + 'assets/js_libs/*.js',
            dest: dest + 'js/libs/'
        },
        fonts: {
            src: src + 'assets/fonts/**/*.{ttf,woff,svg,eot,woff2}',
            dest: dest + 'fonts/'
        },
        css: {
            src: [
                src_modules + 'i-*/*.{css,scss}',
                src_modules + 'g-*/*.{css,scss}',
                src_modules + 'b-*/*.{css,scss}',
                src_modules + '**/*.{css,scss}'
            ],
            name: 'style.css',
            dest: dest + 'css/'
        },
        img: {
            name: '**/*.{png,jpg,gif,svg,ico}',
            src: [
                src_modules + '**/*.{png,jpg,gif,svg,ico}',
                '!' + src_modules + '**/i-*.png'
            ],
            dest: dest + 'img/'
        },
        sprite: {
            block: 'i-icons',
            src: src_modules + '**/i-*.png',
            css: {
                name: 'i-icons' + '.css',
                dest: src_modules + 'i-icons'
            },
            img: {
                name: 'icons.png',
                dest: src_modules + 'i-icons'
            },
            tmpl: src_modules + 'i-icons' + '/' + 'i-icons' + '.hbs'
        }
    };

module.exports = paths;