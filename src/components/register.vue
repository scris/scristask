<template>
  <div id="main">
    <el-card class="box-card" shadow="hover" id="today">
      <div id="today"> {{today}} </div>
    </el-card>
    <br>
    <el-card class="box-card" shadow="hover" id="reglogin">
      <el-form>
        <el-form-item prop="email">
          <el-input v-model="email" placeholder="Email" type="email"></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <el-input v-model="pwd" placeholder="Password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">Login</el-button>
          <el-button type="primary" @click="reg">Register</el-button>
        </el-form-item>
      </el-form>
    </el-card>
		<br>
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
          that.$router.push('main'); 
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
        that.$router.push('main'); 
      }, function (error) {
        alert(JSON.stringify(error));
      });
    },
  },
};
</script>
