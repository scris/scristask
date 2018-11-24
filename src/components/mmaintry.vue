<template>
  <div id="mmain">
    <el-card class="box-card" shadow="hover" id="today">
      <div id="today" class="today"> {{today}} </div>
    </el-card>
    <el-card class="box-card" shadow="hover" id="taskmain">
      <el-row>
        <el-col>
          <el-input autosize id="mval" :type="mtype" :placeholder="mplshldr" 
            v-model="entertask" @focus="mtypeArea" clearable> </el-input>
          <el-button class="mbtn" @click="modify" :style="mvsblty" type="success" icon="el-icon-circle-check">Done</el-button>
          <el-button class="mbtn" @click="mtypeLine" :style="mvsblty" type="danger" icon="el-icon-circle-close">Close without Saving</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div v-if="todos.length">
            <taskitem v-for="todo in todos" :key="todo.id" 
            :todo="todo" @delete="deletetask"/>
          </div>
          <el-alert v-else
            title="No tasks left or tasks are still loading" :closable="false"
            type="warning" show-icon>
          </el-alert>
        </el-col>
      </el-row>
		</el-card>
    <a class="today" @click="logout">Log out</a>
		<br><br>
  </div>
</template>

<script>
import AV from 'leancloud-storage';
import timer from '../components/timer.vue'
import breaktimer from '../components/breaktimer.vue'
import taskitem from '../components/taskitem.vue'
import { log } from 'util';



if(!AV.User.current) {
  this.$router.push('register'); 
}

export default {
  name: 'list',
  components: {
    timer,
    breaktimer,
    taskitem,
  },
  data() {
    return {
      today: "Wow, it is Sunday! Isn't it?",
      entertask: '',
      newDay: '',
      tasktext: '',
      todos: [],
      mtype: 'text',
      mplshldr: 'Click to Modify Tasks',
      mvsblty: 'visibility:hidden;height:0px;margin:0px;padding:0px',
      itemval: '',
      itemid: '',
    };
  },
  mounted: function(){
    this.initfunc();
  },
  methods: {
    //https://github.com/zy343134464/vue-todolist/blob/master/app.js
    initfunc() {
      if(!AV.User.current) {
        this.$router.push('register'); 
      }
      
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
      var myDate = new Date();
      var year = myDate.getFullYear();
      var month = myDate.getMonth() + 1;
      var day = myDate.getDate();
      this.newDay = year + "-" + month + "-" + day;
      this.showtask();
    },
    showtask() {
      var query = new AV.Query('tasktext');
      query.equalTo('owner', AV.User.current());
      var that = this;
      query.first().then(function (result) {
        that.itemval = result.get("val");
        that.itemid = result.id;
        that.mshowtask(that.itemval);
      });
    },
    mshowtask(val) {
      var lines = val.split("\n");
      var li = 0;
      this.todos = [];
      lines.forEach(line => {
        var eachline = line.split("@");
        var name = eachline[0].trim();
        var start = eachline[1].trim();
        var last = eachline[2].trim();
        li++;
        this.todos.push({
          id: li,
          title: name + " (Starts on " + start + ", last for " + last + " minutes)"
        });
      });
    },
    modify() {
			if (this.entertask) {
        this.itemval = this.entertask;
				var todo_m = AV.Object.createWithoutData('tasktext', this.itemid);
        todo_m.set('val', this.itemval);
        todo_m.save();
        this.mtypeLine();
        this.mshowtask(this.itemval);
      }
    },
    mtypeArea() {
      this.mtype = 'textarea';
      this.mplshldr = 'Example Task 1 @ 10:20 @ 60 \nExample Task 2 @ 11:10 @ 25';
      this.entertask = this.itemval;
      this.mvsblty = 'visibility:visible';
    },
    mtypeLine() {
      this.mtype = 'text';
      this.mplshldr = 'Click to Modify Tasks';
      this.entertask = '';
      this.mvsblty = 'visibility:hidden;height:0px;margin:0px;padding:0px';
    },
    deletetask() {

    },
    logout() {
      this.$router.push('register'); 
    },
  },
};


</script>
<style>
  .el-card {
    margin-bottom: 10px;
  }
  #mval {
    margin-bottom: 6px;
    width: 100%;
  }
  .mbtn {
    width: 48%;
  }
  .el-card:last-child {
      margin-bottom: 0;
  }
  .el-row {
    margin-bottom: 10px;
  }
  .el-row:last-child {
      margin-bottom: 0;
  }
  .el-col {
    border-radius: 4px;
  }
  .el-alert {
    margin-bottom: 8px;
  }
  .el-alert:last-child {
      margin-bottom: 0;
  }
</style>
