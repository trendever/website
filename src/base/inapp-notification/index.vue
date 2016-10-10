<style src='./style.pcss'></style>
<template lang="jade">
.inapp-notification(v-if="alert" transition="expand")
  img(v-el="alertData" v-bind:src="image")
  div.middle
    h2 Сообщение от @{{alertData.username}}
    span {{alertData.text}}
</template>

<script type="text/babel">
import * as messages from 'services/message';
import * as users from 'services/user';

export default {
  data(){
    return {
      class: "",
      alert: false,
      alertData: {
        image: "",
        title: "",
        text: ""
      }
    }
  },
  ready(){
    //In app notification
    messages.onMsg( this.onMessage );
  },
  methods:{
    onMessage(data){
        console.log("MESSAGE");
        console.log(data);
        let messages = data.response_map.messages;
        if (messages[0]){
          let user_id = data.response_map.messages[0].user.id;

          console.log("SELFID");
          console.log(this.$store.state.user.myId);

          console.log("USERID")
          console.log(user_id);
        }
       

        /*let chat = data.response_map.chat;
        let messages = data.response_map.messages;
        let user_id = messages[0].user_id;
        let message = messages[0].parts[0];
        var that = this;


        users.get({user_id}).then(function(data){
          console.log("USER!");
          console.log(data);
          let user = data;

          let alertData = {
            title: "Новое сообщение в чате", 
            text: message.content,
            username: user.instagram_username
          }

          if (messages[0].parts[0].mime_type == 'text/plain'){
            that.$set('alert',true);
            that.$set('alertData',alertData);
            setTimeout( () => that.$set('alert', false), 2000);
          }
        });*/
    }
  }
}
</script>
