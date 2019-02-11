<template>
  <div>
    <br v-if="success.display || warning.display || error.display" />
    <Alert type="success" v-if="alert.success.display" show-icon>{{alert.success.message}}</Alert>
    <Alert type="warning" v-if="alert.warning.display" show-icon>{{alert.warning.message}}</Alert>
    <Alert type="error" v-if="alert.error.display" show-icon>{{alert.error.message}}</Alert>
   <br v-if="success.display || warning.display || error.display" />
  </div>
</template>
<script>
export default {
  name: "noticeinformation",
  data() {
    return {
      alert: {
        success: {
          display: false,
          message: ""
        },
        warning: {
          display: false,
          message: ""
        },
        error: {
          display: false,
          message: ""
        }
      },
      msg: "noticeinformation"
    };
  },
  methods: {
    showalert(alert, message) {
      this.alert.success.display = false
      this.alert.warning.display = false
      this.alert.error.display = false
      this.alert[alert].message = message
      this.alert[alert].display = true
    }
  }
}
</script>
<style scoped>
</style>
