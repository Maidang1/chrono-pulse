import Taro from '@tarojs/taro'

export type ActualTheme = 'light' | 'dark'

// 获取系统主题
export const getSystemTheme = (): ActualTheme => {
  try {
    const systemInfo = Taro.getSystemInfoSync()
    // 微信小程序通过 theme 字段获取系统主题
    return (systemInfo as any).theme === 'dark' ? 'dark' : 'light'
  } catch (error) {
    console.warn('获取系统主题失败:', error)
    return 'light'
  }
}

