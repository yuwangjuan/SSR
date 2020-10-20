// 客户端也需要创建vue实例
import { createApp } from './main';

const {app, router} = createApp()

router.onReady(() => {
  // 挂载激活
  app.$mount('#app')
})
