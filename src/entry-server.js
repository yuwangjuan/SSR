import { createApp } from "./main";

// 返回一个函数，接收请求上下文，返回创建的vue实例
export default context => {
  // 这里返回一个Promise，确保路由或组件准备就绪
  return new Promise((resolve, reject) => {
    const { app, router } = createApp(context);
    // 跳转到首屏的地址
    router.push(context.url);
    // 路由就绪，返回结果
    router.onReady(() => {
      resolve(app);
    }, reject);
  });
};