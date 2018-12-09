<!--
<template>
  <div class="timer" id="timer">
    <el-row>
      <el-col>
        <el-input placeholder="Name"
          v-model="timertaskname" clearable></el-input>
      </el-col>
    </el-row>
    <el-row v-show="timerow">
      <el-col>
        <el-input placeholder="Working Time (min)" 
          v-model="worktime" clearable> </el-input>
      </el-col>
    </el-row>
    <el-row v-show="timerow">
      <el-col>
        <el-input placeholder="Relaxing Time (min)" 
          v-model="resttime" clearable> </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-button @click="countDown"> {{content}} </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
var clock;
export default ({
  name: 'breaktimer',
  props: {
    breaktimertitle: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      content: 'Start Timer',
      timertaskname: '',
      worktime: '',
      resttime: '',
      total: 60,
      isStarted: 0,
      timerow: true,
    };
  },
  methods: {
    clocky() {
      
    },
    countDown() {
      //0=haven't started yet
      //1=working
      //3=relaxing
      if(this.isStarted == 0) {
        if(!isNaN(parseInt(this.worktime))) {
          this.total = parseInt(this.worktime) * 60;
          this.isStarted = 1;
          this.timerow = false;
          clock = window.setInterval(() => {
            this.total--;
            this.content = Math.floor(this.total / 60) + 'min' 
              + (this.total % 60) + 's left for working';
            if(this.total < 1) {
              window.clearInterval(clock);
              this.total = parseInt(this.resttime) * 60;
              this.isStarted = 3;
              this.notify('Working Time is Over','It\'s time to have a rest.');
              clock = window.setInterval(() => {
                this.total--;
                this.content = Math.floor(this.total / 60) + 'min' 
                  + (this.total % 60) + 's left for relaxing';
                if(this.total < 0) {
                  window.clearInterval(clock);
                  this.content = 'Relaxing Time is Over';
                  this.total = 0;
                  this.isStarted = 0;
                  this.timerow = true;
                  this.notify('Relaxing Time is Over','Now let\'s start working again.')
                }
              },1000);
            }
          },1000);
        } else {
          this.$alert('Your input is not an number.', 'Please Use a Number as Time', {
            confirmButtonText: 'That\'s OK',
          });
        }
      }
      else if(this.isStarted == 1) {
        window.clearInterval(clock);
        this.total = parseInt(this.resttime) * 60;
        this.isStarted = 3;
        clock = window.setInterval(() => {
          this.total--;
          this.content = Math.floor(this.total / 60) + 'min' 
            + (this.total % 60) + 's left for relaxing';
          if(this.total < 0) {
            window.clearInterval(clock);
            this.content = 'Relaxing Time is Over';
            this.total = 0;
            this.isStarted = 0;
            this.timerow = true;
          }
        },1000);
      }
      else if(this.isStarted == 3) {
        window.clearInterval(clock);
        this.content = 'Start Timer';
        this.total = 0;
        this.worktime = '';
        this.resttime = '';
        this.isStarted = 0;
        this.timerow = true;
      }
    },
    notify (notifytitle,notifybody) {
      if(!window.Notification) {
        this.$alert('We can\'t send you Notifications', 'Either you denied the permission or your platform don\'t support it.', {
              confirmButtonText: 'That\'s OK',
        });
      }
      else if(Notification.permission !== "denied") {
        Notification.requestPermission(function(status) {
          if (status === "granted") {
            let myNotification = new Notification(notifytitle, {
              body: notifybody,
            });
            myNotification.onclick = () => {
              
            };
          } else {
            this.$alert('We can\'t send you Notifications', 'Either you denied the permission or your platform don\'t support it.', {
              confirmButtonText: 'That\'s OK',
            });
           }
        });
      }
      else {
        let myNotification = new Notification(notifytitle, {
          body: notifybody,
        });
        myNotification.onclick = () => {
          
        };
      }
    },
  },
});
</script>
-->