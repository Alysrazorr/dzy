<template>
  <div id="root">
    <el-row style="margin: 20px;" type="flex" justify="end">
      <el-col :span="4">
        <el-button type="primary" @click="newQuestionnaire" style="width: 100%;">新问卷</el-button>
      </el-col>
    </el-row>
    <el-row id="list">
      <el-row>
        <el-col :span="24">
          <el-table
            :data="tableData"
            v-loading="loading"
            style="width: 100%">
            <el-table-column prop="domainId" label="ID" width="60" align="center"></el-table-column>
            <el-table-column prop="text" label="问卷标题" min-width="600" align="left"></el-table-column>
            <el-table-column prop="phase" label="状态" width="100" align="left"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="200" align="left"></el-table-column>
            <el-table-column width="600" label="操作" align="left">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="showEditModal(scope.row.domainId)">编辑</el-button>
                <el-button type="success" size="small" @click="showStatisticsModal(scope.row.domainId)">统计</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-row>
    <el-dialog
      :title="form.text == '' ? '新问卷' : form.text"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="80%"
      >
      <el-form :model="form" ref="form" label-width="100px" v-loading="formLoading">
        <el-form-item prop="text" label="标题" :rules="[{ required: true, message: '请输入标题', trigger: 'blur' }]">
          <el-input v-model="form.text" placeholder="标题"></el-input>
        </el-form-item>
        <el-form-item prop="preface" label="卷首语" :rules="[{ required: true, message: '请输入卷首语', trigger: 'blur' }]">
          <el-input type="textarea" v-model="form.preface" placeholder="卷首语"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="16">
            <el-form-item prop="invoicing" label="落款" :rules="[{ required: true, message: '请输入落款', trigger: 'blur' }]">
              <el-input v-model="form.invoicing" placeholder="落款"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="日期" required>
              <el-form-item prop="date" :rules="[{ type: 'string', required: true, message: '请输入日期', trigger: 'change' }]">
                <el-date-picker v-model="form.date" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="guide" label="答题说明">
          <el-input type="textarea" v-model="form.guide" placeholder="答题说明"></el-input>
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
                    <el-button @click.prevent="delQuestion(qIndex, question.text)" icon="el-icon-delete"></el-button>
                  </el-tooltip>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                :label="'类型'"
                :label-width="'60px'"
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
          <el-row v-for="(option, oIndex) in question.options" :key="oIndex">
            <el-col :span="19" :offset="1">
              <el-form-item
                :label="'选项 ' + number2Alphabet(oIndex)"
                :prop="'questions.' + qIndex + '.options.' + oIndex + '.text'"
                :rules="{ required: true, message: '内容不能为空', trigger: 'blur' }"
                >
                <el-input v-model="option.text" placeholder="选项内容">
                  <el-tooltip class="item" effect="dark" content="删除选项" placement="top" slot="append">
                    <el-button @click.prevent="delOption(qIndex, oIndex, option.text)" icon="el-icon-delete"></el-button>
                  </el-tooltip>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                :label="'权重'"
                :label-width="'60px'"
                :prop="'questions.' + qIndex + '.options.' + oIndex + '.weights'"
                :rules="[{ type: 'number', message: '权重必须为数字值'}, { required: true, message: '请输入权重'}]"
                required>
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: null,
      loading: true,
      dialogVisible: false,
      formLoading: false,
      form: {
        domainId: undefined,
        text: '',
        invoicing: '',
        preface: '',
        guide: '',
        date: '',
        questions: [{
          options: [{
            weights: 1
          }]
        }]
      },
      defaultForm: {
        domainId: undefined,
        text: '',
        invoicing: '',
        preface: '',
        guide: '',
        date: '',
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
          if (typeof _vm.form.domainId === 'undefined') {
            _vm.$axios.put('/questionnaire', _vm.form).then(resp => {
              _vm.dialogVisible = false
              _vm.form = _vm.defaultForm
              getList(_vm, 1, 50)
            })
          } else {
            _vm.$axios.post(`/questionnaire/${_vm.form.domainId}`, _vm.form).then(resp => {
              _vm.dialogVisible = false
              _vm.form = _vm.defaultForm
              getList(_vm, 1, 50)
            })
          }
        } else {
          return false
        }
      })
    },
    reset (formName) {
      this.$refs[formName].resetFields()
    },
    newQuestionnaire () {
      this.dialogVisible = true
      this.form = this.defaultForm
    },
    newQuestion () {
      this.form.questions.push({
        options: [{
          weights: 1
        }]
      })
    },
    delQuestion (index, text) {
      this.$confirm(`确认删除 ${typeof text !== 'undefined' ? text : '本题'} 吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.questions.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    newOption (qIndex) {
      this.form.questions[qIndex].options.push({
        weights: 1
      })
    },
    delOption (qIndex, oIndex, text) {
      this.$confirm(`确认删除 ${typeof text !== 'undefined' ? text : '本选项'} 吗？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.form.questions[qIndex].options.splice(oIndex, 1)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    number2Alphabet (num) {
      return this.$utils.numberToAlphabet(num)
    },
    showEditModal (id) {
      var _vm = this
      _vm.dialogVisible = true
      _vm.formLoading = true
      _vm.$axios.get(`/questionnaire/${id}`).then(function (resp) {
        _vm.formLoading = false
        _vm.form = resp.data.data
      })
    }
  },
  beforeMount () {
    getList(this, 1, 50)
  }
}

const getList = (_vm, currPage, pageSize) => {
  _vm.loading = true
  _vm.$axios.get(`/questionnaire?currPage=${currPage}&pageSize=${pageSize}`).then(resp => {
    _vm.tableData = resp.data.data
    _vm.loading = false
  })
}
</script>

<style scoped>
div#root {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

#list {
  margin: 20px;
  box-shadow: 0 3px 1px rgba(0,0,0,0.1);
}
</style>
