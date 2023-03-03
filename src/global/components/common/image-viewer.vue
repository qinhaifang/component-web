/*
 * @Description: 图片查看器
 */

<template>
    <div class="image-viewer-wrapper">
        <div v-if="mode !== 'none'"
             :style="boxStyle">
            <el-button v-if="!img"
                       @click="handleImgPreview()"
                       v-bind="extend">
                {{ (typeof btnLabel === 'function')?btnLabel(this):btnLabel }}
            </el-button>
            <img v-else
                 :src="img"
                 @click="handleImgPreview()"
                 :style="imgStyle"
                 class="cell-img">
        </div>
        <transition name="el-alert-fade">
            <section v-if="visible"
                     class="fixed-container">
                <div v-show="loading"
                     class="loading-wrapper">
                    <i class="icon-loading" />
                    <span class="text-loading">加载中...</span>
                </div>
                <div v-show="!loading"
                     class="img-wrapper">
                    <div class="img-content">
                        <span :style="`transform:translate(${dx}px,${dy}px);`"
                              class="img-content_box">
                            <img ref="img"
                                 :src="viewer[currentProps.fileUrl]"
                                 :style="`transform: rotate(${rotate}deg) scale(${zoom})`"
                                 class="img">
                        </span>
                    </div>
                    <div class="img-tooltip">
                        <div class="tooltip-wrapper">
                            <div v-if="currentIds.length > 1"
                                 class="tooltip-page">
                                <span @click="handlePrev"
                                      class="icon-prev" />
                                <span class="page-number">
                                    {{ current+1 }}/{{ currentIds.length }}
                                </span>
                                <span @click="handleNext"
                                      class="icon-next" />
                            </div>
                            <div class="tooltip-zoom">
                                <span @click="handleZoom('in')"
                                      class="icon-zoom-in" />
                                <span @click="handleZoom('out')"
                                      class="icon-zoom-out" />
                            </div>
                            <div class="tooltip-rotate">
                                <span @click="handleRotate"
                                      class="icon-rotate" />
                                <span @click="handleDownload"
                                      class="icon-download" />
                                <span @click="handlePrinter"
                                      class="el-icon-printer my-el-icon" />
                            </div>
                            <div class="tooltip-close">
                                <span @click="handleClose"
                                      class="icon-close" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </transition>
    </div>
</template>
<script>
import { DownLoader, downloadFile } from '@/utils/util';

