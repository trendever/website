#Trendever website
###How to install:
  
  1. Clone project :
  
    + `git clone git@bitbucket.org:ifabru/trendever_website.git`
    
          
  2. Install npm :
    
    + `Download and install from https://nodejs.org/en/download/`
    + `Set to system "PATH" variable "NODE_HOME" variable ("Users/%user%/AppData/Roaming/npm")`
    + `Set to system "PATH" variable "%NODE_HOME%\npm_modules" value`
  
  3. Install gulp globally :
    
    + `npm install gulp -g`
    
  4. Install webpack and webpack-dev-server globally:
   
    +  `npm install webpack webpack-dev-server -g`
  
  5. Install dependencies (run from "/trendever_website") :
   
    + `npm run init`
  
  6. Copy and Rename "config.default.js" file to "config.js".
  
  7. Run project (run from "/trendever_website") :
  
    + `npm run dev`


##Gulp Commands
###sprite
Создает спрайт из изображений с префиксом i- из всех папок внутри css_modules.
Созданный спрайт и стили копирует в папку i-icons

###dev
Команда для dev разработки
Минифицирует картинки, собирает спрайты, копирует картинки, запускает watch и webpack_dev_server


##Postcss
###css syntax

+ css variables https://github.com/MadLittleMods/postcss-css-variables
+ media variables https://github.com/postcss/postcss-custom-media
+ color funcion https://github.com/postcss/postcss-color-function
+ not selector https://github.com/postcss/postcss-selector-not

###css shortcuts

+ nested https://github.com/postcss/postcss-nested
+ short https://github.com/jonathantneal/postcss-short

##Dev
По модулям следует раскладывать (src/css_modules/):

- Картинки {png,jpg,gif,svg}


##Куда класть остальную статику:

- JavaScript библиотеки в src/js_libs или node_modules
- Vue.js модули {vue,js,scss} в src/components
- Шрифты в src/fonts

        
 
