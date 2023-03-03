/* * @Author: zhangzc * @Email: zhangzc2@guahao.com * @Date: 2019-09-12 14:32:57 * @Last Modified
by: qiuwt * @Last Modified time: 2020-12-26 15:45:02 * @Description: pdf预览组件 * @Route: Route */
<template>
  <div v-show="currentVisible" class="pdf-viewer-wrapper">
    <div v-show="loading" class="loading-wrapper">
      <i class="icon-loading" />
      <span class="text-loading">加载中...</span>
    </div>
    <div v-show="!loading" class="pdf-wrapper">
      <h3 class="pdf-title">
        {{ title }}
      </h3>
      <div class="pdf-content">
        <pdf :src="task" :page="currentPage" :style="`width: ${zoom}%;`" class="pdf" />
      </div>
      <div class="pdf-tooltip">
        <div class="tooltip-wrapper">
          <div class="tooltip-page">
            <span class="icon-start" @click="handlePdfFirstPage" />
            <span class="icon-prev" @click="handlePdfPrevPage" />
            <span class="page-number">{{ currentPage }}/{{ totalPage }}</span>
            <span class="icon-next" @click="handlePdfNextPage" />
            <span class="icon-end" @click="handlePdfLastPage" />
          </div>
          <div class="tooltip-zoom">
            <span class="icon-zoom-in" @click="handleZoom('in')" />
            <span class="icon-zoom-out" @click="handleZoom('out')" />
          </div>
          <div class="tooltip-rotate">
            <span class="icon-download" @click="handlePdfDownload" />
          </div>
          <div class="tooltip-close">
            <span class="icon-close" @click="handleClose" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { urlObject, DownLoader, isEmptyObj, downloadFile } from '@/utils/util'
import pdf from './pdf/vuePdfNoSssNoWorker'

export default {
  name: 'BkPdfViewer',
  components: {
    pdf
  },
  props: {
    pdfInfo: {
      type: Object,
      default: () => {}
    },
    fileProps: {
      type: Object,
      default: () => ({
        fileId: 'fileId',
        fileName: 'originalFileName',
        fileSuffix: 'fileExt',
        fileUrl: 'fileUrl'
      })
    },
    visible: {
      type: Boolean,
      default: () => {}
    }
  },
  data() {
    const bkConfig = this.$root.bkConfig || this.$bkConfig
    return {
      bkConfig,
      loading: true,
      title: '',
      task: '',
      url: '',
      suffix: '',
      currentPage: 1,
      totalPage: '',
      zoom: 40,
      currentVisible: this.visible
    }
  },
  watch: {
    visible(val, old) {
      if (val === old) return
      if (val) {
        document.body.addEventListener('keydown', this.handleKeydownHide, false)
      }
      this.currentVisible = val
    },
    pdfInfo: {
      handler(val, oldVal) {
        if (JSON.stringify(val) === JSON.stringify(oldVal)) return
        this.loading = true
        this.zoom = 40
        this.init()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const { pdfInfo } = this
      if (isEmptyObj(pdfInfo)) return
      const { fileUrl, fileSuffix, fileName } = this.fileProps
      let url = pdfInfo[fileUrl]
      if (this.bkConfig.pdfFilePath) {
        const urlObj = urlObject(pdfInfo[fileUrl])
        const { pathname, search } = urlObj
        // 便于代理
        url = `${this.bkConfig.pdfFilePath}${pathname}${search}`
      }
      this.task = pdf.createLoadingTask(url)
      this.url = url
      this.suffix = pdfInfo[fileSuffix]
      this.title = pdfInfo[fileName]
      this.currentPage = 1
      this.task.then(
        pdfTask => {
          this.loading = false
          this.totalPage = pdfTask.numPages
        },
        () => {
          this.$message.warning('文件详情查询失败，请重试！')
          this.loading = false
          this.handleClose()
        }
      )
    },
    /**
     * 查看pdf第一页
     */
    handlePdfFirstPage() {
      this.currentPage = 1
    },
    /**
     * 查看pdf最后一页
     */
    handlePdfLastPage() {
      this.currentPage = this.totalPage
    },
    /**
     * 查看pdf下一页
     */
    handlePdfNextPage() {
      if (this.currentPage < this.totalPage) this.currentPage += 1
    },
    /**
     * 查看pdf上一页
     */
    handlePdfPrevPage() {
      if (this.currentPage > 1) this.currentPage -= 1
    },
    /**
     * 下载pdf文件
     * @param {object} url 文件链接
     */
    handlePdfDownload() {
      const { fileUrl, fileName, fileId } = this.fileProps
      if (this.bkConfig.downloadPath && this.pdfInfo[fileId]) {
        const downloadUrl = encodeURI(`${this.bkConfig.downloadPath}?ids[]=${this.pdfInfo[fileId]}`)
        downloadFile(downloadUrl)
        return
      }
      if (this.bkConfig && this.bkConfig.downloadFlag) {
        DownLoader(this.pdfInfo[fileUrl], this.pdfInfo[fileName])
      } else {
        downloadFile(this.pdfInfo[fileUrl])
      }
    },
    /**
     * pdf缩放
     * @param {string} type 缩放类型
     */
    handleZoom(type) {
      if (type === 'in' && this.zoom < 100) {
        this.zoom += 10
      } else if (type === 'out' && this.zoom > 10) {
        this.zoom -= 10
      } else {
        this.$message({
          message: '已经缩放到极限啦！',
          type: 'warning'
        })
      }
    },
    handleKeydownHide(e) {
      if (e.key === 'Escape') {
        this.handleClose()
        e.stopPropagation()
      }
    },
    handleClose() {
      this.currentVisible = false
      this.$emit('close')
      this.$emit('update:visible', false)
      document.body.removeEventListener('keydown', this.handleKeydownHide, false)
    }
  }
}
</script>
