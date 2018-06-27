<template>
  <div id="root">
    <el-row :style="styles">
      <el-row type="flex" justify="end">
        <el-col :span="2">
          <el-button type="primary" @click="dialogVisible = true">新问卷</el-button>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableData"
            v-loading="loading"
            style="width: 100%">
            <el-table-column
              prop="domainId"
              label="ID"
              width="100"
              align="center">
            </el-table-column>
            <el-table-column
              prop="text"
              label="问卷标题"
              min-width="800"
              align="left">>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="200"
              align="left">>
            </el-table-column>
            <el-table-column
              width="200"
              label="操作"
              align="left">>
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle>
                </el-button>
                <el-button
                  type="success"
                  icon="el-icon-share"
                  circle>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-row>
    <el-dialog
      :title="form.text == '' ? '新问卷' : form.text"
      :visible.sync="dialogVisible"
      :lock-scroll="true"
      :close-on-click-modal="false"
      width="80%">
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item prop="text" label="问卷标题" :rules="[{ required: true, message: '请输入问卷标题', trigger: 'blur' }]">
          <el-input v-model="form.text" placeholder="问卷标题"></el-input>
        </el-form-item>
        <el-row
          v-for="(question, qIndex) in form.questions"
          :key="qIndex">
          <el-row>
            <el-col :span="20">
              <el-form-item
                :label="'题目 ' + (qIndex + 1)"
                :prop="'questions.' + qIndex + '.text'"
                :rules="{
                  required: true, message: '题目不能为空', trigger: 'blur'
                }"
              >
                <el-input v-model="question.text" placeholder="题目">
                  <el-tooltip class="item" effect="dark" content="添加选项" placement="top" slot="append">
                    <el-button @click.prevent="newOption(qIndex)" icon="el-icon-plus"></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除题目" placement="top" slot="append">
                    <el-button @click.prevent="delQuestion(qIndex)" icon="el-icon-delete"></el-button>
                  </el-tooltip>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                :label="'类型'"
                :prop="'questions.' + qIndex + '.type'"
                :rules="{
                  required: true, message: '类型不能为空', trigger: 'blur'
                }"
              >
                <el-select v-model="question.type" placeholder="类型">
                  <el-option label="单选" value="SINGLE"></el-option>
                  <el-option label="多选" value="MULTI"></el-option>
                  <el-option label="排序" value="SORT"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row
            v-for="(option, oIndex) in question.options"
            :key="oIndex" :gutter="15">
            <el-col :span="19" :offset="1">
              <el-form-item
                :label="'选项 ' + number2Alphabet(oIndex)"
                :prop="'questions.' + qIndex + '.options.' + oIndex + '.text'"
                :rules="{
                  required: true, message: '内容不能为空', trigger: 'blur'
                }"
              >
                <el-input v-model="option.text" placeholder="选项内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                :label-width="'0px'"
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
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="newQuestion">新题目</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: null,
      loading: true,
      dialogVisible: false,
      styles: {
        padding: '20px'
      },
      cellStyles: {
        'text-align': 'left'
      },
      form: {
        text: '',
        questions: [{
          options: []
        }]
      }
    }
  },
  methods: {
    submit () {
      var _vm = this
      _vm.$axios.put('/questionnaire', _vm.form).then(function (result) {
        _vm.dialogVisible = false
        _vm.loading = true
        _vm.$axios.get(`/questionnaire?currPage=1&pageSize=20`).then(function (resp) {
          _vm.tableData = resp.data.data
          _vm.loading = false
        })
      })
    },
    submitForm (formName) {
      var _vm = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _vm.submit()
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    newQuestion () {
      this.form.questions.push({
        options: []
      })
    },
    delQuestion (index) {
      this.form.questions.splice(index, 1)
    },
    newOption (qIndex) {
      this.form.questions[qIndex].options.push({
        weights: 0
      })
    },
    delOption (qIndex, oIndex) {
      this.form.questions[qIndex].options.splice(oIndex, 1)
    },
    number2Alphabet (num) {
      var alphabet = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]
      return alphabet[num]
    }
  },
  beforeMount () {
    var _vm = this
    _vm.$axios.get(`/questionnaire?currPage=1&pageSize=20`, {}).then(function (resp) {
      _vm.tableData = resp.data.data
      _vm.loading = false
    })
  }
}
</script>

<style scoped>
.el-select .el-input {
  width: 130px;
}
div#root {
  height: 100%;
  background-color: #ffffff;
}
</style>
