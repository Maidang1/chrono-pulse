import Taro from '@tarojs/taro'

// 声明全局函数
declare const getApp: () => any

export type ThemeMode = 'light' | 'dark' | 'system'
export type ActualTheme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme_preference'

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

// 获取用户偏好主题
export const getUserThemePreference = (): ThemeMode => {
  try {
    const stored = Taro.getStorageSync(THEME_STORAGE_KEY)
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored as ThemeMode
    }
  } catch (error) {
    console.warn('读取主题偏好失败:', error)
  }
  return 'system'
}

// 保存用户偏好主题
export const setUserThemePreference = (theme: ThemeMode): void => {
  try {
    Taro.setStorageSync(THEME_STORAGE_KEY, theme)
  } catch (error) {
    console.error('保存主题偏好失败:', error)
  }
}

// 根据偏好和系统主题计算实际主题
export const resolveActualTheme = (preference: ThemeMode): ActualTheme => {
  if (preference === 'system') {
    return getSystemTheme()
  }
  return preference
}

// CSS 变量定义 (保留用于其他可能的用途)
export const lightThemeVars = {
  '--color-bg-primary': '#f5f5f0',
  '--color-bg-secondary': '#ffffff',
  '--color-text-primary': '#1a1a1a',
  '--color-text-secondary': '#4a4a4a',
  '--color-text-muted': '#888888',
  '--color-accent': '#f6821f',
  '--color-border': '#1a1a1a',
  '--color-border-light': '#dcdcdc',
  '--color-danger': '#f4333c',
}

export const darkThemeVars = {
  '--color-bg-primary': '#0f0f0f',
  '--color-bg-secondary': '#1a1a1a',
  '--color-text-primary': '#ffffff',
  '--color-text-secondary': '#cccccc',
  '--color-text-muted': '#888888',
  '--color-accent': '#ff8c42',
  '--color-border': '#333333',
  '--color-border-light': '#2a2a2a',
  '--color-danger': '#ff6b6b',
}

// 应用 CSS 变量
export const applyCSSVariables = (theme: ActualTheme): void => {
  const vars = theme === 'dark' ? darkThemeVars : lightThemeVars

  try {
    // 在微信小程序中，我们需要通过其他方式应用 CSS 变量
    // 这里我们将变量存储到全局状态中，供组件使用
    if (typeof getApp !== 'undefined') {
      const app = getApp()
      if (app) {
        app.globalData = app.globalData || {}
        app.globalData.themeVars = vars
        app.globalData.currentTheme = theme
      }
    }
  } catch (error) {
    console.error('应用 CSS 变量失败:', error)
  }
}