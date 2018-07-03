<template>
  <div id="root">
    <el-row style="margin: 20px;" type="flex" justify="end">
      <el-col :span="4">
        <el-button type="primary" @click="newQuestionnaire" style="width: 100%;">新问卷</el-button>
      </el-col>
    </el-row>
    <el-row id="list">
      <el-table
        :data="table"
        v-loading="loading.table"
        style="width: 100%">
        <el-table-column prop="domainId" label="ID" width="60" align="center"></el-table-column>
        <el-table-column prop="text" label="问卷标题" min-width="600" align="left"></el-table-column>
        <el-table-column prop="phase" label="状态" width="100" align="center"></el-table-column>
        <el-table-column prop="answerCount" label="答卷数量" width="100" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" align="center"></el-table-column>
        <el-table-column width="600" label="操作" align="left">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="showEditModal(scope.row)">编辑</el-button>
            <el-button type="success" size="small" @click="showStatisticsModal(scope.row)">统计</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog id="formDialog"
      :title="form.text == '' ? '新问卷' : form.text"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :visible.sync="visible.formDialog"
      v-loading="loading.form"
      width="80%"
      >
      <el-form :model="form" ref="form" label-width="100px">
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
          </el-row>
          <el-row>
            <el-col :span="23" :offset="1" :style="'text-align: left;'">
              <el-form-item
                :label="'题目类型'"
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
          <el-row v-if="question.type === 'SINGLE'">
            <el-col :span="23" :offset="1" :style="'text-align: left;'">
              <el-form-item
                :label="'计算均值'"
                :prop="'questions.' + qIndex + '.calcAvg'"
                required
                >
                <el-switch
                  v-model="question.calcAvg"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(option, oIndex) in question.options" :key="oIndex">
            <el-col :span="question.type === 'SINGLE' ? 19 : 23" :offset="1">
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
            <el-col :span="question.type === 'SINGLE' ? 4 : 0">
              <el-form-item
                :label="'权重'"
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
    <el-dialog id="statisticsDialog"
      :title="questionnaire.text"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :visible.sync="visible.statisticsDialog"
      width="80%"
      >
      <el-row>
        <h1>{{`总平均分：${!questionnaire.avg ? 0 : questionnaire.avg}`}}</h1>
      </el-row>
      <el-row
        v-for="(question, qIndex) in questionnaire.questions"
        v-if="question.type === 'SINGLE' || question.type === 'MULTI'"
        :key="qIndex"
        :class="'question-class'"
        >
        <el-row>
          <h1 :style="'font-weight: 100; padding: 0 10px;'">{{question.text}}</h1>
        </el-row>
        <el-row type="flex">
          <el-col :span="16">
            <el-row
              type="flex"
              :gutter="10"
              :style="'margin: 10px; margin-top: 0;'"
              >
              <el-col :class="'option-header-class'" :span="16"><div>选项</div></el-col>
              <el-col :class="'option-header-class'" :span="2"><div>权重</div></el-col>
              <el-col :class="'option-header-class'" :span="2"><div>票数</div></el-col>
              <el-col :class="'option-header-class'" :span="2"><div>占比</div></el-col>
              <el-col :class="'option-header-class'" :span="2"><div>分值</div></el-col>
            </el-row>
            <el-row
              type="flex"
              v-for="(option, oIndex) in question.options"
              :key="oIndex"
              :gutter="10"
              :style="'margin: 10px;'"
              >
              <el-col :class="'option-class'" :span="16"><div>{{option.text}}</div></el-col>
              <el-col :class="'option-class'" :span="2"><div>{{option.weights}}</div></el-col>
              <el-col :class="'option-class'" :span="2"><div>{{option.count === 0 || option.count === NaN ? '-' : option.count}}</div></el-col>
              <el-col :class="'option-class'" :span="2"><div>{{option.percent === '0.00' ? '-' : option.percent}}</div></el-col>
              <el-col :class="'option-class'" :span="2"><div>{{option.score === '0.00' ? '-' : option.score}}</div></el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <div :id="`pie_${question.rank}`" :style="'height: 100%;'"></div>
          </el-col>
        </el-row>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      table: null,
      loading: {
        table: false,
        formDialog: false,
        statisticsDialog: false
      },
      visible: {
        formDialog: false,
        statisticsDialog: false
      },
      questionnaire: {
        title: null
      },
      form: {
        domainId: undefined,
        text: '',
        invoicing: '',
        preface: '',
        guide: '',
        date: '',
        questions: [{
          type: 'SINGLE',
          calcAvg: true,
          options: [{
            weights: 1
          }]
        }]
      },
      form_: {
        domainId: undefined,
        text: '',
        invoicing: '',
        preface: '',
        guide: '',
        date: '',
        questions: [{
          type: 'SINGLE',
          calcAvg: true,
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
          _vm.loading.formDialog = true
          if (_vm.form.domainId === undefined) {
            _vm.$axios.put('/questionnaire', _vm.form).then(resp => {
              _vm.loading.formDialog = false
              _vm.visible.formDialog = false
              _vm.form = _vm.form_
              _vm.getList(1, 50)
            })
          } else {
            _vm.$axios.post(`/questionnaire/${_vm.form.domainId}`, _vm.form).then(resp => {
              _vm.loading.formDialog = false
              _vm.visible.formDialog = false
              _vm.form = _vm.form_
              _vm.getList(1, 50)
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
      this.visible.formDialog = true
      this.form = this.form_
    },
    newQuestion () {
      this.form.questions.push({
        type: 'SINGLE',
        calcAvg: true,
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
    showEditModal (row) {
      var _vm = this
      _vm.loading.formDialog = true
      _vm.visible.formDialog = true
      _vm.$axios.get(`/questionnaire/${row.domainId}`).then(resp => {
        _vm.loading.formDialog = false
        _vm.form = resp.data.data
      })
    },
    getList (currPage, pageSize) {
      var _vm = this
      _vm.loading.table = true
      _vm.$axios.get(`/questionnaire?currPage=${currPage}&pageSize=${pageSize}`).then(resp => {
        _vm.table = resp.data.data
        _vm.loading.table = false
      })
    },
    showStatisticsModal (row) {
      var _vm = this
      _vm.loading.statisticsDialog = true
      _vm.visible.statisticsDialog = true
      _vm.$axios.get(`/answer/${row.domainId}`).then(resp => {
        const contents = resp.data.data

        _vm.$axios.get(`/questionnaire/${row.domainId}`).then(resp => {
          _vm.loading.statisticsDialog = false
          _vm.questionnaire = resp.data.data

          for (let content of contents) {
            let answer = JSON.parse(content)
            for (let questionIndex in _vm.questionnaire.questions) {
              let questionAnswer = answer[questionIndex]
              if (typeof questionAnswer === 'string') {
                for (let optionIndex in _vm.questionnaire.questions[questionIndex].options) {
                  let option = _vm.questionnaire.questions[questionIndex].options[optionIndex]
                  option.count = option.count === null || option.count === undefined ? 0 : option.count
                  if (questionAnswer === `${_vm.number2Alphabet(optionIndex)}. ${option.text}`) {
                    option.count++
                  }
                }
              }
              if (Array.isArray(questionAnswer)) {
                for (let qa of questionAnswer) {
                  for (let optionIndex in _vm.questionnaire.questions[questionIndex].options) {
                    let option = _vm.questionnaire.questions[questionIndex].options[optionIndex]
                    option.count = option.count === null || option.count === undefined ? 0 : option.count
                    if (qa === `${_vm.number2Alphabet(optionIndex)}. ${option.text}`) {
                      option.count++
                    }
                  }
                }
              }
            }
          }

          for (let question of _vm.questionnaire.questions) {
            question.count = 0
            for (let option of question.options) {
              question.count += option.count
            }
          }
          for (let question of _vm.questionnaire.questions) {
            question.score = 0
            for (let option of question.options) {
              option.percent = (option.count * 100 / question.count).toFixed(2)
              option.score = (option.weights * option.percent).toFixed(2)
              question.score += parseInt(option.score)
            }
          }

          _vm.questionnaire.avg = 0
          _vm.questionnaire.avgCount = 0
          for (let question of _vm.questionnaire.questions) {
            if (question.type === 'SINGLE' || question.type === 'MULTI') {
              let avg = {
                text: '平均分',
                weights: '-',
                count: '-',
                percent: '-',
                score: (question.score / question.options.length).toFixed(2)
              }
              question.options.push(avg)
              _vm.form.avg += parseInt(avg.score)
              _vm.form.avgCount++

              var chart = _vm.$echarts.init(document.getElementById(`pie_${question.rank}`))
              chart.setOption({
                backgroundColor: '#2c343c',
                title: {
                  text: 'Customized Pie',
                  left: 'center',
                  top: 20,
                  textStyle: {
                    color: '#ccc'
                  }
                },
                tooltip: {
                  trigger: 'item',
                  formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                visualMap: {
                  show: false,
                  min: 80,
                  max: 600,
                  inRange: {
                    colorLightness: [0, 1]
                  }
                },
                series: [{
                  name: '访问来源',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '50%'],
                  data: [{value: 335, name: '直接访问'},
                    {value: 310, name: '邮件营销'},
                    {value: 274, name: '联盟广告'},
                    {value: 235, name: '视频广告'},
                    {value: 400, name: '搜索引擎'}].sort(function (a, b) { return a.value - b.value }),
                  roseType: 'radius',
                  label: {
                    normal: {
                      textStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                      }
                    }
                  },
                  labelLine: {
                    normal: {
                      lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                      },
                      smooth: 0.2,
                      length: 10,
                      length2: 20
                    }
                  },
                  itemStyle: {
                    normal: {
                      color: '#c23531',
                      shadowBlur: 200,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  },
                  animationType: 'scale',
                  animationEasing: 'elasticOut',
                  animationDelay: function (idx) {
                    return Math.random() * 200
                  }
                }]
              })
            }
          }
          _vm.questionnaire.avg = (_vm.questionnaire.avg / _vm.questionnaire.avgCount).toFixed(2)
        })
      })
    }
  },
  beforeMount () {
    this.getList(1, 50)
  }
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

.question-class {
  background-color: rgba(165, 42, 42, 0.05);
  color: #333;
  border-radius: 6px;
  margin: 10px 0;
}

.option-class div {
  background-color: rgba(95, 158, 160, 0.1);
  color: #222;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  font-weight: 100;
}
.option-header-class div {
  background-color: rgba(95, 158, 160, 0.9);
  color: aliceblue;
  border-radius: 6px;
  font-size: 20px;
  font-weight: 100;
  padding: 10px;
}
</style>
