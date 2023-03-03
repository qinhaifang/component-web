/* * @Author: zhangzc * @Email: zhangzc2@guahao.com * @Date: 2019-04-25 14:56:51
* @Last Modified by: qiuwt * @Last Modified time: 2020-01-06 17:20:20 *
@Description: 带提示的标题组件 */
<template>
  <div class="title-wrapper">
    <template v-if="label.type === 'html'">
      <div class="content-html" v-html="label.content" />
    </template>
    <template v-else>
      {{ label }}
    </template>
    <!-- 提示信息，可通过插槽自定义 -->
    <el-popover
      v-if="note"
      v-bind="getMergedObject(extend, { trigger: 'hover', placement: 'right' })"
    >
      <div class="user-defined-popover">
        <slot>
          <div class="title-note">
            {{ note }}
          </div>
        </slot>
      </div>
      <i slot="reference" class="el-icon-warning" />
    </el-popover>
    <template v-if="buttonConfig && Array.isArray(buttonConfig.data)">
      <div class="btn-wrap">
        <template v-for="(item, index) in buttonConfig.data">
          <el-button
            :key="item.name || index"
            :type="item.type"
            @click="() => handleBtnClick(item)"
          >
            {{ item.label }}
          </el-button>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { getMergedObject } from "@/utils/util";

export default {
  name: "BkTitle",
  props: {
    // 名称
    label: {
      type: [String, Object],
      default: "",
    },
    // 提示提示信息
    note: {
      type: String,
      default: "",
    },
    extend: {
      type: Object,
      default: () => ({}),
    },
    buttonConfig: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      getMergedObject,
    };
  },
  methods: {
    handleBtnClick(btn) {
      const { callback } = btn;
      if (callback) callback.call(btn, this);
    },
  },
};
</script>
