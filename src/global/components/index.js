const requireComponent = require.context(
  // 其组件目录的相对路径
  "./",
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /index.js/
);
const resultArr = [];
requireComponent.keys().forEach((fileName) => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName);
  // 全局注册组件
  if (componentConfig.default && componentConfig.default.name) {
    resultArr.push(componentConfig.default);
  }
});
export default resultArr;
