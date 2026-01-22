import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import Taro from '@tarojs/taro'
import { ActualTheme, getSystemTheme } from '../utils/theme'

interface ThemeContextType {
  actualTheme: ActualTheme
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [actualTheme, setActualTheme] = useState<ActualTheme>('light')

  // 更新实际主题
  const updateActualTheme = () => {
    const systemTheme = getSystemTheme()
    setActualTheme(systemTheme)
  }

  // 监听系统主题变化
  useEffect(() => {
    // 初始化主题
    updateActualTheme()

    // 监听系统主题变化
    const handleThemeChange = (res: any) => {
      console.log('系统主题变化:', res.theme)
      updateActualTheme()
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
  }, [])

  const contextValue: ThemeContextType = {
    actualTheme
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