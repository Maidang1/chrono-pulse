export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/event-detail/index',
    'pages/event-analysis/index',
    'pages/sync-status/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  // 启用 dark mode 支持
  darkmode: true
})
