<template>
<div>
    <header-component
            title="Новые тренды"
            show_on_elem="headerAnchor"></header-component>

    <div class="section main">
        <div class="section__content" id="headerAnchor">
            <posts-component></posts-component>
            <footer-component ></footer-component>
        </div>
    </div>
</div>
</template>

<script>
    import HeaderComponent from 'base/header/header.vue'
    import PostsComponent from './posts.vue'
    import FooterComponent from './../footer.vue'

    export default {
        data () {
            return {}
        },
        components: {
            HeaderComponent,
            PostsComponent,
            FooterComponent
        }
    }
</script>