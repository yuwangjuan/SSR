// nodejs代码
// express是我们web服务器
const express = require('express')
const path = require('path')
const fs = require('fs')

// 获取express实例
const server = express()

// 获取绝对路由函数
function resolve(dir) {
  // 把当前执行js文件绝对地址和传入dir做拼接
  return path.resolve(__dirname, dir)
}


// 处理favicon
const favicon = require('serve-favicon')
server.use(favicon(path.join(__dirname, '../public', 'favicon.ico')))

// 第 1 步：开放dist/client目录，关闭默认下载index页的选项，不然到不了后面路由
// /index.html
server.use(express.static(resolve('../dist/client'), {index: false}))

// 第 2 步：获得一个createBundleRenderer
const { createBundleRenderer } = require("vue-server-renderer");

// 第 3 步：导入服务端打包文件
const bundle = require(resolve("../dist/server/vue-ssr-server-bundle.json"));

// 第 4 步：创建渲染器
const template = fs.readFileSync(resolve("../public/index.html"), "utf-8");
const clientManifest = require(resolve("../dist/client/vue-ssr-client-manifest.json"));
const renderer = createBundleRenderer(bundle, {
  runInNewContext: false, // https://ssr.vuejs.org/zh/api/#runinnewcontext
  template:fs.readFileSync(resolve("../public/index.html"), "utf-8"), // 宿主文件
  clientManifest // 客户端清单
});


// 编写路由处理不同url请求
server.get('*', async (req, res) => {
  // 构造上下文
  const context = {
    title: 'ssr test',
    url: req.url // 首屏地址
  }
  // 渲染输出
  try {
    const html = await renderer.renderToString(context)
    // 响应给前端
    res.send(html)
  } catch (error) {
    res.status(500).send('服务器渲染出错')
  }
})

// 监听端口
server.listen(3000, () => {
  console.log('server running!');

})