<template>
  <div class="timer" id="timer">
    <div class="input inputwhited">{{ this.content }}</div>
    <button class="button" @click="countDown" @dblclick="dbl"><mdplay v-if='isStarted == 0'/><mdpause v-else-if='isStarted == 1'/><mdrfilled v-else/></button>
    <button class="button" @click="$emit('delete',timertaskname)"><mdcheck/></button>
  </div>
</template>

<script>
import mdplay from "vue-material-design-icons/Play.vue"
import mdcheck from "vue-material-design-icons/Check.vue"
import mdpause from "vue-material-design-icons/Pause.vue"
import mdrfilled from "vue-material-design-icons/RadioboxMarked.vue"
var clock;
export default ({
  name: 'timer',
  props: {
    timertitle: {
      type: String,
      required: true,
    },
    timertimeset: {
      type: Number,
      required: true,
    }
  },
  components: {
    mdplay,
    mdcheck,
    mdpause,
    mdrfilled,
  },
  data () {
    return {
      content: 'Timer haven\'t been Started yet' ,
      timertaskname: '',
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
        this.$emit('start', this.timertaskname, this.timertimeset);
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
        this.content = 'Click->Resume, Double->Finish';
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
