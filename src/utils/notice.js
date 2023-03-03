import { Loading, MessageBox } from "element-ui";
import { zdymessage, zdyNotify } from "./message";
/**
 * @param {消息类型} type
 * @param {消息内容} msg
 * @param {是否显示关闭按钮} showClose
 * @param {显示时间, 毫秒。设为 0 则不会自动关闭} duration
 * @param {文字是否居中} center
 * @param {自定义图标的类名} iconClass
 * @param {自定义类名} customClass
 * @param {Message 距离窗口顶部的偏移量} offset
 * @param {关闭时的回调函数} onClose
 * @param {是否将 message 属性作为 HTML 片段处理} dangerouslyUseHTMLString
 *
 */
export const message = (msgConfig) => {
  const {
    type,
    msg,
    showClose,
    duration,
    center,
    iconClass,
    offset,
    dangerouslyUseHTMLString,
    onClose,
  } = msgConfig || {};
  zdymessage({
    message: msg || "消息",
    type: type || "info",
    offset: offset || 60,
    duration: duration != 0 ? (duration ? duration : 2000) : 0,
    showClose: showClose || false,
    center: center || false,
    iconClass: iconClass || "",
    customClass: "hl-message",
    dangerouslyUseHTMLString: dangerouslyUseHTMLString || true,
    onClose: () => {
      if (onClose) {
        onClose();
      }
    },
  });
};
/**
 *
 * @param {通知标题} title
 * @param {通知状态} type
 * @param {通知内容} msg
 * @param {是否显示关闭按钮} showClose
 * @param {显示时间, 毫秒。设为 0 则不会自动关闭} duration
 * @param {自定义弹出位置} position
 * @param {自定义类名} customClass
 * @param {Message 距离窗口顶部的偏移量} offset
 * @param {关闭时的回调函数} onClose
 * @param {点击 Notification 时的回调函数} onClickFun
 * @param {是否将 message 属性作为 HTML 片段处理} dangerouslyUseHTMLString
 */
export const notify = (notifyConfig) => {
  const {
    title,
    type,
    msg,
    showClose,
    duration,
    position,
    iconClass,
    offset,
    dangerouslyUseHTMLString,
    onClose,
    onClickFun,
  } = notifyConfig;
  zdyNotify({
    title: title || "通知",
    message: msg || "通知",
    type: type || "success",
    offset: offset || 60,
    duration: duration != 0 ? (duration ? duration : 4500) : 0,
    showClose: showClose || true,
    position: position || "top-right",
    iconClass: iconClass || "",
    customClass: "hl-notify",
    dangerouslyUseHTMLString: dangerouslyUseHTMLString || true,
    onClose: () => {
      if (onClose) {
        onClose();
      }
    },
    onClick: () => {
      if (onClickFun) {
        onClickFun();
      }
    },
  });
};
/**
 *
 * @param {显示在加载图标下方的加载文案} msg
 * @param {Loading 需要覆盖的 DOM 节点。可传入一个 DOM 对象或字符串；若传入字符串，则会将其作为参数传入 document.querySelector以获取到对应 DOM 节点} target
 * @param {同 v-loading 指令中的 body 修饰符} body
 * @param {同 v-loading 指令中的 fullscreen 修饰符} fullscreen
 * @param {同 v-loading 指令中的 lock 修饰符} lock
 * @param {自定义加载图标类名} spinner
 * @param {遮罩背景色} background
 * @param {Loading 的自定义类名} customClass
 */
