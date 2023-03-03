import hlCard from "./src/index.vue";

/* istanbul ignore next */
hlCard.install = function (Vue) {
  Vue.component(hlCard.name, hlCard);
};

export default hlCard;
