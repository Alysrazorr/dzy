<template>
  <div id="root">
    <div id="pad">
      <div id="pad2">
        <el-row type="flex">
          <el-col>
            <el-form :model="loginForm">
              <br />
              <el-row justify="center">
                <span style="font-size: 30px; font-family: '黑体'; line-height: 40px;">典政院绩效咨询（深圳）有限公司调查问卷管理系统</span>
              </el-row>
              <br />
              <br />
              <el-form-item>
                  <el-input type="input" v-model="loginForm.username" placeholder="账号">
                  </el-input>
              </el-form-item>
              <el-form-item>
                  <el-input type="password" v-model="loginForm.password" placeholder="密码">
                  </el-input>
              </el-form-item>
              <el-button type="primary" style="width: 100%;" :loading="loading" @click="login()">登录系统</el-button>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: null,
        password: null
      },
      loading: false
    }
  },
  methods: {
    login () {
      const _vm = this
      _vm.$axios.get(`/security/login?username=${_vm.loginForm.username}&password=${_vm.loginForm.password}`).then(function (result) {
        if (!result.data.data) {
          _vm.showError()
        } else {
          if (result.data.data.length) {
            _vm.$store.commit('setToken', result.data.data)
            _vm.$router.push('/')
          }
        }
      })
    },
    showError () {
      this.$message({
        message: '输入有误，请重新输入！',
        type: 'danger'
      })
    }
  }
}
</script>

<style scoped>
div#root {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  background-image: url('../assets/login.png');
}
div#pad {
  width: 500px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 6px;
  background-color: rgba(255,255,255,0.1);
}
div#pad > div#pad2 {
  padding: 25px;
  border-radius: 6px;
  background-color: rgba(255,255,255,.5);
}
</style>
