<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="阿里云配置" name="0">
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="域名">
            <el-input v-model="form.aliyunDomain" placeholder="阿里云绑定域名" />
          </el-form-item>
          <el-form-item label="路径前缀">
            <el-input v-model="form.aliyunPrefix" placeholder="不设置默认为空" />
          </el-form-item>
          <el-form-item label="EndPoint">
            <el-input v-model="form.aliyunEndPoint" placeholder="阿里云EndPoint" />
          </el-form-item>
          <el-form-item label="AccessKeyId">
            <el-input v-model="form.aliyunAccessKeyId" placeholder="阿里云绑定AccessKeyId" />
          </el-form-item>
          <el-form-item label="AccessKeySecret">
            <el-input v-model="form.aliyunAccessKeySecret" placeholder="阿里云绑定AccessKeySecret" />
          </el-form-item>
          <el-form-item label="BucketName">
            <el-input v-model="form.aliyunBucketName" placeholder="阿里云BucketName" />
          </el-form-item>
          <el-form-item label="是否开启">
            <el-switch
              v-model="select.first"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitchClick($event,0)"
            />
          </el-form-item>

        </el-form>
      </el-tab-pane>
      <el-tab-pane label="七牛云配置" name="1">
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="域名">
            <el-input v-model="form.qiniuDomain" placeholder="七牛云绑定域名" />
          </el-form-item>
          <el-form-item label="路径前缀">
            <el-input v-model="form.qiniuPrefix" placeholder="不设置默认为空" />
          </el-form-item>
          <el-form-item label="AccessKey">
            <el-input v-model="form.qiniuAccessKey" placeholder="七牛云AccessKey" />
          </el-form-item>
          <el-form-item label="SecretKey">
            <el-input v-model="form.qiniuSecretKey" placeholder="七牛云SecretKey" />
          </el-form-item>
          <el-form-item label="空间名">
            <el-input v-model="form.qiniuBucketName" placeholder="七牛云空间名" />
          </el-form-item>
          <el-form-item label="是否开启">
            <el-switch
              v-model="select.second"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitchClick($event,1)"
            />
          </el-form-item>

        </el-form>
      </el-tab-pane>
      <el-tab-pane label="腾讯云配置" name="2">
        <el-form ref="form" :model="form" label-width="150px">
          <el-form-item label="域名">
            <el-input v-model="form.qcloudDomain" placeholder="腾讯云绑定域名" />
          </el-form-item>
          <el-form-item label="路径前缀">
            <el-input v-model="form.qcloudPrefix" placeholder="不设置默认为空" />
          </el-form-item>
          <el-form-item label="AppID">
            <el-input v-model="form.qcloudAppId" placeholder="腾讯云AppId" />
          </el-form-item>
          <el-form-item label="SecretId">
            <el-input v-model="form.qcloudSecretId" placeholder="腾讯云SecretId" />
          </el-form-item>
          <el-form-item label="SecretKey">
            <el-input v-model="form.qcloudSecretKey" placeholder="腾讯云SecretKey" />
          </el-form-item>
          <el-form-item label="BucketName">
            <el-input v-model="form.qcloudBucketName" placeholder="腾讯云BucketName" />
          </el-form-item>
          <el-form-item label="Bucket所属地区">
            <el-input v-model="form.qcloudRegion" placeholder="如：sh(可选值，华南：gz华北：tj华东：sh)" />
          </el-form-item>
          <el-form-item label="是否开启">
            <el-switch
              v-model="select.third"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleSwitchClick($event,2)"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-row class="center">
      <el-button type="primary" align="center" @click="handleSave">保存</el-button>
    </el-row>
    <el-divider content-position="left">{{ defaultMsg }}</el-divider>

    <el-upload
      drag
      action="http://localhost:8080/upload/file/img"
      multiple
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <Editor ref="Editor" :default-msg="defaultMsg" :config="config" />
  </div>
</template>

<script>
import Editor from '@/components/Editor/index'
import { saveConfig, configInfo } from '@/api/sys/config'
export default {
  components: { Editor },
  data() {
    return {
      defaultMsg: '这里是UE测试',
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      },
      activeName: '0',
      select: {
        first: true,
        second: false,
        third: false
      },
      form: {
        type: 0,
        qiniuDomain: '',
        qiniuPrefix: '',
        qiniuAccessKey: '',
        qiniuSecretKey: '',
        qiniuBucketName: '',
        aliyunDomain: '',
        aliyunPrefix: '',
        aliyunEndPoint: '',
        aliyunAccessKeyId: '',
        aliyunAccessKeySecret: '',
        aliyunBucketName: '',
        qcloudDomain: '',
        qcloudPrefix: '',
        qcloudAppId: '',
        qcloudSecretId: '',
        qcloudSecretKey: '',
        qcloudBucketName: '',
        qcloudRegion: ''
      }
    }
  },
  /**
   * 初始化方法
   */
  created() {
    this.loadConfig()
  },
  methods: {
    /**
       * 加载配置信息
       */
    loadConfig() {
      console.log(Editor)
      configInfo().then((response) => {
        var data = response.data
        this.form = data
        var type = data.type
        this.activeName = type + ''
        var select = {
          first: (type === 0),
          second: (type === 1),
          third: (type === 2)
        }
        this.select = select
      })
    },

    /**
     * 处理开启配置
     */
    handleSwitchClick(event, type) {
      if (!event) {
        this.$message({
          message: '必须保留一个选中',
          type: 'warning'
        })
      }
      var select = {
        first: (type === 0),
        second: (type === 1),
        third: (type === 2)
      }
      this.form.type = type
      this.select = select
    },
    /**
     * 处理保存123
     */
    handleSave() {
      this.getUEContent()
      var form = this.form
      saveConfig(form).then((respose) => {
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      })
    },
    getUEContent() {
      const content = this.$refs.Editor.getUEContent()
      this.$notify({
        title: '获取成功，可在控制台查看！',
        message: content,
        type: 'success'
      })
      this.$data.defaultMsg = content
    }
  }
}
</script>

<style lang="scss" scoped>
  .center{
    text-align:center
  }
</style>
