<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable placeholder="资源名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.url" clearable placeholder="资源路径" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.categoryId" class="filter-item" clearable placeholder="请选择" @change="handleFilter">
        <el-option
          v-for="item in resourceCategory"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;float:right" @click="handleShowCategory">
        资源分类
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
    >

      <el-table-column label="ID" align="center" prop="id">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="资源路径" align="center">
        <template slot-scope="{row}">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" width="220">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="create_time">
        <template slot-scope="{row}">
          <span> {{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}  </span>
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
        <el-form-item label="资源名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input v-model="temp.url" />
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select v-model="temp.categoryId" class="filter-item" clearable placeholder="请选择">
            <el-option
              v-for="item in resourceCategory"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="temp.description" />
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
import { resourceList, deleteResource, changeResource, resourceCategoryList } from '@/api/ums/resource'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // 基于el-pagination的二级包
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      // 业务相关参数
      // 查询相关参数
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20
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
        name: '',
        url: '',
        categoryId: '',
        description: ''
      },
      // select 相关参数
      resourceCategory: [{
        value: 0,
        label: '无上级菜单'
      }],
      // 校验相关
      rules: {
        name: [{ required: true, message: '资源名称不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '资源路径不能为空', trigger: 'blur' }],
        categoryId: [{ required: true, message: '资源分类不能为空', trigger: 'blur' }]

      }
    }
  },
  created() {
    this.getResourceCategory()
    this.getList()
  },
  methods: {
    // 加载数据
    getList() {
      this.listLoading = true
      resourceList(this.listQuery).then(response => {
        this.list = response.list
        this.total = response.total
        this.listLoading = false
      })
    },
    // 查询分类菜单
    getResourceCategory() {
      this.listLoading = true
      // 这里就不在开新的接口了(如果你的系统有200个以上的一级菜单，请自行添加查询全部的接口)
      var query = {
        pageIndex: 1,
        pageSize: 200
      }
      resourceCategoryList(query).then(response => {
        const list = response.list
        // 转换成select识别的格式
        const resourceCategory = []
        for (const key in list) {
          if (Object.hasOwnProperty.call(list, key)) {
            const element = list[key]
            resourceCategory.push({
              value: element.id,
              label: element.name
            })
          }
        }
        // 赋值
        this.resourceCategory = resourceCategory
        this.listLoading = false
      })
    },
    // 内容改变搜索
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getResourceCategory()
      this.getList()
    },

    // 还原业务对象
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        url: '',
        categoryId: '',
        description: ''
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
          changeResource(this.temp).then(() => {
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
      this.$confirm('是否要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteResource(row.id).then(response => {
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
        name: row.name,
        url: row.url,
        categoryId: row.categoryId,
        description: row.description
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // 清除校验提示
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 处理展示资源分类
    handleShowCategory() {
      this.$router.push({ path: '/ums/resourceCategory' })
    }
  }
}
</script>
