<template>
  <div class="teamNotification">
    <div class="searchContainer">
      <div class="isFlex">
        <hl-form
          class="marginRight14"
          v-model="searchForm"
          ref="form"
          :form-config="formConfig"
        ></hl-form>
        <hl-button :buttonConfig="btnData"></hl-button>
      </div>
    </div>
    <div class="table">
      <hl-table ref="tables" :table-config="tableConfig"></hl-table>
    </div>
    <hl-dialog :dialogConfig="dialogConfig" v-model="visibleDialog">
      <div class="notification">
        <p>
          <span>{{ notificationCreateTime }}</span>
          <span>发送{{ notificationStatus }}</span>
        </p>
        <p>
          <span>{{ notificationContent }}</span>
        </p>
      </div>
    </hl-dialog>
  </div>
</template>
<script>
import mixins from "@/views/mixins";
export default {
  mixins: [mixins],
  data() {
    return {
      searchForm: {
        status: "",
        notificationType: "",
        content: "",
        searchHistoryParam: "teamNotification",
      },

      btnData: [
        {
          text: "查询",
          clickEvent: this.handleSearch,
        },
        {
          text: "重置",
          plain: true,
          clickEvent: this.handleReset,
        },
      ],
      visibleDialog: false, // 弹框默认不展示
      dialogTitle: "",
      notificationContent: "",
      notificationCreateTime: "",
      notificationStatus: "",
    };
  },
  computed: {
    /**表单配置 */
    formConfig() {
      return {
        layout: "inlineBlock",
        labelWidth: "78px",
        noMargin: true,
        data: [
          {
            type: "select",
            label: "通知类型：",
            width: 340,
            name: "notificationType",
            options: this.dicts.notificationTypeList,
          },
          {
            type: "select",
            label: "发送状态：",
            width: 340,
            name: "status",
            options: this.dicts.notificationStatusList,
          },
        ],
      };
    },
    /**表格配置 */
    tableConfig() {
      return {
        results: [],
        autoHeight: true,
        data: [
          {
            name: "addressUser",
            label: "接受员工",
          },
          {
            name: "notificationType",
            label: "通知类型",
            formatter: true,
            options: this.dicts.notificationTypeList,
          },
          {
            name: "status",
            label: "状态",
            formatter: true,
            options: this.dicts.notificationStatusList,
          },
          {
            name: "createTime",
            label: "发送时间",
          },
          {
            name: "operation",
            label: "操作",
            type: "operation",
            data: [
              {
                content: "查看",
                icon: "iconchakan",
                visibleIcon: true,
                visibleTooltip: true,
                clickEvent: this.notificationDetail,
                permissions: ["teamNotification:check"],
              },
            ],
          },
        ],
        http: {
          url: "/teamNotification/findListByParam",
          params: this.searchForm,
        },
      };
    },
    /**弹框配置 */
    dialogConfig() {
      return {
        height: "300",
        extend: {
          width: "545px",
          title: this.dialogTitle,
          close: this.closeEvent,
        },
        btnData: [
          {
            text: "返回",
            plain: true,
            clickEvent: this.returnEvent,
          },
        ],
      };
    },
  },
  methods: {
    // 查看
    notificationDetail(item) {
      const { notificationType, notificationContent, createTime, status } = item;
      this.dialogTitle = this.dicts.notificationTypeList.filter(item => item.value === notificationType)[0].label;
      this.notificationContent = notificationContent;
      this.notificationCreateTime = createTime;
      this.notificationStatus = status === 1 ? "成功" : "失败";
      this.visibleDialog = true;
    },
    // 返回
    returnEvent() {
      this.visibleDialog = false;
    },
    // 点击取消
    closeEvent() {
      this.visibleDialog = false;
    },
  },
};
</script>
<style scoped lang="scss">
.marginBottom5 {
  margin-bottom: 5px;
}
.notification {
  p:first-child {
    margin-bottom: 20px;
    font-size: 12px;
    color: #7f7f7f;
    span:first-child {
      padding-right: 10px;
    }
  }
}
</style>

