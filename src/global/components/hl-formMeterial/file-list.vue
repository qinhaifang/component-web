/* * @Author: zhangzc * @Email: zhangzc2@guahao.com * @Date: 2019-04-25 16:14:06 * @Last Modified
by: qiuwt * @Last Modified time: 2021-02-02 16:00:53 * @Description: 文件查看 */

<template>
  <el-row :gutter="10" class="file-list-wrapper">
    <el-col v-for="(item, index) in fileList" :key="index" :span="24" class="file-list_item">
      <template
        v-if="
          fileCache[item] &&
          imgReg.test(fileCache[item][fileProps.fileSuffix]) &&
          readonly &&
          imgReadonlyType === 0
        "
      >
        <div class="image-item">
          <bk-image-viewer :value="fileCache[item]" :props="fileProps" mode="img" />
        </div>
      </template>
      <template v-else>
        <template v-if="fileCache[item].errorFlag">
          <i class="icon-file file-error" />
          <span class="file-name file-error">文件信息查询失败</span>
        </template>
        <template v-else>
          <i class="icon-file el-icon-document" />
          <span class="file-name-flex">
            <span
              :title="fileCache[item] ? fileCache[item][fileProps.fileName] : ''"
              class="file-name"
            >
              {{ fileCache[item] ? fileCache[item][fileProps.fileName] : loadText }}
            </span>
          </span>
        </template>
        <span
          v-if="
            fileCache[item] &&
            fileCache[item][fileProps.fileSuffix] &&
            lookReg.test(fileCache[item][fileProps.fileSuffix])
          "
          class="btn-item btn-preview"
          @click="() => handlePreview(fileCache[item])"
        >
          预览
        </span>
        <span
          v-if="fileCache[item] && fileCache[item][fileProps.fileSuffix]"
          :class="['btn-item', 'btn-download', disabled && 'btn-disabled']"
          @click="() => handleDownload(fileCache[item])"
        >
          下载
        </span>
        <span
          v-if="!readonly"
          :class="['btn-item', 'btn-delete', disabled && 'btn-disabled']"
          @click="() => handleDelete(fileCache[item], index)"
        >
          删除
        </span>
      </template>
    </el-col>
    <bk-image-viewer ref="viewer" :props="fileProps" mode="none" />
    <bk-pdf-viewer v-model:visible="pdfVisible" :pdf-info="pdfInfo" :file-props="fileProps" />
  </el-row>
</template>
<script>
import { DownLoader, isEmptyObj, downloadFile, brickTip } from '@/utils/util'

