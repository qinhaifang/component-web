/* * @Author: dubin * @Date: 2022-03-02 08:30:30 * @Last Modified time:
2022-03-02 08:30:30 * @Description: 表格组件 */
<template>
  <!--最外层包裹层-->
  <div :class="`${isHasChildren ? 'list-tree' : ''} list-wrapper`">
    <!-- 提醒插槽区域 -->
    <d-slot :config="tableConfig" slot-name="above-page" />

    <section class="section-wrapper">
      <!-- 增加自定义表格上方的内容区域slot -->
      <slot name="above-table" />
      <!-- 表格区域 -->
      <div ref="table" class="table-wrapper">
        <!--table-->
        <el-table
          ref="list"
          v-if="!tableConfig.autoHeight || maxHeight"
          :data="tableData"
          v-loading="loadingStatus"
          v-bind="tableBind()"
          v-on="
            getMergedObject(tableConfig.extend, {
              'sort-change': defaultSortChange,
            })
          "
          @selection-change="handleSelection"
          :class="{ 'data-none': !tableData.length }"
        >
          <template slot="append">
            <slot name="table-append">
              <d-slot
                slot="append"
                :config="tableConfig"
                slot-name="table-append"
              />
            </slot>
          </template>
          <template slot="empty">
            <hl-empty :imageSize="tableConfig.imageSize || 80"></hl-empty>
          </template>
          <!--checkbox列-->
          <el-table-column
            v-if="tableConfig.selection"
            v-bind="
              getMergedObject(tableConfig.extend, {
                selectable: handleSeletable,
                width: '55',
                align: 'left',
                fixed: true,
              })
            "
            type="selection"
          />
          <!--radio列-->
          <el-table-column
            v-if="tableConfig.selection === false && tableConfig.radio === true"
            v-bind="
              getMergedObject(tableConfig.extend, {
                resizable: false,
                label: '选择',
                width: '70',
                align: 'center',
                fixed: true,
              })
            "
          >
            <template slot-scope="scope">
              <el-radio
                v-model="radio"
                :label="scope.row[rowKey]"
                :disabled="scope.row.disabled ? scope.row.disabled : false"
                @change="() => handleRadioChange(scope.row)"
                class="radio"
              >
                {{ "" }}
              </el-radio>
            </template>
          </el-table-column>
          <!--序号列: 默认是有序号的-->
          <el-table-column
            :fixed="false"
            v-if="tableConfig.order === false ? tableConfig.order : true"
            :resizable="false"
            :index="indexMethod"
            :align="
              (tableConfig.extend && tableConfig.extend.align) || 'center'
            "
            type="index"
            label="序号"
            width="70"
          />
          <template v-if="Array.isArray(tableColumnData)">
            <template v-for="item in tableColumnData">
              <!--操作列-->
              <template v-if="item && item.type === 'operation'">
                <el-table-column
                  :key="item.name"
                  :prop="item.name"
                  :label="item.label"
                  :width="item.width || getOpertionWidth(item.data)"
                  v-bind="
                    getMergedObject(item.extend, {
                      fixed: 'right',
                      align: 'left',
                    })
                  "
                  class-name="list-operation"
                >
                  <template slot-scope="scope">
                    <div class="table-btn-wrapper">
                      <hl-button
                        :tableRow="scope.row"
                        :buttonConfig="item.data"
                      ></hl-button>
                    </div>
                  </template>
                </el-table-column>
              </template>

              <!-- 图片查看列 -->
              <template v-else-if="!item.data && item.type === 'image'">
                <el-table-column
                  :key="item.name"
                  :prop="item.name"
                  :label="item.label"
                  :width="item.width"
                  :fixed="item.fixed"
                  v-bind="
                    getMergedObject(item.extend, {
                      'show-overflow-tooltip': true,
                      minWidth: item.minWidth || '111px',
                      align: 'left',
                    })
                  "
                >
                  <template slot-scope="scope">
                    <hl-image-viewer
                      v-if="scope.row[item.name]"
                      v-bind="setImageViewerCfg(item, scope.row)"
                      class="cell-image-box"
                    />
                  </template>
                </el-table-column>
              </template>
              <!--  表单 -->
              <template v-else-if="!item.data && item.formExtend">
                <el-table-column
                  :key="item.name"
                  :prop="item.name"
                  v-bind="
                    getMergedObject(item.extend, {
                      label: item.label,
                      align: 'left',
                      'show-overflow-tooltip': true,
                      minWidth: item.minWidth || '165px',
                    })
                  "
                >
                  <template slot-scope="scope">
                    <el-form
                      :ref="`list_form_${item.name}_${scope.row[rowKey]}`"
                      :model="scope.row"
                      @submit.native.prevent
                      class="form-wrapper"
                    >
                      <hl-form-material
                        :key="item.name"
                        :ref="`${item.name}_${scope.row[rowKey]}`"
                        :materialConfig="
                          getFormConfig(
                            formConfigs[scope.row[rowKey]],
                            item.name
                          )
                        "
                        :formConfig="formConfigs[scope.row[rowKey]]"
                        :formParams="scope.row"
                        :extend="
                          (getFormConfig(
                            formConfigs[scope.row[rowKey]],
                            item.name
                          ) &&
                            getFormConfig(
                              formConfigs[scope.row[rowKey]],
                              item.name
                            ).extend) ||
                          getFormConfig(
                            formConfigs[scope.row[rowKey]],
                            item.name
                          )
                        "
                        v-on="
                          (getFormConfig(
                            formConfigs[scope.row[rowKey]],
                            item.name
                          ) &&
                            getFormConfig(
                              formConfigs[scope.row[rowKey]],
                              item.name
                            ).extend) ||
                          getFormConfig(
                            formConfigs[scope.row[rowKey]],
                            item.name
                          )
                        "
                      />
                    </el-form>
                  </template>
                </el-table-column>
              </template>
              <template v-else-if="!item.data && item.render">
                <el-table-column
                  :key="item.name"
                  :prop="item.name"
                  v-bind="
                    getMergedObject(item.extend, {
                      'show-overflow-tooltip': true,
                      label: item.label,
                      align: 'left',
                      sortable: 'custom',
                      minWidth: item.minWidth || '165px',
                    })
                  "
                >
                  <template slot-scope="scope">
                    <table-columns-render :row="scope.row" v-bind="item" />
                  </template>
                </el-table-column>
              </template>

              <!--常规显示列-->
              <template v-else>
                <recursive-title
                  v-if="item.visible !== false"
                  v-bind="{
                    rowKey: rowKey,
                    data: item,
                    formConfigs: formConfigs,
                  }"
                />
              </template>
            </template>
          </template>
        </el-table>
      </div>
      <!-- 自定义表格下方的内容区域 -->
      <d-slot :config="tableConfig" slot-name="under-table" />

      <!-- 分页区域 -->
      <div
        ref="pagination"
        v-if="tableConfig.http && !tableConfig.noPagination"
        class="pagination-wrapper"
      >
        <template>
          <el-pagination
            v-show="tableData.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="paginationSetting[listDataProps.pageNumber]"
            :page-sizes="tableConfig.pageSizes || [100, 200, 500]"
            :page-size="paginationSetting[listDataProps.pageSize]"
            :total="Number(totalCount)"
            v-bind="
              getMergedObject(tableConfig.extend, {
                layout: 'total, sizes, prev, pager, next, jumper',
                background: false,
              })
            "
            class="pagination-content"
          />
        </template>
      </div>
    </section>
    <!-- 自定义页面底部的内容区域 -->
    <d-slot :config="tableConfig" slot-name="under-page" />
  </div>
