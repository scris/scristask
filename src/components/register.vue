<template>
  <div id="main">
    <h1>{{ today }}</h1>
    <input v-model="email" placeholder="Email" type="email" class="button input inputwithpadding"/><br>
    <input v-model="pwd" placeholder="Password" type="password" class="button input inputwithpadding"/><br>
    <button @click="login" class="button loginbtn">Login</button>&nbsp;&nbsp;
    <button @click="reg" class="button loginbtn">Register</button>
  </div>
</template>

<script>
import AV from 'leancloud-storage';
var APP_ID = 'C7SVWNehvavYoUH5cssIKYDH-MdYXbMMI';
var APP_KEY = 'nJ2QMhw8deT5QwNt40rjsaK7';
AV.init({
	appId: APP_ID,
	appKey: APP_KEY,
	region: 'us'
});

export default {
  name: 'register',
  data() {
    return {
      email: '',
      pwd: '',
      today: "Wow, it is Sunday! Isn't it?",
    };
  },
  mounted: function(){
      var weekday = new Array(7);
      var weekday = new Array(7);
      weekday[0] = "Sunday 😊";
      weekday[1] = "Monday 😎";
      weekday[2] = "Tuesday 😀";
      weekday[3] = "Wednesday 😏";
      weekday[4] = "Thursday 😙";
      weekday[5] = "Friday 😜";
      weekday[6] = "Saturday 😇";
      var dd = new Date();
      var n = weekday[dd.getDay()];
      var randomWordArray = Array("Wow, it's ", "Hey there, it's ", "Happy ", "It's currently ", "Awesome, it's ", "Have a nice ", "Happy splendid ", "Enjoy your ", "What a good day, it's ");
      var randomWord = randomWordArray[Math.floor(Math.random() * randomWordArray.length)];
      this.today = randomWord + n;
  },
  methods: {
    reg(){
      var that = this;
      var user = new AV.User();
      user.setUsername(that.email);
      user.setPassword(that.pwd);
      user.signUp().then(function (loginedUser) {
        var avnote = AV.Object.extend('note');
        var note = new avnote();
        note.set('owner', AV.User.current());
        note.set('notecontent','');
        note.save().then(function (todo) {
          
        }, function (error) {
          alert(JSON.stringify(error));
        });
        var avtask = AV.Object.extend('tasktext');
        var task = new avtask();
        task.set('owner', AV.User.current());
        task.set('val','');
        task.save().then(function (todo) {
          that.$router.push('list'); 
        }, function (error) {
          alert(JSON.stringify(error));
        });
      }, (function (error) {
        alert(JSON.stringify(error));
      }));
    },
    login(){
      var that = this;
      AV.User.logIn(that.email, that.pwd).then(function (loginedUser) {
        that.$router.push('list'); 
      }, function (error) {
        alert(JSON.stringify(error));
      });
    },
  },
};
</script>
