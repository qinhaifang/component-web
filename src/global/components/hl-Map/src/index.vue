<template>
  <div class="viewmap" style="height: 100%">
    <!-- 地图外层div，放置背景图片 -->
    <div
      ref="Map"
      :style="{ height: height, width: width, margin: '0 auto' }"
    ></div>
  </div>
</template>

<script>
import { getJson } from "./getJson.js";
import * as echarts from "echarts";
import * as mapPath from "./filePath/index";
import sxs from "./filePath/sxs";

export default {
  name: "hlMap",
  components: {},
  // 定义可以接收的属性
  props: {
    width: {
      type: String,
      default: "45vw"
      // default: "20vw",
    },
    area: {
      type: String,
      default: "长治"
    },
    height: {
      type: String,
      default: "70vh"
    },
    // map 的 option 都是由此 config 转换
    mapData: {
      type: Array
    }
  },
  watch: {},
  data() {
    return {
      modelId: "",
      visibleFlag: false,
      deviceId: "",
      title: "",
      chart: null,
      dialogVisible: false,
      option: null,
      mapInfo: {},
      mapKey: "=",
      baseOption: {},
      ifShowButton: false
    };
  },
  computed: {
    seriesData() {
      return "";
    }
  },
  mounted() {
    this.restoreChart();
    window.addEventListener("resize", () => {
      this.restoreChart();
    });
    window.wordClick = this.openDetailDevicelevel; // 把点击事件绑到window上
  },

  beforeDestroy() {
    if (this.chart instanceof Object) {
      this.chart.clear();
      this.chart.dispose();
    }
    this.chart = null;
    this.baseOption = null;
  },

  methods: {
    openDetailDevicelevel(id, modelId, deviceName) {
      this.deviceId = id;
      this.modelId = modelId;
      this.title = deviceName;
      this.chart._dom.childNodes[1].style.display = "none";
      this.visibleFlag = true;
    },
    handeCancel() {
      this.visibleFlag = false;
    },
    // 返回全国
    backToWholeNation() {
      this.mapKey = this.area;
      this.ifShowButton = false;
      this.convertMapOption(this.$props.mapData, this.mapKey);
      this.getGeoJson().then(() => this.refreshChart());
    },
    // 返回默认的 option 配置项
    getBaseOption() {
      var vm = this;
      var image1 = new Image();
      image1.src = "/static/img/bj.jpg";
      var image2 = new Image();
      image2.src = "/static/img/jbs.jpg";
      var image3 = new Image();
      image3.src = "/static/img/gaoliang1.png";
      return {
        // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
        // textStyle: {},
        title: {},
        // tooltip: {},
        // legend: { show: false },
        // dataset: [],
        series: [],
        // visualMap: {
        //   show: false,
        // },
        geo: [
          {
            //影子
            map: this.mapKey,
            zoom: this.mapKey === this.area ? 0.94 : 0.8, //放大级别
            type: "map",
            roam: false,
            layoutCenter: ["45.2%", "48.4%"],
            layoutSize: "100%",
            itemStyle: {
              //容器外边框设置`1
              normal: {
                borderWidth: 2,
                borderColor: "rgb(202,234,243)",
                areaColor: "#000", //区域颜色

                opacity: 1 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
              },

              emphasis: {
                areaColor: "transparent"
              }
            },
            z: 4
          },
          {
            map: this.mapKey,
            zoom: this.mapKey === this.area ? 0.9 : 0.8, //放大级别
            type: "map",
            roam: false,
            layoutCenter: ["45.5%", "48%"],
            layoutSize: "100%",
            itemStyle: {
              //容器外边框设置`1
              normal: {
                shadowColor: "rgb(12,111,134)",
                shadowOffsetX: -9,
                shadowOffsetY: 18
              },
              emphasis: {
                areaColor: "rgb(12,111,134)"
              }
            },
            z: 1
          },
          {
            map: this.mapKey,
            zoom: this.mapKey === this.area ? 0.9 : 0.8, //放大级别
            type: "map",
            roam: false,
            layoutCenter: ["45.5%", "48%"],
            layoutSize: "100%",
            itemStyle: {
              normal: {
                areaColor: "transparent"
              },
              //容器外边框设置`1
              emphasis: {
                areaColor: "rgb(12,111,134)"
              }
            },
            z: 2
          },
          {
            //为纹理图
            map: this.mapKey,
            // aspectScale: 1,
            zoom: this.mapKey === this.area ? 0.9 : 0.8, //放大级别
            type: "map",
            roam: false,
            layoutCenter: ["45.5%", "48%"],
            layoutSize: "100%",
            itemStyle: {
              //容器外边框设置`1
              normal: {
                borderWidth: 0,
                areaColor: {
                  image: image1,
                  repeat: "repeat-x"
                },
                opacity: 1 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
              },
              emphasis: {
                image: image1,
                repeat: "repeat-x"
              }
            },
            z: 4
          },

          {
            //为渐变色
            map: this.mapKey,
            // aspectScale: 1,
            zoom: this.mapKey === this.area ? 0.9 : 0.8, //放大级别
            type: "map",
            roam: false,
            layoutCenter: ["45.5%", "48%"],
            layoutSize: "100%",
            itemStyle: {
              //容器外边框设置`1
              normal: {
                borderWidth: 0,
                areaColor: {
                  image: image2
                  // repeat: "repeat-x",
                },
                opacity: 0.75 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
              },
              emphasis: {
                image: image2,
                repeat: "repeat-x"
              }
            },
            z: 6
          },
          {
            //外层轮廓层
            map: this.mapKey,
            zoom: this.mapKey === this.area ? 0.9 : 0.8, //放大级别
            type: "map",
            roam: false,
            layoutCenter: ["45.5%", "48%"],
            layoutSize: "100%",
            label: {
              normal: {
                show: true,
                color: "#eee",
                fontSize: 14
              },
              emphasis: {
                color: "#fff",
                fontSize: 16
              }
            },
            itemStyle: {
              //容器外边框设置

              normal: {
                areaColor: "transparent", //区域颜色
                borderType: "dashed",
                borderWidth: 0.8,
                borderColor: "#fff",
                opacity: 1 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
              },

              emphasis: {
                image: image3,
                repeat: "repeat-x",
                borderWidth: 0,
                shadowColor: "#000",
                shadowOffsetX: -10,
                shadowOffsetY: 10
              }
            },
            z: 49
          }
        ]
      };
    },
    getDeviceType(type, state) {
      let result = "";
      type = type.toString();
      state = state.toString();
      switch (type) {
        case "0":
          result = "";
          break;
        case "1":
          result = "luyouqi";
          break;
        case "2":
          result = "jiaohuanji";
          break;
        case "3":
          result = "fuwuqi";
          break;
        case "4":
          result = "jiaohuanji";
          break;
      }
      switch (state) {
        case "0":
          result += "5";
          break;
        case "1":
          result += "1";
          break;
        case "2":
          result += "3";
          break;
        case "3":
          result += "4";
          break;
        case "4":
          result += "2";
          break;
        case "5":
          result += "5";
          break;
      }
      return "/static/image/" + result + ".svg";
    },
    // 根据 props 的 config 配置 option
    convertMapOption(seriesData, mapKey) {
      this.baseOption = this.getBaseOption();
      this.baseOption.series = [
        {
          name: this.mapKey,
          type: "scatter",
          coordinateSystem: "geo",
          zoom: this.mapKey === this.area ? 1.1 : 0.8, //放大级别
          layoutCenter: ["45.5%", "48%"],
          roam: false,
          layoutSize: "100%",
          data: seriesData,
          itemStyle: {
            //容器外边框设置`1
            normal: {
              opacity: 1 //图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
            }
          },
          symbolSize: this.mapKey === this.area ? [24, 31] : [40, 47],
          symbolOffset: [0, -20],
          z: 501
        }
      ];
    },
    // 初始化图表
    initChart() {
      this.chart = echarts.init(this.$refs.Map);

      this.chart.on("click", (params) => {
        // 这里做了限制，仅可下钻一级，如果有地级市的下属区域数据，可以改造这个方法
        if (this.mapKey === this.area && !params.data) {
          this.mapKey = params.name;
          this.ifShowButton = true;
          const otherCity = this.mapData.filter(
            (item) => this.mapKey.indexOf(item.county) != -1
          );
          this.convertMapOption(otherCity, this.mapKey);
          this.getGeoJson().then(() => this.refreshChart());
        }
      });
    },

    // 绘制图表
    refreshChart() {
      if (!this.chart) return false;
      setTimeout(() => {
        this.chart.setOption(this.baseOption || {}, true);
      }, 500);
      // 添加根据视口缩放重绘功能
      if (this.lazyResize) {
        window.onresize = () => {
          setTimeout(() => {
            this.chart.resize();
          }, this.lazyResize);
        };
      }
    },

    // 根据 mapKey 获取 JSON 数据
    getGeoJson() {
      // 这个方法封装在 一个 util.js 文件，可以参考接下来的一段代码
      const sxsResult = sxs[this.area];
      const mapInfo = mapPath[sxsResult.filePath][this.mapKey];
      return new Promise((resolve, reject) => {
        if (mapInfo instanceof Object) {
          if (mapInfo.registered) {
            resolve(this.mapKey);
            return this.mapKey;
          }
        } else {
          return false;
        }

        if (mapInfo instanceof Object && mapInfo.key) {
          const url = `/static/json/${sxsResult.filePath}/${mapInfo.filePath}.json`;
          getJson(url)
            .then((res) => {
              echarts.registerMap(this.mapKey, res.data);
              mapInfo.registered = true;
              resolve(this.mapKey);
              return this.mapKey;
            })
            .catch((error) => {
              throw error;
            });
        } else {
          reject(false);
          return false;
        }
      });
    },

    async restoreChart() {
      this.chart = null;
      this.baseOption = null;
      const sxsResult = sxs[this.area];
      this.mapKey = sxsResult.name;
      await this.getGeoJson();
      let allCity;
      if (this.mapKey != this.area) {
        allCity = this.mapData.filter(
          (item) => this.mapKey.indexOf(item.county) != -1
        );
      } else {
        allCity = this.mapData;
      }

      this.convertMapOption(allCity, this.mapKey);
      this.initChart();
      this.refreshChart();
    }
  }
};
</script>
<style></style>