export default {
    name: 'BkImageViewer',
    props: {
        /**
         * 模式
         * btn 显示占位按钮
         * img 显示占位图片
         * none 无占位
         *  */
        mode: {
            type: String,
            default: 'btn'
        },
        // 图片形象或id
        value: {
            type: [Array, String, Object],
            default: ''
        },
        // 按钮名称
        btnLabel: {
            type: [String, Function],
            default: '查看文件'
        },
        http: {
            type: Object,
            default: () => ({})
        },

        // 获得数据上字段的内容
        props: {
            type: Object,
            default: () => ({})
        },
        extend: {
            type: Object,
            default: () => ({})
        },
        imgStyle: {
            type: Object,
            default: () => ({
                maxWidth: '200px',
                maxHeight: '200px'
            })
        },
        boxStyle: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        const bkConfig = this.$root.bkConfig || this.$bkConfig;
        return {
            bkConfig,
            dx: 0,
            dy: 0,
            $img: '', // dom
            moveing: false,
            regUrl: /\/{2}/g, // 链接正则
            currentProps: Object.assign(
                {
                    data: 'data'
                },
                bkConfig.responseProps,
                bkConfig.responseFileProps,
                this.props
            ),
            viewer: {},
            img: '', // 图片地址
            visible: false,
            loading: true,
            rotate: 0,
            zoom: 1,
            currentIds: [],
            // 当前id
            current: 0,
            // 图片集合
            storage: {}
        };
    },
    watch: {
        value(now, old) {
            if (now === old) return;
            this.initData(now);
        },
        /**
         * esc 关闭
         */
        visible(n, o) {
            if (n === o) return;
            if (n) {
                document.body.addEventListener('keydown', this.handleKeydownHide, false);
            }
        }

    },
    created() {
        if (!this.http.filePath) this.http.filePath = this.bkConfig.filePath;
        this.initData(this.value);
    },

    methods: {
        initData(val) {
            const {
                currentProps, storage, regUrl, mode 
            } = this;
            this.current = 0;

            // 数据转换
            if (typeof val === 'string') {
                val = val.split(',');
            }
            // 是否是数组
            let isArray = Array.isArray(val);
            if (typeof val === 'object' && !isArray) {
                val = [val];
                isArray = true;
            }
            // init img
            if (isArray) {
                const ids = [];
                // url
                val.forEach(item => {
                    const type = typeof item;
                    switch (type) {
                    case 'object': {
                        const url = item[currentProps.fileUrl];
                        const id = item[currentProps.fileId] || url;
                        storage[id] = item;
                        ids.push(id);
                        break;
                    }
                    case 'string': {
                        if (item.match(regUrl)) {
                            // 链接
                            storage[item] = {
                                [currentProps.fileUrl]: item
                            };
                        }
                        ids.push(item);

                        break;
                    }
                    default: {
                        break;
                    }
                    }
                });
                this.currentIds = ids;
                // 图片占位模式
                if (mode === 'img') {
                    const img = storage[ids[0]] || '';
                    if (img) {
                        this.img = img[currentProps.fileUrl];
                    } else {
                        this.fetchFile(ids[0]).then(res => {
                            if (res) this.img = res[currentProps.data][currentProps.fileUrl];
                        });
                    }
                }
            }
        },
        handleKeydownHide(e) {
            if (e.key === 'Escape') {
                this.handleClose();
                e.stopPropagation();
            }
        },
        handleClose() {
            this.zoom = 1;
            this.rotate = 0;
            this.visible = false;
            this.restImgMove();
            document.body.removeEventListener('keydown', this.handleKeydownHide, false);
        },
        /**
         * 打印
         */
        handlePrinter() {
            window.print();
        },
        /**
         * 重制预览位置
         */
        restImgMove() {
            this.moveing = false;
            this.dy = 0;
            this.dx = 0;
            document.onmousemove = null;
            if (this.$img) this.$img.removeEventListener('mousedown', this.handleImgMouseDown, false);
        },
        /**
         * 预览图拖动
         */
        handleImgMouseDown(event) {
            // 点击位置
            const left = event.clientX;
            const top = event.clientY;
            // 盒子当前位置
            const boxX = this.dx;
            const boxY = this.dy;
            if (!this.moveing) {
                this.moveing = true;
                document.onmousemove = e => {
                    // 拖动的距离
                    const x = e.clientX - left;
                    const y = e.clientY - top;
                    // 偏移位置
                    this.dx = boxX + Number(x);
                    this.dy = boxY + Number(y);
                };
            } else {
                document.onmousemove = null;
                this.moveing = false;
            }
            document.onmouseup = () => {
                this.moveing = false;
                document.onmousemove = null;
                document.onmouseup = null;
            };
            event.preventDefault();
        },
        /**
         * 预览图片
         * @param {object} params 图片数据
         */
        handleImgPreview(params) {
            if (params) this.initData(params);
            this.showImage();
            this.visible = true;
        },
        handleRotate() {
            this.rotate += 90;
        },
        /**
         * 图片缩放
         * @param {string} type 缩放类型
         */
        handleZoom(type) {
            switch (type) {
            case 'in':
                this.zoom += 0.3;
                break;
            case 'out':
                this.zoom = Math.max(this.zoom - 0.3, 0.1);
                break;
            default:
            }
        },
        /**
         * 显示图片
         */
        showImage() {
            this.loading = true;
            // 当前要显示的id
            const id = this.currentIds[this.current];
            if (this.storage[id]) {
                this.loading = false;
                this.viewer = this.storage[id];
                setTimeout(() => {
                    this.$img = this.$el.querySelector('.img-wrapper');
                    this.$img.addEventListener('mousedown', this.handleImgMouseDown, false);
                }, 500);
            } else {
                const { currentProps } = this;
                this.fetchFile(id).then(res => {
                    // 图片对象
                    if (!res) return;
                    const img = new Image();
                    const file = res[currentProps.data];
                    if (!file) {
                        this.loading = false;
                        this.handleClose();
                        this.$message.error('文件详情查询失败，请重试！');
                        return;
                    }
                    const fileUrl = file[currentProps.fileUrl];
                    // 加载完毕显示图片
                    img.onload = () => {
                        this.showImage();
                    };
                    img.onerror = () => {
                        this.showImage();
                    };
                    img.src = fileUrl;
                    this.storage[id] = file;
                });
            }
        },
        /**
         * 下一页
         */
        handleNext() {
            const index = this.current + 1;
            if (index < this.currentIds.length) {
                this.current = index;
                this.showImage();
            }
        },
        /**
         * 上一页
         */
        handlePrev() {
            const index = this.current - 1;
            if (index >= 0) {
                this.current = index;
                this.showImage();
            }
        },
        /**
         * 加载文件资源
         *
         */
        fetchFile(id) {
            const { currentProps, http } = this;
            const params = {
                [currentProps.fileId]: id
            };
            Object.assign(params, http.params);
            return this.$fetch({
                url: http.filePath,
                params
            });
        },
        handleDownload() {
            const { fileName, fileUrl, fileId } = this.currentProps;
            if (this.bkConfig.downloadPath && this.viewer[fileId]) {
                const downloadUrl = encodeURI(`${this.bkConfig.downloadPath}?ids[]=${this.viewer[fileId]}`);
                downloadFile(downloadUrl);
                return;
            }
            if (this.bkConfig && this.bkConfig.downloadFlag) {
                DownLoader(this.viewer[fileUrl], this.viewer[fileName]);
            } else {
                downloadFile(this.viewer[fileUrl]);
            }
        }
    }
};
</script>