</template>

<script>
import {
  isEmptyObj,
  getMergedObject,
  toUnitNumber,
  deepCopy,
  hasField,
  stringIsHTML,
  targetStyle,
  isIE,
} from "@/utils/util";
import dSlot from "./../../common/slot.vue";
import dTitle from "./../../common/title.vue";
import hlImageViewer from "./../../common/image-viewer.vue";
import Sortable from "sortablejs";
import RecursiveTitle from "./recursive-title";
import tableColumnsRender from "./render";
import hlFormMaterial from "./../../hl-formMeterial/index.vue";
import hlButton from "./../../hl-button";
export default {
  name: "hlTable",
  components: {
    RecursiveTitle,
    tableColumnsRender,
    hlFormMaterial,
    dSlot,
    dTitle,
    hlImageViewer,
    hlButton,
  },
  props: {
    name: {
      type: String,
      default: "",
    },
    selectTable: {
      type: Function,
    },
    // 表格配置
    tableConfig: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    const { tableConfig } = this;
    const bkConfig = this.$root.bkConfig || this.$bkConfig;
    // 防止http为空
    if (!tableConfig.http) tableConfig.http = {};
    /**
     * @namespace 数据对应字段
     */
    const listDataProps = Object.assign(
      {
        // 对应字段
        data: "data",
        pageNumber: "pageNumber",
        pageSize: "pageSize",
        results: "results",
        message: "message",
        totalCount: "totalCount",
        // 游标分页
        cursorCode: "cursorCode",
      },
      {
        ...bkConfig.responseProps,
        ...bkConfig.responseListProps,
      },
      tableConfig.props // 后续版本考虑删除掉
    );
    return {
      bkConfig,
      oldTableConfig: {},
      sortFlag: false, // 排序标识
      sortParams: {}, // 排序参数
      radio: "", // 单选选中项
      data: [],
      // 统一时间格式
      dateFormat: "yyyy-MM-dd HH:mm:ss",
      listDataProps, // 字段配置
      maxHeight: "",
      zdyHeight: "",
      tableData: [], // table数据
      tableDataCache: [], // tableData的watch，无法获取对象的旧数据，因此使用
      // 分页数据
      paginationSetting: {
        [listDataProps.pageNumber]: 1, // 当前页
        [listDataProps.pageSize]:
          (tableConfig && tableConfig.size) ||
          (tableConfig.pageSizes ? tableConfig.pageSizes[0] : 100), // 每页长度
      },
      tableDataTotalFlag: false, // 一次性接收所有分页数据且分页由前端做的标识
      tableDataTotal: [], // 所有分页的总数据
      resultsDataCache: [], // results的watch，无法获取对象的旧数据，因此使用
      startIndex: 0, // 静态数据当前页在整个数据中的起始索引
      loadingStatus: !!(tableConfig.http && tableConfig.http.url), // 数据加载状态
      totalCount: 0, // 总数
      tableSelection: [], // 被选中的数据集合
      operationIndex: "", // 操作行
      selectableKey: tableConfig.selectableKey || "selectable", // 禁止选择标识字段
      // 聚合行内表单
      formConfigs: {},
      // 编辑后的配置
      isHasChildren: false,
      treeProps: {},
      // 行唯一标记
      rowKey: "index",
      sortableRow: null, //行排序
      sortableCol: null, //列排序
      tableColumnDataCache: [],
      tableColumn: [], // 缓存tableConfig的data，避免修改source，便于进行缓存操作
    };
  },
  computed: {
    // 保留之前选中的数据(需指定row-key)
    reserveSelection() {
      const { extend } = this.tableConfig;
      return (
        (extend && (extend["reserve-selection"] || extend.reserveSelection)) ||
        false
      );
    },
    tableColumnData() {
      // 代替tableConfig.data, 在组件中修改数据, 可以在此过滤表格项，节省代码，统一管理
      let col;
      if (
        !this.tableColumnDataCache ||
        this.tableColumnDataCache.length === 0
      ) {
        // 先包证首屏渲染，而后切换数据源
        col = this.tableConfig.data;
      } else {
        col = this.tableColumnDataCache;
      }
      if (col) {
        col.forEach((item, index) => {
          // 初始化值
          if (typeof item.bkIndex !== "number") {
            this.$set(item, "bkIndex", index); // 负责排位的标志位
          }
          if (typeof item.bkVisible !== "boolean") {
            this.$set(item, "bkVisible", true); // 控制显示和隐藏
          }
        });
        const columns = col
          .filter((item) => {
            if (item.visible === false) {
              return false;
            }
            if (item.bkVisible === false) {
              return false;
            }
            return true;
          })
          .sort((pre, next) => pre.bkIndex - next.bkIndex);
        return columns;
      }
    },
    tableConfigData() {
      // tableConfig.data的副本数据。防止数据的污染渲染错误
      return deepCopy(this.tableConfig.data);
    },
  },
  watch: {
    tableData: {
      handler(val) {
        // 添加选中数据
        const valStr = JSON.stringify(val);
        const oldValStr = JSON.stringify(this.tableDataCache);
        if (valStr !== oldValStr) {
          // 触发相应操作按钮显示隐藏的方法
          this.tableDataCache = JSON.parse(valStr);
          this.initRowConfig();
        }
      },
      deep: true,
    },
    "tableConfig.results": {
      handler(val) {
        if (!Array.isArray(val)) return;
        const valStr = JSON.stringify(val);
        const oldValStr = JSON.stringify(this.resultsDataCache);
        const oldVal = JSON.parse(oldValStr);
        if (valStr === oldValStr) return;

        this.resultsDataCache = JSON.parse(valStr);
        this.tableDataTotalFlag = true;
        this.tableDataTotal = val;
        this.totalCount = this.tableDataTotal.length;

        const { extend = {} } = this.tableConfig;
        const key = extend["row-key"] || extend.rowKey;
        if (key) {
          const valList = val.map((item) => item[key]);
          const oldValList = oldVal.map((item) => item[key]);
          if (JSON.stringify(valList) === JSON.stringify(oldValList)) return;
        } else if (valStr === oldValStr) return;
        this.setStaticListStatus({ startIndex: 0, pageCurrent: 1 });
      },
      deep: true,
      immediate: true,
    },
    tableDataTotal: {
      handler(val) {
        if (this.tableDataTotalFlag) this.totalCount = val.length;
      },
      deep: true,
    },
  },
  created() {
    // 对象解构赋值
    const { tableConfig } = this;
    this.oldTableConfig = deepCopy(tableConfig);
    // 设置 rowkey
    this.rowKey =
      (tableConfig.extend && tableConfig.extend["row-key"]) || this.rowKey;
    this.tableON(); // 添加行选中事件

    this.getTableData();
    // tree懒加载
    this.isHasChildren = !!(tableConfig.extend && tableConfig.extend.load);
    if (this.isHasChildren) {
      this.treeProps = Object.assign(
        {
          hasChildren: "hasChildren",
          children: "children",
        },
        tableConfig.extend.treeProps || tableConfig.extend["tree-props"]
      );
      this.handleTreeLoadFn();
    }
    // 监听窗口大小变化
  },
  mounted() {
    const { autoHeight = true } = this.tableConfig;
    // 必须在所以节点渲染完后执行,
    this.$nextTick(() => {
      // 请求表格数据 依照筛选数据
      if (autoHeight) {
        this.initTableHeight(29);
      }
      window.onresize = () => {
        if (autoHeight) {
          this.initTableHeight();
        }
      };
      if (isIE()) {
        // 解决elementUI分页页码选择器在IE下光标聚焦的问题
        const { pagination } = this.$refs;
        const paginationSelect =
          pagination && pagination.querySelector("input.el-input__inner");
        if (paginationSelect)
          paginationSelect.setAttribute("unselectable", "on");
      }
      this.bindSortable();
    });
  },
  beforeDestroy() {
    this.tableConfig.data = this.oldTableConfig.data;
  },
  destroyed() {
    // this.destroyedSortable();
  },
  methods: {
    isEmptyObj,
    getMergedObject,
    hasField,
    stringIsHTML,
    initTableData() {
      this.tableData.map((item, index) => {
        if (this.selectTable) {
          this.$set(item, "disabled", this.selectTable(item, index));
        }
      });
    },
    indexMethod(index) {
      index =
        index +
        1 +
        (this.paginationSetting[this.listDataProps.pageNumber] - 1) *
          this.paginationSetting[this.listDataProps.pageSize];
      return index;
    },
    // 绑定拉拽事件
    bindSortable() {
      let tableColumnData = deepCopy(this.tableColumnData);
      const {
        selection,
        radio,
        order,
        rowSortDisabled = true,
        colSortDisabled = true,
      } = this.tableConfig;
      this.$nextTick(() => {
        const that = this;
        const dom = document.querySelector(
          ".table-wrapper .el-table__body-wrapper tbody"
        );
        if (dom) {
          this.sortableRow = Sortable.create(dom, {
            animation: 150,
            disabled: rowSortDisabled,
            ghostClass: "blue-background-class",
            onEnd({ newIndex, oldIndex }) {
              const currRow = that.tableData.splice(oldIndex, 1)[0];
              that.tableData.splice(newIndex, 0, currRow);
            },
          });
        }

        const wrapperTr = document.querySelector(
          ".el-table__header-wrapper tr"
        );
        if (wrapperTr) {
          const that = this;
          this.sortableCol = Sortable.create(wrapperTr, {
            animation: 150,
            disabled: colSortDisabled,
            ghostClass: "blue-background-class",
            onEnd(evt) {
              const add1 = selection || radio ? 1 : 0;
              const add2 = order === false ? 0 : 1;
              if (evt.newIndex === 0) return;
              if (evt.oldIndex === 0) return;
              let newIndex = evt.newIndex - add1 - add2;
              let oldIndex = evt.oldIndex - add1 - add2;
              const oldItem = tableColumnData[oldIndex];
              tableColumnData.splice(oldIndex, 1);
              tableColumnData.splice(newIndex, 0, oldItem);
              tableColumnData.forEach((item, index) => {
                item.bkIndex = index;
              });
              that.tableColumnDataCache = tableColumnData;
            },
          });
        }
      });
    },
    //获取操作列的宽度
    getOpertionWidth(arr) {
      if (!Array.isArray(arr)) return false;
      return arr.length * 14 + 20 + 40 + (arr.length - 1 || 1) * 20;
    },
    // 解除绑定拉拽事件
    destroyedSortable() {
      if (!this.sortableRow.options.disabled) {
        this.sortableRow.destroyed();
      }
      if (!this.sortableCol.options.disabled) {
        this.sortableCol.destroyed();
      }
    },

    /**
     * 设置按钮的配置
     * @param {Object} item 列配置
     * @param {Object} row 行数据
     */
    setImageViewerCfg(item, row) {
      const cfg = getMergedObject(item.extend, {
        value: row[item.name],
      });
      return cfg;
    },

    /**
     * 父级的节点下内外边距
     * @param {String} className  允许用‘，’分割的多className
     */
    getParentsOffsetBottom(el, m = 0) {
      const target = el.parentNode;
      let offset = m;
      if (target) {
        const style = targetStyle(target);
        offset += toUnitNumber(style.marginBottom);
        offset += toUnitNumber(style.paddingBottom);
      }

      // 继续递归
      if (target.parentNode && target.parentNode.nodeName !== "HTML") {
        return this.getParentsOffsetBottom(target, offset);
      }

      return offset;
    },
    /**
     * 行编辑事件选中当前行配置
     * @param {Object} row 行数据
     * @param {Object} cfg 操作配置
     */
    setRowChangeBind(row, cfg) {
      const { extend } = cfg;
      if (!extend.isSetBind) {
        extend.isSetBind = true;
        const { change, blur } = extend;
        if (change)
          extend.change = (event) =>
            this.setRowChangeFn(event, row, change, cfg);
        if (blur)
          extend.blur = (event) => this.setRowChangeFn(event, row, blur, cfg);
      }
      return extend;
    },
    /**
     * 行编辑选中当前行并执行事件函数
     * @param {Objecy} event
     * @param {Object} row
     * @param {Function} fn 事件函数
     * @param { Object } cfg 当前配置
     */
    setRowChangeFn(event, row, fn, cfg) {
      this.operationIndex = row[this.rowKey];
      const val = row[cfg.name];
      if (fn) fn(val, event);
    },
    /**
     * @desc table动态绑定属性
     */
    tableBind() {
      const bindObj = {
        "show-overflow-tooltip": true,
        border: true,
        stripe: true,
      };
      const { tableConfig, maxHeight, reserveSelection } = this;
      const { autoHeight, extend, zdyHeight } = tableConfig;
      // 自动适应高度
      if (autoHeight) {
        bindObj.height = maxHeight;
      } else {
        bindObj.height = zdyHeight;
      }
      // 选中高亮 表现与行自动选中有冲突
      // if (tableConfig.selection === false && tableConfig.radio === true) {
      //     bindObj['highlight-current-row'] = true;
      // }
      // 为跨页多选设置一个row-key
      if (extend && !extend["row-key"] && reserveSelection === true)
        bindObj["row-key"] = this.rowKey;
      return Object.keys(bindObj).length
        ? getMergedObject(extend, bindObj)
        : extend;
    },
    /**
     * 添加行选中切换状态
     */
    tableON() {
      const { tableConfig } = this;
      if (tableConfig.selection !== false || tableConfig.radio) {
        let fn = "";
        // 保证同extend 正常
        if (tableConfig.extend) {
          fn =
            tableConfig.extend["row-click"] || tableConfig.extend["row-change"];
        } else {
          tableConfig.extend = {};
        }
        tableConfig.extend["row-click"] = (r, c, e) => {
          this.handleRowChange(r, c, e);
          if (fn) fn(r, c, e);
        };
      }
    },
    /**
     * 按照一屏显示设置表格的最大高度，
     */
    initTableHeight(zdyoffset) {
      const { table, pagination } = this.$refs;
      // 窗口的高度
      const winHeight = window.innerHeight;
      // 主容器实际的距离顶部的高
      const tableTop =
        table.getBoundingClientRect().top +
        window.pageYOffset -
        (zdyoffset || 0);
      // 主容器样式
      const computedStyle = targetStyle(table);

      // 主容器margin
      const tableMarginTop = toUnitNumber(computedStyle.marginTop);
      const tableMarginBottom = toUnitNumber(computedStyle.marginBottom);
      // 获得底部的高度
      let parantsOffterBottom = this.getParentsOffsetBottom(table);
      // 这是按表格为页面最底部计算，允许设置部偏移值
      if (
        typeof this.tableConfig.autoHeight !== "boolean" &&
        this.tableConfig.autoHeight
      ) {
        parantsOffterBottom += this.tableConfig.autoHeight;
      }
      // 获得分页的高度
      let paginationHeight = 0;
      if (pagination) {
        const paginationStyle = targetStyle(pagination);
        paginationHeight += pagination.clientHeight || 0;
        const top = toUnitNumber(paginationStyle.marginTop);
        const bottom = toUnitNumber(paginationStyle.marginBottom);
        paginationHeight += top + bottom;
      }

      // 获得剩余屏幕的高度
      let tableHeight =
        winHeight - tableTop - tableMarginTop - tableMarginBottom;
      // 去除分页的高度
      tableHeight -= paginationHeight;
      //  去除窗口的下边距和填充
      tableHeight -= parantsOffterBottom;
      let initMinHeight = 200;
      if (typeof this.tableConfig.minHeight === "number") {
        initMinHeight = this.tableConfig.minHeight;
      }
      if (tableHeight >= initMinHeight) {
        this.maxHeight = tableHeight;
      } else {
        // 设置最低的表格滚动高度200，或者配置的minHeight。
        this.maxHeight = initMinHeight;
      }
    },

    /**
     * 获得表单name对应的配置
     * @param {object} formConfig 表单配置
     */
    getFormConfig(formConfig, name) {
      const materialConfig = formConfig.data.find((i) => i.name === name);
      if (materialConfig.type === "upload") {
        materialConfig.mode = "text";
      }
      return materialConfig;
    },
    /**
     * 处理选中状态
     */
    toggleSelection(rows) {
      let that = this;
      this.$nextTick().then(function () {
        if (rows) {
          rows.forEach((row) => {
            that.$refs.list.toggleRowSelection(row, true);
          });
        } else {
          that.$refs.list.clearSelection();
        }
      });
    },
    /**
     * 当点击该行时选中切换
     */
    handleRowChange(row, c, e) {
      const isTarget =
        e.target.localName === "div" || e.target.localName === "td";
      if (isTarget) {
        const { rowKey, tableSelection, tableConfig } = this;
        if (tableConfig.radio) {
          if (row.disabled !== true) this.handleRadioChange(row);
        } else {
          const index = row[rowKey];
          const has =
            tableSelection.findIndex((item) => item[rowKey] === index) > -1;
          if (row.selectable !== true && this.$refs.list)
            this.$refs.list.toggleRowSelection(row, !has);
        }
      }
    },
    /**
     * 更改页面size
     */
    handleSizeChange(size) {
      if (this.paginationSetting[this.listDataProps.pageSize] !== size) {
        this.paginationSetting[this.listDataProps.pageSize] = size;
        // 重绘table高度
        // if (this.tableConfig.autoHeight) this.initTableHeight();
      }
      // 静态分页
      if (this.tableDataTotalFlag) {
        this.setStaticListStatus({ startIndex: 0, pageCurrent: 1 });
        return;
      }
      this.paginationSetting[this.listDataProps.pageNumber] = 1;
      // 异步分页
      this.getTableData(true);
    },
    /**
     * 切换页码
     * @param {Boolean} flag 是否清空跳转页数内容
     */
    handleCurrentChange(pageIndex, flag) {
      // 单选不涉及跨页选择数据，为了防止切换页码后，tableSelection仍然保留有上一页选择的数据，在此对单选情况做清空处理。
      if (this.radio !== "") {
        this.radio = "";
        this.tableSelection = [];
      }
      this.paginationSetting[this.listDataProps.pageNumber] = pageIndex;
      // 静态分页
      const size = this.paginationSetting[this.listDataProps.pageSize];
      if (this.tableDataTotalFlag) {
        this.setStaticListStatus({ startIndex: (pageIndex - 1) * size });
        return;
      }
      // 异步分页
      this.getTableData(true, null, flag);
    },
    /**
     * 设置禁止选择状态
     */
    handleSeletable(row) {
      return !row[this.selectableKey];
    },
    /**
     * 获取列表数据
     * @param {Boolean}  needScroll
     * @param {Object} extra 扩展请求参数
     * @param {Boolean} flag 是否不清空跳转页数内容
     */
    getTableData(needScroll = false, extra, pageFlag) {
      if (pageFlag) {
        this.paginationSetting[this.listDataProps.pageNumber] = 1;
      }
      const {
        tableConfig,
        sortParams,
        paginationSetting,
        listDataProps,
        reserveSelection,
        tableSelection,
      } = this;
      if (!tableConfig.http || !tableConfig.http.url) return;
      const { params, onBefore } = tableConfig.http;
      const { extend, selection, radio, showLoading } = tableConfig;
      const tableConfigParams = params || {};
      let currentParams = Object.assign(tableConfigParams, paginationSetting);
      // 扩强请求的参数
      if (extra) {
        currentParams = Object.assign({}, currentParams, extra);
      }
      console.log(currentParams, "currentParams");
      // 排序请求参数
      if (this.sortFlag) {
        currentParams = Object.assign({}, currentParams, sortParams);
      }
      // 请求前置
      if (typeof onBefore === "function") {
        const realParams = onBefore(currentParams, this);
        if (realParams === false) {
          this.loadingStatus = false;
          return;
        }
        currentParams = realParams || currentParams;
      }

      const { url, method, onSuccess, onFaild, onSuccessTotal } =
        tableConfig.http;

      this.loadingStatus = showLoading;

      this.scrollToTableLeft();
      const { data, results, totalCount } = listDataProps;
      this.$fetch({
        url, // 配置过来的请求地址
        params: currentParams,
        config: { showLoading: showLoading },

        method: method || "post",
      })
        .then((res) => {
          this.loadingStatus = false;
          if (res !== false) {
            // init status
            this.radio = "";
            this.operationIndex = "";
            let list = [];
            if (!results) {
              list = res || [];
            } else if (res[results]) {
              list = res[results] || [];

              const total = res[totalCount];
              if (total !== undefined) this.totalCount = total || 0;
            }
            // 处理单选按钮情况的选中状态
            if (selection === false && radio === true) {
              if (reserveSelection && tableSelection.length === 1) {
                const obj = list.find(
                  (item) => item[this.rowKey] === tableSelection[0][this.rowKey]
                );
                if (obj) this.radio = obj[this.rowKey];
              } else {
                this.radio = undefined;
                tableSelection.splice(0, tableSelection.length);
              }
            }

            // 成功回调并获得用户调整的分页
            if (onSuccessTotal) {
              // 回填经过上层onSuccess拦截处理后的表格数据
              this.totalCount = onSuccessTotal(res, this) || this.totalCount;
            }
            // 成功回调并获得用户调整的参数
            if (onSuccess) {
              // 回填经过上层onSuccess拦截处理后的表格数据
              list = onSuccess(res, this) || list;
            }
            // 设置一个唯一的id
            if (extend && !extend["row-key"] && reserveSelection === true) {
              throw new Error("请设置row-key！");
            }
            this.tableData = list;
            // 主要用于跨页选择，从新让列表数据和选中数据关联
            if (this.tableSelection.length) {
              this.tableSelection.forEach((d, index) => {
                const id = d[this.rowKey];
                for (let i = 0; i < this.tableData.length; i += 1) {
                  const row = this.tableData[i];
                  if (id === row[this.rowKey]) {
                    this.tableSelection[index] = row;
                    break;
                  }
                }
              });
            }
            this.initRowConfig();

            if (needScroll) {
              this.scrollToTableTop();
            }
            // 当前页码大于1且list无数据时自动跳上一页
            if (
              this.bkConfig.autoPrevPage &&
              this.paginationSetting[this.listDataProps.pageNumber] > 1 &&
              !list.length
            ) {
              this.paginationSetting[this.listDataProps.pageNumber] -= 1;
              this.getTableData();
            }
            this.$nextTick(() => {
              this.$refs.list && this.$refs.list.doLayout();
            });
          } else if (typeof onFaild === "function") onFaild(res, this);
        })
        .catch((e) => {
          this.loadingStatus = false;
        });
    },
    /**
     * 计算列表顶部所在位置，并滚动到此处
     */
    scrollToTableTop() {
      this.$refs.list.bodyWrapper.scrollTop = 0;
    },
    /**
     * 查询数据时table横向滚动复原
     */
    scrollToTableLeft() {
      const elTable = this.$refs.table;
      if (!elTable) return;
      const elBody = elTable.getElementsByClassName(
        "el-table__body-wrapper"
      )[0];
      if (elBody) elBody.scrollLeft = 0;
    },

    /**
     * 初始化行数据的配置
     */
    initRowConfig() {
      if (Array.isArray(this.tableData)) {
        this.tableData.forEach((item, index) => {
          const row = item;
          // 设置自动标记
          row.index = index;
          this.rowFormItemTogather(row);
          if (this.isHasChildren) this.handleTreeChildren(row);
        });
      }
    },
    /**
     * 树状懒加载方法适配list
     */
    handleTreeLoadFn() {
      const { load } = this.tableConfig.extend;
      this.tableConfig.extend.load = (tree, treeNode, callback) => {
        load(tree, treeNode, (data) => {
          if (!data || !data.length) {
            tree[this.treeProps.hasChildren] = false;
            return;
          }
          data.forEach((item) => {
            const row = item;
            // 设置索引标记
            this.rowFormItemTogather(row);
            this.handleTreeChildren(row);
          });
          callback(data);
        });
      };
    },
    /**
     * 树列表存在懒加载时添加默认子集
     */
    handleTreeChildren(row) {
      const { hasChildren, children } = this.treeProps;
      if (row[hasChildren] === undefined) {
        row[children] = [];
        row[hasChildren] = true;
      }
    },

    /**
     * 处理多级表头的formConfig 递归
     */
    handleRowFormItem(item, row, formConfig) {
      const { rowKey } = this;
      const guid = row[rowKey];
      if (item.type !== "operation" && !item.formExtend) {
        const { data } = item;
        if (data && data.length != 0) {
          for (let i = 0; i < data.length; i += 1) {
            this.handleRowFormItem(data[i], row, formConfig);
          }
        } else {
          formConfig.data.push(item);
        }
      } else if (item.formExtend) {
        // 设置所有的行表单配置
        const colConfig = deepCopy(item.formExtend);
        colConfig.name = item.name;
        if (Array.isArray(colConfig.independentOptions)) {
          const { independentOptions } = colConfig;
          if (independentOptions[guid]) {
            colConfig.options = independentOptions[guid].options;
          } else {
            colConfig.options = independentOptions[0].options;
          }
        }
        // 为cell配置操作行
        const { extend } = colConfig;
        if (extend && (extend.change || extend.blur)) {
          colConfig.extend = this.setRowChangeBind(row, colConfig);
        }
        formConfig.data.push(colConfig);
      }
    },
    /**
     * 聚合表格内每行的表单元素，方便进行关联、禁用等操作
     * @param {Object} row 当前数据
     */
    rowFormItemTogather(row) {
      const { tableConfig, rowKey } = this;

      // 初始化行内编辑,模拟form-material 结构
      const guid = row[rowKey];
      let formConfig = this.formConfigs[guid];
      if (formConfig) return;
      // 创建配置级
      formConfig = { data: [] };
      this.$set(this.formConfigs, guid, formConfig);
      if (this.tableConfig.mode === "readonly") {
        // 保存当前状态
        this.$set(formConfig, "readonly", formConfig.readonly !== false);
      }
      if (Array.isArray(tableConfig.data) === false) return;
      tableConfig.data.forEach((item) => {
        this.handleRowFormItem(item, row, formConfig);
      });
    },
    /**
     * 勾选事件
     */
    handleSelection(selection) {
      this.tableSelection = selection;
      this.$emit("selectionChange", this.tableSelection);
    },
    /**
     * 单选事件 与多选共用tableSelection数组对象以保持与btttonConfing中对于selection配置项的逻辑一致。
     * @param {Object} val 选择行的数据集合
     */
    handleRadioChange(val) {
      this.radio = val[this.rowKey];
      this.tableSelection = [val];
      this.$emit("selectionChange", this.tableSelection);
    },

    /**
     * 默认排序处理事件
     * @param {Object} columnInfo 列信息
     * @param {Object} columnInfo.column 列属性
     * @param {String} columnInfo.prop 列字段名称
     * @param {String} columnInfo.order 排序信息
     */
    defaultSortChange(columnInfo) {
      const obj = this.sortParamsFormat(columnInfo);
      if (!obj) return;
      this.getTableData(true, obj);
    },

    /**
     * 格式化sort请求参数和状态
     * @param {Object} columnInfo 列信息
     */
    sortParamsFormat(columnInfo) {
      const { http } = this.tableConfig || {};
      const { sort } = http || {};
      const {
        order = "order",
        columnField = "sort",
        ascend = "asc",
        descend = "desc",
        mode,
        onBefore,
      } = sort || {};

      let obj; // 请求参数
      const { order: columnOrder } = columnInfo;
      // 根据mode格式化参数格式
      let orderValue = columnOrder;
      if (columnOrder === "descending") {
        orderValue = descend; //下降
      } else if (columnOrder === "ascending") {
        //上升
        orderValue = ascend;
      }
      if (mode === "stateAsKey") {
        if (columnOrder === "descending") {
          obj = { [descend]: [columnInfo.prop] };
        } else if (columnOrder === "ascending") {
          obj = { [ascend]: [columnInfo.prop] };
        }
      } else if (mode === "nameAsKey") {
        obj = { [columnInfo.prop]: orderValue };
      } else {
        obj = {
          [order]: orderValue,
          [columnField]: columnInfo.prop,
        };
      }

      // 自定义参数格式
      if (typeof onBefore === "function") {
        obj = onBefore(columnInfo, this, obj);
      }
      this.sortParams = obj || {}; // 排序请求参数
      this.sortFlag = !!columnOrder; // 排序状态
      return obj; // false阻断后续行为
    },

    /**
     * 静态处理列表的展示状态
     * @param {Object} obj 配置对象
     * @param {} obj.startIndex 配置对象
     */
    setStaticListStatus(obj = {}) {
      const { startIndex, pageCurrent } = obj;
      if (startIndex !== undefined && startIndex !== null) {
        this.startIndex = startIndex;
      }
      if (pageCurrent !== undefined && pageCurrent !== null) {
        this.paginationSetting[this.listDataProps.pageNumber] = pageCurrent;
      }
      this.tableData = this.tableDataTotal.slice(
        this.startIndex,
        this.startIndex + this.paginationSetting[this.listDataProps.pageSize]
      );
    },

    /**
     * 静态数据处理列表的删除操作
     */
    handleDeleteStatic(tableRow) {
      this.loadingStatus = true;
      const { results, extend = {} } = this.tableConfig;
      const rowKey = extend["row-key"] || extend.rowKey;
      if (!isEmptyObj(tableRow)) {
        // 单条删除
        const index = results.findIndex((item) => {
          if (rowKey) {
            return item[rowKey] === tableRow[rowKey];
          }
          return JSON.stringify(item) === JSON.stringify(tableRow);
        });
        results.splice(index, 1);
      } else {
        // 批量删除
        this.tableSelection.forEach((data) => {
          const index = results.findIndex((item) => {
            if (rowKey) {
              return item[rowKey] === data[rowKey];
            }
            return JSON.stringify(item) === JSON.stringify(data);
          });
          results.splice(index, 1);
        });
      }
      // 清空全选按钮的半选状态
      this.$refs.list.clearSelection();
      this.setStaticListStatus({ startIndex: 0, pageCurrent: 1 });
      this.loadingStatus = false;
    },
  },
};
</script>
<style scoped lang="scss">
@import "./../../theme-chalk/src/common/element-var.scss";

