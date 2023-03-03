<template>
  <div class="libraryView">
    <iframe ref="iframe" :src="pdfUrl" frameborder="0"></iframe>
  </div>
</template>
<script>
export default {
  props: {
    title_: String,
    pdfUrl: String,
  },
};
</script>
<style lang="scss" scoped>
div.libraryView {
  height: 100%;
  overflow: hidden;
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
