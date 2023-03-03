/* * @Author: dubin * @Date: 2022-03-03 15:42:16 * @Last Modified by: dubin *
@Last Modified time: 2022-05-11 16:11:30 */

<template>
  <div>
    <div class="nav-tabs">
      <ul id="tabs" class="dib-box">
        <li class="dib active"><span>Unicode</span></li>
        <li class="dib"><span>Font class</span></li>
      </ul>

      <a
        href="https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=2469165"
        target="_blank"
        class="nav-more"
        >查看项目</a
      >
    </div>
  </div>
</template>
<script>
export default {
  name: "hlIconList",
  props: {
    name: String,
    size: {
      type: String,
      default: "primary",
    },
    color: {
      type: String,
      default: "",
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
// @import 'https://g.alicdn.com/thx/cube/1.3.2/cube.min.css';
.dib-box .dib {
  display: inline-block;
  vertical-align: top;
  font-size: 12px;
  letter-spacing: normal;
  word-spacing: normal;
  line-height: inherit;
}
</style>
