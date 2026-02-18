// i18n 配置入口
import { zhCN, type Translations } from "./zh-CN";

// 当前语言（默认中文）
const currentLocale = "zh-CN";

// 获取翻译
export const t = zhCN;

// 语言类型
export type { Translations };

// 获取当前语言
export const getLocale = () => currentLocale;

// 切换语言（预留扩展）
export const setLocale = (locale: string) => {
  // 预留：未来可扩展多语言切换
  console.log(`Locale set to: ${locale}`);
};
