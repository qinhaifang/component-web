import {
  getWeekStartDates,
  getWeekEndDates,
  getMonthStartDate,
  getMonthEndDate,
} from "@/utils/formatDate";
var shortcuts = [
  {
    text: "最近一周",
    name: "latelyWeek",
    onClick(picker) {
      // const end = new Date();
      // const start = new Date();
      // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      //  picker.$emit('pick', [start, end]);
      picker.$emit("pick", [getWeekStartDates(), getWeekEndDates()]);
    },
  },
  {
    text: "最近一个月",
    name: "latelyOneMonth",
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit("pick", [start, end]);
    },
  },
  {
    text: "最近三个月",
    name: "latelyThreeMonth",
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit("pick", [start, end]);
    },
  },
];
export { shortcuts };
