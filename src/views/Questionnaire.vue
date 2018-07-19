<template>
  <div id="root">
    <h1 style="font-weight: 100;">{{questionnaire.text}}</h1>
    <p style="text-indent: 2em; text-align: justify;">{{questionnaire.preface}}</p>
    <h5 style="text-align: right; line-height: 1em;">{{questionnaire.invoicing}}</h5>
    <h5 style="text-align: right; line-height: 1em;">{{questionnaire.date}}</h5>
    <p style="text-align: justify; line-height: 1.5em;"><strong>答题说明：</strong><small>{{questionnaire.guide}}</small></p>
    <el-row v-for="(question, qIndex) in questionnaire.questions" v-bind:key="qIndex">
      <el-row style="flex" justify="start">
        <div v-if="question.type === questionType.SINGLE.name">
          <el-row style="text-align: left;"><h4>{{`${qIndex + 1}、${question.text} `}}<small>[单选]</small></h4></el-row>
          <el-radio-group v-model="answers[qIndex]">
            <el-radio-button v-for="(option, oIndex) in question.options" :key="oIndex" :label="number2Alphabet(oIndex) + '. ' + option.text"></el-radio-button>
          </el-radio-group>
        </div>
        <div v-if="question.type === questionType.MULTI.name">
          <el-row style="text-align: left;"><h4>{{`${qIndex + 1}、${question.text} `}}<small>[多选]</small></h4></el-row>
          <el-checkbox-group v-model="answers[qIndex]">
            <el-checkbox-button v-for="(option, oIndex) in question.options" :label="number2Alphabet(oIndex) + '. ' + option.text" :key="oIndex"></el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div v-if="question.type === questionType.SORT.name">
          <el-row style="text-align: left;"><h4>{{`${qIndex + 1}、${question.text} `}}<small>[排序]</small></h4></el-row>
          <el-checkbox-group v-model="answers[qIndex]">
            <el-checkbox-button v-for="(option, oIndex) in question.options" :label="number2Alphabet(oIndex) + '. ' + option.text" :key="oIndex"></el-checkbox-button>
          </el-checkbox-group>
        </div>
        <div v-if="question.type === questionType.FILL.name">
          <el-row style="text-align: left;"><h4>{{`${qIndex + 1}、${question.text} `}}<small>[填写]</small></h4></el-row>
          <el-input v-model="answers[qIndex]" type="textarea"></el-input>
        </div>
        <div v-if="question.type === questionType.SCORE.name">
          <el-row style="text-align: left;"><h4>{{`${qIndex + 1}、${question.text} `}}<small>[评分]</small></h4></el-row>
          <el-row v-for="(option, oIndex) in question.options" :key="oIndex">
            <h5 style="text-align: left;">{{option.text}}</h5>
            <el-rate v-model="answers[qIndex][oIndex]" :show-text="true" :texts="['不清楚', '低', '较低', '一般', '较高', '高']" :max="6"></el-rate>
          </el-row>
        </div>
      </el-row>
    </el-row>
    <el-row style="margin-top: 20px; font-weight: 100;">
      <el-button type="primary" @click="submit('form')">提交答卷</el-button>
    </el-row>
    <el-row style="margin-top: 20px; font-weight: 100;">
      <h5 style="font-weight: 100;">{{`${$store.state.company} 提供技术支持`}}</h5>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    let questionType = this.$store.state.constants.questionType
    return {
      questionType,
      questionnaire: {},
      answers: []
    }
  },
  methods: {
    submit () {
      var _vm = this
      this.$axios.put(`/answer/${_vm.$route.params.id}`, _vm.answers).then(resp => {
        _vm.$message({
          message: '提交成功！',
          type: 'success'
        })
        setTimeout(function () {
          _vm.$router.push('/success')
        }, 2000)
      })
    },
    number2Alphabet (num) {
      return this.$utils.numberToAlphabet(num)
    }
  },
  beforeMount: function () {
    var _vm = this
    _vm.$axios.get(`/questionnaire/${_vm.$route.params.id}`).then(resp => {
      _vm.questionnaire = resp.data.data
      for (let i = 0; i < _vm.questionnaire.questions.length; i++) {
        if (_vm.questionnaire.questions[i].type === _vm.questionType.SCORE.name) {
          var options = _vm.questionnaire.questions[i].options
          _vm.answers.splice(i + 1, 0, [])
          for (let j = 0; j < options.length; j++) {
            _vm.answers[i].splice(j + 1, 0, 1)
          }
        } else if (_vm.questionnaire.questions[i].type === _vm.questionType.FILL.name) {
          _vm.answers.splice(i + 1, 0, '')
        } else {
          _vm.answers.splice(i + 1, 0, [])
        }
      }
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
