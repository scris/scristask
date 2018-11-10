<template>
  <el-alert
		:title="todo.title"
		@close="$emit('delete', todo.id)"> </el-alert>
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
