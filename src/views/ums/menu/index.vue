<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>
    <!-- 返回 -->
    <el-button-group>
      <el-button v-if="backBtnVisible" type="text" icon="el-icon-arrow-left" @click="handleBack">返回</el-button>
    </el-button-group>
    <!-- table -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="ID" align="center" prop="id">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单级数" align="center">
        <template slot-scope="{row}">
          <span>{{ row.level == 0 ? '一级':'二级' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="前端名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="前端图标" align="center">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="是否显示" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.hidden"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(row)"
          />

        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column label="设置" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            :disabled="scope.row.level !=0 "
            @click="handleSelectRole(scope.row)"
          >查看下级
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <!-- <el-form-item label="Id" prop="id" :style="hin">
          <el-input v-model="temp.id" />
        </el-form-item> -->
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="temp.title" />
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="temp.parentId" placeholder="请选择">
            <el-option
              v-for="item in higherMenu"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="前端名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="前端图标" prop="icon" style="width: 80%">
          <template>
            <el-row>
              <el-col :span="18"><el-input v-model="temp.icon" style="float:left" /></el-col>
              <el-col :span="6"><svg-icon style="margin-left: 10px" :icon-class="temp.icon" /></el-col>
            </el-row>
          </template>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" />
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
import { menuList, updateMenuHidden, deleteMenu, changeMenu } from '@/api/menu'

import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // 基于el-pagination的二级包
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      // 查询相关参数
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        pid: 0
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
        icon: '',
        name: '',
        parentId: 0,
        sort: 0,
        title: ''
      },
      // 校验相关
      rules: {
        icon: [{ required: true, message: '前端图标不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '前端名称不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      },
      // select 相关参数
      higherMenu: [{
        value: 0,
        label: '无上级菜单'
      }],
      // 管理二级菜单返回
      backBtnVisible: false

    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 加载列表数据
    getList() {
      this.listLoading = true
      this.backBtnVisible = this.listQuery.pid !== 0
      menuList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    // 查询上级菜单
    getHigherMenu() {
      this.listLoading = true
      // 这里就不在开新的接口了(如果你的系统有200个以上的一级菜单，请自行添加查询全部的接口)
      var query = {
        pageIndex: 1,
        pageSize: 200,
        pid: 0
      }
      var that = this
      menuList(query).then(response => {
        const list = response.list
        // 转换成select识别的格式
        const higherMenu = [{
          value: 0,
          label: '无上级菜单'
        }]
        for (const key in list) {
          if (Object.hasOwnProperty.call(list, key)) {
            const element = list[key]
            // 修改的时候排除自身
            if (element.id === that.temp.id) {
              continue
            }
            higherMenu.push({
              value: element.id,
              label: element.title
            })
          }
        }
        // 赋值
        this.higherMenu = higherMenu
        this.listLoading = false
      })
    },
    // 内容改变搜索
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getList()
    },

    // 处理状态改变
    handleStatusChange(data) {
      const umsAdmin = {
        id: data.id,
        status: data.hidden
      }
      updateMenuHidden(umsAdmin).catch(() => {
        // 失败就回滚页面状态
        data.hidden = data.hidden === 0 ? 1 : 0
      })
    },
    // 还原业务对象
    resetTemp() {
      this.temp = {
        id: undefined,
        icon: '',
        name: '',
        parentId: 0,
        sort: 0,
        title: ''
      }
    },
    // 处理添加
    handleCreate() {
      this.getHigherMenu()
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
          changeMenu(this.temp).then(() => {
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
        deleteMenu(row.id).then(response => {
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
      this.getHigherMenu()
      this.temp = {
        id: row.id,
        icon: row.icon,
        name: row.name,
        parentId: row.parentId,
        sort: row.sort,
        title: row.title
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // 清除校验提示
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 处理查看下级
    handleSelectRole(row) {
      this.listQuery.pid = row.id
      this.handleFilter()
    },
    // 处理返回事件
    handleBack() {
      this.listQuery.pid = 0
      this.handleFilter()
    }
  }
}
</script>
