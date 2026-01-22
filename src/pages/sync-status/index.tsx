import { View, Text, Button } from '@tarojs/components';
import { navigateBack, reLaunch } from '@tarojs/taro';
import { useEffect, useState } from 'react';
import DataManager from '../../services/dataManager';
import { useTheme } from '../../hooks/useTheme';

export default function SyncStatusPage() {
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const { actualTheme } = useTheme();

  const handleSync = async () => {
    setSyncing(true);
    setSyncError(null);
    
    try {
      const success = await DataManager.syncToRemote();
      if (success) {
        setSyncSuccess(true);
        // 可以设置一个计时器自动返回上一页
        setTimeout(() => {
          navigateBack();
        }, 1500);
      } else {
        setSyncError('数据同步失败，请检查网络后重试');
      }
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : '同步时发生未知错误');
    } finally {
      setSyncing(false);
    }
  };

  const handleRetry = () => {
    setSyncSuccess(false);
    setSyncError(null);
  };

  const handleGoHome = () => {
    // 返回首页
    reLaunch({
      url: '/pages/index/index'
    });
  };

  // 根据主题动态生成样式
  const themeStyles = {
    container: actualTheme === 'dark'
      ? "min-h-screen w-full px-[24rpx] py-[32rpx] sm:px-[32rpx] sm:py-[40rpx] pb-[48rpx] sm:pb-[64rpx] bg-[#0f0f0f] text-[#ffffff] font-sans relative box-border flex flex-col gap-[24rpx]"
      : "min-h-screen w-full px-[24rpx] py-[32rpx] sm:px-[32rpx] sm:py-[40rpx] pb-[48rpx] sm:pb-[64rpx] bg-[#f5f5f0] text-[#1a1a1a] font-sans relative box-border flex flex-col gap-[24rpx]",
    background: actualTheme === 'dark'
      ? "absolute inset-0 bg-[#0f0f0f] opacity-70 z-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_60px,#2a2a2a_61px),repeating-linear-gradient(90deg,transparent,transparent_60px,#2a2a2a_61px),repeating-linear-gradient(-45deg,transparent,transparent_3px,#0000001a_3px,#0000001a_4px)]"
      : "absolute inset-0 bg-[#f5f5f0] opacity-70 z-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_60px,#dcdcdc_61px),repeating-linear-gradient(90deg,transparent,transparent_60px,#dcdcdc_61px),repeating-linear-gradient(-45deg,transparent,transparent_3px,#0000001a_3px,#0000001a_4px)]",
    promptCard: actualTheme === 'dark'
      ? "border-[2rpx] border-[#333333] rounded-[20rpx] p-[40rpx] bg-[#1a1a1a] shadow-[0_16rpx_32rpx_#00000014] flex flex-col gap-[24rpx] items-center text-center max-w-[600rpx]"
      : "border-[2rpx] border-[#1a1a1a] rounded-[20rpx] p-[40rpx] bg-[#ffffff] shadow-[0_16rpx_32rpx_#00000014] flex flex-col gap-[24rpx] items-center text-center max-w-[600rpx]",
    title: actualTheme === 'dark' ? "text-[48rpx] font-bold text-[#ffffff]" : "text-[48rpx] font-bold text-[#1a1a1a]",
    message: actualTheme === 'dark' ? "text-[32rpx] text-[#cccccc] leading-[1.5]" : "text-[32rpx] text-[#4a4a4a] leading-[1.5]",
    primaryButton: actualTheme === 'dark'
      ? "bg-[#ff8c42] text-[#ffffff] rounded-[16rpx] text-[32rpx] h-[96rpx] leading-[96rpx] w-full shadow-[0_16rpx_28rpx_#ff8c4240] border-none"
      : "bg-[#f6821f] text-[#ffffff] rounded-[16rpx] text-[32rpx] h-[96rpx] leading-[96rpx] w-full shadow-[0_16rpx_28rpx_#f6821f40] border-none",
    secondaryButton: actualTheme === 'dark'
      ? "border-[2rpx] border-[#333333] rounded-[16rpx] text-[32rpx] h-[96rpx] leading-[96rpx] w-full bg-transparent text-[#ffffff]"
      : "border-[2rpx] border-[#1a1a1a] rounded-[16rpx] text-[32rpx] h-[96rpx] leading-[96rpx] w-full bg-transparent text-[#1a1a1a]",
    progressCard: actualTheme === 'dark'
      ? "border-[2rpx] border-[#333333] rounded-[20rpx] p-[40rpx] bg-[#1a1a1a] shadow-[0_16rpx_32rpx_#00000014] flex flex-col gap-[24rpx] items-center text-center max-w-[600rpx]"
      : "border-[2rpx] border-[#1a1a1a] rounded-[20rpx] p-[40rpx] bg-[#ffffff] shadow-[0_16rpx_32rpx_#00000014] flex flex-col gap-[24rpx] items-center text-center max-w-[600rpx]",
    successCard: actualTheme === 'dark'
      ? "border-[2rpx] border-[#ff8c42] rounded-[20rpx] p-[40rpx] bg-[#1a1a1a] shadow-[0_16rpx_32rpx_#00000014] flex flex-col gap-[24rpx] items-center text-center max-w-[600rpx]"
      : "border-[2rpx] border-[#f6821f] rounded-[20rpx] p-[40rpx] bg-[#ffffff] shadow-[0_16rpx_32rpx_#00000014] flex flex-col gap-[24rpx] items-center text-center max-w-[600rpx]",
    successIcon: actualTheme === 'dark' ? "text-[96rpx] text-[#ff8c42]" : "text-[96rpx] text-[#f6821f]",
    successTitle: actualTheme === 'dark' ? "text-[48rpx] font-bold text-[#ff8c42]" : "text-[48rpx] font-bold text-[#f6821f]",
    errorCard: actualTheme === 'dark'
      ? "border-[2rpx] border-[#ff6b6b] rounded-[20rpx] p-[40rpx] bg-[#1a1a1a] shadow-[0_16rpx_32rpx_#00000014] flex flex-col gap-[24rpx] items-center text-center max-w-[600rpx]"
      : "border-[2rpx] border-[#f4333c] rounded-[20rpx] p-[40rpx] bg-[#ffffff] shadow-[0_16rpx_32rpx_#00000014] flex flex-col gap-[24rpx] items-center text-center max-w-[600rpx]",
    errorTitle: actualTheme === 'dark' ? "text-[48rpx] font-bold text-[#ff6b6b]" : "text-[48rpx] font-bold text-[#f4333c]",
    infoCard: actualTheme === 'dark'
      ? "border-[2rpx] dashed border-[#2a2a2a] rounded-[16rpx] p-[24rpx] bg-[#0f0f0f] text-center max-w-[600rpx]"
      : "border-[2rpx] dashed border-[#dcdcdc] rounded-[16rpx] p-[24rpx] bg-[#f5f5f0] text-center max-w-[600rpx]",
    infoText: actualTheme === 'dark' ? "text-[28rpx] text-[#888888]" : "text-[28rpx] text-[#888888]",
  };

  return (
    <View className={themeStyles.container}>
      <View className={themeStyles.background} />

      <View className="relative z-[1] flex flex-col items-center justify-center min-h-[60vh] gap-[32rpx]">
        {!syncSuccess && !syncing && (
          <View className={themeStyles.promptCard}>
            <Text className={themeStyles.title}>数据同步提醒</Text>
            <Text className={themeStyles.message}>
              检测到本地有未同步的数据更改
            </Text>
            <View className="flex flex-col gap-[16rpx] w-full mt-[16rpx]">
              <Button
                className={themeStyles.primaryButton}
                onClick={handleSync}
                disabled={syncing}
              >
                {syncing ? '同步中...' : '立即同步'}
              </Button>
              <Button
                className={themeStyles.secondaryButton}
                onClick={handleGoHome}
              >
                稍后同步
              </Button>
            </View>
          </View>
        )}

        {syncing && (
          <View className={themeStyles.progressCard}>
            <Text className={themeStyles.message}>正在同步数据...</Text>
          </View>
        )}

        {syncSuccess && (
          <View className={themeStyles.successCard}>
            <Text className={themeStyles.successIcon}>✓</Text>
            <Text className={themeStyles.successTitle}>数据同步成功！</Text>
          </View>
        )}

        {syncError && (
          <View className={themeStyles.errorCard}>
            <Text className={themeStyles.errorTitle}>同步失败</Text>
            <Text className={themeStyles.message}>{syncError}</Text>
            <View className="flex flex-col gap-[16rpx] w-full mt-[16rpx]">
              <Button
                className={themeStyles.primaryButton}
                onClick={handleRetry}
              >
                重试
              </Button>
              <Button
                className={themeStyles.secondaryButton}
                onClick={handleGoHome}
              >
                稍后处理
              </Button>
            </View>
          </View>
        )}

        <View className={themeStyles.infoCard}>
          <Text className={themeStyles.infoText}>
            {DataManager.hasChanges()
              ? '仍有未同步的更改'
              : '所有数据均已同步'}
          </Text>
        </View>
      </View>
    </View>
  );
}