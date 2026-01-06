import { PropsWithChildren, useMemo, useRef, useState } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './SwipeableItem.scss'

type SwipeAction = {
  text: string
  type?: 'default' | 'danger'
  onClick: () => void
}

type SwipeableItemProps = PropsWithChildren<{
  actions: SwipeAction[]
  actionWidthRpx?: number
}>

const getRpxScale = () => {
  try {
    const { screenWidth } = Taro.getSystemInfoSync()
    if (!screenWidth) return 1
    return 750 / screenWidth
  } catch {
    return 1
  }
}

export default function SwipeableItem ({
  actions,
  actionWidthRpx = 120,
  children
}: SwipeableItemProps) {
  const [offsetRpx, setOffsetRpx] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startXRef = useRef(0)
  const startOffsetRef = useRef(0)
  const scale = useMemo(() => getRpxScale(), [])
  const maxOffset = actionWidthRpx * actions.length

  const handleTouchStart = (event: any) => {
    const touch = event.touches?.[0]
    if (!touch) return
    startXRef.current = touch.clientX
    startOffsetRef.current = offsetRpx
    setDragging(true)
  }

  const handleTouchMove = (event: any) => {
    const touch = event.touches?.[0]
    if (!touch) return
    const deltaX = touch.clientX - startXRef.current
    const nextOffset = startOffsetRef.current + deltaX * scale * 0.7
    const clamped = Math.min(0, Math.max(-maxOffset, nextOffset))
    setOffsetRpx(clamped)
  }

  const handleTouchEnd = () => {
    setDragging(false)
    const shouldOpen = Math.abs(offsetRpx) > maxOffset * 0.6
    setOffsetRpx(shouldOpen ? -maxOffset : 0)
  }

  const handleAction = (action: SwipeAction) => {
    action.onClick()
    setOffsetRpx(0)
  }

  return (
    <View className='swipe-item'>
      <View
        className='swipe-item_content'
        style={{
          transform: `translateX(${offsetRpx}rpx)`,
          transition: dragging ? 'none' : 'transform 0.2s ease'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </View>
      <View
        className='swipe-item_actions'
        style={{
          width: `${maxOffset}rpx`
        }}
      >
        {actions.map(action => (
          <View
            key={action.text}
            className={`swipe-item_action ${action.type ?? 'default'}`}
            style={{ width: `${actionWidthRpx}rpx` }}
            onClick={() => handleAction(action)}
          >
            {action.text}
          </View>
        ))}
      </View>
    </View>
  )
}
