<template>
    <el-card shadow="never">
    <el-container>
      <el-aside width="30%">
        <span style="float: left;padding: 5px 0 12px 0">{{ todo.starttime }}<br> +{{ todo.lastfor }}</span>
      </el-aside>
      <el-main>
        <span>{{ todo.title }}</span>
        <el-button style="float: right; padding: 1px 0" type="text" @click="$emit('delete', todo.id)" class="el-icon-close"></el-button>
      </el-main>
    </el-container>      
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
