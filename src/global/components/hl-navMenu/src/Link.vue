<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
// import { isExternal } from "@/global/utils/validate";
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}
export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  computed: {
    isExternal() {
      return isExternal(this.to);
    },
    type() {
      if (this.isExternal) {
        return "a";
      }
      return "router-link";
    },
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to + "?=t" + Date.now(),
          target: "_blank",
          rel: "noopener",
        };
      }
      return {
        to: to + "?=t" + Date.now(),
      };
    },
  },
};
</script>
