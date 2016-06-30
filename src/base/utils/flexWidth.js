export const flex = (() => {

  let fullHeight = 0;

  return function _flex( tags = [], baseWidth = 200, marginRight = 10, padding = 20, border = 2 ) {

    if ( tags.length > 0 ) {

      const containerWidth = baseWidth - 20; // Для того чтобы элементы не перескакивали со строки на строку я убрал из
                                             // ширины контейнера 20 пикселей

      let count    = 0;
      let rowWidth = 0;

      fullHeight += (tags[ 0 ].offsetHeight + 12); // Это отступ снизу

      const contentWidth = ( items ) => {

        let width = 0

        if ( Array.isArray( items ) ) {

          items.forEach( ( { offsetWidth } ) => {

            width += offsetWidth;

          } );

        }

        return width

      }

      for ( let i = 0; i < tags.length; i++ ) {

        const insideWidth = contentWidth( Array.from( tags[ i ].children ) );

        const fullWidth = insideWidth + border + padding * 2 + marginRight;

        rowWidth += fullWidth;

        if ( parseInt( containerWidth / rowWidth ) > 0 ) {

          count++;

        } else {

          rowWidth -= fullWidth + marginRight;

          break;

        }

      }

      if ( count === 1 ) {

        rowWidth += border / 2;

      }

      if ( tags.slice( count, tags.length ).length === 0 ) {

        rowWidth -= marginRight;

      }

      const freeSpace = containerWidth - rowWidth;

      for ( let i = 0; i < count; i++ ) {

        const insideWidth = contentWidth( Array.from( tags[ i ].children ) );

        const newWidth = insideWidth + ( freeSpace / count );

        if ( count > 1 ) {

          if ( i < count - 1 ) {

            tags[ i ].style.width       = `${ newWidth }px`
            tags[ i ].style.marginRight = `${ marginRight }px`

          } else {

            tags[ i ].style.width = `${ newWidth }px`

          }

        } else {

          tags[ i ].style.width = `${ newWidth }px`

        }

      }

      const height = fullHeight;

      if ( count > 0 ) {

        const tagsSlice = tags.slice( count, tags.length );

        if ( tagsSlice.length > 0 ) {

          return _flex( tagsSlice, baseWidth, marginRight, padding, border );

        } else {

          fullHeight   = 0;

          return height;

        }

      } else {

        fullHeight   = 0;

        return height;
      }

    }

  }

})()
