<template>
  <div class="hlStateList">
    <div
      :class="'item' + direction"
      class="hlStateListItem"
      v-for="(item, num) in stateList"
      :key="num"
    >
      <hl-tooltip
        :tooltipConfig="{
          content: item.content,
        }"
      >
        <span slot="text">
          <hl-icon
            @click="handleClick(item)"
            v-bind="item.extend"
            :color="item.color"
            fontSize="20"
            v-if="item.type === 'icon'"
            :name="item.icon"
          ></hl-icon>
          <div
            v-else-if="item.type === 'circle'"
            class="stateCircle"
            @click="handleClick(item)"
            :class="item.color"
            :style="{ background: item.color }"
          ></div>
          <span class="marginLeft10">{{ item.value }}</span>
        </span>
      </hl-tooltip>
    </div>
  </div>
</template>

<script>
import hlIcon from './../../hl-icon'
export default {
    components:{hlIcon},
  name: "hlStateList",
  props: {
    stateListConfig: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      stateList: [],
      direction: "horizontal",
      extend: {},
    };
  },
  watch: {
    stateListConfig: {
      handler(newVal) {
        const { options, extend } = newVal;
        this.stateList = options;
        this.extend = extend;
      },
      deep: true,
    },
  },
  methods: {
    handleClick(item) {
      const { extend } = item;
      if (extend && extend.callBack) {
        extend.callBack(item);
      }
    },
  },
  mounted() {
    const { options, extend, direction } = this.stateListConfig;
    this.stateList = options;
    this.extend = extend;
    this.direction = direction || "horizontal";
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.hlStateList {
  display: flex;
  .stateCircle {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  .itemvertical {
    .el-tooltip {
      flex-direction: column;
      margin-right: 0px;
      align-items: center;
      span {
        margin-left: 0;
      }
    }
  }
  .hlStateListItem {
    margin-right: 20px;
    cursor: pointer;
    display: flex;
    font-size: 20px;
    color: #333333;
    line-height: 20px;
    font-weight: 500;
    .hl-tooltip {
      margin-right: 10px;
      ::v-deep {
        .el-tooltip {
          display: flex;
        }
      }
    }
  }
}
</style>
