<template>
  <div class="card positionRelative">
    <el-image class="baWarp positionAbsolute" :src="color"></el-image>
    <div class="monitor-left">
      <label>{{ label }}</label>
      <div class="isFlex">
        <p v-html="value"></p>
        <p>{{ unit }}</p>
      </div>
    </div>
    <div class="monitor-right">
      <div>
        <i class="iconfont" :class="icon" :style="{ color: iconColor }"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "hlCard",
  props: {
    label: String,
    icon: String,
    value: [String, Number],
    iconColor: String,
    color: String,
    unit: String,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.card {
  border-radius: 10px;
  flex: 1;
  display: flex;
  height: 90px;
  justify-content: space-between;
  padding: 16px 30px;
  .baWarp {
    position: absolute !important;
    width: 100%;
    left: 0;
    top: 0;
  }
  .monitor-left {
    display: flex;
    flex-direction: column;
    z-index: 999;
    label {
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0;
      font-weight: 600;
    }
    p {
      font-size: 22px;
      color: #ffffff;
      letter-spacing: 0;
      font-weight: 600;
      margin-top: 10px;
    }
  }
  .monitor-right {
    z-index: 999;
    div {
      background: #ffffff;
      width: 52px;
      height: 52px;
      overflow: hidden;
      text-align: center;
      line-height: 52px;
      border-radius: 50%;
      i {
        font-size: 20px;
      }
    }
  }
}
</style>
