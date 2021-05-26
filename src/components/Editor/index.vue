<template>
  <div>
    <script id="editor" type="text/plain" />
  </div>
</template>
<script>
import '@/components/Editor/config/ueditor.config.js'
import '@/components/Editor/config/ueditor.all.js'
import '@/components/Editor/config/lang/zh-cn/zh-cn.js'
import '@/components/Editor/config/ueditor.parse.js'

export default {
  name: 'Editor',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    defaultMsg: {
      type: String,
      default: null

    },
    config: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    const _this = this

    // eslint-disable-next-line no-undef
    this.editor = UE.getEditor('editor', this.config) // 初始化UE
    this.editor.addListener('ready', function() {
      _this.editor.setContent(_this.defaultMsg) // 确保UE加载完成后，放入内容。
    })
  },
  destroyed() {
    this.editor.destroy()
  },
  methods: {
    getUEContent() { // 获取内容方法
      return this.editor.getContent()
    }
  }
}
</script>
