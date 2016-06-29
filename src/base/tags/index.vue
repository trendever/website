<template>
  <div
    v-if="isShow"
    class="tags-container"
    :class="{'tags-container-open': isOpen || !hiddenContent, 'tags-container-button': hiddenContent && showMoreButton}"
  >
    <div class="tags" v-el:tags v-bind:style="{maxHeight: maxHeight, height: height}">
      <div class="tag"
           v-for="tag of tags | filterBy searchString in 'name'"
           :class="{'tag-active': tag.active}"
           @click.stop="addTag(tag)">
        <span class="text">{{tag.name}}</span>
        <i class="ic-close close" v-if="tag.active" @click.stop="delTag(tag)"></i>
      </div>
    </div>
    <div class="button" @click="open" v-if="hiddenContent && showMoreButton"></div>
    <div class="pending" v-if="isPending"></div>
  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">

  import listener from 'event-listener'
  import { flex } from '../utils/flexWidth'
  import { browser } from 'utils'

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
      },
      searchString: {
        type: String,
        default: ''
      },
      delTag: {
        type: Function,
        default: ( tag, index ) => {
          console.log( tag, index );
        }
      },
      addTag: {
        type: Function,
        default: ( tag, index ) => {
          console.log( tag, index );
        }
      },
      isOpen: {
        type: Boolean,
        default: false
      },
      isPending: {
        type: Boolean,
        default: false
      }
    },

    data(){
      return {
        timer: null,
        showMoreButton: false,
        fullHeight: 0
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

      if ( this.resize ) {
        this.resize.remove()
      }
      this.$off( 'update', this.onFlex )
      clearTimeout( this.timer )
      this.$set( 'timer', null )

    },

    computed: {

      height(){

        if ( window.matchMedia( "(max-width: 750px)" ).matches ) {

          if ( this.fullHeight < 170 ) {

            return `${this.fullHeight - 10}px`

          }

        } else {

          if ( this.fullHeight < 90 ) {

            return `${this.fullHeight -10}px`

          }

        }

        return null;

      },

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
        this.$els.tags.scrollTop = 0;
      },

      onFlex(){

        if ( this.isShow ) {

          const computed = () => {

            if ( this.$els.tags !== null ) {

              this.$set( 'showMoreButton', this.$els.tags.scrollHeight > (this.$els.tags.offsetHeight + 10) )

              Array
                .from( this.$els.tags.children )
                .forEach( ( tag ) => {

                  tag.style.marginRight = '0';

                } );

              this.$set( 'fullHeight', flex( Array.from( this.$els.tags.children ), this.$els.tags.clientWidth ) )

            }

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
      },
      searchString(){
        this.onFlex()
      }
    }
  }
</script>
