<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container">
      <el-input v-model="listQuery.name" clearable placeholder="描述" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
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

      <el-table-column label="ID" align="center" prop="id" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理员名称" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="参数" align="center" width="320" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.params }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="create_time" width="150">
        <template slot-scope="{row}">
          <span> {{ row.time | parseTime('{y}-{m}-{d} {h}:{i}') }}  </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页插件 -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>
</template>

<script>
import { logList } from '@/api/sys/log'
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
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 加载数据
    getList() {
      logList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.list
        this.total = response.total
      })
    },
    // 内容改变搜索
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getList()
    }
  }
}
</script>
