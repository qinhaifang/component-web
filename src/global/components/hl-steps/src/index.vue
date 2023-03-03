<template>
  <div :class="[ 'hl-steps', stepsConfig.direction ]">
    <template v-for="(item, index) in stepsConfig.data">
      <div :class="[ 'subItem', setStatusClass(index) ]">
        <div class="circle">
          <span
            class="triangle iconfont iconxialasmall"
            v-if="stepsConfig.direction === 'horizontal' && stepsConfig.active === index">
          </span>
          <span class="num">{{ index + 1 }}</span>
          <span
            :class="[ 'status', item.processStatus ]"
            v-if="item.processStatus === 'success' || item.processStatus === 'error'">
            <i class="iconfont iconyitianjia" v-if="item.processStatus === 'success'"></i>
            <i class="iconfont iconhuitui" v-if="item.processStatus === 'error'"></i>
          </span>
        </div>
        <div class="title">
          <span>{{ item.name }}</span>
          <div class="description">
            <span>{{ item.description }}</span>
          </div>
        </div>
      </div>
      <div
        :class="[ 'line', setStatusClass(index) ]"
        v-if="index !== stepsConfig.data.length - 1"
      >
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: "hlSteps",
  props: {
    stepsConfig: {
      type: Object,
      default: [],
    },
  },
  data() {
    return {

    };
  },
  mounted() {

  },
  methods: {
    setStatusClass(index) {
      if ( index < this.stepsConfig.active ) {
        return "pend";
      } else if ( index === this.stepsConfig.active ) {
        return "pending";
      } else {
        return "notStart";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.hl-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  //水平样式
  &.horizontal {
    height: 24px;
    flex-direction: row;
    div.line {
      height: 1px;
      margin: 0 16px;
      margin-top: 12px;
    }
  }
  //垂直样式
  &.vertical {
    min-height: 300px;
    flex-direction: column;
    div.line {
      width: 1px;
      margin: 16px 0;
      margin-left: 12px;
    }
  }
  >div.line {
    flex: 1;
    &.pend {
      border: 1px solid #24B563;
    }
    &.pending {
      border: 1px solid #008CF9;
    }
    &.notStart {
      border: 1px solid #DCDCDC;
    }
  }
  >div.subItem {
    height: 24px;
    &.pend {
      >div.circle {
        background: #24B563;
        border: 1px solid #24B563;
        span.num {
          color: #ffffff;
        }
      }
      >div.title {
        > span {
          color: #24B563;
        }
      }
    }
    &.pending {
      >div.circle {
        background: #ffffff;
        border: 1px solid #008CF9;
        span.num {
          color: #008CF9;
        }
      }
      >div.title {
        > span {
          color: #008CF9;
        }
      }
    }
    &.notStart {
      >div.circle {
        background: #ffffff;
        border: 1px solid #B4B4B4;
        span.num {
          color: #B4B4B4;
        }
      }
      >div.title {
        > span {
          color: #B4B4B4;
        }
      }
    }
    >div.circle {
      position: relative;
      width: 24px;
      height: 24px;
      border: 1px solid #000;
      line-height: 22px;
      text-align: center;
      border-radius: 50%;
      margin-right: 16px;
      float: left;
      span.triangle {
        position: absolute;
        top: -18px;
        left: 2px;
        z-index: 100;
        font-size: 12px;
        color: #008CF9;
      }
      span.status {
        position: absolute;
        bottom: -1px;
        left: 15px;
        width: 12px;
        height: 12px;
        text-align: center;
        line-height: 8px;
        border-radius: 50%;
        display: block;
        background: #ffffff;
        i {
          color: #fff;
          font-size: 10px;
        }
        &.success {
          background: #2ECE73;
        }
        &.error {
          background: #FA6600;
        }
      }
    }
    >div.title {
      height: 24px;
      line-height: 24px;
      font-size: 16px;
      font-weight: 500;
      float: left;
      position: relative;
      >div.description {
        position: absolute;
        left: 0;
        bottom: -26px;
        white-space: nowrap;
        span {
          height: 22px;
          line-height: 22px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(0,0,0,0.40);
          text-align: left;
        }
      }
    }
  }
}
</style>
