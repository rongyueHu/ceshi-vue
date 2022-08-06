<template>
  <div>
    姓名<input v-focus />
    <button @click="add" v-throttle>提交按钮</button>
    <p>{{ count }}</p>
  </div>
</template>

<script>
export default {
  created () { },
  data () {
    return {
      count: 0
    }
  },
  methods: {
    add () {
      this.count++
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
</style>
