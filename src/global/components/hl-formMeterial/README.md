# form配置
 # [
        {
          name: "stationName",
          label: "场站名称",
          linkedData: "stationId",
          linkedTowEventUrl: {
            //关联数据参数、和接口路劲
            params: "id",
            url: "/resource/mgmt/station/findAll",
            option: [
              { returnData: "stationTypeId", setData: "stationTypeId" },
              { returnData: "groupName", setData: "groupName" },
              { returnData: "stationType", setData: "stationType" },
              { returnData: "regionVOList", setData: "regionVOList" },
              {
                returnData: "equNameVOList",
                setData: "equNameVOList",
                specialData: true,
              },
            ],
          },
          width: 1,
          type: "autocomplete",
          url: "/resource/mgmt/station/findAllName",
          option: { label: "id", value: "stationName" },
          rules: [
            { required: true, message: "请输入场站名称", trigger: "change" },
            {
              max: 20,
              message: "最大输入长度为20个字符",
              trigger: "blur",
            },
          ],
        },
        {
          name: "stationTypeId",
          label: "场站类型",
          width: 1,
          url: "/resource/mgmt/station/findAllType",
          type: "selectUrl",
          option: { label: "stationTypeName", value: "id" },
        },
        {
          name: "regionVOList",
          label: "所属地区",
          type: "area",
          width: 1,
        },
        {
          name: "groupName",
          label: "所属集团",
          type: "input",
          width: 1,
        },
        {
          name: "faultTime",
          label: "故障时间",
          type: "date",
          width: 1,
          formDate: "datetime",
          valueFormat: "yyyy-MM-dd HH:mm",
          rules: [
            { required: true, message: "请选择故障时间", trigger: "blur" },
          ],
        },
        {
          name: "useTime",
          label: "投运时间",
          type: "date",
          formDate: "datetime",
          width: 1,
          valueFormat: "yyyy-MM-dd HH:mm",
          rules: [
            { required: true, message: "请选择投运时间", trigger: "blur" },
          ],
        },
        {
          name: "equNameVOList",
          label: "失电范围",
          type: "selectData",
          multiple: true,
          option: { label: "equName", value: "id" },
          width: 1,
          rules: [
            { required: true, message: "请输入失电范围", trigger: "blur" },
          ],
        },
        {
          name: "stopType",
          label: "停运原因",
          type: "select",
          width: 1,
          option: [
            { label: "故障跳闸", value: 1 },
            { label: "临停消缺", value: 2 },
          ],
          rules: [
            { required: true, message: "请选择停运原因", trigger: "blur" },
          ],
        },
        {
          name: "installedCapacity",
          label: "停电装机容量",
          type: "input",
          width: 1,
          rules: [
            { required: true, message: "请输入停电装机容量", trigger: "blur" },
          ],
        },
        {
          name: "sumInstalledCapacity",
          label: "总装机容量",
          type: "input",
          width: 1,
          rules: [
            { required: true, message: "请输入总装机容量", trigger: "blur" },
          ],
        },
        {
          name: "powerFailureDuration",
          label: "折算全场停电时长",
          type: "input",
          width: 1,
          rules: [
            {
              required: true,
              message: "请输入折算全场停电时长",
              trigger: "blur",
            },
          ],
        },
        {
          name: "powerLossDuration",
          label: "失电时长",
          type: "input",
          width: 1,
          rules: [
            { required: true, message: "请输入失电时长", trigger: "blur" },
          ],
        },
        {
          name: "faultReason",
          label: "故障原因",
          type: "textarea",
          rules: [
            { required: true, message: "请输入故障原因", trigger: "blur" },
          ],
        },
      ],