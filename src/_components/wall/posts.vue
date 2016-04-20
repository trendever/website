<template>
<div>
    <div class="wall" id="PostsList">

        <template v-for="post in objects_list">
            <div class="wall__post">
                <post-component :obj_data="post"></post-component>
            </div>
        </template>

    </div>
</div>
</template>


<script>
    import PostComponent from './../post.vue'
    import products_find from './../../services/products/products'
    var w = window;

    export default {
        data(){
            return {
                objects_list: [],
                is_infinity_enabled: false,
                is_wait_response: false
            }
        },
        activate: function (done) {
            var self = this;
            products_find(
                    [], {
                        offset: self.objects_list.length,
                        limit: 5,
                        type: "update"
                    }, {}, findCallback
            );
            function findCallback(resp) {
                self.objects_list = resp["response_map"]["object_list"];
                done()
            }

            // Enable infinity scrolling
            this.enable_infinity_scroll()
        },

        methods: {
            enable_infinity_scroll: function (e) {
                var self = this;
                this.is_infinity_enabled = true;
                this.is_wait_response = false;

                function fn() {
                    var pos_scroll = w.scrollGetY();
                    var full_scroll = w.ge("PostsList").offsetHeight;
                    var diff_scroll = full_scroll - pos_scroll;
                    if (diff_scroll < 1500 && !self.is_wait_response) {
                        self.showMore()
                    }
                }

                // Add event for infinity scroll
                w.addEvent(window, "scroll", fn);
                w.cur.destroy.push(function () {
                    w.removeEvent(window, "scroll", fn);
                })
            },

            showMore: function () {
                var self = this;
                self.is_wait_response = true;

                function findCallback(resp) {
                    self.objects_list = self.objects_list.concat(resp["response_map"]["object_list"]);
                    self.is_wait_response = false;
                }

                products_find(
                        [], {
                            offset: self.objects_list.length,
                            limit: 5,
                            type: "more"
                        }, {}, findCallback
                );
            }
        },
        created: function () {
            this.$on('hook:beforeDestroy', function () {
                // remove old events and data
                console.log("destroy");
                w.processDestroy(w.cur);
            });
        },
        components: {
            PostComponent
        }
    }

</script>