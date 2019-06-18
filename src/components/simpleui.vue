<template>
  <div id="simpleui" class="simpleui">
    <h1>{{ today }}</h1>
    <input class="input inputwithpadding" placeholder="Input your Task's Name" v-model="entertask"/>
    <input class="input inputwithpadding" placeholder="When Should it Start" v-model="starttime"/><br>
    <input class="input inputwithpadding" placeholder="How Long Will it Last" v-model="lastfor"/>
    <button class="button" @click="modify"><mdcheck/></button><br>
    <div id="tasks">
      <div v-if="todos.length">
        <taskitem v-for="todo in todos" :key="todo.id" :todo="todo" @delete="deletetask" @start="starttask"/>
      </div>
      <div v-else class="taskpane"> {{ notask }} </div>
    </div>
    <br>
    <div id="footer">
      <b><span class="tasktime">Dominik Qiu from Scris Studio</span></b>
      <!--<span class="tasktime"><a>Tutorial</a></span>-->
      <br><span class="tasktime">Use <b><a href="https://wnr.scris.top/">wnr</a></b> together to get better experience.</span>
    </div>
  </div>
</template>
<script>
import mdcheck from "vue-material-design-icons/Check.vue"
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
  name: 'simpleui',
  components: {
    timer,
    breaktimer,
    taskitem,
    mdcheck,
  },
  data() {
    return {
      today: "Wow, it is Sunday! Isn't it?",
      entertask: '',
      starttime: '',
      lastfor: '',
      nlastfor: 0,
      todos: [],
      notask: 'Tasks are Loading…',
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
        lastfor: lastfor,
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
      query.ascending('starttime');
      query.find().then(function (results) {
        results.forEach((taskr) => {
          thatq.todos.push({
            id: taskr.id,
            title: taskr.get("taskname"),
            starttime: taskr.get("starttime"),
            lastfor: taskr.get("lastfor")
          });
        });
        thatq.notask = 'No tasks left';
      }, function (error) {
        alert(JSON.stringify(error));
      });
    },
    addtask() {
      var ataskname = this.entertask.trim();
      var astarttime = this.starttime.trim();
      var alastfor = Number(this.lastfor.trim());
      this.entertask = '';
      this.starttime = '';
      this.lastfor = '';
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
        this.addtask();
      }
    },
    starttask(taskid, tlastfor){
      log(".i.")
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
