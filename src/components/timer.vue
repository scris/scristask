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
        <el-input placeholder="Total Time (min)" 
          v-model="timertimeset" clearable> </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-button @click="countDown"> {{content}} </el-button>
        <el-button @click="dbl" v-show="isDblShow"> {{dblclicky}} </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
var clock;
export default ({
  name: 'timer',
  data () {
    return {
      content: 'Start Timer',
      timertaskname: '',
      timertimeset: '',
      total: 60,
      isStarted: 0,
      dblclicky: 'End Timer',
      isDblShow: false,
      timerow: true,
    };
  },
  methods: {
    clocky() {
      
    },
    countDown() {
      //0=haven't started yet
      //1=working
      //2=paused
      if(this.isStarted == 0) {
        if(!isNaN(parseInt(this.timertimeset))) {
          this.total = parseInt(this.timertimeset) * 60;
          this.isStarted = 1;
          this.timerow = false;
          clock = window.setInterval(() => {
            this.total--;
            this.content = Math.floor(this.total / 60) + 'min' 
              + (this.total % 60) + 's left';
            if(this.total < 0) {
              window.clearInterval(clock);
              this.content = 'Time is Up';
              this.total = 0;
              this.timertimeset = '';
              this.isStarted = 0;
              this.timerow = true;
              this.notify('Time is Up','Now check whether you\'ve finished the task or not.');
            }
          },1000);
        } else {
          this.$alert('Your input is not an number.', 'Please Use a Number as Time', {
            confirmButtonText: 'That\'s OK',
          });
        }
      }
      else if(this.isStarted == 1) {
        this.isStarted = 2;
        window.clearInterval(clock);
        this.isDblShow = true;
        this.content = 'Resume';
      }
      else {
        this.isStarted = 1;
        window.clearInterval(clock);
        this.isDblShow = false;
        clock = window.setInterval(() => {
          this.total--;
          this.content = Math.floor(this.total / 60) + 'min' 
            + (this.total % 60) + 's left.';
          if(this.total < 0) {
            window.clearInterval(clock);
            this.content = 'Time is Up';
            this.total = 0;
            this.timertimeset = '';
            this.isStarted = 0;
            this.timerow = true;
            this.notify('Time is Up','Now check whether you\'ve finished the task or not.');
          }
        },1000);
      }
    },
    dbl() {
      if(this.isStarted == 2) {
        window.clearInterval(clock);
        this.content = 'Start Timer';
        this.total = 0;
        this.timertimeset = '';
        this.isStarted = 0;
        this.isDblShow = false;
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
