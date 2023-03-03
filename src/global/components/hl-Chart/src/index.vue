<template>
  <div class="hlChart" :style="{ width: width, height: height }">
    <div class="titleBlock" v-if="title">
      <div class="title">{{ title }}</div>
      <div class="extraOperate">
        <slot name="extraOperate"></slot>
      </div>
    </div>
    <div class="chartBlock">
      <div :id="chartId"></div>
      <!-- <img :src="noDataImage" alt="" /> -->
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";

export default {
  name: "hlChart",
  props: {
    width: {
      type: String,
      default: "560px"
    },
    height: {
      type: String,
      default: "376px"
    },
    title: {
      type: String,
      default: ""
    },
    chartConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chartId: this.getUuid(),
      chart: null,
      noDataImage: require("./notData.png")
    };
  },
  watch: {
    chartConfig: {
      handler(v) {
        this.chart.setOption(this.initChartOption(), true);
      },
      deep: true
    }
  },
  mounted() {
    this.initChart();
  },
  beforeDestroy() {
    this.chart.dispose();
  },
  methods: {
    getUuid() {
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = "-";
      return s.join("");
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.chartId));
      this.chart.setOption(this.initChartOption(), true);
      window.addEventListener("resize", () => {
        this.chart.resize();
      });

      this.chart.on("click", (params) => {
        const { onClick } = this.chartConfig;
        if (onClick) {
          onClick(params);
        }
      });
    },
    initChartOption() {
      let chartOption = {};
      const {
        color = [
          "#5470c6",
          "#91cc75",
          "#fac858",
          "#ee6666",
          "#73c0de",
          "#3ba272",
          "#fc8452",
          "#9a60b4",
          "#ea7ccc"
        ],
        gridParams = null, //直角坐标系
        radar = null, //雷达图坐标系
        legendParams = null,
        tooltipParams = null,
        xAxisParams = null,
        yAxisParams = null,
        visualMap = null,
        dataZoomParams = null,
        seriesParams = []
      } = this.chartConfig;
      //常规选项设置
      Object.assign(chartOption, {
        // color: this.colorOption(color),
        grid: this.gridOption(gridParams),
        radar: radar && this.radarOption(radar),
        legend: this.legendOption(legendParams),
        tooltip: this.tooltipOption(tooltipParams),
        visualMap: visualMap && this.visualMapOption(visualMap),
        dataZoom: dataZoomParams && this.dataZoomOption(dataZoomParams),
        series: this.seriesOption(seriesParams)
      });
      //雷达图含xAxis、yAxis会报错,且无法通过show: false来屏蔽
      if (seriesParams.every((item) => item.type !== "radar")) {
        Object.assign(chartOption, {
          xAxis: this.xAxisOption(xAxisParams),
          yAxis: this.yAxisOption(yAxisParams)
        });
      }
      return chartOption;
    },
    colorOption(excessParams) {
      return excessParams;
    },
    gridOption(excessParams) {
      return this.deepObjectMerge(
        {
          top: 30,
          bottom: 0,
          left: 10,
          right: 0,
          containLabel: true
        },
        excessParams
      );
    },
    radarOption(excessParams) {
      return this.deepObjectMerge(
        {
          center: ["50%", "50%"],
          radius: "70%",
          startAngle: 90,
          splitNumber: 4,
          shape: "circle",
          splitArea: {
            areaStyle: {
              color: ["transparent"]
            }
          },
          axisLabel: {
            show: false,
            fontSize: 18,
            color: "#fff",
            fontStyle: "normal",
            fontWeight: "normal"
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#000" //
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#ccc" //
            }
          }
        },
        excessParams
      );
    },
    legendOption(excessParams) {
      return this.deepObjectMerge(
        {
          show: false,
          top: 0,
          right: 0,
          orient: "horizontal",
          itemGap: 14,
          icon: "rect",
          itemWidth: 8,
          itemHeight: 8,
          textStyle: {
            color: "#666666"
          }
        },
        excessParams
      );
    },
    tooltipOption(excessParams) {
      return this.deepObjectMerge(
        {
          show: true,
          trigger: "axis",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderColor: "#fff"
        },
        excessParams
      );
    },
    xAxisOption(excessParams) {
      return this.deepObjectMerge(
        {
          show: true,
          type: "category",
          //坐标轴轴线
          axisLine: { lineStyle: { color: "#BFBFBF" } },
          //坐标轴刻度
          axisTick: { show: false },
          //坐标轴标签
          axisLabel: {
            color: "#666666",
            fontSize: 12,
            interval: "auto"
          }
        },
        excessParams
      );
    },
    yAxisOption(excessParams) {
      return this.deepObjectMerge(
        {
          show: true,
          name: "数量",
          nameLocation: "end",
          nameTextStyle: { align: "right", padding: [0, 5, 0, 0] },
          type: "value",
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: true, lineStyle: { color: "#D9D9D9" } },
          axisLabel: { color: "#666666", fontSize: 12 }
        },
        excessParams
      );
    },
    visualMapOption(excessParams) {
      return excessParams;
    },
    dataZoomOption(excessParams) {
      const excessInsideParams =
        excessParams.filter((item) => item.type === "inside")[0] || null;
      const excessSliderParams =
        excessParams.filter((item) => item.type === "slider")[0] || null;
      return [
        this.deepObjectMerge(
          {
            type: "inside",
            disabled: true
          },
          excessInsideParams
        ),
        this.deepObjectMerge(
          {
            type: "slider",
            show: false,
            backgroundColor: "#FFFFFF",
            dataBackground: {
              lineStyle: {
                color: "#D4D4D4",
                width: 2
              },
              areaStyle: {
                color: "#D4D4D4",
                opacity: 0.5
              }
            },
            fillerColor: "rgba(16,216,159,0.4)",
            borderColor: "#11D9A0",
            handleIcon:
              "M-9.35,34.56V42m0-40V9.5m-2,0h4a2,2,0,0,1,2,2v21a2,2,0,0,1-2,2h-4a2,2,0,0,1-2-2v-21A2,2,0,0,1-11.35,9.5Z",
            handleSize: 30,
            handleStyle: {
              color: "#fff"
            },
            height: 25,
            left: 130,
            right: 130,
            bottom: 10,
            textStyle: {
              color: "#333"
            }
          },
          excessSliderParams
        )
      ];
    },
    seriesOption(excessParams) {
      return excessParams;
    },
    //深度合并对象
    deepObjectMerge(sourceObj, targetObj) {
      for (var key in targetObj) {
        sourceObj[key] =
          sourceObj[key] && sourceObj[key].toString() === "[object Object]"
            ? this.deepObjectMerge(sourceObj[key], targetObj[key])
            : targetObj[key];
      }
      return sourceObj;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../theme-chalk/src/common/var.scss";
div.hlChart {
  background: rgba(183, 134, 43, 0.1);
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  div.titleBlock {
    height: 20px;
    line-height: 20px;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: bold;
    color: #65789b;
    display: flex;
    justify-content: space-between;
  }
  div.chartBlock {
    flex: 1;
    width: 100%;
    position: relative;
    > div {
      width: 100%;
      height: 100%;
    }
    > img {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 15%;
    }
  }
}
</style>