.list-wrapper {
  .el-table--border {
    border-left: none;
    border-top: none;
  }
  ::v-deep {
    .el-table__fixed-right-patch {
      background-color: $el-table-header-th;
    }
    .el-table__empty-text {
      line-height: initial;
    }
    .el-table__fixed {
      height: 100% !important;
    }
    .el-table__fixed-right {
      height: 100% !important;
    }
    .el-table .sort-caret.ascending {
      top: 7px;
    }
    .el-table .sort-caret.descending {
      bottom: 9px;
    }
    .el-table .sort-caret {
      border: solid 4px transparent;
    }
    .el-input__inner {
      border-radius: 2px;
    }
    //   ::-webkit-scrollbar{
    //     width: 2px;
    // }
    // ::-webkit-scrollbar-thumb{
    //     border-radius: 2px;
    //     height: 50px;
    //     background: rgb(135,136,139);;
    // }
    // ::-webkit-scrollbar-track{
    //     box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    //     border-radius: 2px;
    //     background: rgba(0,0,0,0.4);
    // }
    .el-table__header .has-gutter th.is-leaf:nth-last-child(2) {
      // border-right: none;
    }
    .el-table {
      overflow: auto;
    }
    .el-table::before {
      height: 0;
    }
    .el-table--group::after,
    .el-table--border::after {
      height: 0;
    }
    .el-table__fixed::before,
    .el-table__fixed-right::before {
      height: 0;
    }
    // .el-table__body-wrapper {
    //   overflow: visible;
    // }
    // .el-table::after {
    //   position: relative;
    // }
    //分页样式
    .pagination-wrapper {
      margin-top: 30px;
      height: 28px;
      .el-pagination {
        display: flex;
        justify-content: flex-end;
        .el-input {
          width: 77px;
          .el-input__inner {
            padding-right: 19px;
            font-size: 12px;
            height: 24px;
            line-height: 24px;
          }
        }
        .el-input__icon {
          height: 24px;
          line-height: 24px;
        }
        span:not([class*="suffix"]),
        button {
          min-width: 24px;
          height: 24px;
          line-height: 24px;
        }
        .el-pager li,
        button {
          min-width: 24px;
          height: 24px;
          line-height: 22px;
          font-size: 12px;
          border: 1px solid $--border-color-base;
          color: #666;
          border-radius: 2px;
          margin-left: 8px;
          &.active {
            background: $--color-primary;
            border: 1px solid $--color-primary;
            color: #fff;
          }
        }
        .btn-prev,
        .btn-next {
          padding: 0;
        }
        .el-pagination__sizes {
          margin: 0;
        }
        .el-pagination__jump {
          font-size: 12px;
          margin-left: 10px;
          .el-pagination__editor {
            width: 34px;
            height: 24px;
            &.el-input {
              margin: 0 8px;
              .el-input__inner {
                padding-right: 0;
                padding-left: 0;
              }
            }
          }
        }
      }
    }
    //表格样式
    .el-table {
      .formBlock {
        span {
        }
        .scopeHeaderInput {
        }
      }
      .formInlineBlock {
        display: flex;
        align-items: center;
        height: 45px;
        span {
          margin-right: 20px;
        }
        .scopeHeaderInput {
          flex: 1;
        }
      }
      .emptyImgBox {
        padding: 20px;
      }
      .el-form-item {
        margin-bottom: 0;
      }
      .el-input__inner {
        height: 28px;
        line-height: 28px;
      }
      .el-input-number {
        line-height: 28px;
      }
      .el-input-number__decrease,
      .el-input-number__increase {
        width: 28px;
      }
      .list-operation {
        .cell {
          padding-right: 40px;
        }
      }
      td,
      th {
        padding: 0;
        height: 33px;
      }
      th {
        background: $el-table-header-th;
        & {
          border-right: 1px solid #d4d4d9;
          border-bottom: 1px solid #d4d4d9;
        }
        & > .cell {
          font-size: 14px;
          color: #575d6c;
        }
      }
      td {
        & {
          border-right: 0;
        }
        & > .cell {
          font-size: 12px;
          color: #666;
        }
      }
      .ascending .sort-caret.ascending {
        border-bottom-color: #000;
      }
      .descending .sort-caret.descending {
        border-top-color: #000;
      }
      .sort-caret.ascending {
        border-bottom-color: #999;
      }
      .sort-caret.descending {
        border-top-color: #999;
      }
      .el-table__row {
        border-bottom: 1px solid $el-table-row-border-bottom;
        &:last-child {
          .el-table__cell {
            // border-bottom: 0;
          }
        }
      }
      .el-table__body tr.el-table__row--striped td.el-table__cell {
        background-color: $el-table-row-border-bottom;
      }
      .el-table__body tr.hover-row.current-row > td,
      .el-table__body tr.hover-row.el-table__row--striped.current-row > td,
      .el-table__body tr.hover-row.el-table__row--striped > td,
      .el-table__body tr.hover-row > td {
        background-color: $el-table-row-hover;
      }
    }
    .el-table .cell,
    .el-table th div,
    .el-table--border td:first-child .cell,
    .el-table--border th:first-child .cell {
      padding-left: 20px;
      &.scopeHeaderInput {
        padding-left: 0;
      }
    }
    .el-table .cell,
    .el-table th div {
      height: 33px;
      padding-right: 20px;
      line-height: 33px;
      &.scopeHeaderInput {
        padding-right: 0;
      }
    }
  }
}
</style>