export default {
  name: 'BkFileList',
  // 接收注入的属性
  inject: ['medUpload'],
  props: {
    // 禁止操作
    disabled: {
      type: Boolean,
      default: false
    },
    http: {
      type: Object,
      default: () => ({})
    },
    fileData: {
      required: true,
      type: [Array, String]
    },
    readonly: {
      type: Boolean,
      default: false
    },
    handleRemove: {
      type: Function,
      default: () => () => {}
    },
    // 获得数据上字段的内容
    responseFileProps: {
      type: Object,
      default: () => ({})
    },
    // 文件预览方式 0：弹窗/客户端打开  1：浏览器新页签打开
    previewType: {
      type: Number,
      default: 0
    },
    // readonly为true时，图片显示的方式，0：大图展示 1：文件名展示
    imgReadonlyType: {
      type: Number,
      default: 0
    }
  },
  data() {
    const bkConfig = this.$root.bkConfig || this.$bkConfig
    return {
      bkConfig,
      imgReg: /(jpeg|jpg|png|gif)$/i,
      lookReg: /(jpg|jpeg|gif|png|edc|pdf)$/i,
      edcReg: /(edc)$/i,
      pdfReg: /(pdf)$/i,
      fileList: [], // 完整的文件信息数据，包括文件名、文件url、文件ID、文件后缀
      fileCache: {}, // 通过文件ID获取的完整文件数据，以文件ID为key文件信息为value
      picVisible: false, // 是否显示预览图片
      picSrc: '', // 预览的图片地址
      rotateAngle: 0, // 旋转角度
      imgStyle: {}, // 图片行内样式
      fileProps: {},
      pdfInfo: {},
      loadText: '加载中...',
      pdfVisible: false
    }
  },
  watch: {
    fileData: {
      handler(val) {
        this.standardData(val)
      },
      deep: true
    }
  },
  created() {
    this.fileProps = Object.assign(
      {
        fileId: 'fileId', // 文件标识字段
        fileUrl: 'fileUrl', // 文件地址
        fileName: 'fileName', // 文件名
        fileSuffix: 'fileSuffix' // 文件后缀
      },
      this.bkConfig.responseFileProps,
      this.responseFileProps
    )
    this.standardData(this.fileData)
  },
  methods: {
    /**
     * 将文件数据标准化
     * 数据类型分3种：
     * 1、完整的文件数据，包含以下字段：fileId、fileUrl、fileName、fileSuffix，完整的文件数据直接缓存
     * 2、不完整的文件数据，只包含一个字段：fileId，需要通过fileId获取完整数据后缓存
     * 3、不完整的文件数据，只包含一个字段：fileUrl，直接展示
     * @param {Array || String} data 文件数据
     */
    standardData(data) {
      const { fileId, fileUrl, fileName, fileSuffix } = this.fileProps
      // 清空文件列表
      this.fileList = []
      if (typeof data === 'string') {
        data = data.split(',')
      }
      // 如果上层组件数据被清空，此组件也应该清空缓存数据
      if (!data.length) {
        this.fileCache = {}
        return false
      }
      data.forEach(item => {
        if (!item) return
        const fileCode = item[fileId] ? item[fileId] : item
        // 添加到upload 后数据会转换会 { [fileId]:*** }
        if (typeof fileCode === 'object') return
        // 判断是否为完整数据
        if (item[fileId] && item[fileUrl] && item[fileName] && item[fileSuffix]) {
          this.fileCache[fileCode] = item
        } else if (isEmptyObj(this.fileCache[fileCode]) && fileCode.indexOf('http') === -1) {
          // 判断fileCache中是否存在该数据，如果存在，则不请求图片服务器
          // 不是完整数据，需通过fileId获取完整的数据，然后缓存
          this.$set(this.fileCache, fileCode, {
            [fileId]: fileCode,
            [fileName]: '加载中'
          })
          this.fetchFile(fileCode)
        } else if (isEmptyObj(this.fileCache[fileCode]) && fileCode.indexOf('http') > -1) {
          // 直接显示
          this.$set(this.fileCache, fileCode, {
            [fileUrl]: fileCode,
            [fileSuffix]: '.jpg'
          })
        }
        this.fileList.push(fileCode)
      })
      return true
    },

    // 预览文件
    handlePreview(item) {
      if (typeof this.medUpload.previewCallback === 'function') {
        this.medUpload.previewCallback(item)
      } else {
        const { fileSuffix, fileUrl } = this.fileProps
        if (this.edcReg.test(item[fileSuffix])) {
          // 如果是edc文件，使用ca包打开
          if (window.hxFileCert) {
            window.hxFileCert(item[fileUrl])
          } else {
            console.error(brickTip.lackCaRead)
          }
        } else if (this.imgReg.test(item[fileSuffix])) {
          this.$refs.viewer.handleImgPreview(item)
        } else if (this.pdfReg.test(item[fileSuffix])) {
          if (this.previewType === 1) {
            const { availHeight, availWidth } = window.screen
            const url = `http://hxmec.net/pdf/web/viewer.html?file=${item[fileUrl]}`
            window.open(
              url,
              'pdfPreview',
              `width=${availWidth / 3},height=${availHeight},left=10000,top=0`
            )
          } else {
            this.pdfInfo = item
            this.pdfVisible = true
          }
        }
      }
    },
    /**
     *  请求文件信息
     * @param {string} fileCode
     */
    fetchFile(fileCode) {
      // 判断fileCache中是否存在该数据，如果存在，则不请求图片服务器
      // 不是完整数据，需通过fileId获取完整的数据，然后缓存
      const { fileId } = this.fileProps
      this.$set(this.fileCache, [fileCode], {})
      const { onBefore, onSuccess, onFaild, filePath, params, baseUrl, method } = this.http || {}
      const url = filePath || this.bkConfig.filePath
      let realParams = {
        [fileId]: fileCode,
        ...params
      }
      if (typeof onBefore === 'function') {
        realParams = onBefore(realParams, this) === undefined && realParams
      }
      if (!realParams || !url) {
        return
      }
      this.$fetch({
        baseUrl,
        url,
        params: realParams,
        method
      }).then(res => {
        const { code, data, successCode } = this.bkConfig.responseProps
        if (!res || res[code] !== successCode || !res.data) {
          this.$set(this.fileCache[fileCode], 'errorFlag', true)
          if (typeof onFaild === 'function') {
            onFaild('文件查询失败', this)
          }
          return
        }
        if (typeof onSuccess === 'function') {
          onSuccess(res, this)
        }
        const value = res[data]
        if (Array.isArray(value)) {
          value.forEach(item => {
            this.$set(this.fileCache, item[fileId], item)
          })
        } else {
          this.$set(this.fileCache, [fileCode], value)
        }
      })
    },
    /**
     * 下载文件
     * @param {object} item 目标文件信息
     */
    handleDownload(item) {
      if (this.disabled) return
      const { fileUrl, fileName, fileId } = this.fileProps
      if (this.bkConfig.downloadPath && item[fileId]) {
        const downloadUrl = encodeURI(`${this.bkConfig.downloadPath}?ids[]=${item[fileId]}`)
        downloadFile(downloadUrl)
        return
      }
      if (this.bkConfig && this.bkConfig.downloadFlag) {
        DownLoader(item[fileUrl], item[fileName])
      } else {
        downloadFile(item[fileUrl])
      }
    },
    /**
     * 删除文件
     * @param {object} item 目标文件信息
     * @param {number} index 目标文件索引
     */
    handleDelete(item, index) {
      if (this.disabled) return
      const { fileName } = this.fileProps
      this.$confirm(`确定移除 ${item[fileName] || '未知文件'}？`).then(() => {
        // 调用父组件进行删除
        this.medUpload.handleFileRemove(index)
        // 删除自身组件数据，避免重复渲染
        this.fileList.splice(index, 1)
        // delete this.fileCache[item[fileId]];
      })
    }
  }
}
</script>
