<template>
  <el-dialog
    :title="form.text == '' ? '新问卷' : form.text"
    :lock-scroll="true"
    :close-on-click-modal="false"
    :closed="$emit('update:dialogVisible', false)"
    :visible.sync="dialogVisible"
    width="80%"
    >
    <el-form :model="form" ref="form" label-width="100px">
      <el-form-item prop="text" label="标题" :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]">
        <el-input v-model="form.text" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item prop="text" label="祝词" :rules="[{ required: true, message: '请输入祝词', trigger: 'blur' }]">
        <el-input type="textarea" v-model="form.toast" placeholder="祝词"></el-input>
      </el-form-item>
      <el-form-item prop="text" label="落款" :rules="[{ required: true, message: '请输入落款', trigger: 'blur' }]">
        <el-input v-model="form.invoicing" placeholder="落款"></el-input>
      </el-form-item>
      <el-row
        v-for="(question, qIndex) in form.questions"
        :key="qIndex">
        <el-row>
          <el-col :span="20">
            <el-form-item
            :label="'题目 ' + (qIndex + 1)"
            :prop="'questions.' + qIndex + '.text'"
            :rules="{ required: true, message: '题目不能为空', trigger: 'blur' }"
            >
            <el-input v-model="question.text" placeholder="题目">
                <el-tooltip class="item" effect="dark" content="添加选项" placement="top" slot="append">
                <el-button @click.prevent="newOption(qIndex)" icon="el-icon-plus"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除题目" placement="top" slot="append">
                <el-button @click.prevent="delQuestion(qIndex)" icon="el-icon-delete"></el-button>
                </el-tooltip>
                <el-form-item
                :prop="'questions.' + qIndex + '.type'"
                :rules="{ required: true, message: '类型不能为空', trigger: 'blur' }"
                slot="prepend"
                >
                <el-select v-model="question.type" placeholder="类型">
                    <el-option label="单选" value="SINGLE"></el-option>
                    <el-option label="多选" value="MULTI"></el-option>
                    <el-option label="排序" value="SORT"></el-option>
                    <el-option label="填写" value="FILL_IN"></el-option>
                </el-select>
                </el-form-item>
            </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
            :label="'类型'"
            :prop="'questions.' + qIndex + '.type'"
            :rules="{ required: true, message: '类型不能为空', trigger: 'blur' }"
            >
            <el-select v-model="question.type" placeholder="类型">
                <el-option label="单选" value="SINGLE"></el-option>
                <el-option label="多选" value="MULTI"></el-option>
                <el-option label="排序" value="SORT"></el-option>
                <el-option label="填写" value="FILL_IN"></el-option>
            </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(option, oIndex) in question.options" :key="oIndex" :gutter="15">
          <el-col :span="19" :offset="1">
            <el-form-item
            :label="'选项 ' + number2Alphabet(oIndex)"
            :prop="'questions.' + qIndex + '.options.' + oIndex + '.text'"
            :rules="{ required: true, message: '内容不能为空', trigger: 'blur' }"
            >
              <el-input v-model="option.text" placeholder="选项内容">
                <el-tooltip class="item" effect="dark" content="删除选项" placement="top" slot="append">
                  <el-button @click.prevent="delOption(qIndex, oIndex)" icon="el-icon-delete"></el-button>
                </el-tooltip>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item
            :label="'权重'"
            :label-width="'60px'"
            :prop="'questions.' + qIndex + '.options.' + oIndex + '.weights'"
            :rules="[
                { required: true, message: '权重不能为空'},
                { type: 'number', message: '权重必须为数字值'}
            ]"
            >
            <el-input v-model.number="option.weights" placeholder="权重"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="submit('form')">提交</el-button>
        <el-button @click="newQuestion">新题目</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      form: {
        text: '',
        questions: [{
          options: [{
            weights: 1
          }]
        }]
      }
    }
  },
  methods: {
    submit (formName) {
      var _vm = this
      _vm.$refs[formName].validate((valid) => {
        if (valid) {
          _vm.$axios.put('/questionnaire', _vm.form).then(function (result) {
            _vm.$emit('afterAdd')
          })
        } else {
          return false
        }
      })
    },
    newQuestion () {
      this.form.questions.push({
        options: [{
          weights: 1
        }]
      })
    },
    delQuestion (index) {
      this.form.questions.splice(index, 1)
    },
    newOption (qIndex) {
      this.form.questions[qIndex].options.push({
        weights: 1
      })
    },
    delOption (qIndex, oIndex) {
      this.form.questions[qIndex].options.splice(oIndex, 1)
    },
    number2Alphabet (num) {
      return this.$utils.numberToAlphabet(num)
    }
  }
}
</script>

<style>
</style>
