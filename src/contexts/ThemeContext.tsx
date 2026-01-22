import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import Taro from '@tarojs/taro'
import {
  ThemeMode,
  ActualTheme,
  getUserThemePreference,
  setUserThemePreference,
  resolveActualTheme,
  applyCSSVariables
} from '../utils/theme'

// 声明全局函数
declare const getApp: () => any

interface ThemeContextType {
  themeMode: ThemeMode
  actualTheme: ActualTheme
  setThemeMode: (mode: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system')
  const [actualTheme, setActualTheme] = useState<ActualTheme>('light')

  // 更新实际主题
  const updateActualTheme = (mode: ThemeMode) => {
    const resolved = resolveActualTheme(mode)
    setActualTheme(resolved)
    applyCSSVariables(resolved)

    // 在微信小程序中，我们通过设置全局数据来控制主题
    try {
      // 使用 Taro 的方式获取 app 实例
      if (typeof getApp !== 'undefined') {
        const app = getApp()
        if (app) {
          app.globalData = app.globalData || {}
          app.globalData.isDarkMode = resolved === 'dark'
        }
      }
    } catch (error) {
      console.warn('设置全局主题状态失败:', error)
    }
  }

  // 设置主题模式
  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode)
    setUserThemePreference(mode)
    updateActualTheme(mode)
  }

  // 切换主题（在 light/dark 之间切换）
  const toggleTheme = () => {
    const newMode = actualTheme === 'light' ? 'dark' : 'light'
    setThemeMode(newMode)
  }

  // 监听系统主题变化
  useEffect(() => {
    // 初始化主题
    const savedMode = getUserThemePreference()
    setThemeModeState(savedMode)
    updateActualTheme(savedMode)

    // 监听系统主题变化
    const handleThemeChange = (res: any) => {
      console.log('系统主题变化:', res.theme)
      // 只有在用户设置为跟随系统时才响应系统主题变化
      if (themeMode === 'system') {
        updateActualTheme('system')
      }
    }

    // 微信小程序监听主题变化
    try {
      if (Taro.onThemeChange) {
        Taro.onThemeChange(handleThemeChange)
      }
    } catch (error) {
      console.warn('不支持主题变化监听:', error)
    }

    // 清理函数
    return () => {
      try {
        if (Taro.offThemeChange) {
          Taro.offThemeChange(handleThemeChange)
        }
      } catch (error) {
        console.warn('移除主题变化监听失败:', error)
      }
    }
  }, [themeMode])

  const contextValue: ThemeContextType = {
    themeMode,
    actualTheme,
    setThemeMode,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  )
}

// 自定义 Hook
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}