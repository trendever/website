<style src='./style.pcss'></style>
<template lang="jade">
.inapp-notification(v-if="alert" transition="expand" @click="goToChat")
  div.middle
    img.popup_img(v-bind:src="avatarUrl")
    .popup_author-name Сообщение от @{{username}}
    .popup_msg {{text}}
</template>

<script type="text/babel">
import * as messages from 'services/message';
import * as users from 'services/user';
import * as leads from 'services/leads';

export default {
  data(){
    return {
      class: "",
      alert: false,
      username: "",
      text: "",
      avatarUrl: "",
      chatId: 0
    }
  },
  ready(){
    this.onMessage = this.onMessage.bind( this );
    messages.onMsg( this.onMessage );
  },
  beforeDestroy(){
    messages.offMsg( this.onMessage );
  },
  methods:{
    goToChat(){
      if (this.chatId){
        this.$router.go({name: "chat", params: {id: this.chatId}})
      }
    },
    _getUser(user_id){
      return users.get({user_id});
    },
    _getLead(){
      return leads.get({conversation_id: this.chatId});
    },
    onMessage(data){
        console.log("MESSAGE");
        console.log(data);
        let messages = data.response_map.messages;
        if (messages[0]){
          let user_id = data.response_map.messages[0].user.user_id;
          let message = data.response_map.messages[0].parts[0];
          let chat_id = data.response_map.chat.id;
          this.$set('text', message.content);
          this.$set('chatId', chat_id);


          if (message.mime_type === 'text/plain' && user_id != this.$store.state.user.myId){
            this._getUser(user_id).then(data => {
                this.$set('username', data.instagram_username);
                this.$set('alert', true);
                this.$set('avatarUrl', data.avatar_url);

                this._getLead().then(data => {
                  this.$set('chatId', data.lead.id);
                });
                setTimeout( () => this.$set('alert', false), 3000);
            });
          }

        }
       
    }
  }
}
</script>
