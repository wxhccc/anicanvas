# anicanvas
一个简单的canvas动画库，可用来制作动画或简单游戏

# 安装
npm: npm install anicanvas

本地：将dist目录下的anicanvas.min.js放到使用目录

sdn: https://cdn.jsdelivr.net/npm/anicanvas@0.0.3/dist/anicanvas.min.js

# 使用说明
简单的实例
```
import Anicanvas from 'anicanvas'
const app = new Anicanvas('#app', {width: 200, height: 100}); //创建实例
const ballPainter = new Anicanvas.Painter((sprite, context, time, fdelta) => {
  let {left, top, width, height, rotatePoint: {x, y}} = sprite; //rotatePoint为精灵中心坐标，免去计算
  context.save();
  context.beginPath();
  context.fillStyle = "red";
  context.arc(x, y, width / 2, 0, Math.PI*2);
  context.fill();
  context.restore();
});
const ballBehaviors = {
  'rollRight': new Anicanvas.Behavior({
    name: 'rollRight',
    duration:1000,
    animation: {left: 50}
  }),
  'rollDown': new Anicanvas.Behavior({
    name: 'rollDown',
    duration:1000,
    delay: 1000, //延迟1000ms执行，让rollRight先执行完
    animation: {
      0: {opacity: 1},
      100: {top: 50, opacity: 0.5}
    }
  })
};
const ball = new Anicanvas.Sprite('ball', {width: 20, height: 20}, ballPainter, ballBehaviors);
app.append(ball);
app.start();
```

稍微复杂的实例可以看demo, 里面涉及到目前此库已有功能，包括资源加载和管理，分层绘制，多舞台层叠，低频次舞台惰化。

ps：目前还没有事件处理模块，后续会添加