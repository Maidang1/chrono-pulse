import { PropsWithChildren, useMemo, useRef, useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useTheme } from "../hooks/useTheme";

type SwipeAction = {
  text: string;
  type?: "default" | "danger";
  onClick: () => void;
};

type SwipeableItemProps = PropsWithChildren<{
  actions: SwipeAction[];
  actionWidthRpx?: number;
}>;

const getRpxScale = () => {
  try {
    const { screenWidth } = Taro.getSystemInfoSync();
    if (!screenWidth) return 1;
    return 750 / screenWidth;
  } catch {
    return 1;
  }
};

export default function SwipeableItem({
  actions,
  actionWidthRpx = 80,
  children,
}: SwipeableItemProps) {
  const [offsetRpx, setOffsetRpx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const scale = useMemo(() => getRpxScale(), []);
  const maxOffset = (actionWidthRpx + 16) * actions.length + 24; // 增加间距和右边距
  const { actualTheme } = useTheme();

  const handleTouchStart = (event: any) => {
    const touch = event.touches?.[0];
    if (!touch) return;
    startXRef.current = touch.clientX;
    startOffsetRef.current = offsetRpx;
    setDragging(true);
  };

  const handleTouchMove = (event: any) => {
    const touch = event.touches?.[0];
    if (!touch) return;
    const deltaX = touch.clientX - startXRef.current;
    const nextOffset = startOffsetRef.current + deltaX * scale * 0.7;
    const clamped = Math.min(0, Math.max(-maxOffset, nextOffset));
    setOffsetRpx(clamped);
  };

  const handleTouchEnd = () => {
    setDragging(false);
    const shouldOpen = Math.abs(offsetRpx) > maxOffset * 0.6;
    setOffsetRpx(shouldOpen ? -maxOffset : 0);
  };

  const handleAction = (action: SwipeAction) => {
    action.onClick();
    setOffsetRpx(0);
  };

  // 根据主题动态生成样式
  const themeStyles = {
    actionButton: (actionType: string) => actualTheme === 'dark'
      ? `w-[80rpx] h-[80rpx] rounded-full flex items-center justify-center shadow-[0_8rpx_16rpx_rgba(0,0,0,0.15)] border-[2rpx] border-[#333333] ${
          actionType === "danger" ? "bg-[#ff6b6b] text-[#ffffff]" : "bg-[#1a1a1a] text-[#ffffff]"
        }`
      : `w-[80rpx] h-[80rpx] rounded-full flex items-center justify-center shadow-[0_8rpx_16rpx_rgba(0,0,0,0.15)] border-[2rpx] border-[#1a1a1a] ${
          actionType === "danger" ? "bg-[#f4333c] text-[#ffffff]" : "bg-[#ffffff] text-[#1a1a1a]"
        }`,
  };

  return (
    <View className="relative rounded-[18rpx]">
      <View
        className="relative z-[2] rounded-[18rpx]"
        style={{
          transform: `translateX(${offsetRpx}rpx)`,
          transition: dragging ? "none" : "transform 0.2s ease",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </View>
      <View
        className="absolute top-[50%] right-[24rpx] flex items-center gap-[16rpx] z-[1]"
        style={{
          transform: 'translateY(-50%)',
          opacity: Math.abs(offsetRpx) > 20 ? 1 : 0,
          transition: dragging ? "none" : "opacity 0.2s ease",
        }}
      >
        {actions.map((action) => (
          <View
            key={action.text}
            className={themeStyles.actionButton(action.type || "default")}
            style={{
              transform: `scale(${Math.abs(offsetRpx) > 60 ? 1 : 0.8})`,
              transition: dragging ? "none" : "transform 0.2s ease",
            }}
            onClick={() => handleAction(action)}
          >
            {action.type === "danger" ? (
              <View className="text-[32rpx] font-bold">×</View>
            ) : (
              <View className="text-[28rpx]">✎</View>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
