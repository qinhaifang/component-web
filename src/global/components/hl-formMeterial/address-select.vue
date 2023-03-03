/* * @Author: zhuangmw * @Email: zhuangmw@hxmec.com * @Date: 2020-06-10 16:31:27 * @Last Modified
by: zhuangmw * @Last Modified time: 2020-08-28 10:53:33 * @Description: 地址选择器 */
<template>
  <div>
    <div v-if="!readonly">
      <el-select
        ref="province"
        v-model="value[provinceField]"
        class="areaField-select"
        placeholder="选择省"
        @change="addressSelect(provinceField, $event)"
      >
        <el-option
          v-for="item in provinceOptions"
          :key="item.value"
          :label="setMaterialOptionsLabelByConfig(item, 'label')"
          :value="setMaterialOptionsLabelByConfig(item, 'value')"
        />
      </el-select>
      <el-select
        ref="city"
        v-model="value[cityField]"
        class="areaField-select"
        placeholder="选择市"
        @change="addressSelect(cityField, $event)"
      >
        <el-option
          v-for="item in cityOptions"
          :key="item.value"
          :label="setMaterialOptionsLabelByConfig(item, 'label')"
          :value="setMaterialOptionsLabelByConfig(item, 'value')"
        />
      </el-select>
      <el-select
        ref="area"
        v-model="value[areaField]"
        class="areaField-select"
        placeholder="选择区/县"
        @change="addressSelect(areaField, $event)"
      >
        <el-option
          v-for="item in areaOptions"
          :key="item.value"
          :label="setMaterialOptionsLabelByConfig(item, 'label')"
          :value="setMaterialOptionsLabelByConfig(item, 'value')"
        />
      </el-select>
      <el-input
        v-model="value[addressField]"
        placeholder="请输入街道门牌号，如：海沧达到669号"
        class="areaField-input"
      />
    </div>
    <div v-else>
      {{ readonlyFormatter }}
    </div>
  </div>
</template>

<script>
export default {
  name: "hlAddressSelect",
  props: {
    materialConfig: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: Object,
      default: () => ({}),
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      provinceOptions: [],
      regionData:[],
      CodeToText:[],
      TextToCode:[],
      cityOptions: [],
      areaOptions: [],
      provinceField: "provinceId", // 省份的字段
      cityField: "cityId", // 市的字段
      areaField: "areaId", // 区，县的字段
      addressField: "addressField", // 详细地址
      provinceSelectedLabel: "", // 省份的选择结果
      citySelectedLabel: "", // 市的选择结果
      areaSelectedLabel: "", // 区的选择结果
    };
  },
  computed: {
    readonlyFormatter() {
      const formatter = [
        this.provinceSelectedLabel,
        this.citySelectedLabel,
        this.areaSelectedLabel,
        this.value[this.addressField],
      ].join(this.materialConfig.separator || "-");
      return formatter;
    },
  },
  watch: {
    value() {
      this.initFlow();
    },
  },
  mounted() {
     import('element-china-area-data').then(module=>{
       const {regionData, CodeToText, TextToCode} = module
       this.regionData = regionData
       this.CodeToText = CodeToText
       this.TextToCode = TextToCode
       this.initFlow();
    })
  },
  methods: {
    initFlow() {
      const { extraFields } = this.materialConfig; // 自定义各个选择框的字段
      if (extraFields && Array.isArray(extraFields)) {
        [
          this.provinceField,
          this.cityField,
          this.areaField,
          this.addressField,
        ] = extraFields;
      }

      this.provinceOptions = this.regionData;
      if (this.value[this.provinceField]) {
        this.provinceSelectedLabel = this.selectedLabelFilter(
          this.value[this.provinceField],
          this.provinceOptions
        );
      }
      if (this.value[this.cityField]&&this.value[this.provinceField]) {
        cityResult = this.provinceSelectedLabel.find(
          (item) => item.value === this.value[this.provinceField]
        );
        if(cityResult){
          this.cityOptions = cityResult.children;
          this.citySelectedLabel = this.selectedLabelFilter(
            this.value[this.cityField],
            this.cityOptions
          );
        }
      }
      if (this.value[this.areaField] && this.value[this.cityField]&&this.value[this.provinceField]) {
        if(cityResult){
          areaOptionsResult = this.cityOptions.find(
            (item) => item.value === this.value[this.cityField]
          );
          if(areaOptionsResult){
             this.areaOptions = areaOptionsResult.children
             this.areaSelectedLabel = this.selectedLabelFilter(
                this.value[this.areaField],
                this.areaOptions
              );
          }
         
        }
      }
    },
    addressSelect(field, target) {
      const val = String(target);
      if (field === this.provinceField) {
        this.$set(this.value, this.cityField, '')
        this.$set(this.value, this.areaField, '')
        this.$set(this.value, this.addressField, '')
       const cityResult = this.provinceOptions.find(
          (item) => item.value === val
        );
        if(cityResult){
          this.cityOptions = cityResult.children;
        }

      } else if (field === this.cityField) {
        this.citySelectedLabel = this.selectedLabelFilter(val, this.cityOptions)
        this.$set(this.value, this.areaField, '')
        this.$set(this.value, this.addressField, '')
        const  areaSelectedLabelResult = this.cityOptions.find(
          (item) => item.value === val
        );
        if(areaSelectedLabelResult){
          this.areaOptions = areaSelectedLabelResult.children;
        }
        
      } else if (field === this.areaField) {
        this.value[this.addressField] = ''
      }
    },
    /**
     * @Description 根据配置的属性获取数据对象的值
     * @params [Object] obj 数据对象
     * @params [String] key 配置的属性值
     */
    setMaterialOptionsLabelByConfig(obj, key) {
      const { props, type, valueObj } = this.materialConfig;
      // 针对select多选时值为选中的整个数据对象
      if (type === "select" && key === "value" && valueObj) {
        return obj;
      }
      if (props && props[key]) {
        return obj[props[key]];
      }
      return obj[key];
    },
    selectedLabelFilter(targetId, options) {
      const { props } = this.materialConfig;
      const { label, value } = props||{};
      const target = options.find((item) => {
        if (item[value||'value'] === targetId) {
          return true;
        }
        return false;
      });
      if (target) {
        return target[label||'label'];
      }
      return "";
    },
  },
};
</script>
