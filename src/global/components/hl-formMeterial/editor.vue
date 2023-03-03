<template>
  <div class="editor" />
</template>

<script>
export default {
  name: 'BkEditor',
  inject: {
    elFormItem: {
      default: () => {}
    }
  },
  props: {
    /**
     * 参数
     */
    value: {
      type: String,
      default: ''
    },
    /**
     * 只读
     */
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Editor:Null,
      $obj: '',
      currentValue: this.value
    }
  },
  watch: {
    value(val, old) {
      if (val === old || val === this.currentValue) return
      this.$obj.txt.html(val)
    }
  },
  mounted() {
    import('wangeditor').then(module=>{
      this.Editor = module.default
       if (this.readonly) {
          this.initReadonly()
        } else {
          this.init()
        }
    })
  },
  methods: {
    /**
     * 显示文本模式
     */
    initReadonly() {
      this.$el.innerHTML = this.currentValue
    },
    /**
     * 初始化editor
     */
    init() {
      this.$obj = new this.Editor(this.$el)
      console.log(this.$obj, 'this.$elthis.$el')
      this.$obj.config.onchange = this.handleValue
      this.$obj.config.onblur = this.handleBlur
      this.$obj.create()
      this.$obj.txt.html(this.currentValue)
    },
    /**
     * 设置参数
     */
    handleValue(val) {
      if (val === this.currentValue) return
      this.$emit('input', val)
      this.currentValue = val
    },
    /**
     * 失去焦点
     * @param {String} val 输入的内容
     */
    handleBlur(val) {
      this.$emit('change', val)
      this.$emit('blur', val)
      // 触发表单
      if (this.elFormItem) {
        this.elFormItem.onFieldChange()
      }
    }
  }
}
</script>
