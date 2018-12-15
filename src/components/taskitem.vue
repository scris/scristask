<template>
    <div class="taskitem">
      <div class="taskpane">
        <div class="taskleft">
          <button class="button tasktitle" @click="toggle"> {{ todo.title }} </button>
          <div class="tasktime">
            <mdlist/> {{ todo.starttime }} <mdtimer/> {{ slastfor }} mins
          </div>
        </div>
        <nav class="taskright">
          <button class="button" @click="$emit('delete',todo.id)">&nbsp;<mdclose/></button>
        </nav>
      </div>
      <div class="taskmore" v-if="toggling">
          <timer :timertitle="todo.title" :timertimeset="todo.lastfor" @delete="$emit('delete',todo.id)"/>
      </div>
      <br>
    </div>
</template>

<script>
import mdclose from "vue-material-design-icons/Close.vue"
import mdtimer from "vue-material-design-icons/Timer.vue"
import mdlist from "../components/ClipboardTextPlayOutline.vue"
import timer from "../components/timer.vue"
export default {
  name: 'taskitem',
  components: {
    mdclose,
    mdtimer,
    mdlist,
    timer,
  },
  props: {
    todo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return{
      toggling: false,
      slastfor: '',
    }
  },
  mounted: function(){
    this.initfunc();
  },
  methods: {
    initfunc() {
      slastfor = String(this.todo.lastfor);
    },
    toggle() {
      slastfor = String(this.todo.lastfor);
      this.toggling = !this.toggling;
    },
  }
}
</script>
