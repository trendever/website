<template lang="jade">
.scroll-cnt
  hero-component
  caption-component

  .section.main
    .section__content
      search-component
      photos-component(id='headerAnchor')
      footer-component
      navbar-component(current='feed')
</template>

<script type='text/babel'>
import NavbarComponent from 'base/navbar/navbar.vue'

import HeroComponent from './hero.vue'
import CaptionComponent from './caption.vue'
import SearchComponent from './search.vue'
import PhotosComponent from './photos.vue'
import FooterComponent from 'base/footer/footer.vue'

export default {
  components: {
  //  HeaderComponent,
    NavbarComponent,
    SearchComponent,
    HeroComponent,
    CaptionComponent,
    PhotosComponent,
    FooterComponent
  }
}
</script>
