<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <!-- table -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >

      <el-table-column label="ID" align="center" prop="id" sortable="custom" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.note }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="create_time" sortable="custom" :class-name="getSortClass('create_time')">
        <template slot-scope="{row}">
          <span> {{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}  </span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(row)"
          />

        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleSelectRole(scope.row)"
          >分配角色
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>

        </template>
      </el-table-column>

    </el-table>
    <!-- 分页插件 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
    <!-- 修改弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <!-- <el-form-item label="Id" prop="id" :style="hin">
          <el-input v-model="temp.id" />
        </el-form-item> -->
        <el-form-item label="账号" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="temp.nickName" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="temp.note" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="changeData()">
          提交
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { adminList, updateAdminStatus, changeAdmin, deleteAdmin } from '@/api/admin'
import { validEmail } from '@/utils/validate'

import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // 基于el-pagination的二级包
import { sortByKey, getSortClass } from '@/utils/sort'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    // 校验邮箱
    const validateEmail = (rule, value, callback) => {
      if (!value.trim().length > 0) {
        callback()
      }
      if (validEmail(value)) {
        callback()
      } else {
        callback(new Error(rule.message))
      }
    }
    return {
      // 业务相关参数
      SEMBLANCE_PASSWORD: 'gCXJXVhWYEZ3jKnPJ01NGbkHPQ',
      // 查询相关参数
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        sortKey: 'id',
        sortDescen: 'false'
      },
      // 修改相关参数
      dialogFormVisible: false,
      dialogStatus: 'create',
      textMap: {
        update: '修改',
        create: '新增'
      },
      temp: {
        id: undefined,
        username: '',
        nickName: '',
        password: '',
        email: '',
        note: ''
      },
      // 校验相关
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        nickName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        email: [{ required: false, message: 'email格式不正确', validator: validateEmail, trigger: 'blur' }]

      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 加载排序相关方法
    getSortClass,
    // 加载数据
    getList() {
      this.listLoading = true
      adminList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    // 内容改变搜索
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getList()
    },
    // sort 改变事件
    sortChange(data) {
      const { prop, order } = data
      sortByKey(this, order, prop, this.handleFilter)
    },
    // 处理状态改变
    handleStatusChange(data) {
      const umsAdmin = {
        id: data.id,
        status: data.status
      }
      updateAdminStatus(umsAdmin).catch(error => {
        console.log('err' + error.message)
        // 失败就回滚页面状态
        data.status = data.status === 0 ? 1 : 0
      })
    },
    // 还原业务对象
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        nickName: '',
        email: '',
        note: ''
      }
    },
    // 处理添加
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      // 清除校验提示
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新增
    changeData() {
      // 校验参数
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 判断password是否改变过
          if (this.temp.password === this.SEMBLANCE_PASSWORD) {
            // 如果没修改过，就删除password ，后台不做修改
            delete this.temp.password
          }
          changeAdmin(this.temp).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: (this.dialogStatus === 'update' ? '修改' : '添加') + '成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 处理删除
    handleDelete(row) {
      this.$confirm('是否要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdmin(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    },
    // 处理修改
    handleUpdate(row) {
      this.temp = {
        id: row.id,
        password: this.SEMBLANCE_PASSWORD,
        username: row.username,
        nickName: row.nickName,
        email: row.email,
        note: row.note
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // 清除校验提示
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    }
  }
}
</script>
