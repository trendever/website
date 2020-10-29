#Trendever website
###How to install:

  1. Clone project :

    + `git clone git@github.com:trendever/website.git`


  2. Install npm :

    + `Download and install from https://nodejs.org/en/download/`
    + `Set to system "PATH" variable "NODE_HOME" variable ("Users/%user%/AppData/Roaming/npm")`
    + `Set to system "PATH" variable "%NODE_HOME%\npm_modules" value`

  4. Install webpack:

    +  `npm i webpack -g`

  5. Install dependencies (run from root project) :

    + `npm install`

  6. Copy and Rename "config.default.js" file to "config.js".

  7. Run project (run from root project) :

    + `npm run dev`


###dev
  Run dev server on address: localhost:3000.

###build
  Build project in folder: build/


##Куда и что и как:
Главный принцип: все необходимое лежит рядом с компонентом. Разве что компонент может переиспользоваться.

Например верстаем страницу src/project/why:

 - **HTML/JADE** -  src/project/why/index.vue - там кладешь html (jade). Но если jade напрягает можешь прям html туда засунуть, убрав lang=“jade”.

 - **CSS/PCSS** - src/project/why/style.pcss - там все стили для этой страницы

 - **Картинки (jpg, png)** - src/project/why/img/ - кладешь картинку в эту папку и в  html или css указываешь относительный путь. Например: ./img/magic.png

 - **Монохромные иконки (SVG)** - src/base/fonts/trendever-icons/icons - кладешь сюда svg иконку с нормальным именем через дефис. Она тут же появится в шрифте и будет доступна через класс ic-filename. Например <i class=“ic-magic”></i>

 - **Emoje иконки (png)** - src/base/emoji/img кладешь туда emoji такого же размера (если хватит, иначе пометь размером например emoji_angel_64). Так же добавь в стиль путь до нее src/base/emoji/emoji.pcss

 - [https://operatino.github.io/MCSS/](Почитать про методологию)



###Postcss
####css syntax

  + postcss-color-function
  + postcss-colormin
  + postcss-cssnext gy
  + postcss-short-size
  + postcss-short-font-size
  + postcss-simple-vars
  + postcss-custom-media
  + postcss-import
  + postcss-nested
<script>
    new Vue(
        {
            el: '#app_basic',
            data: {
                message: '🐵 Hello World 🔮',
                timestamp: `Timestamp ${new Date().toLocaleString()}`,
            }
        });
</script>

