<template>
  <div class="libraryFolder">
    <div class="content">
      <p class="knowledgeName">{{ knowledgeLibraryName }}</p>
      <p class="title">{{ title }}</p>
      <p class="num">- {{ fileNum }} -</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      knowledgeLibraryName: this.$route.query.knowledgeName,
    };
  },
  props: {
    title: String,
    fileNum: Number,
  },
};
</script>
<style lang="scss" scoped>
div.libraryFolder {
  height: 100%;
  position: relative;
  div.content {
    width: 400px;
    height: 200px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    p.knowledgeName {
      text-align: center;
      color: #1585c8;
      font-size: 22px;
      margin-bottom: 10px;
    }
    p.title {
      text-align: center;
      color: #000000;
      font-size: 26px;
      margin-bottom: 10px;
    }
    p.num {
      text-align: center;
      color: #afadb0;
      font-size: 22px;
    }
  }
}
</style>
