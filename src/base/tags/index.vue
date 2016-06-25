<template>
  <div v-if="isShow" class="tags-container" :class="{'tags-container-open': isOpen || !hiddenContent}">
    <div class="tags" v-el:tags v-bind:style="{maxHeight: maxHeight}">
      <div class="tag" v-for="tag of tags">
        <span class="text">{{tag.name}}</span>
      </div>
    </div>
    <div class="button" @click="open" v-if="hiddenContent"></div>
  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">

  import listener from 'event-listener'

  export default {
    props: {
      tags: {
        type: Array,
        default: []
      },
      maxHeight: {
        type: String,
        default: `285px`
      },
      hiddenContent: {
        type: Boolean,
        default: true
      }
    },
    data(){
      return {
        timer: null,
        isOpen: false
      }
    },
    ready(){

      this.onFlex = this.onFlex.bind( this );

      this.$nextTick( () => {
        this.onFlex();
      } );

      this.resize = listener( window, 'optimizedResize', this.onFlex )

      this.$on( 'update', this.onFlex )

    },
    beforeDestroy(){

      this.resize.remove()
      this.$off( 'update', this.onFlex )
      clearTimeout( this.timer )
      this.$set( 'timer', null )

    },

    computed: {

      isShow(){
        if ( Array.isArray( this.tags ) ) {

          return this.tags.length > 0;

        }

        return false;
      }

    },

    methods: {

      open(){

        this.$set( 'isOpen', !this.isOpen );

      },

      onFlex(){

        if ( this.isShow ) {

          const computed = () => {

            Array
              .from( this.$els.tags.children )
              .forEach( ( tag ) => {

                tag.style.marginRight = '0';

              } );

            this.flex();

          };

          computed();

          if ( this.timer !== null ) {

            clearTimeout( this.timer )

          }

          this.$set( 'timer', setTimeout( () => {

            this.$set( 'timer', null );

            computed();

          }, 100 ) );

        }

      },

      flex( tags = Array.from( this.$els.tags === null ? [] : this.$els.tags.children ) ){

        if ( this.$els.tags !== null ) {

          const marginRight = 10;
          const padding     = 20;
          const border      = 2; // Для супер точности нужно поставить 2, но так дёргается всё потому что окно первее сжимается чем вызывается пересчёт.

          const containerWidth = this.$els.tags.clientWidth - 20;

          let count    = 0;
          let rowWidth = 0;

          for ( let i = 0; i < tags.length; i++ ) {

            const textWidth = tags[ i ].children[ 0 ].offsetWidth;

            const fullWidth = (textWidth + border + (padding * 2)) + marginRight;

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

            const textWidth = tags[ i ].children[ 0 ].offsetWidth;

            const newWidth = textWidth + ( freeSpace / count );

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

          if ( count > 0 ) {

            const tagsSlice = tags.slice( count, tags.length );

            if ( tagsSlice.length > 0 ) {

              this.flex( tagsSlice );

            }

          }

        }

      }
    },

    watch: {
      tags(){
        this.onFlex()
      },
      height(){
        this.onFlex()
      },
      maxHeight(){
        this.onFlex()
      }
    }
  }
</script>
