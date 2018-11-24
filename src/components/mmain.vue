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
            <taskitem v-for="todo in todos" :key="todo.id" :todo="todo" @delete="deletetask"/>
          </div>
          <el-alert v-else
            title="No tasks left or Tasks are loading" :closable="false"
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

var avtask = AV.Object.extend('task');
var avnote = AV.Object.extend('note');

export default {
  name: 'main',
  components: {
    timer,
    breaktimer,
    taskitem,
  },
  data() {
    return {
      today: "Wow, it is Sunday! Isn't it?",
      entertask: '',
      starttime: '',
      lastfor: '',
      todos: [],
      mtype: 'text',
      mplshldr: 'Click to Add a Task',
      mvsblty: 'visibility:hidden;height:0px;margin:0px;padding:0px',
      itemval: '',
    };
  },
  mounted: function(){
    this.initfunc();
  },
  methods: {
    additem(text, id, starttime, lastfor) {
			this.todos.push({
				id: id,
				title: text,
        starttime: starttime,
        lastfor: lastfor
      });
    },
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
      
      var query = new AV.Query('task');
      query.equalTo('owner', AV.User.current());
      var thatq = this;
      query.find().then(function (results) {
        results.forEach((taskr) => {
          thatq.todos.push({
            id: taskr.id,
            title: taskr.get("taskname"),
            starttime: taskr.get("starttime"),
            lastfor: taskr.get("lastfor")
          });
        });
      }, function (error) {
        alert(JSON.stringify(error));
      });
    },
    addtask() {
      var eachline = this.itemval.split("\n");
      var ataskname = eachline[0].trim();
      var astarttime = eachline[1].trim();
      var alastfor = eachline[2].trim();
			if (ataskname) {
        var itemVal = ataskname;
				var todoFolder = new avtask();
        todoFolder.set('taskname', itemVal);
        todoFolder.set('isfinished', false);
        todoFolder.set('owner', AV.User.current());
        todoFolder.set('starttime', astarttime);
        todoFolder.set('lastfor', alastfor);
        var thatt = this;
        todoFolder.save().then(function (itodo) {
          thatt.additem(itodo.get("taskname"), itodo.id, itodo.get("starttime"), itodo.get("lastfor"));
        }, function (error) {
          alert(JSON.stringify(error));
        });
      }
    },
    modify() {
			if (this.entertask) {
        this.itemval = this.entertask;
        this.mtypeLine();
        this.addtask();
      }
    },
    mtypeArea() {
      this.mtype = 'textarea';
      this.mplshldr = 'First Line: Task Name \nSecond Line: When should the Task Starts (e.g. 08:15) \nThird Line: How Many Minutes is the Task Expected to Last (e.g. 30)';
      this.entertask = '';
      this.mvsblty = 'visibility:visible';
    },
    mtypeLine() {
      this.mtype = 'text';
      this.mplshldr = 'Click to Add a Task';
      this.entertask = '';
      this.mvsblty = 'visibility:hidden;height:0px;margin:0px;padding:0px';
    },
    deletetask(taskid) {
      var itodo = AV.Object.createWithoutData('task', taskid);
      var thatd = this;
      itodo.destroy().then(function (success){
        thatd.todos = thatd.todos.filter(todo => {
          return todo.id !== taskid
        })
      }, function (error) {
        alert(JSON.stringify(error));
      });
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
  .el-card:last-child {
      margin-bottom: 0;
  }
  #mval {
    margin-bottom: 6px;
    width: 100%;
  }
  .mbtn {
    width: 48%;
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
