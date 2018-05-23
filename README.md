# anicanvas
一个简单的canvas动画库，可用来制作动画或简单游戏

# 安装
npm: npm install anicanvas

本地：将dist目录下的anicanvas.min.js放到使用目录

CDN: https://cdn.jsdelivr.net/npm/anicanvas/dist/anicanvas.min.js (最新版地址，指导版本可在anicanvas后添加@0.0.x版本号)

# 使用说明

简单的实例(es6语法)
```
import Anicanvas from 'anicanvas'
const app = new Anicanvas('#app', {width: 200, height: 100}); //创建实例
const ballPainter = new Anicanvas.Painter((sprite, context, time, fdelta) => {
  let {left, top, width, height, rotatePoint: {x, y}} = sprite; //rotatePoint为精灵中心坐标，免去计算
  context.save();
  context.beginPath();
  context.globalAlpha = sprite.opacity;
  context.fillStyle = "red";
  context.arc(x, y, width / 2, 0, Math.PI*2);
  context.fill();
  context.restore();
});
const ballBehaviors = [
  new Anicanvas.Behavior({
    name: 'rollRight',
    duration:1000,
    animation: {left: 50}
  }),
  new Anicanvas.Behavior({
    name: 'rollDown',
    duration:1000,
    delay: 1000, //延迟1000ms执行，让rollRight先执行完
    animation: {
      0: {opacity: 1},
      100: {top: 50, opacity: 0.5}
    }
  })
];
const ball = new Anicanvas.Sprite('ball', {needAutoRP: true, width: 20, height: 20}, ballPainter, ballBehaviors);
app.append(ball);
app.start();
```
浏览器端
```
<!DOCTYPE html>
<html><head>
  <meta charset="utf-8">
  <title>Demo</title>
</head>
<body>
  <div class="wrap" id="app" style="border: 1px solid #aeaeae;width: 200px;height: 100px;">
  </div>
  <script src="https://cdn.jsdelivr.net/npm/anicanvas/dist/anicanvas.min.js"></script>
  <script>
    var app = new Anicanvas('#app', {width: 200, height: 100}); //´´½¨ÊµÀý
    var bgPainter = new Anicanvas.Painter(function(sprite, context, time, fdelta){
      context.save();
      context.fillStyle = "#efefef";
      context.fillRect(sprite.left, sprite.top, sprite.width, sprite.height);
      context.restore();
    });
    var ballPainter = new Anicanvas.Painter(function(sprite, context, time, fdelta) {
      let width = sprite.width,
          rotatePoint = sprite.rotatePoint,
          x = rotatePoint.x,
          y = rotatePoint.y;
      context.save();
      context.globalAlpha = sprite.opacity;
      context.beginPath();
      context.fillStyle = "red";
      context.arc(x, y, width / 2, 0, Math.PI*2);
      context.fill();
      context.restore();
    });
    var ballBehaviors = [
      new Anicanvas.Behavior({
        name: 'rollRight',
        duration:1000,
        animation: {left: 50}
      }),
      new Anicanvas.Behavior({
        name: 'rollDown',
        duration: 1000,
        delay: 1000, 
        animation: {top: 50, opacity: 0.4}
      })
    ];
    var bgLayer = new Anicanvas.Sprite('bg', {width: 200, height: 100}, bgPainter);
    var ball = new Anicanvas.Sprite('ball', {needAutoRP: true, width: 20, height: 20, opacity: 1}, ballPainter, ballBehaviors);
    app.append(bgLayer, ball);
    app.start();
  </script>
</body>
</html>
```

# DEMO

在根目录下使用命令行工具运行 
npm start 命令可开启本地node服务器来访问demo
npm run demo-es5 可监听demo/js/index.js文件的修改并编译为es5环境代码，刷新页面可以看到修改后的效果

