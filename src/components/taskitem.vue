<template>
    <div class="taskitem">
      <div class="taskpane">
        <div class="taskleft">
          <button class="button tasktitle" @click="toggle"> {{ todo.title }} </button>
          <div class="tasktime">
            <mdlist/> {{ todo.starttime }} <mdtimer/> {{ todo.lastfor }} mins
          </div>
        </div>
        <nav class="taskright">
          <button class="button" @click="$emit('delete',todo.id)">&nbsp;<mdclose/></button>
          <button class="button" @click="$emit('delete',todo.id)"><mdcheck/></button>
        </nav>
      </div>
      <br>
    </div>
</template>

<script>
import mdclose from "vue-material-design-icons/Close.vue"
import mdtimer from "vue-material-design-icons/Timer.vue"
import mdlist from "../components/ClipboardTextPlayOutline.vue"
import mdcheck from "vue-material-design-icons/Check.vue"
export default {
  name: 'taskitem',
  components: {
    mdclose,
    mdtimer,
    mdlist,
    mdcheck,
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
    }
  },
  mounted: function(){
    this.initfunc();
  },
  methods: {
    initfunc() {
    
    },
    toggle() {
      this.toggling = !this.toggling;
    },
  }
}
</script>
