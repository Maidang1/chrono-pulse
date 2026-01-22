import React from 'react'
import { View, Button } from '@tarojs/components'
import { useTheme } from '../hooks/useTheme'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { actualTheme, toggleTheme } = useTheme()

  const handleToggle = () => {
    console.log('主题切换按钮被点击，当前主题:', actualTheme)
    toggleTheme()
  }

  // 根据主题动态生成样式
  const buttonStyle = actualTheme === 'dark'
    ? "mr-0 border-[2rpx] border-solid border-[#333333] rounded-[999px] px-[24rpx] h-[72rpx] leading-[72rpx] bg-[#1a1a1a] text-[#ffffff] text-[26rpx]"
    : "mr-0 border-[2rpx] border-solid border-[#1a1a1a] rounded-[999px] px-[24rpx] h-[72rpx] leading-[72rpx] bg-[#ffffff] text-[#1a1a1a] text-[26rpx]"

  return (
    <Button
      className={`${buttonStyle} ${className || ''}`}
      onClick={handleToggle}
    >
      <View className="flex items-center justify-center">
        {actualTheme === 'light' ? (
          <View className="text-[28rpx]">🌙</View>
        ) : (
          <View className="text-[28rpx]">☀️</View>
        )}
      </View>
    </Button>
  )
}