import { useMemo } from 'react'
import { Text, View } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'

import { useEventData } from '../../hooks/useEventData'
import { formatMinutes } from '../../utils/time'
import { useTheme } from '../../hooks/useTheme'

export default function EventAnalysis () {
  const router = useRouter()
  const eventId = Number(router.params?.id || 0)
  const { eventData } = useEventData(eventId)
  const { actualTheme } = useTheme()

  const totalMinutes = useMemo(() => {
    if (!eventData) return 0
    return eventData.records.reduce(
      (acc, record) => acc + record.durationMinutes,
      0
    )
  }, [eventData])

  const longestRecord = useMemo(() => {
    if (!eventData) return 0
    return eventData.records.reduce(
      (max, record) => Math.max(max, record.durationMinutes),
      0
    )
  }, [eventData])

  const averageDuration = useMemo(() => {
    if (!eventData || !eventData.records.length) return 0
    return Math.round(totalMinutes / eventData.records.length)
  }, [eventData, totalMinutes])

  // 根据主题动态生成样式
  const themeStyles = {
    container: actualTheme === 'dark'
      ? "min-h-screen w-full px-[24rpx] py-[32rpx] sm:px-[32rpx] sm:py-[40rpx] pb-[48rpx] sm:pb-[64rpx] bg-[#0f0f0f] text-[#ffffff] font-sans relative box-border flex flex-col gap-[24rpx]"
      : "min-h-screen w-full px-[24rpx] py-[32rpx] sm:px-[32rpx] sm:py-[40rpx] pb-[48rpx] sm:pb-[64rpx] bg-[#f5f5f0] text-[#1a1a1a] font-sans relative box-border flex flex-col gap-[24rpx]",
    background: actualTheme === 'dark'
      ? "absolute inset-0 bg-[#0f0f0f] opacity-70 z-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_60px,#2a2a2a_61px),repeating-linear-gradient(90deg,transparent,transparent_60px,#2a2a2a_61px),repeating-linear-gradient(-45deg,transparent,transparent_3px,#0000001a_3px,#0000001a_4px)]"
      : "absolute inset-0 bg-[#f5f5f0] opacity-70 z-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_60px,#dcdcdc_61px),repeating-linear-gradient(90deg,transparent,transparent_60px,#dcdcdc_61px),repeating-linear-gradient(-45deg,transparent,transparent_3px,#0000001a_3px,#0000001a_4px)]",
    analysisCard: actualTheme === 'dark'
      ? "relative z-[1] border-[2rpx] border-[#333333] rounded-[20rpx] p-[28rpx] bg-[#1a1a1a] shadow-[0_16rpx_32rpx_#00000014] flex flex-col gap-[16rpx]"
      : "relative z-[1] border-[2rpx] border-[#1a1a1a] rounded-[20rpx] p-[28rpx] bg-[#ffffff] shadow-[0_16rpx_32rpx_#00000014] flex flex-col gap-[16rpx]",
    analysisLabel: actualTheme === 'dark' ? "text-[24rpx] uppercase tracking-[0.12em] text-[#cccccc] leading-[1.4]" : "text-[24rpx] uppercase tracking-[0.12em] text-[#4a4a4a] leading-[1.4]",
    analysisTitle: actualTheme === 'dark' ? "text-[64rpx] leading-[1.25] font-bold text-[#ffffff]" : "text-[64rpx] leading-[1.25] font-bold text-[#1a1a1a]",
    analysisDate: actualTheme === 'dark' ? "text-[24rpx] uppercase tracking-[0.12em] text-[#888888] leading-[1.4]" : "text-[24rpx] uppercase tracking-[0.12em] text-[#888888] leading-[1.4]",
    statCard: actualTheme === 'dark'
      ? "border-[2rpx] border-[#333333] rounded-[16rpx] p-[20rpx] flex flex-col gap-[8rpx] bg-[#1a1a1a]"
      : "border-[2rpx] border-[#1a1a1a] rounded-[16rpx] p-[20rpx] flex flex-col gap-[8rpx] bg-[#ffffff]",
    statLabel: actualTheme === 'dark' ? "text-[24rpx] uppercase tracking-[0.1em] text-[#888888] leading-[1.35]" : "text-[24rpx] uppercase tracking-[0.1em] text-[#888888] leading-[1.35]",
    statValue: actualTheme === 'dark' ? "text-[36rpx] font-bold leading-[1.2] text-[#ffffff]" : "text-[36rpx] font-bold leading-[1.2] text-[#1a1a1a]",
    recordsCard: actualTheme === 'dark'
      ? "mt-[24rpx] border-[2rpx] border-[#333333] rounded-[18rpx] p-[24rpx] bg-[#1a1a1a] flex flex-col gap-[16rpx] relative z-[1]"
      : "mt-[24rpx] border-[2rpx] border-[#1a1a1a] rounded-[18rpx] p-[24rpx] bg-[#ffffff] flex flex-col gap-[16rpx] relative z-[1]",
    recordTime: actualTheme === 'dark' ? "text-[28rpx] font-semibold text-[#ffffff]" : "text-[28rpx] font-semibold text-[#1a1a1a]",
    recordNote: actualTheme === 'dark' ? "text-[24rpx] text-[#888888]" : "text-[24rpx] text-[#888888]",
    progressBar: actualTheme === 'dark'
      ? "w-full h-[12rpx] border-[2rpx] border-[#333333] rounded-[999px] bg-[#0f0f0f] overflow-hidden"
      : "w-full h-[12rpx] border-[2rpx] border-[#1a1a1a] rounded-[999px] bg-[#e5e5e5] overflow-hidden",
    progressFill: actualTheme === 'dark'
      ? "h-full bg-[linear-gradient(90deg,#ff8c42,#ffaa5b)]"
      : "h-full bg-[linear-gradient(90deg,#f6821f,#ffaa5b)]",
    recordDuration: actualTheme === 'dark' ? "text-[26rpx] font-semibold text-left text-[#ffffff]" : "text-[26rpx] font-semibold text-left text-[#1a1a1a]",
    emptyState: actualTheme === 'dark' ? "text-[26rpx] text-[#cccccc]" : "text-[26rpx] text-[#4a4a4a]",
    errorState: actualTheme === 'dark'
      ? "border-[2rpx] dashed border-[#888888] rounded-[16rpx] p-[28rpx] text-[#cccccc] text-center bg-[#1a1a1a] text-[26rpx] leading-[1.5] relative z-[1]"
      : "border-[2rpx] dashed border-[#888888] rounded-[16rpx] p-[28rpx] text-[#4a4a4a] text-center bg-[#ffffff] text-[26rpx] leading-[1.5] relative z-[1]",
  }

  if (!eventId) {
    return (
      <View className={themeStyles.container}>
        <View className={themeStyles.background} />
        <View className={themeStyles.errorState}>
          <Text>缺少事件 ID，请返回上一页。</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={themeStyles.container}>
      <View className={themeStyles.background} />

      {eventData ? (
        <>
          <View className={themeStyles.analysisCard}>
            <Text className={themeStyles.analysisLabel}>事件分析</Text>
            <Text className={themeStyles.analysisTitle}>{eventData.title}</Text>
            <Text className={themeStyles.analysisDate}>
              创建时间 {new Date(eventData.createdAt).toLocaleString()}
            </Text>

            <View className='grid grid-cols-2 gap-[16rpx]'>
              <View className={themeStyles.statCard}>
                <Text className={themeStyles.statLabel}>记录数</Text>
                <Text className={themeStyles.statValue}>{eventData.records.length}</Text>
              </View>
              <View className={themeStyles.statCard}>
                <Text className={themeStyles.statLabel}>总时长</Text>
                <Text className={themeStyles.statValue}>
                  {formatMinutes(totalMinutes)}
                </Text>
              </View>
              <View className={themeStyles.statCard}>
                <Text className={themeStyles.statLabel}>最长</Text>
                <Text className={themeStyles.statValue}>
                  {longestRecord ? formatMinutes(longestRecord) : '—'}
                </Text>
              </View>
              <View className={themeStyles.statCard}>
                <Text className={themeStyles.statLabel}>平均</Text>
                <Text className={themeStyles.statValue}>
                  {averageDuration ? formatMinutes(averageDuration) : '—'}
                </Text>
              </View>
            </View>
          </View>

          <View className={themeStyles.recordsCard}>
            {eventData.records.length ? (
              eventData.records.map(record => {
                const width = longestRecord
                  ? Math.round((record.durationMinutes / longestRecord) * 100)
                  : 0
                return (
                  <View key={record.id} className='grid grid-cols-1 gap-[12rpx] items-start'>
                    <View className='flex flex-col gap-[6rpx]'>
                      <Text className={themeStyles.recordTime}>
                        {record.startTime} - {record.endTime}
                      </Text>
                      <Text className={themeStyles.recordNote}>
                        {record.note || '无备注'}
                      </Text>
                    </View>
                    <View className={themeStyles.progressBar}>
                      <View
                        className={themeStyles.progressFill}
                        style={{ width: `${width}%` }}
                      />
                    </View>
                    <Text className={themeStyles.recordDuration}>
                      {formatMinutes(record.durationMinutes)}
                    </Text>
                  </View>
                )
              })
            ) : (
              <Text className={themeStyles.emptyState}>暂无记录可分析。</Text>
            )}
          </View>
        </>
      ) : (
        <View className={themeStyles.errorState}>
          <Text>未找到事件或已被删除。</Text>
        </View>
      )}
    </View>
  )
}
