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

let nextTodoId = 1;

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
        {
          id: nextTodoId++,
          title: 'learn vue.js',
        },
      ],
    };
  },
  methods: {
    addtask() {
      const trimmed = this.entertask.trim()
			if (trimmed) {
				this.todos.push({
					id: nextTodoId++,
					title: trimmed
				})
				this.entertask = ''
			}
    },
    deletetask(taskid) {
      this.todos = this.todos.filter(todo => {
				return todo.id !== taskid
			})
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
