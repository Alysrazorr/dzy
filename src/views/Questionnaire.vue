<template>
  <div id="root">
    <h1 style="font-weight: 100;">{{questionnaire.text}}</h1>
    <h5>{{questionnaire.createTime}}</h5>
    <el-row v-for="(question, qIndex) in questionnaire.questions" v-bind:key="qIndex">
      <el-row style="flex" justify="start">
        <el-col :span="24">{{question.text}}</el-col>

        <div v-if="question.type === 'SINGLE'">
          <!-- <el-radio-group v-model="answers[qIndex].answer" style="font-size: 16px; font-weight: 100; text-align: left;">
            <el-radio :label="oIndex" v-for="(option, oIndex) in question.options" v-bind:key="oIndex"
              style="">{{option.text}}</el-radio>
          </el-radio-group> -->
          <el-checkbox-group v-model="answers[qIndex].answer">
            <el-checkbox :label="oIndex" v-for="(option, oIndex) in question.options" v-bind:key="oIndex">{{option.text}}</el-checkbox>
          </el-checkbox-group>
          <!-- <el-row v-for="(option, oIndex) in question.options" v-bind:key="oIndex">
            {{option.text}}
          </el-row> -->
        </div>

      </el-row>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      questionnaire: {},
      answers: []
    }
  },
  beforeMount: function () {
    var _vm = this
    this.$axios.get(`/questionnaire/${_vm.$route.params.id}`).then(resp => {
      for (let i = 0; i < resp.data.data.questions.length; i++) {
        _vm.answers.push({})
      }
      _vm.questionnaire = resp.data.data
    })
  }
}
</script>

<style scoped>
div#root {
  padding: 40px;
  height: calc(100% - 80px);
  overflow: auto;
}
</style>
