<template>
  <el-row :style="styles">
    <el-row type="flex" justify="end">
      <el-col :span="2">
        <el-button type="primary" @click="dialogVisible = true">创建新问卷</el-button>
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
      width="80%">
      <el-button type="primary" @click="activeStep++">next</el-button>
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step title="步骤1" description="这是一段很长很长很长的描述性文字"></el-step>
        <el-step title="步骤2" description="这是一段很长很长很长的描述性文字"></el-step>
        <el-step title="步骤3" description="这是一段很长很长很长的描述性文字"></el-step>
        <el-step title="步骤4" description="这是一段很长很长很长的描述性文字"></el-step>
      </el-steps>
      <el-form :model="form" v-if="activeStep === 1">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submit()">提交</el-button>
      </span>
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
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      activeStep: 2
    }
  },
  methods: {
    submit () {
      var _vm = this
      _vm.dialogVisible = false
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

</style>
