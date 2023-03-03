<template>
  <div v-if="cfg">
    <bk-render v-if="cfg.render" v-bind="cfg" />
    <div v-else-if="cfg.html" v-html="cfg.html" />
  </div>
</template>

<script>
import BkRender from './render'

export default {
  name: 'BkSlot',
  components: {
    BkRender
  },
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    slotName: {
      type: String,
      default: 'slot'
    }
  },
  computed: {
    cfg() {
      let targert = ''
      if (Array.isArray(this.config.slot)) {
        targert = this.config.slot.find(slot => slot.name === this.slotName)
      } else if (this.config.slot && this.config.slot.name === this.slotName) {
        targert = this.config.slot
      }
      return targert
    }
  }
}
</script>
