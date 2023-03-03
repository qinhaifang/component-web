<template>
  <div
    :class="['knowledgeLibraryCard', { active: true }]"
    :style="{ backgroundImage: `url(${backgroundImage[num]['bg']})` }"
  >
    <p class="title">
      <img :src="backgroundImage[num]['tg']" />
      <span>{{ data.knowledgeName }}</span>
    </p>
    <p class="info">
      <span>{{ data.memo }}</span>
    </p>
    <div class="tools">
      <span
        class="icon iconfont iconshezhi"
        @click.stop="editKnowledgeLibrary"
      ></span>
      <span
        v-hasPermi="['knowledgeLibrary:delete']"
        v-if="data.baseType === 0"
        class="icon iconfont iconshanchu"
        @click.stop="deleteKnowledgeLibrary"
      ></span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    index_: Number,
    data: Object,
  },
  data() {
    return {
      backgroundImage: {
        0: {
          bg: require("@/assets/imgs/knowledgeLibraryBg1.png"),
          tg: require("@/assets/imgs/11.png"),
        },
        1: {
          bg: require("@/assets/imgs/knowledgeLibraryBg2.png"),
          tg: require("@/assets/imgs/22.png"),
        },
        2: {
          bg: require("@/assets/imgs/knowledgeLibraryBg3.png"),
          tg: require("@/assets/imgs/33.png"),
        },
        3: {
          bg: require("@/assets/imgs/knowledgeLibraryBg4.png"),
          tg: require("@/assets/imgs/44.png"),
        },
      },
    };
  },
  computed: {
    num: function () {
      let index_ = this.index_;
      return index_ % 4;
    },
  },
  methods: {
    deleteKnowledgeLibrary() {
      const { id } = this.data;
      this.$emit("deleteKnowledgeLibrary", id);
    },
    editKnowledgeLibrary() {
      const { id } = this.data;
      this.$emit("editKnowledgeLibrary", id);
    },
  },
};
</script>
<style lang="scss" scoped>
div.knowledgeLibraryCard {
  width: 100%;
  height: 260px;
  margin-bottom: 30px;
  padding: 30px;
  box-sizing: border-box;
  border-radius: 6px;
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  position: relative;
  border: 1px solid #fff;
  &:hover {
    box-shadow: 0 0 6px 1px rgba(31, 133, 236, 0.49);
    border: 1px solid #1f85ec;
    div.tools {
      display: block;
    }
  }
  div.tools {
    display: none;
    position: absolute;
    bottom: 20px;
    right: 20px;
    height: 17px;
    span:first-child {
      color: #1f85ec;
    }
    span:last-child {
      color: #ff0000;
      margin-left: 22px;
    }
  }
  p.title {
    height: 25px;
    line-height: 25px;
    margin-bottom: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    img {
      height: 22px;
      margin-right: 16px;
      vertical-align: middle;
    }
    span {
      font-size: 18px;
      color: #000000;
      font-weight: 500;
    }
  }
  p.info {
    line-height: 22px;
    display: -webkit-box;
    text-overflow: ellipsis;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    span {
      font-size: 14px;
      color: #000000;
      letter-spacing: 0;
      text-align: justify;
      font-weight: 400;
    }
  }
}
</style>
