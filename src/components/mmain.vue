<template>
  <div id="mmain">
    <el-card class="box-card" shadow="hover" id="today">
      <div id="today" class="today"> {{today}} </div>
    </el-card>
    <el-card class="box-card" shadow="hover" id="taskmain">
      <el-row>
        <el-col>
          <el-input placeholder="Task Name (Enter to Add)" 
            v-model="entertask" @keyup.enter.native="addtask" clearable> </el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div v-if="todos.length">
            <taskitem v-for="todo in todos" :key="todo.id" :todo="todo" @delete="deletetask"/>
          </div>
          <el-alert v-else
            title="No tasks left" :closable="false"
            type="warning" show-icon>
          </el-alert>
        </el-col>
      </el-row>
		</el-card>
    <el-card class="box-card" shadow="hover" id="ttimer">
			<timer></timer>
		</el-card>
    <el-card class="box-card" shadow="hover" id="ptimer">
			<breaktimer></breaktimer>
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



if(AV.User.current){
  
	
}else{
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
      todos: [
      
      ],
    };
  },
  methods: {
    init() {
      var weekday = new Array(7);
      var weekday = new Array(7);
      weekday[0] = "Sunday 😊";
      weekday[1] = "Monday 😎";
      weekday[2] = "Tuesday 😀";
      weekday[3] = "Wednesday 😏";
      weekday[4] = "Thursday 😙";
      weekday[5] = "Friday 😜";
      weekday[6] = "Saturday 😇";
      var n = weekday[d.getDay()];
      var randomWordArray = Array("Wow, it's ", "Hey there, it's ", "Happy ", "It's currently ", "Awesome, it's ", "Have a nice ", "Happy splendid ", "Enjoy your ", "What a good day, it's ");
      var randomWord = randomWordArray[Math.floor(Math.random() * randomWordArray.length)];
      this.today = randomWord + n;
      
      var myDate = new Date();
      var year = myDate.getFullYear();
      var month = myDate.getMonth() + 1;
      var day = myDate.getDate();
      var newDay = year + "-" + month + "-" + day;
      var queryday = new AV.Query('task');
      queryday.equalTo('owner', AV.User.current());
      queryday.equalTo('day', newDay);
      var querylongterm = new AV.Query('task');
      querylongterm.equalTo('owner', AV.User.current());
      querylongterm.equalTo('islongterm',true);
      querylongterm.equalTo('isfinished',false);
      var query = new AV.Query('task');
      query = AV.Query.or(queryday,querylongterm);
      query.find().then(function (results) {
        results.forEach(this.addeach);
      }, function (error) {
        alert(JSON.stringify(error));
      });
    },
    addeach() {
      additem(item.get("taskname"), item.get("isfinished"), item.id, true);
    },
    additem(text, status, id, noUpdate) {
			this.todos.push({
				id: id,
				title: text
			})
    },
    addtask() {
      const trimmed = this.entertask.trim()
			if (trimmed) {
        var itemVal = trimmed;
				var todoFolder = new avtask();
        todoFolder.set('taskname', itemVal);
        todoFolder.set('isfinished', false);
        todoFolder.set('owner', AV.User.current());
        var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        var day = myDate.getDate();
        var newDay = year + "-" + month + "-" + day;
        todoFolder.set('day', newDay);
        if((itemVal.indexOf('[longterm]') >= 0) || (itemVal.indexOf('[plan]') >= 0) || (itemVal.indexOf('[routine]') >= 0))
        {
          todoFolder.set('islongterm',true);
        }
        todoFolder.save().then(function (itodo) {
          additem(itemVal, false, itodo.id, true);
        }, function (error) {
          alert(JSON.stringify(error));
        });
      }
    },
    deletetask(taskid) {
      var itodo = AV.Object.createWithoutData('task', taskid);
      itodo.destroy().then(function (success)){
        this.todos = this.todos.filter(todo => {
          return todo.id !== taskid
        })
      }, function (error) {
        alert(JSON.stringify(error));
      }
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
