<template>
  <div class="projectType positionRelative">
    <div class="searchContainer">
      <div class="isFlex">
        <hl-form
          class="marginRight14"
          v-model="searchForm"
          ref="form"
          :form-config="formConfig"
        >
        </hl-form>
        <hl-popover top="50">
          <hl-form
            v-model="searchForm"
            ref="forms"
            :form-config="popoverConfig"
          ></hl-form
        ></hl-popover>
        <hl-button :buttonConfig="btnData"></hl-button>
      </div>
      <hl-button
        :buttonConfig="{
          text: '新增配置',
          clickEvent: this.handleAdd,
          permissions: ['projectType:add'],
        }"
      ></hl-button>
    </div>
    <div class="table">
      <hl-table ref="tables" :table-config="tableConfig"></hl-table>
    </div>
    <hl-dialog :dialogConfig="dialogConfig" v-model="visibleDialog">
      <hl-form
        ref="dialogForm"
        v-model="dialogForm"
        :form-config="dialogFormConfig"
      ></hl-form>
    </hl-dialog>
  </div>
</template>
<script>
import globalMixins from "@/views/mixins";
import mixins from "./mixins";
export default {
  mixins: [globalMixins, mixins],
  data() {
    return {
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
      visibleDialog: false,
      dialogWidth: "540px",
      dialogTitle: "新增",
    };
  },
  methods: {},
};
</script>
<style scoped lang="scss"></style>
