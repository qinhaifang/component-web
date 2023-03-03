import { Message, Notification } from "element-ui"; // 引入message

let messageInstance = null;
const resetMessage = (options) => {
  if (messageInstance) {
    messageInstance.close(); //关闭
  }
  messageInstance = Message(options);
};
["error", "success", "info", "warning"].forEach((type) => {
  resetMessage[type] = (options) => {
    if (typeof options === "string") {
      options = {
        message: options,
      };
    }
    options.type = type;
    return resetMessage(options);
  };
});
export const zdymessage = resetMessage;

let notifyInstance = null;
const resetNotify = (options) => {
  if (notifyInstance) {
    notifyInstance.close(); //关闭
  }
  notifyInstance = Notification(options);
};
["error", "success", "info", "warning"].forEach((type) => {
  resetNotify[type] = (options) => {
    if (typeof options === "string") {
      options = {
        message: options,
      };
    }
    options.type = type;
    return resetNotify(options);
  };
});
export const zdyNotify = resetNotify;
