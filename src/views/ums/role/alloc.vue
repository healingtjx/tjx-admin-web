<template>
  <el-card class="form-container" shadow="never">
    <el-tag>{{ type === 1?'分配菜单':'分配资源' }}</el-tag>
    <el-tree
      ref="tree"
      :data="tree"
      show-checkbox
      default-expand-all
      node-key="id"
      highlight-current
      :props="defaultProps"
    />
    <div style="margin-top: 20px" align="center">
      <el-button type="primary" @click="handleSave()">保存</el-button>
      <el-button @click="handleClear()">清空</el-button>
    </div>
  </el-card>
</template>

<script>
import { menuTreeList } from '@/api/menu'
import { resourceTreeList } from '@/api/resource'

import { allocMenu, allocResource } from '@/api/role'
export default {
  name: 'ComplexTable',
  filters: {},
  data() {
    return {
      // 查询相关参数
      tree: [],
      // 1 分配菜单 2 分配资源
      type: 1,
      listLoading: true,
      listQuery: {
        roleId: 1
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    const roleId = this.$route.query.roleId
    const type = this.$route.query.type
    if (type) {
      this.type = type
    }
    if (roleId) {
      this.listQuery.roleId = roleId
    }
    this.getList()
  },
  methods: {
    // 加载数据
    getList() {
      this.listLoading = true
      var treeList = this.type === 1 ? menuTreeList : resourceTreeList
      treeList(this.listQuery).then(response => {
        this.tree = response.data.tree
        this.listLoading = false
        // 处理
        this.$refs.tree.setCheckedKeys(response.data.ids)
      })
    },
    // 处理保存
    handleSave() {
      // 获取被选中元素
      const keys = this.$refs.tree.getCheckedKeys()
      const saveDate = {
        roleId: this.listQuery.roleId,
        relationIds: keys
      }
      var alloc = this.type === 1 ? allocMenu : allocResource
      alloc(saveDate).then(response => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 处理清空
    handleClear() {
      this.$refs.tree.setCheckedKeys([])
    }
  }

}
</script>
