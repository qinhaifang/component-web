const defaultSettings = require("@/config/config.base");

const title = defaultSettings.title || "Vue Element Admin";

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
