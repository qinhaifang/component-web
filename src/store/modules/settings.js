const defaultSettings = require("@/config/config.base");
const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings;

const state = {
  theme: localStorage.getItem("theme") ,
  showSettings: showSettings,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
};

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value;
      if (key === "theme") {
        localStorage.setItem(key, value);
      }
    }
  },
};

const actions = {
  changeSetting({ commit }, data) {
    commit("CHANGE_SETTING", data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
