<template>
  <el-row :style="styles">
    <el-row type="flex" justify="end">
      <el-col :span="2">
        <el-button type="primary" @click="dialogVisible = true">新问卷</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="tableData"
          v-loading="loading"
          style="width: 100%">
          <el-table-column
            prop="p_id"
            label="ID"
            width="100"
            align="center">
          </el-table-column>
          <el-table-column
            prop="title"
            label="问卷标题"
            min-width="800"
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
    <el-dialog
      title="创建新问卷"
      :visible.sync="dialogVisible"
      :lock-scroll="true"
      :close-on-click-modal="false"
      width="80%">
      <el-row>
        <el-col :span="1">
          <el-tooltip class="item" effect="dark" content="上一步" placement="top-start">
            <el-button type="default" icon="el-icon-arrow-left" circle @click="backward()"></el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="22">
          <el-steps :active="activeStep" finish-status="success" align-center>
            <el-step title="步骤1" description="填写问卷名称"></el-step>
            <el-step title="步骤2" description="填写问卷题目"></el-step>
            <el-step title="步骤3" description="填写题目选项"></el-step>
          </el-steps>
          <el-form :model="form" style="margin-top: 40px;">
            <el-row v-if="activeStep === 0">
              <el-form-item label="问卷名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
              </el-form-item>
            </el-row>
            <el-row v-if="activeStep === 1">
              <el-form-item :label="'题目 ' + (index + 1)" :label-width="formLabelWidth" v-for="(question, index) in form.questions" v-bind:key="index">
                <el-input v-model="question.text" auto-complete="off">
                  <el-select v-model="question.type" slot="prepend" placeholder="类型">
                    <el-option label="单选" value="SINGLE"></el-option>
                    <el-option label="多选" value="MULTI"></el-option>
                    <el-option label="排序" value="SORT"></el-option>
                  </el-select>
                  <el-button type="danger" icon="el-icon-delete" circle @click="delQuestion(index)" slot="append"></el-button>
                </el-input>
              </el-form-item>
              <el-row type="flex" justify="center">
                <el-col :span="24">
                  <el-button type="primary" @click="newQuestion()" circle icon="el-icon-plus"></el-button>
                </el-col>
              </el-row>
            </el-row>
            <el-row v-if="activeStep === 2">
              <el-form-item :label="'题目 ' + (qIndex + 1)" :label-width="formLabelWidth" v-for="(question, qIndex) in form.questions" v-bind:key="qIndex">
                <el-input v-model="question.text" auto-complete="off" readonly="readonly">
                  <el-button type="danger" icon="el-icon-plus" circle @click="newOption(qIndex)" slot="append"></el-button>
                </el-input>
                <el-row>
                  <el-form-item
                    :label="'选项 ' + number2Alphabet(oIndex)"
                    :label-width="formLabelWidth"
                    v-for="(option, oIndex) in question.options" v-bind:key="oIndex"
                    style="margin-top: 5px;">
                    <el-input v-model="option.text" auto-complete="off">
                      <el-button type="danger" icon="el-icon-delete" circle @click="delOption(qIndex, oIndex)" slot="append"></el-button>
                    </el-input>
                  </el-form-item>
                </el-row>
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="1">
          <el-tooltip class="item" effect="dark" content="下一步" placement="top-start">
            <el-button type="default" icon="el-icon-arrow-right" circle @click="forward()"></el-button>
          </el-tooltip>
        </el-col>
      </el-row>
    </el-dialog>
  </el-row>
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
        name: '',
        questions: [{
          options: []
        }]
      },
      formLabelWidth: '120px',
      activeStep: 0,
      maxSteps: 3
    }
  },
  methods: {
    submit () {
      var _vm = this
      _vm.dialogVisible = false
    },
    forward () {
      this.activeStep += this.activeStep >= this.maxSteps ? 0 : 1
    },
    backward () {
      this.activeStep -= this.activeStep > 0 ? 1 : 0
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
      this.form.questions[qIndex].options.push({})
    },
    delOption (qIndex, oIndex) {
      this.form.questions[qIndex].options.splice(oIndex, 1)
    },
    number2Alphabet (num) {
      var alphabet = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]
      return alphabet[num]
    }
  },
  mounted () {
    var _vm = this
    _vm.$axios.get(`/apis/questionnaire?currPage=1&pageSize=20`, {}).then(function (resp) {
      _vm.tableData = resp.data.data.content
      _vm.loading = false
    })
  }
}
</script>

<style>
.el-select .el-input {
  width: 130px;
}
</style>