export const loading = (loadConfig) => {
  const {
    msg,
    background,
    target,
    body,
    fullscreen,
    lock,
    spinner,
    customClass,
  } = loadConfig || {};
  Loading.service({
    background: background || "rgba(0, 0, 0, 0.7)",
    text: msg || "加载中...",
    spinner: spinner,
    customClass: customClass || "gifLoading",
  });
  // closeLoading();
};
/**
 *
 * @param {消息正文内容} msg
 * @param {标题} title
 * @param {消息类型，用于显示图标} type
 * @param {自定义图标的类名，会覆盖 type} iconClass
 * @param {自定义类名} customClass
 *  * @param {是否将 message 属性作为 HTML 片段处理} dangerouslyUseHTMLString
 * @param {是否显示右上角关闭按钮} showClose
 * @param {若不使用 Promise，可以使用此参数指定 MessageBox 关闭后的回调} callback
 * @param {关闭前的回调，会暂停实例的关闭} beforeClose
 * @param {是否将取消（点击取消按钮）与关闭（点击关闭按钮或遮罩层、按下 ESC 键）进行区分} distinguishCancelAndClose
 * @param {是否在 MessageBox 出现时将 body 滚动锁定} lockScroll
 * @param {是否显示确定按钮} isConfirmBtn
 * @param {是否显示取消按钮} isCancelBtn
 * @param {确认按钮文字} btn1
 * @param {取消按钮文字} btn2
 * @param {确定按钮的自定义类名} confirmButtonClass
 * @param {取消按钮的自定义类名} cancelButtonClass
 * @param {是否可通过点击遮罩关闭 MessageBox} closeOnClickModal
 * @param {是否可通过按下 ESC 键关闭 MessageBox} closeOnPressEscape
 * @param {是否在 hashchange 时关闭 MessageBox} closeOnHashChange
 * @param {是否显示输入框} showInput
 * @param {输入框的占位符} inputPlaceholder
 * @param {输入框的类型} inputType
 * @param {输入框的初始文本} inputValue
 * @param {输入框的校验表达式} inputPattern
 * @param {输入框的校验函数。可以返回布尔值或字符串，若返回一个字符串, 则返回结果会被赋值给 inputErrorMessage} inputValidator
 * @param {输入框的校验表达式} inputErrorMessage
 * @param {是否居中布局} center
 * @param {是否使用圆角按钮} roundButton
 */
export const alert = (alertConfig) => {
  const {
    msg,
    title,
    type,
    isConfirmBtn,
    isCancelBtn,
    btn1,
    btn2,
    showClose,
    beforeClose,
    onClose,
    lockScroll,
    dangerouslyUseHTMLString,
    cancelButtonClass,
    confirmButtonClass,
    closeOnClickModal,
    closeOnPressEscape,
    showInput,
    inputPlaceholder,
    inputType,
    inputValue,
    inputPattern,
    inputValidator,
    inputErrorMessage,
    center,
    roundButton,
  } = alertConfig || {};
  // return new Promise((resove, reject) => {
  MessageBox.alert(msg, title, {
    showClose: showClose,
    showConfirmButton: isConfirmBtn,
    showCancelButton: isCancelBtn,
    cancelButtonText: btn1 || "取消",
    confirmButtonText: btn2 || "确认",
    type: type || "info ",
    lockScroll: lockScroll,
    cancelButtonClass: cancelButtonClass,
    confirmButtonClass: confirmButtonClass,
    closeOnClickModal: closeOnClickModal,
    closeOnPressEscape: closeOnPressEscape,
    dangerouslyUseHTMLString: dangerouslyUseHTMLString || true,
    showInput: showInput,
    inputPlaceholder: inputPlaceholder || "请输入",
    inputType: inputType,
    inputValue: inputValue,
    inputPattern: inputPattern,
    inputValidator: inputValidator,
    inputErrorMessage: inputErrorMessage,
    center: center,
    customClass: "hl-messageBox",
    roundButton: roundButton,
    callback: (action) => {
      if (onClose) {
        onClose();
      }
    },
  });
};
/**
 *
 * @param {自定义确认框内容} msg
 */
export const confirm = (confirmConfig) => {
  const { msg, title, iconClass, type, btn, cal, onSubmit, onClose, params } =
    confirmConfig;
  return new Promise((resove, reject) => {
    MessageBox.confirm(msg, title, {
      cancelButtonText: cal,
      confirmButtonText: btn,
      type: type || "warning",
      iconClass: iconClass || "",
      customClass: "hl-messageBox",
    })
      .then(() => {
        if (onSubmit) onSubmit(params);
        else resove();
      })
      .catch((error) => {
        if (onClose) onClose(error);
        else reject(error);
      });
  });
};
/**
 *
 * @param {关闭弹框内容} msg
 */
export const closeLoading = (msg) => {
  const loading = Loading.service({
    background: "rgba(0, 0, 0, 0.7)",
  });
  setTimeout(() => {
    loading.close();
  }, 500);
};
