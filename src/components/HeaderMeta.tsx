import type { ReactNode } from 'react'
import { Text, View } from '@tarojs/components'
import { useTheme } from '../hooks/useTheme'

type MetaTone = 'pending' | 'completed' | 'neutral'

export type HeaderMetaItem = {
  key: string
  text: ReactNode
  tone?: MetaTone
  onClick?: () => void
  className?: string
}

type HeaderMetaProps = {
  items: HeaderMetaItem[]
  className?: string
}

export default function HeaderMeta ({ items, className }: HeaderMetaProps) {
  const { actualTheme } = useTheme()

  // 根据主题动态生成样式
  const themeStyles = {
    container: `flex gap-[16rpx] relative z-[1]${className ? ` ${className}` : ''}`,
    item: actualTheme === 'dark'
      ? "flex items-center gap-[8rpx] px-[16rpx] py-[8rpx] border-[2rpx] border-[#333333] rounded-[999px] bg-[#1a1a1a]"
      : "flex items-center gap-[8rpx] px-[16rpx] py-[8rpx] border-[2rpx] border-[#1a1a1a] rounded-[999px] bg-[#ffffff]",
    pendingDot: actualTheme === 'dark' ? "w-[14rpx] h-[14rpx] rounded-full bg-[#ff9d5c]" : "w-[14rpx] h-[14rpx] rounded-full bg-[#f08c26]",
    completedDot: actualTheme === 'dark' ? "w-[14rpx] h-[14rpx] rounded-full bg-[#4ade80]" : "w-[14rpx] h-[14rpx] rounded-full bg-[#28b463]",
    neutralDot: actualTheme === 'dark' ? "w-[14rpx] h-[14rpx] rounded-full bg-[#a0a0a0]" : "w-[14rpx] h-[14rpx] rounded-full bg-[#888888]",
    text: actualTheme === 'dark' ? "text-[24rpx] text-[#ffffff]" : "text-[24rpx] text-[#1a1a1a]",
  }

  return (
    <View className={themeStyles.container}>
      {items.map(item => (
        <View
          key={item.key}
          className={`${themeStyles.item}${item.className ? ` ${item.className}` : ''}`}
          onClick={item.onClick}
        >
          <View className={
            item.tone === 'pending' ? themeStyles.pendingDot :
            item.tone === 'completed' ? themeStyles.completedDot :
            themeStyles.neutralDot
          } />
          <Text className={themeStyles.text}>{item.text}</Text>
        </View>
      ))}
    </View>
  )
}
