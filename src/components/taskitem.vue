<template>
    <el-card shadow="never">
      <span style="float: left">{{ todo.title }}</span>
      <el-button style="float: right; padding: 1px 0" type="text" @click="$emit('delete', todo.id)" class="el-icon-close"></el-button>
      <br>
      <span style="float: left;padding: 5px 0 12px 0">Start at: {{ todo.starttime }} Last for: {{ todo.lastfor }} minutes</span>
    </el-card>
</template>

<script>
export default {
  name: 'taskitem',
  props: {
    todo: {
      type: Object,
      required: true,
    },
  },
}
</script>
