<template>
  <el-card class="form-container" shadow="never">
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
import { allocMenu } from '@/api/role'
export default {
  name: 'ComplexTable',
  filters: {},
  data() {
    return {
      // 查询相关参数
      tree: [],
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
    if (roleId) {
      this.listQuery.roleId = roleId
    }
    this.getList()
  },
  methods: {
    // 加载数据
    getList() {
      this.listLoading = true
      menuTreeList(this.listQuery).then(response => {
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
      allocMenu(saveDate).then(response => {
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
